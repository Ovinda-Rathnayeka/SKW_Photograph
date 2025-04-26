import mongoose from "mongoose";
import RentalProduct from "../Models/RentalProduct.js";
import uploadMultiple from "../Middleware/MulterMultipleConfig.js";
import cloudinary from "../Middleware/CloudinaryConfig.js";

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

const createRentalProduct = async (req, res) => {
  try {
    const imageUrls = [];

    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const cloudinaryResult = await cloudinary.uploader.upload(file.path, {
          folder: "skw-photography/rentals",
          allowed_formats: ["jpg", "jpeg", "png"],
        });
        imageUrls.push(cloudinaryResult.secure_url);
      }

      req.body.images = imageUrls;
    }

    const newRentalProduct = new RentalProduct(req.body);
    const savedRentalProduct = await newRentalProduct.save();

    res.status(201).json(savedRentalProduct);
  } catch (error) {
    console.error("Error creating rental product:", error);
    res.status(500).json({ message: "Error creating rental product", error });
  }
};

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
      images: product.images,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    }));

    res.status(200).json(formattedRentalProductList);
  } catch (error) {
    console.error("Error fetching rental products:", error);
    res.status(500).json({ message: "Error fetching rental products", error });
  }
};

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

const updateRentalProductById = async (req, res) => {
  const { id } = req.params;

  if (!isValidObjectId(id)) {
    return res
      .status(400)
      .json({ message: "Invalid rental product ID format" });
  }

  try {
    const imageUrls = [];

    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const cloudinaryResult = await cloudinary.uploader.upload(file.path, {
          folder: "skw-photography/rentals",
          allowed_formats: ["jpg", "jpeg", "png"],
        });
        imageUrls.push(cloudinaryResult.secure_url);
      }
      req.body.images = imageUrls;
    }

    const updatedRentalProduct = await RentalProduct.findByIdAndUpdate(
      id,
      req.body,
      {
        new: true,
      }
    );

    if (!updatedRentalProduct) {
      return res.status(404).json({ message: "Rental product not found" });
    }

    res.status(200).json(updatedRentalProduct);
  } catch (error) {
    console.error("Error updating rental product:", error);
    res.status(500).json({ message: "Error updating rental product", error });
  }
};

const deleteRentalProductById = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res
      .status(400)
      .json({ message: "Invalid rental product ID format" });
  }

  try {
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
