import express from "express";
import ResourceController from "../Controllers/ResourceController.js";

const router = express.Router();

router.post("/", ResourceController.createResource);



router.put("/:id/update", ResourceController.updateResource);
// Create resource
router.post("/", ResourceController.createResource);

router.put("/:id/reduce-stock", ResourceController.reduceResourceStock);

router.get("/:id", ResourceController.getResourceById);

router.get("/", ResourceController.getAllResources);

router.delete("/:id", ResourceController.deleteResourceById);

// Update the stock and rentalStock for a specific resource
router.put(
  "/:id/stockAndRental",
  ResourceController.updateResourceStockAndRentalStock
);

router.put("/:id/availability", ResourceController.updateResourceAvailability);

export default router;
