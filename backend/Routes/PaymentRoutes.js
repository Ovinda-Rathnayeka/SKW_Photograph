import express from "express";
import upload from "../Middleware/MulterConfig.js";
import PaymentController from "../Controllers/PaymentController.js";

const router = express.Router();

router.post("/", upload.single("proofImage"), PaymentController.createPayment);

router.get("/", PaymentController.getAllPayments);

router.get("/:id", PaymentController.getPaymentById);

router.put("/:id", PaymentController.updatePaymentStatus);

export default router;
