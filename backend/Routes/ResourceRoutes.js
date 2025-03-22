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

// Update resource stock
// Update the stock and rentalStock for a specific resource
router.put(
  "/:id/stockAndRental",
  ResourceController.updateResourceStockAndRentalStock
);

// Update resource availability
router.put("/:id/availability", ResourceController.updateResourceAvailability);

export default router;
