"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AuthController_mongoose_1 = require("../controllers/AuthController.mongoose");
const auth_1 = require("../middleware/auth");
const errorHandler_1 = require("../middleware/errorHandler");
const security_1 = require("../middleware/security");
const express_1 = require("express");
const router = (0, express_1.Router)();
router.post("/login", security_1.authRateLimiter, (0, errorHandler_1.asyncHandler)(AuthController_mongoose_1.authController.login.bind(AuthController_mongoose_1.authController)));
router.get("/verify", auth_1.authenticateToken, (0, errorHandler_1.asyncHandler)(AuthController_mongoose_1.authController.verify.bind(AuthController_mongoose_1.authController)));
router.post("/logout", auth_1.authenticateToken, (0, errorHandler_1.asyncHandler)(AuthController_mongoose_1.authController.logout.bind(AuthController_mongoose_1.authController)));
router.get("/profile", auth_1.authenticateToken, (0, errorHandler_1.asyncHandler)(AuthController_mongoose_1.authController.getProfile.bind(AuthController_mongoose_1.authController)));
router.get("/credentials", (0, errorHandler_1.asyncHandler)(AuthController_mongoose_1.authController.getCredentials.bind(AuthController_mongoose_1.authController)));
exports.default = router;
//# sourceMappingURL=auth.js.map