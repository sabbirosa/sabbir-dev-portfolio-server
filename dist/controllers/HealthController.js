"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.healthController = exports.HealthController = void 0;
const environment_1 = require("../config/environment");
const User_adapter_1 = require("../models/User.adapter");
const logger_1 = require("../utils/logger");
class HealthController {
    async getHealth(req, res) {
        try {
            const uptime = process.uptime();
            const memoryUsage = process.memoryUsage();
            const userCount = await User_adapter_1.userModel.getUserCount();
            const healthData = {
                status: "healthy",
                timestamp: new Date().toISOString(),
                uptime: `${Math.floor(uptime)}s`,
                environment: environment_1.env.NODE_ENV,
                version: process.env.npm_package_version || "1.0.0",
                server: {
                    port: environment_1.env.PORT,
                    host: environment_1.env.HOST,
                },
                database: {
                    type: "mongodb",
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
            if (environment_1.isDevelopment) {
                Object.assign(healthData, {
                    development: {
                        jwt: {
                            expiresIn: environment_1.env.JWT_EXPIRES_IN,
                        },
                        cors: {
                            origin: environment_1.env.FRONTEND_URL,
                        },
                        rateLimit: {
                            max: environment_1.env.RATE_LIMIT_MAX,
                            windowMs: environment_1.env.RATE_LIMIT_WINDOW_MS,
                        },
                    },
                });
            }
            logger_1.logger.info("Health check requested");
            const response = {
                success: true,
                message: "Server is running healthy",
                data: healthData,
                timestamp: new Date().toISOString(),
            };
            res.status(200).json(response);
        }
        catch (error) {
            this.handleError(res, error);
        }
    }
    async getReadiness(req, res) {
        try {
            const checks = await this.performReadinessChecks();
            const allReady = Object.values(checks).every((check) => check.status === "ready");
            const response = {
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
            logger_1.logger.info("Readiness check completed", { ready: allReady });
        }
        catch (error) {
            this.handleError(res, error);
        }
    }
    async getLiveness(req, res) {
        try {
            const response = {
                success: true,
                message: "Service is alive",
                data: {
                    alive: true,
                    timestamp: new Date().toISOString(),
                    uptime: process.uptime(),
                },
            };
            res.status(200).json(response);
            logger_1.logger.debug("Liveness check completed");
        }
        catch (error) {
            this.handleError(res, error);
        }
    }
    async performReadinessChecks() {
        const checks = {};
        try {
            const userCount = await User_adapter_1.userModel.getUserCount();
            checks.database = {
                status: "ready",
                type: "mongodb",
                userCount,
            };
        }
        catch (error) {
            checks.database = {
                status: "not_ready",
                error: error.message,
            };
        }
        try {
            const requiredEnvVars = ["JWT_SECRET", "ADMIN_EMAIL", "ADMIN_PASSWORD"];
            const missingVars = requiredEnvVars.filter((envVar) => !process.env[envVar]);
            checks.environment = {
                status: missingVars.length === 0 ? "ready" : "not_ready",
                missingVariables: missingVars,
            };
        }
        catch (error) {
            checks.environment = {
                status: "not_ready",
                error: error.message,
            };
        }
        try {
            const memoryUsage = process.memoryUsage();
            const heapUsedPercent = (memoryUsage.heapUsed / memoryUsage.heapTotal) * 100;
            checks.memory = {
                status: heapUsedPercent < 90 ? "ready" : "not_ready",
                heapUsedPercent: Math.round(heapUsedPercent * 100) / 100,
                heapUsed: `${Math.round(memoryUsage.heapUsed / 1024 / 1024)}MB`,
                heapTotal: `${Math.round(memoryUsage.heapTotal / 1024 / 1024)}MB`,
            };
        }
        catch (error) {
            checks.memory = {
                status: "not_ready",
                error: error.message,
            };
        }
        return checks;
    }
    handleError(res, error) {
        logger_1.logger.error("Health controller error", {
            message: error.message,
            stack: error.stack,
        });
        const response = {
            success: false,
            message: "Health check failed",
            error: environment_1.isDevelopment ? error.message : "Internal server error",
            timestamp: new Date().toISOString(),
        };
        res.status(503).json(response);
    }
}
exports.HealthController = HealthController;
exports.healthController = new HealthController();
//# sourceMappingURL=HealthController.js.map