import mongoose from "mongoose";
// Importing the mongoose module to create a schema for the feedback data model
const Schema = mongoose.Schema;

const feedbackSchema = new mongoose.Schema({
  user: {
    type: String, // Storing user name or email for now
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
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
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
  },
});

const FeedbackModel = mongoose.model("Feedback", feedbackSchema);
// Creating a model for the feedback schema and exporting it
export default FeedbackModel;
// Compare this snippet from backend/Models/FeedbackModel.js:
