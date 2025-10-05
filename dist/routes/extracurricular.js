"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ExtracurricularController_1 = require("../controllers/ExtracurricularController");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
router.get("/", ExtracurricularController_1.extracurricularController.getAllExtracurricular.bind(ExtracurricularController_1.extracurricularController));
router.get("/:id", ExtracurricularController_1.extracurricularController.getExtracurricularById.bind(ExtracurricularController_1.extracurricularController));
router.post("/", auth_1.authenticateToken, auth_1.requireAdmin, ExtracurricularController_1.extracurricularController.createExtracurricular.bind(ExtracurricularController_1.extracurricularController));
router.put("/:id", auth_1.authenticateToken, auth_1.requireAdmin, ExtracurricularController_1.extracurricularController.updateExtracurricular.bind(ExtracurricularController_1.extracurricularController));
router.delete("/:id", auth_1.authenticateToken, auth_1.requireAdmin, ExtracurricularController_1.extracurricularController.deleteExtracurricular.bind(ExtracurricularController_1.extracurricularController));
exports.default = router;
//# sourceMappingURL=extracurricular.js.map