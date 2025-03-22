import mongoose from "mongoose";

const cartPaymentSchema = new mongoose.Schema({
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Customer",
    required: true,
  },
  cartItems: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      quantity: Number,
      price: Number,
    },
  ],
  totalAmount: {
    type: Number,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  paymentMethod: {
    type: String,
    default: "Bank Transfer",
  },
  proofImageUrl: {
    type: String,
    
  },
  transactionId: {
    type: String,
    required: true,
  },
  paymentStatus: {
    type: String,
    enum: ["Pending", "Completed", "Failed"],
    default: "Pending",
  },
}, { timestamps: true });

const CartPayment = mongoose.model("CartPayment", cartPaymentSchema);
export default CartPayment;