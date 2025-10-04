/* eslint-disable no-console */
import { Server } from "http";
import mongoose from "mongoose";
import app from "./app";
import { env, isDevelopment } from "./config/environment";
import { logger } from "./utils/logger";

let server: Server;

const startServer = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(
      env.MONGODB_URI || "mongodb://localhost:27017/portfolio",
      {
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
        maxPoolSize: 10,
        minPoolSize: 2,
      }
    );

    console.log("🗄️  MongoDB connected successfully");
    logger.info("📦 Database initialized successfully");

    // Seed initial data only in development
    if (isDevelopment) {
      try {
        const { seedAll } = await import("./scripts/seed.mongoose");
        await seedAll();
        logger.info("🌱 Initial data seeded successfully");
      } catch (error) {
        logger.error("Initial data seeding failed", {
          error: (error as Error).message,
        });
      }
    }

    // Start server
    server = app.listen(env.PORT, () => {
      logger.info(`🚀 Server running on http://${env.HOST}:${env.PORT}`);
      logger.info(`📋 Environment: ${env.NODE_ENV}`);
      logger.info(`📋 API Health: http://${env.HOST}:${env.PORT}/api/health`);
      logger.info(`🔐 Admin Email: ${env.ADMIN_EMAIL}`);

      if (isDevelopment) {
        logger.info(
          `🔑 Demo Credentials: http://${env.HOST}:${env.PORT}/api/auth/credentials`
        );
      }
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    logger.error("Failed to start server", {
      error: (error as Error).message,
    });
    process.exit(1);
  }
};

// Start server only if not in Vercel environment
if (process.env.VERCEL !== "1") {
  (async () => {
    await startServer();
  })();
}

// Graceful shutdown handlers
process.on("SIGTERM", () => {
  logger.info("SIGTERM signal received... Server shutting down...");

  if (server) {
    server.close(() => {
      logger.info("Server closed");
      process.exit(0);
    });
  } else {
    process.exit(0);
  }
});

process.on("SIGINT", () => {
  logger.info("SIGINT signal received... Server shutting down...");

  if (server) {
    server.close(() => {
      logger.info("Server closed");
      process.exit(0);
    });
  } else {
    process.exit(0);
  }
});

process.on("unhandledRejection", (err) => {
  logger.error("Unhandled Rejection detected... Server shutting down...", {
    error: err,
  });

  if (server) {
    server.close(() => {
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
});

process.on("uncaughtException", (err) => {
  logger.error("Uncaught Exception detected... Server shutting down...", {
    error: err.message,
    stack: err.stack,
  });

  if (server) {
    server.close(() => {
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
});

// Export app for Vercel serverless
export default app;
