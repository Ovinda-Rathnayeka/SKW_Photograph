import express from "express";
import RentalController from "../Controllers/RentalController.js"; 
import uploadMultiple from "../Middleware/MulterMultipleConfig.js"; 

const router = express.Router();


router.post("/", uploadMultiple, RentalController.createRentalProduct);


router.put("/:id", uploadMultiple, RentalController.updateRentalProductById);


router.get("/", RentalController.getAllRentalProducts);


router.get("/:id", RentalController.getRentalProductById);


router.delete("/:id", RentalController.deleteRentalProductById);

export default router;
