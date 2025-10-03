import { initializeDatabase } from "@/config/database";
import { env, isDevelopment } from "@/config/environment";
import { errorHandler, notFoundHandler } from "@/middleware/errorHandler";
import {
  apiRateLimiter,
  requestSizeLimiter,
  requestTimeout,
  securityHeaders,
} from "@/middleware/security";
import routes from "@/routes";
import { seedAdminUser } from "@/scripts/seed";
import { logger } from "@/utils/logger";
import compression from "compression";
import cors from "cors";
import express from "express";
import morgan from "morgan";

/**
 * Express application setup
 */
class Server {
  private app: express.Application;
  private port: number;
  private host: string;

  constructor() {
    this.app = express();
    this.port = env.PORT;
    this.host = env.HOST;

    this.initializeServer();
  }

  /**
   * Initialize server configuration
   */
  private async initializeServer(): Promise<void> {
    try {
      // Initialize database
      await this.initializeDatabase();

      // Configure middleware
      this.configureMiddleware();

      // Configure routes
      this.configureRoutes();

      // Configure error handling
      this.configureErrorHandling();

      // Seed initial data
      await this.seedInitialData();

      // Start server
      this.startServer();
    } catch (error) {
      logger.error("Failed to initialize server", {
        error: (error as Error).message,
      });
      process.exit(1);
    }
  }

  /**
   * Initialize database connection
   */
  private async initializeDatabase(): Promise<void> {
    try {
      await initializeDatabase();
      logger.info("📦 Database initialized successfully");
    } catch (error) {
      logger.error("Database initialization failed", {
        error: (error as Error).message,
      });
      throw error;
    }
  }

  /**
   * Configure Express middleware
   */
  private configureMiddleware(): void {
    // Security headers
    this.app.use(securityHeaders);

    // Request timeout
    this.app.use(requestTimeout(30000)); // 30 seconds

    // Request size limiter
    this.app.use(requestSizeLimiter);

    // Rate limiting
    if (!isDevelopment) {
      this.app.use(apiRateLimiter);
    }

    // Compression
    this.app.use(compression());

    // CORS configuration
    this.app.use(
      cors({
        origin: isDevelopment
          ? ["http://localhost:3000", "http://127.0.0.1:3000"]
          : [env.FRONTEND_URL],
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization", "Accept"],
      })
    );

    // Body parsing
    this.app.use(express.json({ limit: "10mb" }));
    this.app.use(express.urlencoded({ extended: true, limit: "10mb" }));

    // Logging
    if (isDevelopment) {
      this.app.use(morgan("dev"));
    } else {
      this.app.use(
        morgan("combined", {
          stream: {
            write: (message: string) => logger.info(message.trim()),
          },
        })
      );
    }

    // Request logging
    this.app.use((req, res, next) => {
      const start = Date.now();

      res.on("finish", () => {
        const duration = Date.now() - start;
        logger.logRequest(req.method, req.url, res.statusCode, duration);
      });

      next();
    });

    logger.info("🔧 Middleware configured successfully");
  }

  /**
   * Configure application routes
   */
  private configureRoutes(): void {
    // Health check (before rate limiting)
    this.app.get("/", (req, res) => {
      res.json({
        success: true,
        message: "Sabbir Ahmed Portfolio API v2 is running",
        timestamp: new Date().toISOString(),
        environment: env.NODE_ENV,
      });
    });

    // API routes
    this.app.use("/api", routes);

    logger.info("🛣️  Routes configured successfully");
  }

  /**
   * Configure error handling
   */
  private configureErrorHandling(): void {
    // 404 handler
    this.app.use(notFoundHandler);

    // Global error handler
    this.app.use(errorHandler);

    logger.info("🛡️  Error handling configured successfully");
  }

  /**
   * Seed initial data
   */
  private async seedInitialData(): Promise<void> {
    try {
      await seedAdminUser();
      logger.info("🌱 Initial data seeded successfully");
    } catch (error) {
      logger.error("Initial data seeding failed", {
        error: (error as Error).message,
      });
      // Don't exit on seeding failure, server should still start
    }
  }

  /**
   * Start the server
   */
  private startServer(): void {
    const server = this.app.listen(this.port, this.host, () => {
      logger.info(`🚀 Server running on http://${this.host}:${this.port}`);
      logger.info(`📋 Environment: ${env.NODE_ENV}`);
      logger.info(`📋 API Health: http://${this.host}:${this.port}/api/health`);
      logger.info(`🔐 Admin Email: ${env.ADMIN_EMAIL}`);

      if (isDevelopment) {
        logger.info(
          `🔑 Demo Credentials: http://${this.host}:${this.port}/api/auth/credentials`
        );
      }
    });

    // Graceful shutdown
    process.on("SIGTERM", () => {
      logger.info("SIGTERM received, shutting down gracefully");
      server.close(() => {
        logger.info("Server closed");
        process.exit(0);
      });
    });

    process.on("SIGINT", () => {
      logger.info("SIGINT received, shutting down gracefully");
      server.close(() => {
        logger.info("Server closed");
        process.exit(0);
      });
    });

    // Handle uncaught exceptions
    process.on("uncaughtException", (error) => {
      logger.error("Uncaught Exception", {
        error: error.message,
        stack: error.stack,
      });
      process.exit(1);
    });

    process.on("unhandledRejection", (reason, promise) => {
      logger.error("Unhandled Rejection", { reason, promise });
      process.exit(1);
    });
  }

  /**
   * Get Express application instance
   */
  public getApp(): express.Application {
    return this.app;
  }
}

// Create and start server
const server = new Server();

export default server;
