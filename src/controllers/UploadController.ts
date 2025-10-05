import { Request, Response } from "express";
import { deleteFromCloudinary, uploadToCloudinary } from "../utils/cloudinary";
import { logger } from "../utils/logger";

/**
 * Upload Controller
 * Handles image upload operations to Cloudinary
 */
export class UploadController {
  /**
   * Upload an image to Cloudinary
   * @route POST /api/upload
   */
  async uploadImage(req: Request, res: Response): Promise<void> {
    try {
      if (!req.file) {
        res.status(400).json({
          success: false,
          message: "No file uploaded",
        });
        return;
      }

      const { folder = "general" } = req.body;

      // Validate folder name to prevent path traversal
      const validFolders = ["blogs", "projects", "general"];
      const targetFolder = validFolders.includes(folder) ? folder : "general";

      // Upload to Cloudinary
      const result = await uploadToCloudinary(
        req.file.buffer,
        targetFolder,
        undefined
      );

      logger.info("Image uploaded successfully", {
        url: result.url,
        folder: targetFolder,
      });

      res.status(200).json({
        success: true,
        message: "Image uploaded successfully",
        data: {
          url: result.url,
          publicId: result.publicId,
          width: result.width,
          height: result.height,
        },
      });
    } catch (error: any) {
      logger.error("Error uploading image", { error: error.message });
      res.status(500).json({
        success: false,
        message: "Failed to upload image",
        error: error.message,
      });
    }
  }

  /**
   * Delete an image from Cloudinary
   * @route DELETE /api/upload/:publicId
   */
  async deleteImage(req: Request, res: Response): Promise<void> {
    try {
      const { publicId } = req.body;

      if (!publicId) {
        res.status(400).json({
          success: false,
          message: "Public ID is required",
        });
        return;
      }

      await deleteFromCloudinary(publicId);

      logger.info("Image deleted successfully", { publicId });

      res.status(200).json({
        success: true,
        message: "Image deleted successfully",
      });
    } catch (error: any) {
      logger.error("Error deleting image", { error: error.message });
      res.status(500).json({
        success: false,
        message: "Failed to delete image",
        error: error.message,
      });
    }
  }
}

export const uploadController = new UploadController();
