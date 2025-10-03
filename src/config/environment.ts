import dotenv from "dotenv";

// Load environment variables
dotenv.config();

export interface EnvironmentConfig {
  NODE_ENV: string;
  PORT: number;
  HOST: string;
  JWT_SECRET: string;
  JWT_EXPIRES_IN: string;
  ADMIN_EMAIL: string;
  ADMIN_PASSWORD: string;
  FRONTEND_URL: string;
  MONGODB_URI: string;
  RATE_LIMIT_MAX: number;
  RATE_LIMIT_WINDOW_MS: number;
  LOG_LEVEL: string;
}

// Validate required environment variables
const requiredEnvVars = [
  "JWT_SECRET",
  "ADMIN_EMAIL",
  "ADMIN_PASSWORD",
  "MONGODB_URI",
];

const missingEnvVars = requiredEnvVars.filter((envVar) => !process.env[envVar]);

if (missingEnvVars.length > 0) {
  console.error(
    "❌ Missing required environment variables:",
    missingEnvVars.join(", ")
  );
  console.error(
    "Please check your .env file and ensure all required variables are set."
  );
  process.exit(1);
}

export const env: EnvironmentConfig = {
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: parseInt(process.env.PORT || "3001", 10),
  HOST: process.env.HOST || "localhost",
  JWT_SECRET: process.env.JWT_SECRET!,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "7d",
  ADMIN_EMAIL: process.env.ADMIN_EMAIL!,
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD!,
  FRONTEND_URL: process.env.FRONTEND_URL || "http://localhost:3000",
  MONGODB_URI: process.env.MONGODB_URI || "mongodb://localhost:27017/portfolio",
  RATE_LIMIT_MAX: parseInt(process.env.RATE_LIMIT_MAX || "100", 10),
  RATE_LIMIT_WINDOW_MS: parseInt(
    process.env.RATE_LIMIT_WINDOW_MS || "900000",
    10
  ),
  LOG_LEVEL: process.env.LOG_LEVEL || "info",
};

export const isDevelopment = env.NODE_ENV === "development";
export const isProduction = env.NODE_ENV === "production";
export const isTest = env.NODE_ENV === "test";
