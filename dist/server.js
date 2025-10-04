"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = require("./config/database");
const environment_1 = require("./config/environment");
const errorHandler_1 = require("./middleware/errorHandler");
const security_1 = require("./middleware/security");
const routes_1 = __importDefault(require("./routes"));
const logger_1 = require("./utils/logger");
const compression_1 = __importDefault(require("compression"));
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
class Server {
    constructor() {
        this.isInitialized = false;
        this.initializationPromise = null;
        this.app = (0, express_1.default)();
        this.port = environment_1.env.PORT;
        this.host = environment_1.env.HOST;
        this.configureMiddleware();
        this.configureRoutes();
        this.configureErrorHandling();
    }
    async initialize() {
        if (this.isInitialized) {
            return;
        }
        if (this.initializationPromise) {
            return this.initializationPromise;
        }
        this.initializationPromise = (async () => {
            try {
                await this.initializeDatabase();
                if (environment_1.isDevelopment) {
                    await this.seedInitialData();
                }
                this.isInitialized = true;
                logger_1.logger.info("✅ Server initialized successfully");
            }
            catch (error) {
                logger_1.logger.error("Failed to initialize server", {
                    error: error.message,
                });
                throw error;
            }
        })();
        return this.initializationPromise;
    }
    async initializeDatabase() {
        try {
            await (0, database_1.initializeDatabase)();
            logger_1.logger.info("📦 Database initialized successfully");
        }
        catch (error) {
            logger_1.logger.error("Database initialization failed", {
                error: error.message,
            });
            throw error;
        }
    }
    configureMiddleware() {
        this.app.use(security_1.securityHeaders);
        this.app.use((0, security_1.requestTimeout)(30000));
        this.app.use(security_1.requestSizeLimiter);
        if (!environment_1.isDevelopment) {
            this.app.use(security_1.apiRateLimiter);
        }
        this.app.use((0, compression_1.default)());
        this.app.use((0, cors_1.default)({
            origin: environment_1.isDevelopment
                ? ["http://localhost:3000", "http://127.0.0.1:3000"]
                : [environment_1.env.FRONTEND_URL],
            credentials: true,
            methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
            allowedHeaders: ["Content-Type", "Authorization", "Accept"],
        }));
        this.app.use(express_1.default.json({ limit: "10mb" }));
        this.app.use(express_1.default.urlencoded({ extended: true, limit: "10mb" }));
        if (environment_1.isDevelopment) {
            this.app.use((0, morgan_1.default)("dev"));
        }
        else {
            this.app.use((0, morgan_1.default)("combined", {
                stream: {
                    write: (message) => logger_1.logger.info(message.trim()),
                },
            }));
        }
        this.app.use((req, res, next) => {
            const start = Date.now();
            res.on("finish", () => {
                const duration = Date.now() - start;
                logger_1.logger.logRequest(req.method, req.url, res.statusCode, duration);
            });
            next();
        });
        logger_1.logger.info("🔧 Middleware configured successfully");
    }
    configureRoutes() {
        this.app.get("/", (req, res) => {
            res.json({
                success: true,
                message: "Sabbir Ahmed Portfolio API v2 is running",
                timestamp: new Date().toISOString(),
                environment: environment_1.env.NODE_ENV,
            });
        });
        this.app.use(async (req, res, next) => {
            try {
                await this.initialize();
                next();
            }
            catch (error) {
                next(error);
            }
        });
        this.app.use("/api", routes_1.default);
        logger_1.logger.info("🛣️  Routes configured successfully");
    }
    configureErrorHandling() {
        this.app.use(errorHandler_1.notFoundHandler);
        this.app.use(errorHandler_1.errorHandler);
        logger_1.logger.info("🛡️  Error handling configured successfully");
    }
    async seedInitialData() {
        try {
            const { seedAll } = await Promise.resolve().then(() => __importStar(require("./scripts/seed.mongoose")));
            await seedAll();
            logger_1.logger.info("🌱 Initial data seeded successfully");
        }
        catch (error) {
            logger_1.logger.error("Initial data seeding failed", {
                error: error.message,
            });
        }
    }
    async start() {
        try {
            await this.initialize();
            const server = this.app.listen(this.port, this.host, () => {
                logger_1.logger.info(`🚀 Server running on http://${this.host}:${this.port}`);
                logger_1.logger.info(`📋 Environment: ${environment_1.env.NODE_ENV}`);
                logger_1.logger.info(`📋 API Health: http://${this.host}:${this.port}/api/health`);
                logger_1.logger.info(`🔐 Admin Email: ${environment_1.env.ADMIN_EMAIL}`);
                if (environment_1.isDevelopment) {
                    logger_1.logger.info(`🔑 Demo Credentials: http://${this.host}:${this.port}/api/auth/credentials`);
                }
            });
            process.on("SIGTERM", () => {
                logger_1.logger.info("SIGTERM received, shutting down gracefully");
                server.close(() => {
                    logger_1.logger.info("Server closed");
                    process.exit(0);
                });
            });
            process.on("SIGINT", () => {
                logger_1.logger.info("SIGINT received, shutting down gracefully");
                server.close(() => {
                    logger_1.logger.info("Server closed");
                    process.exit(0);
                });
            });
            process.on("uncaughtException", (error) => {
                logger_1.logger.error("Uncaught Exception", {
                    error: error.message,
                    stack: error.stack,
                });
                process.exit(1);
            });
            process.on("unhandledRejection", (reason, promise) => {
                logger_1.logger.error("Unhandled Rejection", { reason, promise });
                process.exit(1);
            });
        }
        catch (error) {
            logger_1.logger.error("Failed to start server", {
                error: error.message,
            });
            process.exit(1);
        }
    }
    getApp() {
        return this.app;
    }
}
const server = new Server();
exports.default = server.getApp();
if (environment_1.isDevelopment || process.env.VERCEL !== "1") {
    server.start().catch((error) => {
        logger_1.logger.error("Failed to start server", { error });
        process.exit(1);
    });
}
//# sourceMappingURL=server.js.map