import express from "express";
import RentalController from "../Controllers/RentalController.js"; // Import the RentalController
import uploadMultiple from "../Middleware/MulterMultipleConfig.js"; // Middleware for multiple file uploads

const router = express.Router();

// Route to create a rental product
router.post("/", uploadMultiple, RentalController.createRentalProduct);

// Route to update a rental product by ID
router.put("/:id", uploadMultiple, RentalController.updateRentalProductById);

// Route to get all rental products
router.get("/", RentalController.getAllRentalProducts);

// Route to get a rental product by ID
router.get("/:id", RentalController.getRentalProductById);

// Route to delete a rental product by ID
router.delete("/:id", RentalController.deleteRentalProductById);

export default router;
