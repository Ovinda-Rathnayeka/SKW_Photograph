import express from "express";
import PackageController from "../Controllers/PackageController.js";

const router = express.Router();

router.post("/packages", PackageController.createPackage);
router.get("/packages", PackageController.getAllPackages);
router.get("/packages/:id", PackageController.getPackageById);
router.put("/packages/:id", PackageController.updatePackageById);
router.delete("/packages/:id", PackageController.deletePackageById);

export default router;
