import express from "express";
import upload from "../Middleware/MulterConfig.js";
import {
  createCartPayment,
  getAllCartPayments,
  acceptCartPayment,
} from "../Controllers/CartPaymentController.js";

const router = express.Router();

router.post("/", upload.single("proofImage"), createCartPayment);
router.get("/", getAllCartPayments);
router.patch("/:id/status", acceptCartPayment); // PATCH to accept order

export default router;
