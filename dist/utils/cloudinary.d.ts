import { v2 as cloudinary } from "cloudinary";
export declare function uploadToCloudinary(fileBuffer: Buffer, folder: string, publicId?: string): Promise<{
    url: string;
    publicId: string;
    width: number;
    height: number;
}>;
export declare function deleteFromCloudinary(publicId: string): Promise<{
    result: string;
}>;
export declare function extractPublicId(url: string): string | null;
export { cloudinary };
//# sourceMappingURL=cloudinary.d.ts.map