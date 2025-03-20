import mongoose from "mongoose";

// Cart Schema - Each cart is associated with a customer and product
const cartSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product", // Reference to Product model
      required: true,
    },
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer", // Reference to Customer model
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1, // Quantity must be at least 1
    },
    price: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

const Cart = mongoose.model("Cart", cartSchema);
export default Cart;
