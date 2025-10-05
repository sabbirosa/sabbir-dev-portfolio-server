"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cloudinary = void 0;
exports.uploadToCloudinary = uploadToCloudinary;
exports.deleteFromCloudinary = deleteFromCloudinary;
exports.extractPublicId = extractPublicId;
const cloudinary_1 = require("cloudinary");
Object.defineProperty(exports, "cloudinary", { enumerable: true, get: function () { return cloudinary_1.v2; } });
const environment_1 = require("../config/environment");
const logger_1 = require("./logger");
cloudinary_1.v2.config({
    cloud_name: environment_1.env.CLOUDINARY_CLOUD_NAME,
    api_key: environment_1.env.CLOUDINARY_API_KEY,
    api_secret: environment_1.env.CLOUDINARY_API_SECRET,
});
async function uploadToCloudinary(fileBuffer, folder, publicId) {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary_1.v2.uploader.upload_stream({
            folder: `portfolio/${folder}`,
            public_id: publicId,
            resource_type: "image",
            transformation: [
                { width: 1200, crop: "limit" },
                { quality: "auto" },
                { fetch_format: "auto" },
            ],
        }, (error, result) => {
            if (error) {
                logger_1.logger.error("Cloudinary upload error", { error: error.message });
                reject(error);
            }
            else if (result) {
                logger_1.logger.info("Image uploaded to Cloudinary", {
                    publicId: result.public_id,
                    url: result.secure_url,
                });
                resolve({
                    url: result.secure_url,
                    publicId: result.public_id,
                    width: result.width,
                    height: result.height,
                });
            }
        });
        uploadStream.end(fileBuffer);
    });
}
async function deleteFromCloudinary(publicId) {
    try {
        const result = await cloudinary_1.v2.uploader.destroy(publicId);
        logger_1.logger.info("Image deleted from Cloudinary", { publicId });
        return result;
    }
    catch (error) {
        logger_1.logger.error("Cloudinary deletion error", { error: error.message });
        throw error;
    }
}
function extractPublicId(url) {
    try {
        const match = url.match(/\/portfolio\/([^/]+\/[^/.]+)/);
        return match ? `portfolio/${match[1]}` : null;
    }
    catch (error) {
        logger_1.logger.error("Error extracting public ID from URL", { url });
        return null;
    }
}
//# sourceMappingURL=cloudinary.js.map