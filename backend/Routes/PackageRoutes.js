import express from "express";
import PackageController from "../Controllers/PackageController.js";

const router = express.Router();

router.post("/", PackageController.createPackage);
router.get("/", PackageController.getAllPackages);
router.get("/:id", PackageController.getPackageById);
router.put("/:id", PackageController.updatePackageById);
router.delete("/:id", PackageController.deletePackageById);

export default router;
