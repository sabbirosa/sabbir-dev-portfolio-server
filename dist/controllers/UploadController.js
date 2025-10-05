"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadController = exports.UploadController = void 0;
const cloudinary_1 = require("../utils/cloudinary");
const logger_1 = require("../utils/logger");
class UploadController {
    async uploadImage(req, res) {
        try {
            if (!req.file) {
                res.status(400).json({
                    success: false,
                    message: "No file uploaded",
                });
                return;
            }
            const { folder = "general" } = req.body;
            const validFolders = ["blogs", "projects", "general"];
            const targetFolder = validFolders.includes(folder) ? folder : "general";
            const result = await (0, cloudinary_1.uploadToCloudinary)(req.file.buffer, targetFolder, undefined);
            logger_1.logger.info("Image uploaded successfully", {
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
        }
        catch (error) {
            logger_1.logger.error("Error uploading image", { error: error.message });
            res.status(500).json({
                success: false,
                message: "Failed to upload image",
                error: error.message,
            });
        }
    }
    async deleteImage(req, res) {
        try {
            const { publicId } = req.body;
            if (!publicId) {
                res.status(400).json({
                    success: false,
                    message: "Public ID is required",
                });
                return;
            }
            await (0, cloudinary_1.deleteFromCloudinary)(publicId);
            logger_1.logger.info("Image deleted successfully", { publicId });
            res.status(200).json({
                success: true,
                message: "Image deleted successfully",
            });
        }
        catch (error) {
            logger_1.logger.error("Error deleting image", { error: error.message });
            res.status(500).json({
                success: false,
                message: "Failed to delete image",
                error: error.message,
            });
        }
    }
}
exports.UploadController = UploadController;
exports.uploadController = new UploadController();
//# sourceMappingURL=UploadController.js.map