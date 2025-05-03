import mongoose from "mongoose";

// Rental Cart Schema
const rentalCartSchema = new mongoose.Schema(
  {
    rentalId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "RentalItem", // Reference to RentalItem model
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer", // Reference to Customer model
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    price: {
      type: Number,
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    
    },
    rentalDays: {
      type: Number,
      required: true,
      min: 1,
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Confirmed", "Returned"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

const RentalCart = mongoose.model("RentalCart", rentalCartSchema);
export default RentalCart;
