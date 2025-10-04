"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.optionalAuth = exports.requireAdmin = exports.requireRole = exports.authenticateToken = void 0;
const User_adapter_1 = require("../models/User.adapter");
const types_1 = require("../types");
const jwt_1 = require("../utils/jwt");
const logger_1 = require("../utils/logger");
const authenticateToken = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        const token = jwt_1.JWTService.extractTokenFromHeader(authHeader);
        if (!token) {
            throw new types_1.UnauthorizedError("Access token required");
        }
        const decoded = jwt_1.JWTService.verifyToken(token);
        const user = await User_adapter_1.userModel.getUserById(decoded.id);
        if (!user) {
            throw new types_1.UnauthorizedError("User not found");
        }
        req.user = {
            id: user.id,
            email: user.email,
            role: user.role,
        };
        logger_1.logger.debug("User authenticated", { userId: user.id, email: user.email });
        next();
    }
    catch (error) {
        handleAuthError(res, error);
    }
};
exports.authenticateToken = authenticateToken;
const requireRole = (allowedRoles) => {
    return (req, res, next) => {
        try {
            if (!req.user) {
                throw new types_1.UnauthorizedError("Authentication required");
            }
            if (!allowedRoles.includes(req.user.role)) {
                logger_1.logger.warn("Access denied - insufficient permissions", {
                    userId: req.user.id,
                    userRole: req.user.role,
                    requiredRoles: allowedRoles,
                });
                const response = {
                    success: false,
                    message: "Insufficient permissions",
                    timestamp: new Date().toISOString(),
                };
                res.status(403).json(response);
                return;
            }
            next();
        }
        catch (error) {
            handleAuthError(res, error);
        }
    };
};
exports.requireRole = requireRole;
exports.requireAdmin = (0, exports.requireRole)(["admin"]);
const optionalAuth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        const token = jwt_1.JWTService.extractTokenFromHeader(authHeader);
        if (token) {
            try {
                const decoded = jwt_1.JWTService.verifyToken(token);
                const user = await User_adapter_1.userModel.getUserById(decoded.id);
                if (user) {
                    req.user = {
                        id: user.id,
                        email: user.email,
                        role: user.role,
                    };
                }
            }
            catch (error) {
                logger_1.logger.debug("Optional auth failed", {
                    error: error.message,
                });
            }
        }
        next();
    }
    catch (error) {
        next();
    }
};
exports.optionalAuth = optionalAuth;
const handleAuthError = (res, error) => {
    logger_1.logger.warn("Authentication failed", { error: error.message });
    let statusCode = 401;
    let message = "Unauthorized";
    if (error instanceof types_1.UnauthorizedError) {
        statusCode = error.statusCode;
        message = error.message;
    }
    else if (error.message.includes("expired")) {
        message = "Token has expired";
    }
    else if (error.message.includes("invalid")) {
        message = "Invalid token";
    }
    const response = {
        success: false,
        message,
        timestamp: new Date().toISOString(),
    };
    res.status(statusCode).json(response);
};
//# sourceMappingURL=auth.js.map