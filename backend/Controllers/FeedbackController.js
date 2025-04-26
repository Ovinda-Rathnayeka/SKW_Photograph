import mongoose from "mongoose";
import Feedback from "../Models/FeedbackModel.js";
import uploadMultiple from "../Middleware/MulterMultipleConfig.js";
import cloudinary from "../Middleware/CloudinaryConfig.js";

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

const createFeedback = async (req, res) => {
  try {
    const imageUrls = [];

    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const cloudinaryResult = await cloudinary.uploader.upload(file.path, {
          folder: "skw-photography",
          allowed_formats: ["jpg", "jpeg", "png"],
        });
        imageUrls.push(cloudinaryResult.secure_url);
      }
<<<<<<< HEAD
    }

    const {
      customerId,
      category,
      rating,
      title,
      comment,
      serviceQuality,
      responseTime,
      valueForMoney,
      overallExperience,
    } = req.body;

    if (!customerId) {
      return res.status(400).json({ message: "Customer ID is required" });
    }

    const newFeedback = new Feedback({
      customerId,
      category,
      rating,
      title,
      comment,
      serviceQuality: Number(serviceQuality),
      responseTime: Number(responseTime),
      valueForMoney: Number(valueForMoney),
      overallExperience: Number(overallExperience),
      images: imageUrls,
      isApproved: false,
    });

    const savedFeedback = await newFeedback.save();
=======

      req.body.images = imageUrls;
    }

    if (!req.body.customerId) {
      return res.status(400).json({ message: "Customer ID is required" });
    }

    const newFeedback = new Feedback(req.body);
    const savedFeedback = await newFeedback.save();

>>>>>>> main
    res.status(201).json(savedFeedback);
  } catch (error) {
    console.error("Error creating feedback:", error);
    res.status(500).json({ message: "Error creating feedback", error });
  }
};

<<<<<<< HEAD
// Get all feedbacks
const getAllFeedback = async (req, res) => {
  try {
    const feedbackList = await Feedback.find();
    res.status(200).json(feedbackList);
=======
export const getAllFeedback = async (req, res) => {
  try {
    const feedbackList = await Feedback.find();

    const formattedFeedbackList = feedbackList.map((feedback) => ({
      _id: feedback._id,
      customerId: feedback.customerId,
      category: feedback.category,
      rating: feedback.rating,
      title: feedback.title,
      comment: feedback.comment,
      images: feedback.images,
      createdAt: feedback.createdAt,
      updatedAt: feedback.updatedAt,
    }));

    res.status(200).json(formattedFeedbackList);
>>>>>>> main
  } catch (error) {
    console.error("Error fetching feedback:", error);
    res.status(500).json({ message: "Error fetching feedback", error });
  }
};

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

// Update feedback
const updateFeedbackById = async (req, res) => {
  const { id } = req.params;

  if (!isValidObjectId(id)) {
    return res.status(400).json({ message: "Invalid feedback ID format" });
  }

  try {
<<<<<<< HEAD
    const existing = await Feedback.findById(id);
    if (!existing) {
      return res.status(404).json({ message: "Feedback not found" });
    }

    const imageUrls = existing.images;
    if (req.files && req.files.length > 0) {
      imageUrls.length = 0; // clear old
      for (const file of req.files) {
        const cloudinaryResult = await cloudinary.uploader.upload(file.path, {
          folder: "skw-photography",
          allowed_formats: ["jpg", "jpeg", "png"],
        });
        imageUrls.push(cloudinaryResult.secure_url);
      }
    }

    const {
      category,
      rating,
      title,
      comment,
      serviceQuality,
      responseTime,
      valueForMoney,
      overallExperience,
    } = req.body;

    const updatedFeedback = await Feedback.findByIdAndUpdate(
      id,
      {
        category,
        rating,
        title,
        comment,
        serviceQuality: Number(serviceQuality),
        responseTime: Number(responseTime),
        valueForMoney: Number(valueForMoney),
        overallExperience: Number(overallExperience),
        images: imageUrls,
        isApproved: false,
        updatedAt: new Date(),
      },
      { new: true }
    );

=======
    const imageUrls = [];

    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const cloudinaryResult = await cloudinary.uploader.upload(file.path, {
          folder: "skw-photography",
          allowed_formats: ["jpg", "jpeg", "png"],
        });
        imageUrls.push(cloudinaryResult.secure_url);
      }
      req.body.images = imageUrls;
    }

    const updatedFeedback = await Feedback.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (!updatedFeedback) {
      return res.status(404).json({ message: "Feedback not found" });
    }

>>>>>>> main
    res.status(200).json(updatedFeedback);
  } catch (error) {
    console.error("Error updating feedback:", error);
    res.status(500).json({ message: "Error updating feedback", error });
  }
};

<<<<<<< HEAD
// Delete feedback
const deleteFeedbackById = async (req, res) => {
  const { id } = req.params;

  if (!isValidObjectId(id)) {
=======
const deleteFeedbackById = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
>>>>>>> main
    return res.status(400).json({ message: "Invalid feedback ID format" });
  }

  try {
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

// Approve feedback
const approveFeedbackById = async (req, res) => {
  const { id } = req.params;

  if (!isValidObjectId(id)) {
    return res.status(400).json({ message: "Invalid feedback ID format" });
  }

  try {
    const approvedFeedback = await Feedback.findByIdAndUpdate(
      id,
      { isApproved: true },
      { new: true }
    );

    if (!approvedFeedback) {
      return res.status(404).json({ message: "Feedback not found" });
    }

    res.status(200).json(approvedFeedback);
  } catch (error) {
    console.error("Error approving feedback:", error);
    res.status(500).json({ message: "Error approving feedback", error });
  }
};

export default {
  createFeedback,
  getAllFeedback,
  getFeedbackById,
  updateFeedbackById,
  deleteFeedbackById,
  approveFeedbackById,
};
