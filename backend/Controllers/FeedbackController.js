import mongoose from "mongoose";
import Feedback from "../Models/FeedbackModel.js";
import uploadMultiple from "../Middleware/MulterMultipleConfig.js"; // Importing the multiple upload config
import cloudinary from "../Middleware/CloudinaryConfig.js"; // Cloudinary configuration

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// Create feedback
const createFeedback = async (req, res) => {
  try {
    const imageUrls = []; // Initialize an array to hold image URLs

    // Check if files are provided (multiple images)
    if (req.files && req.files.length > 0) {
      // Loop through each file and upload it to Cloudinary
      for (const file of req.files) {
        const cloudinaryResult = await cloudinary.uploader.upload(file.path, {
          folder: "skw-photography", // Cloudinary folder
          allowed_formats: ["jpg", "jpeg", "png"], // Allowed formats
        });
        imageUrls.push(cloudinaryResult.secure_url); // Store the URL of each uploaded image
      }

      // Attach the uploaded image URLs to the request body
      req.body.images = imageUrls;
    }

    // Ensure customerId is present
    if (!req.body.customerId) {
      return res.status(400).json({ message: "Customer ID is required" });
    }

    // Create a new feedback instance with customerId
    const newFeedback = new Feedback(req.body);
    const savedFeedback = await newFeedback.save();

    res.status(201).json(savedFeedback); // Respond with the saved feedback
  } catch (error) {
    console.error("Error creating feedback:", error);
    res.status(500).json({ message: "Error creating feedback", error });
  }
};

// Get all feedback
export const getAllFeedback = async (req, res) => {
  try {
    const feedbackList = await Feedback.find();

    const formattedFeedbackList = feedbackList.map((feedback) => ({
      _id: feedback._id,
      customerId: feedback.customerId, // Ensure customerId is included in the response
      category: feedback.category,
      rating: feedback.rating,
      title: feedback.title,
      comment: feedback.comment,
      images: feedback.images, // Multiple images
      createdAt: feedback.createdAt,
      updatedAt: feedback.updatedAt,
    }));

    res.status(200).json(formattedFeedbackList);
  } catch (error) {
    console.error("Error fetching feedback:", error);
    res.status(500).json({ message: "Error fetching feedback", error });
  }
};

// Get feedback by ID
const getFeedbackById = async (req, res) => {
  const { id } = req.params;

  if (!isValidObjectId(id)) {
    return res.status(400).json({ message: "Invalid feedback ID format" });
  }

  try {
    const feedback = await Feedback.findById(id);
    if (!feedback) {
      return res.status(404).json({ message: "Feedback not found" });
    }
    res.status(200).json(feedback);
  } catch (error) {
    console.error("Error fetching feedback:", error);
    res.status(500).json({ message: "Error fetching feedback", error });
  }
};

const updateFeedbackById = async (req, res) => {
  const { id } = req.params;

  // Validate feedback ID format
  if (!isValidObjectId(id)) {
    return res.status(400).json({ message: "Invalid feedback ID format" });
  }

  try {
    const imageUrls = []; // Initialize an array to hold image URLs

    // Check if files (images) are provided for update
    if (req.files && req.files.length > 0) {
      // Loop through each file and upload it to Cloudinary
      for (const file of req.files) {
        const cloudinaryResult = await cloudinary.uploader.upload(file.path, {
          folder: "skw-photography", // Cloudinary folder
          allowed_formats: ["jpg", "jpeg", "png"], // Allowed formats
        });
        imageUrls.push(cloudinaryResult.secure_url); // Push image URL to array
      }
      req.body.images = imageUrls; // Add new images to the request body
    }

    // Find and update the feedback by its ID
    const updatedFeedback = await Feedback.findByIdAndUpdate(id, req.body, {
      new: true, // Return the updated document
    });

    if (!updatedFeedback) {
      return res.status(404).json({ message: "Feedback not found" });
    }

    // Respond with the updated feedback
    res.status(200).json(updatedFeedback);
  } catch (error) {
    console.error("Error updating feedback:", error);
    res.status(500).json({ message: "Error updating feedback", error });
  }
};

// Delete feedback by ID
const deleteFeedbackById = async (req, res) => {
  const { id } = req.params;

  // Validate the ID format
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid feedback ID format" });
  }

  try {
    // Find and delete the feedback by ID
    const deletedFeedback = await Feedback.findByIdAndDelete(id);
    if (!deletedFeedback) {
      return res.status(404).json({ message: "Feedback not found" });
    }
    res.status(200).json({ message: "Feedback deleted successfully!" });
  } catch (error) {
    console.error("Error deleting feedback:", error);
    res.status(500).json({ message: "Error deleting feedback", error });
  }
};

export default {
  createFeedback,
  getAllFeedback,
  getFeedbackById,
  updateFeedbackById,
  deleteFeedbackById,
};
