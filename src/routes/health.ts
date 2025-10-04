import { healthController } from "../controllers/HealthController";
import { asyncHandler } from "../middleware/errorHandler";
import { Router } from "express";

const router = Router();

/**
 * Health Routes
 * Base path: /api/health
 */

// GET /api/health - General health check
router.get(
  "/",
  asyncHandler(healthController.getHealth.bind(healthController))
);

// GET /api/health/ready - Readiness probe
router.get(
  "/ready",
  asyncHandler(healthController.getReadiness.bind(healthController))
);

// GET /api/health/live - Liveness probe
router.get(
  "/live",
  asyncHandler(healthController.getLiveness.bind(healthController))
);

export default router;
