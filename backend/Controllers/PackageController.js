import mongoose from "mongoose";
import PhotoPackage from "../Models/PackageModel.js";
import multerconfig from "../Middleware/MulterConfig.js";
import cloudinary from "../Middleware/CloudinaryConfig.js";

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

const createPackage = async (req, res) => {
  try {
    if (req.file) {
    
      const cloudinaryResult = await cloudinary.uploader.upload(req.file.path, {
        folder: "skw-photography",
        allowed_formats: ["jpg", "jpeg", "png"],
      });

      
      req.body.image = cloudinaryResult.secure_url;
    }

    const newPackage = new PhotoPackage(req.body);
    const savedPackage = await newPackage.save();

    res.status(201).json(savedPackage); 
  } catch (error) {
    console.error("Error creating package:", error);
    res.status(500).json({ message: "Error creating package", error });
  }
};

export const getAllPackages = async (req, res) => {
  try {
    const packages = await PhotoPackage.find();

    const formattedPackages = packages.map((pkg) => ({
      _id: pkg._id,
      packageName: pkg.packageName,
      category: pkg.category,
      price: pkg.price,
      duration: pkg.duration,
      numberOfPhotos: pkg.numberOfPhotos,
      photoEditing: pkg.photoEditing,
      deliveryTime: pkg.deliveryTime,
      additionalServices: pkg.additionalServices,
      image: pkg.image,
      description: pkg.description,
      availability: pkg.availability,
      createdAt: pkg.createdAt,
      updatedAt: pkg.updatedAt,
    }));

    res.status(200).json(formattedPackages);
  } catch (error) {
    console.error("Error fetching packages:", error);
    res.status(500).json({ message: "Error fetching packages", error });
  }
};

const getPackageById = async (req, res) => {
  const { id } = req.params;

  if (!isValidObjectId(id)) {
    return res.status(400).json({ message: "Invalid package ID format" });
  }

  try {
    const packageData = await PhotoPackage.findById(id);
    if (!packageData) {
      return res.status(404).json({ message: "Package not found" });
    }
    res.status(200).json(packageData);
  } catch (error) {
    console.error("Error fetching package:", error);
    res.status(500).json({ message: "Error fetching package", error });
  }
};

const updatePackageById = async (req, res) => {
  const { id } = req.params;

  if (!isValidObjectId(id)) {
    return res.status(400).json({ message: "Invalid package ID format" });
  }

  try {
    
    if (req.file) {
      
      const cloudinaryResult = await cloudinary.v2.uploader.upload(
        req.file.path,
        {
          folder: "skw-photography",
          allowed_formats: ["jpg", "jpeg", "png"],
        }
      );

      
      req.body.image = cloudinaryResult.secure_url;
    }

    
    const updatedPackage = await PhotoPackage.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (!updatedPackage) {
      return res.status(404).json({ message: "Package not found" });
    }

    res.status(200).json(updatedPackage); 
  } catch (error) {
    console.error("Error updating package:", error);
    res.status(500).json({ message: "Error updating package", error });
  }
};

const deletePackageById = async (req, res) => {
  const { id } = req.params;

  if (!isValidObjectId(id)) {
    return res.status(400).json({ message: "Invalid package ID format" });
  }

  try {
    const deletedPackage = await PhotoPackage.findByIdAndDelete(id);
    if (!deletedPackage) {
      return res.status(404).json({ message: "Package not found" });
    }
    res.status(200).json({ message: "Package deleted successfully!" });
  } catch (error) {
    console.error(" Error deleting package:", error);
    res.status(500).json({ message: "Error deleting package", error });
  }
};

export default {
  createPackage,
  getAllPackages,
  getPackageById,
  updatePackageById,
  deletePackageById,
};
