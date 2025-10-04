import { env } from "../config/environment";
import { logger } from "../utils/logger";
import { NextFunction, Request, Response } from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";

/**
 * Rate limiting middleware
 */
export const createRateLimiter = (windowMs?: number, max?: number) => {
  return rateLimit({
    windowMs: windowMs || env.RATE_LIMIT_WINDOW_MS, // 15 minutes default
    max: max || env.RATE_LIMIT_MAX, // limit each IP to 100 requests per windowMs
    message: {
      success: false,
      message: "Too many requests from this IP, please try again later",
      timestamp: new Date().toISOString(),
    },
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    handler: (req: Request, res: Response) => {
      logger.warn("Rate limit exceeded", {
        ip: req.ip,
        url: req.url,
        method: req.method,
      });

      res.status(429).json({
        success: false,
        message: "Too many requests from this IP, please try again later",
        timestamp: new Date().toISOString(),
      });
    },
  });
};

/**
 * Auth-specific rate limiter (stricter for login attempts)
 */
export const authRateLimiter = createRateLimiter(
  15 * 60 * 1000, // 15 minutes
  5 // limit each IP to 5 login requests per 15 minutes
);

/**
 * API rate limiter (general API usage)
 */
export const apiRateLimiter = createRateLimiter();

/**
 * Helmet security middleware configuration
 */
export const securityHeaders = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'"],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"],
    },
  },
  crossOriginEmbedderPolicy: false, // Disable for API server
  hsts: {
    maxAge: 31536000, // 1 year
    includeSubDomains: true,
    preload: true,
  },
});

/**
 * Request size limiter middleware
 */
export const requestSizeLimiter = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const maxSize = 10 * 1024 * 1024; // 10MB
  const contentLength = req.get("content-length");

  if (contentLength && parseInt(contentLength) > maxSize) {
    logger.warn("Request too large", {
      contentLength,
      maxSize,
      ip: req.ip,
      url: req.url,
    });

    res.status(413).json({
      success: false,
      message: "Request entity too large",
      timestamp: new Date().toISOString(),
    });
    return;
  }

  next();
};

/**
 * IP whitelist middleware (for admin operations in production)
 */
export const createIPWhitelist = (allowedIPs: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const clientIP = req.ip || req.connection.remoteAddress;

    if (!allowedIPs.includes(clientIP || "")) {
      logger.warn("IP not whitelisted", {
        clientIP,
        allowedIPs,
        url: req.url,
      });

      res.status(403).json({
        success: false,
        message: "Access forbidden",
        timestamp: new Date().toISOString(),
      });
      return;
    }

    next();
  };
};

/**
 * Request timeout middleware
 */
export const requestTimeout = (timeoutMs: number = 30000) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const timeout = setTimeout(() => {
      logger.warn("Request timeout", {
        url: req.url,
        method: req.method,
        timeout: timeoutMs,
      });

      if (!res.headersSent) {
        res.status(408).json({
          success: false,
          message: "Request timeout",
          timestamp: new Date().toISOString(),
        });
      }
    }, timeoutMs);

    // Clear timeout when response finishes
    res.on("finish", () => {
      clearTimeout(timeout);
    });

    next();
  };
};
