"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.closeDatabase = exports.initializeDatabase = exports.databaseConfig = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const environment_1 = require("./environment");
exports.databaseConfig = {
    type: "mongodb",
    connectionString: environment_1.env.MONGODB_URI || "mongodb://localhost:27017/portfolio",
    options: {
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
        maxPoolSize: 10,
        minPoolSize: 2,
    },
};
let cachedConnection = null;
const initializeDatabase = async () => {
    switch (exports.databaseConfig.type) {
        case "memory":
            console.log("🗄️  Using in-memory database for demo");
            break;
        case "prisma":
            console.log("🗄️  Initializing Prisma database connection");
            break;
        case "mongodb":
            if (!exports.databaseConfig.connectionString) {
                throw new Error("MongoDB connection string is not defined");
            }
            if (mongoose_1.default.connection.readyState === 1) {
                console.log("🗄️  Using existing MongoDB connection");
                return;
            }
            if (mongoose_1.default.connection.readyState === 2) {
                console.log("🗄️  MongoDB connection in progress, waiting...");
                await mongoose_1.default.connection.asPromise();
                return;
            }
            try {
                if (!cachedConnection) {
                    cachedConnection = mongoose_1.default.connect(exports.databaseConfig.connectionString, {
                        ...exports.databaseConfig.options,
                    });
                }
                await cachedConnection;
                console.log("🗄️  MongoDB connected successfully");
            }
            catch (error) {
                console.error("MongoDB connection error:", error);
                cachedConnection = null;
                throw error;
            }
            mongoose_1.default.connection.on("error", (err) => {
                console.error("MongoDB connection error:", err);
            });
            mongoose_1.default.connection.on("disconnected", () => {
                console.log("🗄️  MongoDB disconnected");
                cachedConnection = null;
            });
            break;
        default:
            throw new Error("Unknown database type");
    }
};
exports.initializeDatabase = initializeDatabase;
const closeDatabase = async () => {
    if (exports.databaseConfig.type === "mongodb") {
        await mongoose_1.default.connection.close();
    }
    console.log("🗄️  Database connection closed");
};
exports.closeDatabase = closeDatabase;
//# sourceMappingURL=database.js.map