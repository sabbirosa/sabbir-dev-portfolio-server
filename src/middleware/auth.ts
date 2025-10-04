import { userModel } from "../models/User.adapter";
import { ApiResponse, UnauthorizedError } from "../types";
import { JWTService } from "../utils/jwt";
import { logger } from "../utils/logger";
import { NextFunction, Request, Response } from "express";

// Extend Request interface to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        role: string;
      };
    }
  }
}

/**
 * Authentication middleware
 * Verifies JWT token and attaches user to request
 */
export const authenticateToken = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Extract token from Authorization header
    const authHeader = req.headers.authorization;
    const token = JWTService.extractTokenFromHeader(authHeader);

    if (!token) {
      throw new UnauthorizedError("Access token required");
    }

    // Verify token
    const decoded = JWTService.verifyToken(token);

    // Get user from database to ensure they still exist
    const user = await userModel.getUserById(decoded.id);
    if (!user) {
      throw new UnauthorizedError("User not found");
    }

    // Attach user to request
    req.user = {
      id: user.id,
      email: user.email,
      role: user.role,
    };

    logger.debug("User authenticated", { userId: user.id, email: user.email });
    next();
  } catch (error) {
    handleAuthError(res, error as Error);
  }
};

/**
 * Role-based authorization middleware
 */
export const requireRole = (allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      if (!req.user) {
        throw new UnauthorizedError("Authentication required");
      }

      if (!allowedRoles.includes(req.user.role)) {
        logger.warn("Access denied - insufficient permissions", {
          userId: req.user.id,
          userRole: req.user.role,
          requiredRoles: allowedRoles,
        });

        const response: ApiResponse = {
          success: false,
          message: "Insufficient permissions",
          timestamp: new Date().toISOString(),
        };

        res.status(403).json(response);
        return;
      }

      next();
    } catch (error) {
      handleAuthError(res, error as Error);
    }
  };
};

/**
 * Admin-only middleware
 */
export const requireAdmin = requireRole(["admin"]);

/**
 * Optional authentication middleware
 * Attaches user if token is valid, but doesn't require authentication
 */
export const optionalAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    const token = JWTService.extractTokenFromHeader(authHeader);

    if (token) {
      try {
        const decoded = JWTService.verifyToken(token);
        const user = await userModel.getUserById(decoded.id);

        if (user) {
          req.user = {
            id: user.id,
            email: user.email,
            role: user.role,
          };
        }
      } catch (error) {
        // Ignore token errors for optional auth
        logger.debug("Optional auth failed", {
          error: (error as Error).message,
        });
      }
    }

    next();
  } catch (error) {
    // For optional auth, we don't fail on errors
    next();
  }
};

/**
 * Handle authentication errors
 */
const handleAuthError = (res: Response, error: Error): void => {
  logger.warn("Authentication failed", { error: error.message });

  let statusCode = 401;
  let message = "Unauthorized";

  if (error instanceof UnauthorizedError) {
    statusCode = error.statusCode;
    message = error.message;
  } else if (error.message.includes("expired")) {
    message = "Token has expired";
  } else if (error.message.includes("invalid")) {
    message = "Invalid token";
  }

  const response: ApiResponse = {
    success: false,
    message,
    timestamp: new Date().toISOString(),
  };

  res.status(statusCode).json(response);
};
