import express from "express";
import FeedbackController from "../Controllers/FeedbackController.js";
import uploadMultiple from "../Middleware/MulterMultipleConfig.js";

const router = express.Router();

router.post("/", uploadMultiple, FeedbackController.createFeedback);

router.put("/:id", uploadMultiple, FeedbackController.updateFeedbackById);

router.get("/", FeedbackController.getAllFeedback);

router.get("/:id", FeedbackController.getFeedbackById);

router.delete("/:id", FeedbackController.deleteFeedbackById);

export default router;
