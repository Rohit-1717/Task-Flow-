import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import dotenv from "dotenv";
dotenv.config({ path: "./.env" });

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Upload file to Cloudinary and delete local temp
export const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;

    const result = await cloudinary.uploader.upload(localFilePath, { resource_type: "auto" });

    // Delete local temp file
    if (fs.existsSync(localFilePath)) fs.unlinkSync(localFilePath);

    return result;
  } catch (error) {
    console.error("Cloudinary Upload Error:", error.message);
    if (fs.existsSync(localFilePath)) fs.unlinkSync(localFilePath);
    return null;
  }
};

// Delete file from Cloudinary by public ID
export const deleteFromCloudinary = async (publicId) => {
  if (!publicId) return;
  try {
    await cloudinary.uploader.destroy(publicId);
    console.log("Old avatar deleted successfully");
  } catch (error) {
    console.error("Error deleting old avatar:", error.message);
  }
};
