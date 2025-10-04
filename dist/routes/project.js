"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ProjectController_1 = require("../controllers/ProjectController");
const auth_1 = require("../middleware/auth");
const express_1 = require("express");
const router = (0, express_1.Router)();
router.get("/", ProjectController_1.projectController.getAllProjects.bind(ProjectController_1.projectController));
router.get("/:id", ProjectController_1.projectController.getProjectById.bind(ProjectController_1.projectController));
router.post("/", auth_1.authenticateToken, auth_1.requireAdmin, ProjectController_1.projectController.createProject.bind(ProjectController_1.projectController));
router.put("/:id", auth_1.authenticateToken, auth_1.requireAdmin, ProjectController_1.projectController.updateProject.bind(ProjectController_1.projectController));
router.delete("/:id", auth_1.authenticateToken, auth_1.requireAdmin, ProjectController_1.projectController.deleteProject.bind(ProjectController_1.projectController));
exports.default = router;
//# sourceMappingURL=project.js.map