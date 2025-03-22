import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: String,
    category: String,
    price: Number,
    quantity: Number,
    description: String,
    image: String,
  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);
