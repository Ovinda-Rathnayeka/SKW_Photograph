import mongoose from "mongoose";

const Schema = mongoose.Schema;

const feedbackSchema = new mongoose.Schema({
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Customer",
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  comment: {
    type: String,
    required: true,
  },
  serviceQuality: {
    type: Number,
    min: 0,
    max: 5,
    required: true,
  },
  responseTime: {
    type: Number,
    min: 0,
    max: 5,
    required: true,
  },
  valueForMoney: {
    type: Number,
    min: 0,
    max: 5,
    required: true,
  },
  overallExperience: {
    type: Number,
    min: 0,
    max: 5,
    required: true,
  },
  images: [
    {
      type: String,
    },
  ],
  isApproved: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
  },
});

const FeedbackModel = mongoose.model("Feedback", feedbackSchema);
export default FeedbackModel;
