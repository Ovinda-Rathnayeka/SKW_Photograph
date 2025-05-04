// routes/rentalPaymentRoutes.js
import express from "express";
import RentalPaymentController from "../Controllers/RentalPaymentController.js";

const router = express.Router();

// Create new rental payment
router.post("/", RentalPaymentController.createRentalPayment);

// Get all rental payments
router.get("/", RentalPaymentController.getAllPayments);

// Get rental payments by userId
router.get("/user/:userId", RentalPaymentController.getPaymentByUserId);

// Get a specific rental payment by payment ID
router.get("/:id", RentalPaymentController.getPaymentById);

// Update rental payment status (e.g., to Completed or Failed)
router.put("/:id", RentalPaymentController.updateRentalPaymentStatus);

// Delete a rental payment
router.delete("/:id", RentalPaymentController.deleteRentalPayment);

export default router;
