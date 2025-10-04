import { ApiResponse } from "../types";
import { logger } from "../utils/logger";
import { Router } from "express";
import authRoutes from "./auth";
import blogRoutes from "./blog";
import healthRoutes from "./health";
import projectRoutes from "./project";

const router = Router();

/**
 * API Routes
 * Base path: /api
 */

// Mount route modules
router.use("/auth", authRoutes);
router.use("/health", healthRoutes);
router.use("/blogs", blogRoutes);
router.use("/projects", projectRoutes);

// API root endpoint
router.get("/", (req, res) => {
  logger.info("API root accessed");

  const response: ApiResponse = {
    success: true,
    message: "Sabbir Ahmed Portfolio API v2",
    data: {
      version: "2.0.0",
      description:
        "Express.js API with JWT authentication for portfolio management",
      endpoints: {
        auth: {
          login: "POST /api/auth/login",
          verify: "GET /api/auth/verify",
          logout: "POST /api/auth/logout",
          profile: "GET /api/auth/profile",
          credentials: "GET /api/auth/credentials (dev only)",
        },
        health: {
          general: "GET /api/health",
          readiness: "GET /api/health/ready",
          liveness: "GET /api/health/live",
        },
        blogs: {
          getAll: "GET /api/blogs",
          getById: "GET /api/blogs/:id",
          create: "POST /api/blogs (protected)",
          update: "PUT /api/blogs/:id (protected)",
          delete: "DELETE /api/blogs/:id (protected)",
        },
        projects: {
          getAll: "GET /api/projects",
          getById: "GET /api/projects/:id",
          create: "POST /api/projects (protected)",
          update: "PUT /api/projects/:id (protected)",
          delete: "DELETE /api/projects/:id (protected)",
        },
      },
      documentation: "https://github.com/sabbir-ahmed/portfolio-v2-server",
    },
    timestamp: new Date().toISOString(),
  };

  res.json(response);
});

// API version endpoint
router.get("/version", (req, res) => {
  const response: ApiResponse = {
    success: true,
    message: "API version information",
    data: {
      version: "2.0.0",
      buildDate: new Date().toISOString(),
      nodeVersion: process.version,
      environment: process.env.NODE_ENV || "development",
    },
    timestamp: new Date().toISOString(),
  };

  res.json(response);
});

export default router;
