"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const EducationController_1 = require("../controllers/EducationController");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
router.get("/", EducationController_1.educationController.getAllEducation.bind(EducationController_1.educationController));
router.get("/:id", EducationController_1.educationController.getEducationById.bind(EducationController_1.educationController));
router.post("/", auth_1.authenticateToken, auth_1.requireAdmin, EducationController_1.educationController.createEducation.bind(EducationController_1.educationController));
router.put("/:id", auth_1.authenticateToken, auth_1.requireAdmin, EducationController_1.educationController.updateEducation.bind(EducationController_1.educationController));
router.delete("/:id", auth_1.authenticateToken, auth_1.requireAdmin, EducationController_1.educationController.deleteEducation.bind(EducationController_1.educationController));
exports.default = router;
//# sourceMappingURL=education.js.map