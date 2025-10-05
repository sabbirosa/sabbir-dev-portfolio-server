import { Router } from "express";
import { experienceController } from "../controllers/ExperienceController";
import { authenticateToken, requireAdmin } from "../middleware/auth";

const router = Router();

// Public routes
router.get(
  "/",
  experienceController.getAllExperience.bind(experienceController)
);
router.get(
  "/:id",
  experienceController.getExperienceById.bind(experienceController)
);

// Protected routes (admin only)
router.post(
  "/",
  authenticateToken,
  requireAdmin,
  experienceController.createExperience.bind(experienceController)
);
router.put(
  "/:id",
  authenticateToken,
  requireAdmin,
  experienceController.updateExperience.bind(experienceController)
);
router.delete(
  "/:id",
  authenticateToken,
  requireAdmin,
  experienceController.deleteExperience.bind(experienceController)
);

export default router;
