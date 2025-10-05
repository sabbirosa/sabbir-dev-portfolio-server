"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const UploadController_1 = require("../controllers/UploadController");
const auth_1 = require("../middleware/auth");
const upload_1 = require("../middleware/upload");
const router = (0, express_1.Router)();
router.post("/", auth_1.authenticateToken, auth_1.requireAdmin, upload_1.upload.single("image"), UploadController_1.uploadController.uploadImage.bind(UploadController_1.uploadController));
router.delete("/", auth_1.authenticateToken, auth_1.requireAdmin, UploadController_1.uploadController.deleteImage.bind(UploadController_1.uploadController));
exports.default = router;
//# sourceMappingURL=upload.js.map