"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const compression_1 = __importDefault(require("compression"));
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const environment_1 = require("./config/environment");
const errorHandler_1 = require("./middleware/errorHandler");
const security_1 = require("./middleware/security");
const routes_1 = __importDefault(require("./routes"));
const logger_1 = require("./utils/logger");
const app = (0, express_1.default)();
app.use(security_1.securityHeaders);
app.use((0, security_1.requestTimeout)(30000));
app.use(security_1.requestSizeLimiter);
if (!environment_1.isDevelopment) {
    app.use(security_1.apiRateLimiter);
}
app.use((0, compression_1.default)());
app.use((0, cors_1.default)({
    origin: environment_1.isDevelopment
        ? ["http://localhost:3000", "http://127.0.0.1:3000"]
        : [environment_1.env.FRONTEND_URL],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Accept"],
}));
app.use(express_1.default.json({ limit: "10mb" }));
app.use(express_1.default.urlencoded({ extended: true, limit: "10mb" }));
if (environment_1.isDevelopment) {
    app.use((0, morgan_1.default)("dev"));
}
else {
    app.use((0, morgan_1.default)("combined", {
        stream: {
            write: (message) => logger_1.logger.info(message.trim()),
        },
    }));
}
app.use((req, res, next) => {
    const start = Date.now();
    res.on("finish", () => {
        const duration = Date.now() - start;
        logger_1.logger.logRequest(req.method, req.url, res.statusCode, duration);
    });
    next();
});
app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Sabbir Ahmed Portfolio API v2 is running",
        timestamp: new Date().toISOString(),
        environment: environment_1.env.NODE_ENV,
    });
});
app.use("/api", routes_1.default);
app.use(errorHandler_1.notFoundHandler);
app.use(errorHandler_1.errorHandler);
exports.default = app;
//# sourceMappingURL=app.js.map