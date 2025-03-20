import express from "express";
import FeedbackController from "../Controllers/FeedbackController.js";
import uploadMultiple from "../Middleware/MulterMultipleConfig.js"; // Import the middleware for multiple file upload

const router = express.Router();

// Route for creating feedback with multiple image uploads
router.post("/", uploadMultiple, FeedbackController.createFeedback);

// Route for updating feedback with multiple image uploads
router.put("/:id", uploadMultiple, FeedbackController.updateFeedbackById);

// Route for fetching all feedbacks
router.get("/", FeedbackController.getAllFeedback);

// Route for getting feedback by ID
router.get("/:id", FeedbackController.getFeedbackById);

// Route for deleting feedback by ID
router.delete("/:id", FeedbackController.deleteFeedbackById);

export default router;
