import express from "express";
import upload from "../Middleware/MulterConfig.js";
import PackageController from "../Controllers/PackageController.js";

const router = express.Router();

router.post("/", upload.single("image"), PackageController.createPackage);

router.get("/", PackageController.getAllPackages);

router.get("/:id", PackageController.getPackageById);

router.put("/:id", upload.single("image"), PackageController.updatePackageById);

router.delete("/:id", PackageController.deletePackageById);

export default router;
