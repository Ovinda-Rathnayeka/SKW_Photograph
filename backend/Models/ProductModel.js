import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: String,
    category: String,
    price: Number,
    quantity: Number, // ✅ added quantity
    description: String,
    image: String,
  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);
