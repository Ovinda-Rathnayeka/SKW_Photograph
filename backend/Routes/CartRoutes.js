import express from "express";
import CartController from "../Controllers/CartController.js"; // Import Cart Controller

const router = express.Router();

// Route to add a product to the cart
router.post("/", CartController.addToCart);

// Route to get all cart items for a specific customer
router.get("/:customerId", CartController.getCartByCustomerId);

// Route to update the quantity of a cart item
router.put("/update", CartController.updateCartItem);

// Route to remove a product from the cart by its cart item id
router.delete("/:cartItemId", CartController.removeFromCart); // Delete cart item by ID

export default router;
