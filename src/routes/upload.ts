import { Router } from "express";
import { uploadController } from "../controllers/UploadController";
import { authenticateToken, requireAdmin } from "../middleware/auth";
import { upload } from "../middleware/upload";

const router = Router();

// Protected routes (admin only)
router.post(
  "/",
  authenticateToken,
  requireAdmin,
  upload.single("image"),
  uploadController.uploadImage.bind(uploadController)
);

router.delete(
  "/",
  authenticateToken,
  requireAdmin,
  uploadController.deleteImage.bind(uploadController)
);

export default router;
