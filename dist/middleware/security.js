"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestTimeout = exports.createIPWhitelist = exports.requestSizeLimiter = exports.securityHeaders = exports.apiRateLimiter = exports.authRateLimiter = exports.createRateLimiter = void 0;
const environment_1 = require("../config/environment");
const logger_1 = require("../utils/logger");
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const helmet_1 = __importDefault(require("helmet"));
const createRateLimiter = (windowMs, max) => {
    return (0, express_rate_limit_1.default)({
        windowMs: windowMs || environment_1.env.RATE_LIMIT_WINDOW_MS,
        max: max || environment_1.env.RATE_LIMIT_MAX,
        message: {
            success: false,
            message: "Too many requests from this IP, please try again later",
            timestamp: new Date().toISOString(),
        },
        standardHeaders: true,
        legacyHeaders: false,
        handler: (req, res) => {
            logger_1.logger.warn("Rate limit exceeded", {
                ip: req.ip,
                url: req.url,
                method: req.method,
            });
            res.status(429).json({
                success: false,
                message: "Too many requests from this IP, please try again later",
                timestamp: new Date().toISOString(),
            });
        },
    });
};
exports.createRateLimiter = createRateLimiter;
exports.authRateLimiter = (0, exports.createRateLimiter)(15 * 60 * 1000, 5);
exports.apiRateLimiter = (0, exports.createRateLimiter)();
exports.securityHeaders = (0, helmet_1.default)({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            scriptSrc: ["'self'"],
            imgSrc: ["'self'", "data:", "https:"],
            connectSrc: ["'self'"],
            fontSrc: ["'self'"],
            objectSrc: ["'none'"],
            mediaSrc: ["'self'"],
            frameSrc: ["'none'"],
        },
    },
    crossOriginEmbedderPolicy: false,
    hsts: {
        maxAge: 31536000,
        includeSubDomains: true,
        preload: true,
    },
});
const requestSizeLimiter = (req, res, next) => {
    const maxSize = 10 * 1024 * 1024;
    const contentLength = req.get("content-length");
    if (contentLength && parseInt(contentLength) > maxSize) {
        logger_1.logger.warn("Request too large", {
            contentLength,
            maxSize,
            ip: req.ip,
            url: req.url,
        });
        res.status(413).json({
            success: false,
            message: "Request entity too large",
            timestamp: new Date().toISOString(),
        });
        return;
    }
    next();
};
exports.requestSizeLimiter = requestSizeLimiter;
const createIPWhitelist = (allowedIPs) => {
    return (req, res, next) => {
        const clientIP = req.ip || req.connection.remoteAddress;
        if (!allowedIPs.includes(clientIP || "")) {
            logger_1.logger.warn("IP not whitelisted", {
                clientIP,
                allowedIPs,
                url: req.url,
            });
            res.status(403).json({
                success: false,
                message: "Access forbidden",
                timestamp: new Date().toISOString(),
            });
            return;
        }
        next();
    };
};
exports.createIPWhitelist = createIPWhitelist;
const requestTimeout = (timeoutMs = 30000) => {
    return (req, res, next) => {
        const timeout = setTimeout(() => {
            logger_1.logger.warn("Request timeout", {
                url: req.url,
                method: req.method,
                timeout: timeoutMs,
            });
            if (!res.headersSent) {
                res.status(408).json({
                    success: false,
                    message: "Request timeout",
                    timestamp: new Date().toISOString(),
                });
            }
        }, timeoutMs);
        res.on("finish", () => {
            clearTimeout(timeout);
        });
        next();
    };
};
exports.requestTimeout = requestTimeout;
//# sourceMappingURL=security.js.map