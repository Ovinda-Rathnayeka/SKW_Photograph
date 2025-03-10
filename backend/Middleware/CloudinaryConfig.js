import cloudinary from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

// Initialize cloudinary
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default cloudinary.v2; // Ensure that you're exporting cloudinary.v2
