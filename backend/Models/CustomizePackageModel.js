import mongoose from "mongoose";

// Define the schema for customize package
const customizePackageSchema = new mongoose.Schema({
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Customer", // Reference to the Customer model
    required: true, // Ensuring that every package is linked to a customer
  },
  serviceType: {
    type: String,
    required: true,
  },
  eventType: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  startTime: {
    type: String,
    required: true,
  },
  durationHours: {
    type: Number,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  packageType: {
    type: String,
    required: true,
  },
  count: {
    type: Number,
    required: true,
  },
  transportRequired: {
    type: Boolean,
    required: true,
  },
  additionalRequests: {
    type: String,
    default: "",
  },
  totalPrice: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    default: "Pending",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const CustomizePackage = mongoose.model(
  "CustomizePackage",
  customizePackageSchema
);

export default CustomizePackage;
