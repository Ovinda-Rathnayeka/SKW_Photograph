import express from "express";
import ResourceController from "../Controllers/ResourceController.js";

const router = express.Router();

// Create resource
router.post("/", ResourceController.createResource);

// Get resource by ID
router.get("/:id", ResourceController.getResourceById);

// Get all resources
router.get("/", ResourceController.getAllResources);

// Delete resource by ID
router.delete("/:id", ResourceController.deleteResourceById);

// Full update of resource fields
router.put("/:id/update", ResourceController.updateResource);

// Reduce stock quantity
router.put("/:id/reduce-stock", ResourceController.reduceResourceStock);

// Update the stock and rentalStock for a specific resource
router.put("/:id/stockAndRental", ResourceController.updateResourceStockAndRentalStock);

// Update availability status
router.put("/:id/availability", ResourceController.updateResourceAvailability);

export default router;
