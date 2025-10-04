import { UserModel } from "../models/User.mongoose";
import {
  ApiResponse,
  AuthResponseDto,
  LoginDto,
  UnauthorizedError,
  ValidationError,
} from "../types";
import { JWTService } from "../utils/jwt";
import { logger } from "../utils/logger";
import { loginSchema, validateInput } from "../utils/validation";
import { Request, Response } from "express";

export class AuthController {
  /**
   * POST /api/auth/login
   * Authenticate user and return JWT token
   */
  async login(req: Request, res: Response): Promise<void> {
    try {
      // Validate input
      const loginData = validateInput(loginSchema, req.body) as LoginDto;

      logger.info("Login attempt", { email: loginData.email });

      // Find user and include password for comparison
      const user = await UserModel.findOne({ email: loginData.email }).select(
        "+password"
      );

      if (!user) {
        logger.warn("Login failed - user not found", {
          email: loginData.email,
        });
        throw new UnauthorizedError("Invalid email or password");
      }

      // Compare password
      const isPasswordValid = await user.comparePassword(loginData.password);

      if (!isPasswordValid) {
        logger.warn("Login failed - invalid password", {
          email: loginData.email,
        });
        throw new UnauthorizedError("Invalid email or password");
      }

      // Generate JWT token
      const tokenPayload = {
        id: (user._id as any).toString(),
        email: user.email,
        role: user.role as "admin",
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        password: user.password,
      };

      const token = JWTService.generateToken(tokenPayload);

      // Prepare response (without password)
      const authResponse: AuthResponseDto = {
        token,
        user: {
          id: (user._id as any).toString(),
          email: user.email,
          role: user.role as "admin",
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
      };

      logger.logAuth("LOGIN_SUCCESS", (user._id as any).toString(), user.email);

      const response: ApiResponse<AuthResponseDto> = {
        success: true,
        message: "Login successful",
        data: authResponse,
        timestamp: new Date().toISOString(),
      };

      res.status(200).json(response);
    } catch (error) {
      this.handleError(res, error as Error, "login");
    }
  }

  /**
   * GET /api/auth/verify
   * Verify JWT token validity
   */
  async verify(req: Request, res: Response): Promise<void> {
    try {
      // Token is already verified by auth middleware
      const authRequest = req as any; // Type assertion for authenticated request
      const user = authRequest.user;

      if (!user) {
        throw new UnauthorizedError("Invalid token payload");
      }

      logger.logAuth("TOKEN_VERIFIED", user.id, user.email);

      const response: ApiResponse = {
        success: true,
        message: "Token is valid",
        data: { user },
        timestamp: new Date().toISOString(),
      };

      res.status(200).json(response);
    } catch (error) {
      this.handleError(res, error as Error, "verify");
    }
  }

  /**
   * POST /api/auth/logout
   * Logout user (mainly for client-side token removal)
   */
  async logout(req: Request, res: Response): Promise<void> {
    try {
      const authRequest = req as any;
      const user = authRequest.user;

      if (user) {
        logger.logAuth("LOGOUT", user.id, user.email);
      }

      const response: ApiResponse = {
        success: true,
        message: "Logged out successfully",
        timestamp: new Date().toISOString(),
      };

      res.status(200).json(response);
    } catch (error) {
      this.handleError(res, error as Error, "logout");
    }
  }

  /**
   * GET /api/auth/credentials
   * Get demo credentials (for development only)
   */
  async getCredentials(req: Request, res: Response): Promise<void> {
    try {
      // Only allow in development mode
      if (process.env.NODE_ENV === "production") {
        throw new Error("Credentials endpoint not available in production");
      }

      const response: ApiResponse = {
        success: true,
        message: "Demo credentials for testing",
        data: {
          email: process.env.ADMIN_EMAIL,
          password: process.env.ADMIN_PASSWORD,
          note: "Use these credentials to login as admin",
        },
        timestamp: new Date().toISOString(),
      };

      res.status(200).json(response);
    } catch (error) {
      this.handleError(res, error as Error, "getCredentials");
    }
  }

  /**
   * GET /api/auth/profile
   * Get current user profile
   */
  async getProfile(req: Request, res: Response): Promise<void> {
    try {
      const authRequest = req as any;
      const user = authRequest.user;

      if (!user) {
        throw new UnauthorizedError("User not found");
      }

      // Get full user data from database
      const fullUser = await UserModel.findById(user.id);

      if (!fullUser) {
        throw new UnauthorizedError("User not found in database");
      }

      const response: ApiResponse = {
        success: true,
        message: "Profile retrieved successfully",
        data: {
          user: {
            id: (fullUser._id as any).toString(),
            email: fullUser.email,
            role: fullUser.role as "admin",
            createdAt: fullUser.createdAt,
            updatedAt: fullUser.updatedAt,
          },
        },
        timestamp: new Date().toISOString(),
      };

      res.status(200).json(response);
    } catch (error) {
      this.handleError(res, error as Error, "getProfile");
    }
  }

  /**
   * Handle controller errors
   */
  private handleError(res: Response, error: Error, operation: string): void {
    logger.error(`Auth controller error in ${operation}`, {
      message: error.message,
      stack: error.stack,
    });

    let statusCode = 500;
    let message = "Internal server error";

    if (error instanceof ValidationError) {
      statusCode = 400;
      message = error.message;
    } else if (error instanceof UnauthorizedError) {
      statusCode = 401;
      message = error.message;
    } else if (
      error.message.includes("validation") ||
      error.message.includes("required")
    ) {
      statusCode = 400;
      message = error.message;
    }

    const response: ApiResponse = {
      success: false,
      message,
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
      timestamp: new Date().toISOString(),
    };

    res.status(statusCode).json(response);
  }
}

// Export singleton instance
export const authController = new AuthController();
