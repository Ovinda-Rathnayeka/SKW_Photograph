import express from "express";
import ResourceController from "../Controllers/ResourceController.js";

const router = express.Router();

router.post("/", ResourceController.createResource);

router.get("/:id", ResourceController.getResourceById);

router.get("/", ResourceController.getAllResources);

router.delete("/:id", ResourceController.deleteResourceById);

router.put(
  "/:id/stockAndRental",
  ResourceController.updateResourceStockAndRentalStock
);

router.put("/:id/availability", ResourceController.updateResourceAvailability);

export default router;
