import express from "express";
import FeedbackController from "../Controllers/FeedbackController.js";
const router = express.Router();

router.get("/", FeedbackController.getAllFeedbacks);
router.post("/", FeedbackController.AddFeedback);
router.get("/:feedbackId", FeedbackController.getFeedbackById);
router.put("/:feedbackId", FeedbackController.updateFeedback);
router.delete("/:feedbackId", FeedbackController.deleteFeedback);

export default router;