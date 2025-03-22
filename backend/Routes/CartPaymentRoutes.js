import express from "express";
import upload from "../Middleware/MulterConfig.js";
import {
  createCartPayment,
  getAllCartPayments,
  updateCartPaymentStatus,
} from "../Controllers/CartPaymentController.js";

const router = express.Router();

router.post("/", upload.single("proofImage"), createCartPayment);
router.get("/", getAllCartPayments);
router.patch("/:id/status", updateCartPaymentStatus); // Handles Accept/Deny

export default router;