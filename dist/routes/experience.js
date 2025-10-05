"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ExperienceController_1 = require("../controllers/ExperienceController");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
router.get("/", ExperienceController_1.experienceController.getAllExperience.bind(ExperienceController_1.experienceController));
router.get("/:id", ExperienceController_1.experienceController.getExperienceById.bind(ExperienceController_1.experienceController));
router.post("/", auth_1.authenticateToken, auth_1.requireAdmin, ExperienceController_1.experienceController.createExperience.bind(ExperienceController_1.experienceController));
router.put("/:id", auth_1.authenticateToken, auth_1.requireAdmin, ExperienceController_1.experienceController.updateExperience.bind(ExperienceController_1.experienceController));
router.delete("/:id", auth_1.authenticateToken, auth_1.requireAdmin, ExperienceController_1.experienceController.deleteExperience.bind(ExperienceController_1.experienceController));
exports.default = router;
//# sourceMappingURL=experience.js.map