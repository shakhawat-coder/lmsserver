import { UploadApiResponse } from "cloudinary";
import cloudinary from "../lib/cloudinary";

export const uploadToCloudinary = (
  fileBuffer: Buffer,
  folder: string = "uploads",
): Promise<UploadApiResponse> => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "auto",
      },
      (error, result) => {
        if (error) return reject(error);
        if (!result)
          return reject(
            new Error("Cloudinary upload failed: No result returned"),
          );
        resolve(result);
      },
    );

    uploadStream.end(fileBuffer);
  });
};
