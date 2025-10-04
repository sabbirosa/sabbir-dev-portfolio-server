"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isTest = exports.isProduction = exports.isDevelopment = exports.env = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const requiredEnvVars = [
    "JWT_SECRET",
    "ADMIN_EMAIL",
    "ADMIN_PASSWORD",
    "MONGODB_URI",
];
const missingEnvVars = requiredEnvVars.filter((envVar) => !process.env[envVar]);
if (missingEnvVars.length > 0) {
    console.error("❌ Missing required environment variables:", missingEnvVars.join(", "));
    console.error("Please check your .env file and ensure all required variables are set.");
    process.exit(1);
}
exports.env = {
    NODE_ENV: process.env.NODE_ENV || "development",
    PORT: parseInt(process.env.PORT || "3001", 10),
    HOST: process.env.HOST || "localhost",
    JWT_SECRET: process.env.JWT_SECRET,
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "7d",
    ADMIN_EMAIL: process.env.ADMIN_EMAIL,
    ADMIN_PASSWORD: process.env.ADMIN_PASSWORD,
    FRONTEND_URL: process.env.FRONTEND_URL || "http://localhost:3000",
    MONGODB_URI: process.env.MONGODB_URI || "mongodb://localhost:27017/portfolio",
    RATE_LIMIT_MAX: parseInt(process.env.RATE_LIMIT_MAX || "100", 10),
    RATE_LIMIT_WINDOW_MS: parseInt(process.env.RATE_LIMIT_WINDOW_MS || "900000", 10),
    LOG_LEVEL: process.env.LOG_LEVEL || "info",
};
exports.isDevelopment = exports.env.NODE_ENV === "development";
exports.isProduction = exports.env.NODE_ENV === "production";
exports.isTest = exports.env.NODE_ENV === "test";
//# sourceMappingURL=environment.js.map