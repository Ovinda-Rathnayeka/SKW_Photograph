import mongoose from "mongoose";
import RentalProduct from "../Models/RentalProduct.js"; // Import your RentalProduct model
import uploadMultiple from "../Middleware/MulterMultipleConfig.js"; // Importing the multiple upload config
import cloudinary from "../Middleware/CloudinaryConfig.js"; // Cloudinary configuration

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// Create rental product
const createRentalProduct = async (req, res) => {
  try {
    const imageUrls = []; // Initialize an array to hold image URLs

    // Check if files are provided (multiple images)
    if (req.files && req.files.length > 0) {
      // Loop through each file and upload it to Cloudinary
      for (const file of req.files) {
        const cloudinaryResult = await cloudinary.uploader.upload(file.path, {
          folder: "skw-photography/rentals", // Cloudinary folder
          allowed_formats: ["jpg", "jpeg", "png"], // Allowed formats
        });
        imageUrls.push(cloudinaryResult.secure_url); // Store the URL of each uploaded image
      }

      // Attach the uploaded image URLs to the request body
      req.body.images = imageUrls;
    }

    // Create a new rental product instance with provided data
    const newRentalProduct = new RentalProduct(req.body);
    const savedRentalProduct = await newRentalProduct.save();

    res.status(201).json(savedRentalProduct); // Respond with the saved rental product
  } catch (error) {
    console.error("Error creating rental product:", error);
    res.status(500).json({ message: "Error creating rental product", error });
  }
};

// Get all rental products
export const getAllRentalProducts = async (req, res) => {
  try {
    const rentalProducts = await RentalProduct.find();

    const formattedRentalProductList = rentalProducts.map((product) => ({
      _id: product._id,
      name: product.name,
      category: product.category,
      description: product.description,
      rentalStock: product.rentalStock,
      price: product.price,
      condition: product.condition,
      availabilityStatus: product.availabilityStatus,
      images: product.images, // Multiple images
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    }));

    res.status(200).json(formattedRentalProductList);
  } catch (error) {
    console.error("Error fetching rental products:", error);
    res.status(500).json({ message: "Error fetching rental products", error });
  }
};

// Get rental product by ID
const getRentalProductById = async (req, res) => {
  const { id } = req.params;

  if (!isValidObjectId(id)) {
    return res
      .status(400)
      .json({ message: "Invalid rental product ID format" });
  }

  try {
    const rentalProduct = await RentalProduct.findById(id);
    if (!rentalProduct) {
      return res.status(404).json({ message: "Rental product not found" });
    }
    res.status(200).json(rentalProduct);
  } catch (error) {
    console.error("Error fetching rental product:", error);
    res.status(500).json({ message: "Error fetching rental product", error });
  }
};

// Update rental product by ID
const updateRentalProductById = async (req, res) => {
  const { id } = req.params;

  // Validate rental product ID format
  if (!isValidObjectId(id)) {
    return res
      .status(400)
      .json({ message: "Invalid rental product ID format" });
  }

  try {
    const imageUrls = []; // Initialize an array to hold image URLs

    // Check if files (images) are provided for update
    if (req.files && req.files.length > 0) {
      // Loop through each file and upload it to Cloudinary
      for (const file of req.files) {
        const cloudinaryResult = await cloudinary.uploader.upload(file.path, {
          folder: "skw-photography/rentals", // Cloudinary folder
          allowed_formats: ["jpg", "jpeg", "png"], // Allowed formats
        });
        imageUrls.push(cloudinaryResult.secure_url); // Push image URL to array
      }
      req.body.images = imageUrls; // Add new images to the request body
    }

    // Find and update the rental product by its ID
    const updatedRentalProduct = await RentalProduct.findByIdAndUpdate(
      id,
      req.body,
      {
        new: true, // Return the updated document
      }
    );

    if (!updatedRentalProduct) {
      return res.status(404).json({ message: "Rental product not found" });
    }

    // Respond with the updated rental product
    res.status(200).json(updatedRentalProduct);
  } catch (error) {
    console.error("Error updating rental product:", error);
    res.status(500).json({ message: "Error updating rental product", error });
  }
};

// Delete rental product by ID
const deleteRentalProductById = async (req, res) => {
  const { id } = req.params;

  // Validate the ID format
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res
      .status(400)
      .json({ message: "Invalid rental product ID format" });
  }

  try {
    // Find and delete the rental product by ID
    const deletedRentalProduct = await RentalProduct.findByIdAndDelete(id);
    if (!deletedRentalProduct) {
      return res.status(404).json({ message: "Rental product not found" });
    }
    res.status(200).json({ message: "Rental product deleted successfully!" });
  } catch (error) {
    console.error("Error deleting rental product:", error);
    res.status(500).json({ message: "Error deleting rental product", error });
  }
};

export default {
  createRentalProduct,
  getAllRentalProducts,
  getRentalProductById,
  updateRentalProductById,
  deleteRentalProductById,
};
