"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authController = exports.AuthController = void 0;
const User_adapter_1 = require("../models/User.adapter");
const types_1 = require("../types");
const jwt_1 = require("../utils/jwt");
const logger_1 = require("../utils/logger");
const validation_1 = require("../utils/validation");
class AuthController {
    async login(req, res) {
        try {
            const loginData = (0, validation_1.validateInput)(validation_1.loginSchema, req.body);
            logger_1.logger.info("Login attempt", { email: loginData.email });
            const user = await User_adapter_1.userModel.authenticateUser(loginData.email, loginData.password);
            if (!user) {
                logger_1.logger.warn("Login failed - invalid credentials", {
                    email: loginData.email,
                });
                throw new types_1.UnauthorizedError("Invalid email or password");
            }
            const token = jwt_1.JWTService.generateToken(user);
            const authResponse = {
                token,
                user: User_adapter_1.userModel.sanitizeUser(user),
            };
            logger_1.logger.logAuth("LOGIN_SUCCESS", user.id, user.email);
            const response = {
                success: true,
                message: "Login successful",
                data: authResponse,
                timestamp: new Date().toISOString(),
            };
            res.status(200).json(response);
        }
        catch (error) {
            this.handleError(res, error, "login");
        }
    }
    async verify(req, res) {
        try {
            const authRequest = req;
            const user = authRequest.user;
            if (!user) {
                throw new types_1.UnauthorizedError("Invalid token payload");
            }
            logger_1.logger.logAuth("TOKEN_VERIFIED", user.id, user.email);
            const response = {
                success: true,
                message: "Token is valid",
                data: { user },
                timestamp: new Date().toISOString(),
            };
            res.status(200).json(response);
        }
        catch (error) {
            this.handleError(res, error, "verify");
        }
    }
    async logout(req, res) {
        try {
            const authRequest = req;
            const user = authRequest.user;
            if (user) {
                logger_1.logger.logAuth("LOGOUT", user.id, user.email);
            }
            const response = {
                success: true,
                message: "Logged out successfully",
                timestamp: new Date().toISOString(),
            };
            res.status(200).json(response);
        }
        catch (error) {
            this.handleError(res, error, "logout");
        }
    }
    async getCredentials(req, res) {
        try {
            if (process.env.NODE_ENV === "production") {
                throw new Error("Credentials endpoint not available in production");
            }
            const response = {
                success: true,
                message: "Demo credentials for testing",
                data: {
                    email: process.env.ADMIN_EMAIL,
                    password: process.env.ADMIN_PASSWORD,
                    note: "Use these credentials to login as admin",
                },
                timestamp: new Date().toISOString(),
            };
            res.status(200).json(response);
        }
        catch (error) {
            this.handleError(res, error, "getCredentials");
        }
    }
    async getProfile(req, res) {
        try {
            const authRequest = req;
            const user = authRequest.user;
            if (!user) {
                throw new types_1.UnauthorizedError("User not found");
            }
            const fullUser = await User_adapter_1.userModel.getUserById(user.id);
            if (!fullUser) {
                throw new types_1.UnauthorizedError("User not found in database");
            }
            const response = {
                success: true,
                message: "Profile retrieved successfully",
                data: { user: User_adapter_1.userModel.sanitizeUser(fullUser) },
                timestamp: new Date().toISOString(),
            };
            res.status(200).json(response);
        }
        catch (error) {
            this.handleError(res, error, "getProfile");
        }
    }
    handleError(res, error, operation) {
        logger_1.logger.error(`Auth controller error in ${operation}`, {
            message: error.message,
            stack: error.stack,
        });
        let statusCode = 500;
        let message = "Internal server error";
        if (error instanceof types_1.ValidationError) {
            statusCode = 400;
            message = error.message;
        }
        else if (error instanceof types_1.UnauthorizedError) {
            statusCode = 401;
            message = error.message;
        }
        else if (error.message.includes("validation") ||
            error.message.includes("required")) {
            statusCode = 400;
            message = error.message;
        }
        const response = {
            success: false,
            message,
            error: process.env.NODE_ENV === "development" ? error.message : undefined,
            timestamp: new Date().toISOString(),
        };
        res.status(statusCode).json(response);
    }
}
exports.AuthController = AuthController;
exports.authController = new AuthController();
//# sourceMappingURL=AuthController.js.map