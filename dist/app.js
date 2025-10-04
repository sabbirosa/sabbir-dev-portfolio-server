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
const routes_1 = __importDefault(require("./routes"));
const app = (0, express_1.default)();
const frontendUrl = process.env.FRONTEND_URL || environment_1.env.FRONTEND_URL;
let allowedOrigins;
if (!environment_1.isDevelopment) {
    allowedOrigins =
        frontendUrl && frontendUrl !== "http://localhost:3000"
            ? frontendUrl.split(",").map((u) => u.trim())
            : [
                "https://sabbir-dev-portfolio-client.vercel.app",
                /^https:\/\/sabbir-dev-portfolio-client.*\.vercel\.app$/,
            ];
}
else {
    allowedOrigins = ["http://localhost:3000", "http://127.0.0.1:3000"];
}
const corsConfig = {
    credentials: true,
    origin(origin, cb) {
        if (!origin)
            return cb(null, true);
        const ok = allowedOrigins.some((o) => typeof o === "string" ? o === origin : o.test(origin));
        cb(ok ? null : new Error(`CORS: origin not allowed: ${origin}`), ok);
    },
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
};
app.options("*", (0, cors_1.default)(corsConfig));
app.use((0, cors_1.default)(corsConfig));
app.use((0, compression_1.default)());
app.use(express_1.default.json({ limit: "10mb" }));
app.use(express_1.default.urlencoded({ extended: true, limit: "10mb" }));
app.use(environment_1.isDevelopment ? (0, morgan_1.default)("dev") : (0, morgan_1.default)("combined"));
app.get("/", (_req, res) => {
    res.json({
        success: true,
        message: "Sabbir Bin Abdul Latif Portfolio API v2 is running",
        timestamp: new Date().toISOString(),
        environment: environment_1.env.NODE_ENV,
    });
});
app.use("/api", routes_1.default);
app.use(errorHandler_1.notFoundHandler);
app.use(errorHandler_1.errorHandler);
exports.default = app;
//# sourceMappingURL=app.js.map