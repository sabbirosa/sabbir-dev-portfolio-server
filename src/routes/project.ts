import { Router } from "express";
import { projectController } from "@/controllers/ProjectController";
import { authenticate } from "@/middleware/auth";

const router = Router();

// Public routes
router.get("/", projectController.getAllProjects.bind(projectController));
router.get("/:id", projectController.getProjectById.bind(projectController));

// Protected routes (admin only)
router.post("/", authenticate, projectController.createProject.bind(projectController));
router.put("/:id", authenticate, projectController.updateProject.bind(projectController));
router.delete("/:id", authenticate, projectController.deleteProject.bind(projectController));

export default router;

