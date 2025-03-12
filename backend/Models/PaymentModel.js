import mongoose from "mongoose";


const paymentSchema = new mongoose.Schema({
  bookingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Booking",
    required: true,
  },
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Customer", 
    required: true,
  },
  packageId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "PhotoPackage", 
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  halfPaymentAmount: {
    type: Number,
    required: true,
  },
  toPayAmount: {
    type: Number,
    required: true,
  },
  paymentMethod: {
    type: String,
    required: true,
  },
  proofImageUrl: {
    type: String,
    required: true,
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
});


const Payment = mongoose.model("Payment", paymentSchema);
export default Payment;
