import express from "express";
import FeedbackController from "../Controllers/FeedbackController.js";
import uploadMultiple from "../Middleware/MulterMultipleConfig.js";

const router = express.Router();

router.post("/", uploadMultiple, FeedbackController.createFeedback);
router.put("/:id", FeedbackController.updateFeedbackById);
router.get("/", FeedbackController.getAllFeedback);
router.get("/:id", FeedbackController.getFeedbackById);
router.delete("/:id", FeedbackController.deleteFeedbackById);

// Approve feedback by ID
router.patch("/:id/approve", FeedbackController.approveFeedbackById);

export default router;
