import { isDevelopment } from "@/config/environment";
import { ApiResponse, AppError } from "@/types";
import { logger } from "@/utils/logger";
import { NextFunction, Request, Response } from "express";

/**
 * Global error handling middleware
 */
export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // Log the error
  logger.error("Unhandled error", {
    message: error.message,
    stack: error.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
    userAgent: req.get("User-Agent"),
  });

  // Default error values
  let statusCode = 500;
  let message = "Internal server error";
  let details: any = undefined;

  // Handle different error types
  if (error instanceof AppError) {
    statusCode = error.statusCode;
    message = error.message;
  } else if (error.name === "ValidationError") {
    statusCode = 400;
    message = "Validation failed";
    details = isDevelopment ? error.message : undefined;
  } else if (error.name === "CastError") {
    statusCode = 400;
    message = "Invalid data format";
  } else if (error.name === "MongoError" && (error as any).code === 11000) {
    statusCode = 409;
    message = "Duplicate entry";
  } else if (
    error.message.includes("ENOTFOUND") ||
    error.message.includes("ECONNREFUSED")
  ) {
    statusCode = 503;
    message = "Service unavailable";
  }

  // Prepare error response
  const response: ApiResponse = {
    success: false,
    message,
    error: isDevelopment ? error.message : undefined,
    timestamp: new Date().toISOString(),
  };

  // Add development-specific details
  if (isDevelopment && details) {
    response.data = { details };
  }

  res.status(statusCode).json(response);
};

/**
 * 404 handler for unknown routes
 */
export const notFoundHandler = (req: Request, res: Response): void => {
  logger.warn("Route not found", {
    url: req.url,
    method: req.method,
    ip: req.ip,
  });

  const response: ApiResponse = {
    success: false,
    message: `Route ${req.method} ${req.url} not found`,
    timestamp: new Date().toISOString(),
  };

  res.status(404).json(response);
};

/**
 * Async error wrapper for route handlers
 */
export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
