import { v2 as cloudinary } from "cloudinary";
import { env } from "../config/environment";
import { logger } from "./logger";

// Configure Cloudinary
cloudinary.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
});

/**
 * Upload an image to Cloudinary
 * @param fileBuffer - The file buffer to upload
 * @param folder - The folder to upload to (e.g., 'blogs', 'projects')
 * @param publicId - Optional public ID for the image
 * @returns The Cloudinary upload result
 */
export async function uploadToCloudinary(
  fileBuffer: Buffer,
  folder: string,
  publicId?: string
): Promise<{
  url: string;
  publicId: string;
  width: number;
  height: number;
}> {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: `portfolio/${folder}`,
        public_id: publicId,
        resource_type: "image",
        transformation: [
          { width: 1200, crop: "limit" }, // Limit max width to 1200px
          { quality: "auto" }, // Automatic quality optimization
          { fetch_format: "auto" }, // Automatic format selection
        ],
      },
      (error, result) => {
        if (error) {
          logger.error("Cloudinary upload error", { error: error.message });
          reject(error);
        } else if (result) {
          logger.info("Image uploaded to Cloudinary", {
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
      }
    );

    uploadStream.end(fileBuffer);
  });
}

/**
 * Delete an image from Cloudinary
 * @param publicId - The public ID of the image to delete
 * @returns The deletion result
 */
export async function deleteFromCloudinary(
  publicId: string
): Promise<{ result: string }> {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    logger.info("Image deleted from Cloudinary", { publicId });
    return result;
  } catch (error: any) {
    logger.error("Cloudinary deletion error", { error: error.message });
    throw error;
  }
}

/**
 * Extract public ID from Cloudinary URL
 * @param url - The Cloudinary URL
 * @returns The public ID
 */
export function extractPublicId(url: string): string | null {
  try {
    const match = url.match(/\/portfolio\/([^/]+\/[^/.]+)/);
    return match ? `portfolio/${match[1]}` : null;
  } catch (error) {
    logger.error("Error extracting public ID from URL", { url });
    return null;
  }
}

export { cloudinary };
