import { authController } from "../controllers/AuthController.mongoose";
import { authenticateToken } from "../middleware/auth";
import { asyncHandler } from "../middleware/errorHandler";
import { authRateLimiter } from "../middleware/security";
import { Router } from "express";

const router = Router();

/**
 * Auth Routes
 * Base path: /api/auth
 */

// POST /api/auth/login - User login
router.post(
  "/login",
  authRateLimiter,
  asyncHandler(authController.login.bind(authController))
);

// GET /api/auth/verify - Verify token
router.get(
  "/verify",
  authenticateToken,
  asyncHandler(authController.verify.bind(authController))
);

// POST /api/auth/logout - User logout
router.post(
  "/logout",
  authenticateToken,
  asyncHandler(authController.logout.bind(authController))
);

// GET /api/auth/profile - Get user profile
router.get(
  "/profile",
  authenticateToken,
  asyncHandler(authController.getProfile.bind(authController))
);

// GET /api/auth/credentials - Get demo credentials (development only)
router.get(
  "/credentials",
  asyncHandler(authController.getCredentials.bind(authController))
);

export default router;
