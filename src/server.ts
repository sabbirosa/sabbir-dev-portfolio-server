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
  private isInitialized: boolean = false;
  private initializationPromise: Promise<void> | null = null;

  constructor() {
    this.app = express();
    this.port = env.PORT;
    this.host = env.HOST;

    // Configure middleware and routes immediately (synchronous)
    this.configureMiddleware();
    this.configureRoutes();
    this.configureErrorHandling();
  }

  /**
   * Initialize server asynchronously (database, seeding, etc.)
   */
  private async initialize(): Promise<void> {
    if (this.isInitialized) {
      return;
    }

    // Prevent multiple initializations
    if (this.initializationPromise) {
      return this.initializationPromise;
    }

    this.initializationPromise = (async () => {
      try {
        // Initialize database
        await this.initializeDatabase();

        // Seed initial data only in development or first run
        if (isDevelopment) {
          await this.seedInitialData();
        }

        this.isInitialized = true;
        logger.info("✅ Server initialized successfully");
      } catch (error) {
        logger.error("Failed to initialize server", {
          error: (error as Error).message,
        });
        throw error;
      }
    })();

    return this.initializationPromise;
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

    // API routes with lazy initialization
    this.app.use(async (req, res, next) => {
      try {
        await this.initialize();
        next();
      } catch (error) {
        next(error);
      }
    });

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
      // Import the mongoose seed functions
      const { seedAll } = await import("@/scripts/seed.mongoose");
      await seedAll();
      logger.info("🌱 Initial data seeded successfully");
    } catch (error) {
      logger.error("Initial data seeding failed", {
        error: (error as Error).message,
      });
      // Don't throw - seeding failure shouldn't prevent server from starting
    }
  }

  /**
   * Start the server (for local development only)
   */
  public async start(): Promise<void> {
    try {
      // Initialize before starting
      await this.initialize();

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
    } catch (error) {
      logger.error("Failed to start server", {
        error: (error as Error).message,
      });
      process.exit(1);
    }
  }

  /**
   * Get Express application instance
   */
  public getApp(): express.Application {
    return this.app;
  }
}

// Create server instance
const server = new Server();

// For Vercel serverless function - export the Express app directly
export default server.getApp();

// For local development - start the server if not in production
if (isDevelopment || process.env.VERCEL !== "1") {
  server.start().catch((error) => {
    logger.error("Failed to start server", { error });
    process.exit(1);
  });
}
