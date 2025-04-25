import mongoose from "mongoose";
import Product from "../Models/ProductModel.js";
import multerconfig from "../Middleware/MulterConfig.js";
import cloudinary from "../Middleware/CloudinaryConfig.js";

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);


const createProduct = async (req, res) => {
  try {
    if (req.file) {
      const cloudinaryResult = await cloudinary.uploader.upload(req.file.path, {
        folder: "skw-photography/products",
        allowed_formats: ["jpg", "jpeg", "png"],
      });

      req.body.image = cloudinaryResult.secure_url;
    }

    const newProduct = new Product(req.body);
    const savedProduct = await newProduct.save();

    res.status(201).json(savedProduct);
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ message: "Error creating product", error });
  }
};


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


const updateProductById = async (req, res) => {
  const { id } = req.params;

  if (!isValidObjectId(id)) {
    return res.status(400).json({ message: "Invalid product ID format" });
  }

  try {
    if (req.file) {
      const cloudinaryResult = await cloudinary.uploader.upload(req.file.path, {
        folder: "skw-photography/products",
        allowed_formats: ["jpg", "jpeg", "png"],
      });

      req.body.image = cloudinaryResult.secure_url;
    }

    const updatedProduct = await Product.findByIdAndUpdate(id, req.body, {
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
