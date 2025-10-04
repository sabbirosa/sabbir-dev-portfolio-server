"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const HealthController_1 = require("../controllers/HealthController");
const errorHandler_1 = require("../middleware/errorHandler");
const express_1 = require("express");
const router = (0, express_1.Router)();
router.get("/", (0, errorHandler_1.asyncHandler)(HealthController_1.healthController.getHealth.bind(HealthController_1.healthController)));
router.get("/ready", (0, errorHandler_1.asyncHandler)(HealthController_1.healthController.getReadiness.bind(HealthController_1.healthController)));
router.get("/live", (0, errorHandler_1.asyncHandler)(HealthController_1.healthController.getLiveness.bind(HealthController_1.healthController)));
exports.default = router;
//# sourceMappingURL=health.js.map