import { Router } from "express";
import { educationController } from "../controllers/EducationController";
import { authenticateToken, requireAdmin } from "../middleware/auth";

const router = Router();

// Public routes
router.get("/", educationController.getAllEducation.bind(educationController));
router.get(
  "/:id",
  educationController.getEducationById.bind(educationController)
);

// Protected routes (admin only)
router.post(
  "/",
  authenticateToken,
  requireAdmin,
  educationController.createEducation.bind(educationController)
);
router.put(
  "/:id",
  authenticateToken,
  requireAdmin,
  educationController.updateEducation.bind(educationController)
);
router.delete(
  "/:id",
  authenticateToken,
  requireAdmin,
  educationController.deleteEducation.bind(educationController)
);

export default router;
