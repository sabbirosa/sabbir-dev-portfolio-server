import { env, isDevelopment } from "@/config/environment";
import { userModel } from "@/models/User.adapter";
import { ApiResponse } from "@/types";
import { logger } from "@/utils/logger";
import { Request, Response } from "express";

export class HealthController {
  /**
   * GET /api/health
   * Health check endpoint
   */
  async getHealth(req: Request, res: Response): Promise<void> {
    try {
      const uptime = process.uptime();
      const memoryUsage = process.memoryUsage();
      const userCount = await userModel.getUserCount();

      const healthData = {
        status: "healthy",
        timestamp: new Date().toISOString(),
        uptime: `${Math.floor(uptime)}s`,
        environment: env.NODE_ENV,
        version: process.env.npm_package_version || "1.0.0",
        server: {
          port: env.PORT,
          host: env.HOST,
        },
        database: {
          type: "memory",
          connected: true,
          userCount,
        },
        memory: {
          rss: `${Math.round(memoryUsage.rss / 1024 / 1024)}MB`,
          heapTotal: `${Math.round(memoryUsage.heapTotal / 1024 / 1024)}MB`,
          heapUsed: `${Math.round(memoryUsage.heapUsed / 1024 / 1024)}MB`,
          external: `${Math.round(memoryUsage.external / 1024 / 1024)}MB`,
        },
      };

      // Add development-specific information
      if (isDevelopment) {
        Object.assign(healthData, {
          development: {
            jwt: {
              expiresIn: env.JWT_EXPIRES_IN,
            },
            cors: {
              origin: env.FRONTEND_URL,
            },
            rateLimit: {
              max: env.RATE_LIMIT_MAX,
              windowMs: env.RATE_LIMIT_WINDOW_MS,
            },
          },
        });
      }

      logger.info("Health check requested");

      const response: ApiResponse = {
        success: true,
        message: "Server is running healthy",
        data: healthData,
        timestamp: new Date().toISOString(),
      };

      res.status(200).json(response);
    } catch (error) {
      this.handleError(res, error as Error);
    }
  }

  /**
   * GET /api/health/ready
   * Readiness probe for container orchestration
   */
  async getReadiness(req: Request, res: Response): Promise<void> {
    try {
      // Check if all required services are ready
      const checks = await this.performReadinessChecks();

      const allReady = Object.values(checks).every(
        (check) => check.status === "ready"
      );

      const response: ApiResponse = {
        success: allReady,
        message: allReady ? "Service is ready" : "Service is not ready",
        data: {
          ready: allReady,
          checks,
          timestamp: new Date().toISOString(),
        },
      };

      const statusCode = allReady ? 200 : 503;
      res.status(statusCode).json(response);

      logger.info("Readiness check completed", { ready: allReady });
    } catch (error) {
      this.handleError(res, error as Error);
    }
  }

  /**
   * GET /api/health/live
   * Liveness probe for container orchestration
   */
  async getLiveness(req: Request, res: Response): Promise<void> {
    try {
      // Simple liveness check - if we can respond, we're alive
      const response: ApiResponse = {
        success: true,
        message: "Service is alive",
        data: {
          alive: true,
          timestamp: new Date().toISOString(),
          uptime: process.uptime(),
        },
      };

      res.status(200).json(response);
      logger.debug("Liveness check completed");
    } catch (error) {
      this.handleError(res, error as Error);
    }
  }

  /**
   * Perform readiness checks for various services
   */
  private async performReadinessChecks(): Promise<Record<string, any>> {
    const checks: Record<string, any> = {};

    // Database check
    try {
      const userCount = await userModel.getUserCount();
      checks.database = {
        status: "ready",
        type: "memory",
        userCount,
      };
    } catch (error) {
      checks.database = {
        status: "not_ready",
        error: (error as Error).message,
      };
    }

    // Environment variables check
    try {
      const requiredEnvVars = ["JWT_SECRET", "ADMIN_EMAIL", "ADMIN_PASSWORD"];
      const missingVars = requiredEnvVars.filter(
        (envVar) => !process.env[envVar]
      );

      checks.environment = {
        status: missingVars.length === 0 ? "ready" : "not_ready",
        missingVariables: missingVars,
      };
    } catch (error) {
      checks.environment = {
        status: "not_ready",
        error: (error as Error).message,
      };
    }

    // Memory check
    try {
      const memoryUsage = process.memoryUsage();
      const heapUsedPercent =
        (memoryUsage.heapUsed / memoryUsage.heapTotal) * 100;

      checks.memory = {
        status: heapUsedPercent < 90 ? "ready" : "not_ready",
        heapUsedPercent: Math.round(heapUsedPercent * 100) / 100,
        heapUsed: `${Math.round(memoryUsage.heapUsed / 1024 / 1024)}MB`,
        heapTotal: `${Math.round(memoryUsage.heapTotal / 1024 / 1024)}MB`,
      };
    } catch (error) {
      checks.memory = {
        status: "not_ready",
        error: (error as Error).message,
      };
    }

    return checks;
  }

  /**
   * Handle controller errors
   */
  private handleError(res: Response, error: Error): void {
    logger.error("Health controller error", {
      message: error.message,
      stack: error.stack,
    });

    const response: ApiResponse = {
      success: false,
      message: "Health check failed",
      error: isDevelopment ? error.message : "Internal server error",
      timestamp: new Date().toISOString(),
    };

    res.status(503).json(response);
  }
}

// Export singleton instance
export const healthController = new HealthController();
