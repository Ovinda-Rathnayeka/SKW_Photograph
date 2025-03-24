import express from "express";
import RentalCartController from "../Controllers/RentalCartController.js";

const router = express.Router();

// Add to rental cart
router.post("/", RentalCartController.addToRentalCart);

// Get rental cart by userId
router.get("/:userId", RentalCartController.getRentalCartByUserId);

// Update rental cart item
router.put("/update", RentalCartController.updateRentalCartItem);

// Remove rental item
router.delete("/:rentalCartItemId", RentalCartController.removeFromRentalCart);

export default router;
