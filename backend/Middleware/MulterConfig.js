import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "./CloudinaryConfig.js";

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    return {
      folder: "skw-photography",
      allowed_formats: ["jpg", "jpeg", "png"],
    };
  },
});

const upload = multer({ storage });

export default upload;
