import express from "express";
import upload from "../Middleware/MulterConfig.js";
import {
  createCartPayment,
  getAllCartPayments,
} from "../Controllers/CartPaymentController.js";

const router = express.Router();

router.post("/", upload.single("proofImage"), createCartPayment);
router.get("/", getAllCartPayments);

export default router;