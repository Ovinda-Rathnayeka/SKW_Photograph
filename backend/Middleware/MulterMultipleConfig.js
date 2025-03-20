import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "./CloudinaryConfig.js";

// Create Cloudinary storage configuration for multiple file uploads
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    return {
      folder: "skw-photography", // Cloudinary folder
      allowed_formats: ["jpg", "jpeg", "png"], // Allowed formats
    };
  },
});

// Middleware to handle multiple image uploads (up to 5 images at once)
const uploadMultiple = multer({ storage }).array("images", 5); // 'images' field with max 5 files

export default uploadMultiple;
