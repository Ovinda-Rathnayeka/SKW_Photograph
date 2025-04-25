import mongoose from "mongoose";

const rentalProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  rentalStock: {
    type: Number,
    required: true,
    min: 0,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  condition: {
    type: String,
    required: true,
  },
  availabilityStatus: {
    type: String,
    required: true,
    enum: ["Available", "Not Available", "Reserved"],
  },
  images: [
    {
      type: String,
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const RentalProduct = mongoose.model("RentalProduct", rentalProductSchema);

export default RentalProduct;
