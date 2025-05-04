import express from "express";
import RentalPaymentController from "../Controllers/RentalPaymentController.js";

const router = express.Router();

router.post("/", RentalPaymentController.createRentalPayment);

router.get("/", RentalPaymentController.getAllPayments);

router.get("/user/:userId", RentalPaymentController.getPaymentByUserId);

router.get("/:id", RentalPaymentController.getPaymentById);

router.put("/:id", RentalPaymentController.updateRentalPaymentStatus);

router.delete("/:id", RentalPaymentController.deleteRentalPayment);

export default router;
