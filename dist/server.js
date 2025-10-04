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
const mongoose_1 = __importDefault(require("mongoose"));
const app_1 = __importDefault(require("./app"));
const environment_1 = require("./config/environment");
const logger_1 = require("./utils/logger");
let server;
const startServer = async () => {
    try {
        await mongoose_1.default.connect(environment_1.env.MONGODB_URI || "mongodb://localhost:27017/portfolio", {
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
            maxPoolSize: 10,
            minPoolSize: 2,
        });
        console.log("🗄️  MongoDB connected successfully");
        logger_1.logger.info("📦 Database initialized successfully");
        if (environment_1.isDevelopment) {
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
        server = app_1.default.listen(environment_1.env.PORT, () => {
            logger_1.logger.info(`🚀 Server running on http://${environment_1.env.HOST}:${environment_1.env.PORT}`);
            logger_1.logger.info(`📋 Environment: ${environment_1.env.NODE_ENV}`);
            logger_1.logger.info(`📋 API Health: http://${environment_1.env.HOST}:${environment_1.env.PORT}/api/health`);
            logger_1.logger.info(`🔐 Admin Email: ${environment_1.env.ADMIN_EMAIL}`);
            if (environment_1.isDevelopment) {
                logger_1.logger.info(`🔑 Demo Credentials: http://${environment_1.env.HOST}:${environment_1.env.PORT}/api/auth/credentials`);
            }
        });
    }
    catch (error) {
        console.error("Failed to start server:", error);
        logger_1.logger.error("Failed to start server", {
            error: error.message,
        });
        process.exit(1);
    }
};
if (process.env.VERCEL !== "1") {
    (async () => {
        await startServer();
    })();
}
process.on("SIGTERM", () => {
    logger_1.logger.info("SIGTERM signal received... Server shutting down...");
    if (server) {
        server.close(() => {
            logger_1.logger.info("Server closed");
            process.exit(0);
        });
    }
    else {
        process.exit(0);
    }
});
process.on("SIGINT", () => {
    logger_1.logger.info("SIGINT signal received... Server shutting down...");
    if (server) {
        server.close(() => {
            logger_1.logger.info("Server closed");
            process.exit(0);
        });
    }
    else {
        process.exit(0);
    }
});
process.on("unhandledRejection", (err) => {
    logger_1.logger.error("Unhandled Rejection detected... Server shutting down...", {
        error: err,
    });
    if (server) {
        server.close(() => {
            process.exit(1);
        });
    }
    else {
        process.exit(1);
    }
});
process.on("uncaughtException", (err) => {
    logger_1.logger.error("Uncaught Exception detected... Server shutting down...", {
        error: err.message,
        stack: err.stack,
    });
    if (server) {
        server.close(() => {
            process.exit(1);
        });
    }
    else {
        process.exit(1);
    }
});
exports.default = app_1.default;
//# sourceMappingURL=server.js.map