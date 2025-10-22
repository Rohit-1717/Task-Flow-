import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import dotenv from "dotenv";
dotenv.config({
  path: "./.env",
});

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) {
      console.log("No local file path provided!");
      return null;
    }


    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });

    

    fs.unlinkSync(localFilePath); // delete temp file
    return response;
  } catch (error) {
    console.error("❌ Cloudinary Upload Error:", error.message);
    if (fs.existsSync(localFilePath)) fs.unlinkSync(localFilePath);
    return null;
  }
};

// Delete File from Cloudinary
const deleteFromCloudinary = async (publicId) => {
  try {
    await cloudinary.uploader.destroy(publicId);
    console.log("✅ Old avatar deleted successfully!");
  } catch (error) {
    console.error("❌ Error deleting old avatar:", error);
  }
};

export { uploadOnCloudinary, deleteFromCloudinary };
