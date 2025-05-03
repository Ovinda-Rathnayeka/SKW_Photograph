import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
  bookingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Booking",
    default: null,
  },
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Customer",
  },
  packageId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "PhotoPackage",
    default: null,
  },
  cartItems: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
      quantity: Number,
      price: Number,
    },
  ],
  amount: Number,
  halfPaymentAmount: {
    type: Number,
    default: 0, // Default to 0 if it's a full payment
  },
  toPayAmount: Number,
  paymentMethod: {
    type: String,
  },
  proofImageUrl: {
    type: String,
  },
  transactionId: {
    type: String,
  },
  paymentStatus: {
    type: String,
    enum: ["Pending", "Completed", "Failed"],
    default: "Pending",
  },
  paymentType: {
    type: String,
    enum: ["full", "half"],
  },
  totalAmount: {
    type: Number,
  },
  address: {
    type: String,
  },
  isCartPayment: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

const Payment = mongoose.model("Payment", paymentSchema);
export default Payment;
