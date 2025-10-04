import { projectController } from "../controllers/ProjectController";
import { authenticateToken, requireAdmin } from "../middleware/auth";
import { Router } from "express";

const router = Router();

// Public routes
router.get("/", projectController.getAllProjects.bind(projectController));
router.get("/:id", projectController.getProjectById.bind(projectController));

// Protected routes (admin only)
router.post(
  "/",
  authenticateToken,
  requireAdmin,
  projectController.createProject.bind(projectController)
);
router.put(
  "/:id",
  authenticateToken,
  requireAdmin,
  projectController.updateProject.bind(projectController)
);
router.delete(
  "/:id",
  authenticateToken,
  requireAdmin,
  projectController.deleteProject.bind(projectController)
);

export default router;
