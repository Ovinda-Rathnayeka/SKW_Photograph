import mongoose from "mongoose";
import Product from "../Models/ProductModel.js";
import multerconfig from "../Middleware/MulterConfig.js";
import cloudinary from "../Middleware/CloudinaryConfig.js";

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// Create Product
const createProduct = async (req, res) => {
  try {
    let imageUrl = "";

    if (req.file) {
      const cloudinaryResult = await cloudinary.uploader.upload(req.file.path, {
        folder: "skw-photography/products",
        allowed_formats: ["jpg", "jpeg", "png"],
      });

      imageUrl = cloudinaryResult.secure_url;
    }

    // Explicitly create product object
    const newProduct = new Product({
      name: req.body.name,
      category: req.body.category,
      price: req.body.price,
      quantity: req.body.quantity,
      description: req.body.description,
      image: imageUrl, // ✅ Save Cloudinary image URL
    });

    const savedProduct = await newProduct.save();

    res.status(201).json(savedProduct);
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ message: "Error creating product", error });
  }
};

// Get All Products
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();

    const formattedProducts = products.map((prod) => ({
      _id: prod._id,
      name: prod.name,
      category: prod.category,
      price: prod.price,
      quantity: prod.quantity,
      description: prod.description,
      image: prod.image,
      createdAt: prod.createdAt,
      updatedAt: prod.updatedAt,
    }));

    res.status(200).json(formattedProducts);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Error fetching products", error });
  }
};

// Get Product By ID
const getProductById = async (req, res) => {
  const { id } = req.params;

  if (!isValidObjectId(id)) {
    return res.status(400).json({ message: "Invalid product ID format" });
  }

  try {
    const productData = await Product.findById(id);
    if (!productData) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json(productData);
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({ message: "Error fetching product", error });
  }
};

// Update Product By ID
const updateProductById = async (req, res) => {
  const { id } = req.params;

  if (!isValidObjectId(id)) {
    return res.status(400).json({ message: "Invalid product ID format" });
  }

  try {
    const updateData = { ...req.body };

    if (req.file) {
      const cloudinaryResult = await cloudinary.uploader.upload(req.file.path, {
        folder: "skw-photography/products",
        allowed_formats: ["jpg", "jpeg", "png"],
      });

      updateData.image = cloudinaryResult.secure_url; // ✅ Set image URL
    }

    const updatedProduct = await Product.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json(updatedProduct);
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ message: "Error updating product", error });
  }
};


// Delete Product By ID
const deleteProductById = async (req, res) => {
  const { id } = req.params;

  if (!isValidObjectId(id)) {
    return res.status(400).json({ message: "Invalid product ID format" });
  }

  try {
    const deletedProduct = await Product.findByIdAndDelete(id);
    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json({ message: "Product deleted successfully!" });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ message: "Error deleting product", error });
  }
};

export default {
  createProduct,
  getAllProducts,
  getProductById,
  updateProductById,
  deleteProductById,
};
