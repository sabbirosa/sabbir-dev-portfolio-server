"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.asyncHandler = exports.notFoundHandler = exports.errorHandler = void 0;
const environment_1 = require("../config/environment");
const types_1 = require("../types");
const logger_1 = require("../utils/logger");
const errorHandler = (error, req, res, next) => {
    logger_1.logger.error("Unhandled error", {
        message: error.message,
        stack: error.stack,
        url: req.url,
        method: req.method,
        ip: req.ip,
        userAgent: req.get("User-Agent"),
    });
    let statusCode = 500;
    let message = "Internal server error";
    let details = undefined;
    if (error instanceof types_1.AppError) {
        statusCode = error.statusCode;
        message = error.message;
    }
    else if (error.name === "ValidationError") {
        statusCode = 400;
        message = "Validation failed";
        details = environment_1.isDevelopment ? error.message : undefined;
    }
    else if (error.name === "CastError") {
        statusCode = 400;
        message = "Invalid data format";
    }
    else if (error.name === "MongoError" && error.code === 11000) {
        statusCode = 409;
        message = "Duplicate entry";
    }
    else if (error.message.includes("ENOTFOUND") ||
        error.message.includes("ECONNREFUSED")) {
        statusCode = 503;
        message = "Service unavailable";
    }
    const response = {
        success: false,
        message,
        error: environment_1.isDevelopment ? error.message : undefined,
        timestamp: new Date().toISOString(),
    };
    if (environment_1.isDevelopment && details) {
        response.data = { details };
    }
    res.status(statusCode).json(response);
};
exports.errorHandler = errorHandler;
const notFoundHandler = (req, res) => {
    logger_1.logger.warn("Route not found", {
        url: req.url,
        method: req.method,
        ip: req.ip,
    });
    const response = {
        success: false,
        message: `Route ${req.method} ${req.url} not found`,
        timestamp: new Date().toISOString(),
    };
    res.status(404).json(response);
};
exports.notFoundHandler = notFoundHandler;
const asyncHandler = (fn) => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};
exports.asyncHandler = asyncHandler;
//# sourceMappingURL=errorHandler.js.map