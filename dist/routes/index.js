"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const logger_1 = require("../utils/logger");
const auth_1 = __importDefault(require("./auth"));
const blog_1 = __importDefault(require("./blog"));
const health_1 = __importDefault(require("./health"));
const project_1 = __importDefault(require("./project"));
const router = (0, express_1.Router)();
router.use("/auth", auth_1.default);
router.use("/health", health_1.default);
router.use("/blogs", blog_1.default);
router.use("/projects", project_1.default);
router.get("/", (req, res) => {
    logger_1.logger.info("API root accessed");
    const response = {
        success: true,
        message: "Sabbir Bin Abdul Latif Portfolio API v2",
        data: {
            version: "2.0.0",
            description: "Express.js API with JWT authentication for portfolio management",
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
router.get("/version", (req, res) => {
    const response = {
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
exports.default = router;
//# sourceMappingURL=index.js.map