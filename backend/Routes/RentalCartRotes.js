import express from "express";
import RentalCartController from "../Controllers/RentalCartController.js";

const router = express.Router();


router.post("/", RentalCartController.addToRentalCart);


router.get("/user/:userId", RentalCartController.getRentalCartByUserId);


router.put("/update", RentalCartController.updateRentalCartItem);


router.delete(
  "/delete/:rentalCartItemId",
  RentalCartController.removeFromRentalCart
);

export default router;
