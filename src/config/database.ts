// Database configuration with MongoDB/Mongoose
import mongoose from "mongoose";
import { env } from "./environment";

export interface DatabaseConfig {
  type: "memory" | "prisma" | "mongodb";
  connectionString?: string;
  options?: Record<string, any>;
}

export const databaseConfig: DatabaseConfig = {
  type: "mongodb",
  connectionString: env.MONGODB_URI || "mongodb://localhost:27017/portfolio",
  options: {
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
  },
};

// Initialize database connection
export const initializeDatabase = async (): Promise<void> => {
  switch (databaseConfig.type) {
    case "memory":
      console.log("🗄️  Using in-memory database for demo");
      break;
    case "prisma":
      // Initialize Prisma client
      console.log("🗄️  Initializing Prisma database connection");
      break;
    case "mongodb":
      if (!databaseConfig.connectionString) {
        throw new Error("MongoDB connection string is not defined");
      }

      try {
        await mongoose.connect(databaseConfig.connectionString, {
          ...databaseConfig.options,
        });
        console.log("🗄️  MongoDB connected successfully");
      } catch (error) {
        console.error("MongoDB connection error:", error);
        throw error;
      }

      // Handle connection events
      mongoose.connection.on("error", (err) => {
        console.error("MongoDB connection error:", err);
      });

      mongoose.connection.on("disconnected", () => {
        console.log("🗄️  MongoDB disconnected");
      });

      break;
    default:
      throw new Error("Unknown database type");
  }
};

export const closeDatabase = async (): Promise<void> => {
  if (databaseConfig.type === "mongodb") {
    await mongoose.connection.close();
  }
  console.log("🗄️  Database connection closed");
};
