import express from "express";
import CartController from "../Controllers/CartController.js";

const router = express.Router();

router.post("/", CartController.addToCart);

router.get("/:customerId", CartController.getCartByCustomerId);

router.put("/update", CartController.updateCartItem);

router.delete("/:cartItemId", CartController.removeFromCart);

export default router;
