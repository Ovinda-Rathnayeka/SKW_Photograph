import express from "express";
<<<<<<< Updated upstream
import upload from "../Middleware/MulterConfig.js";
=======
>>>>>>> Stashed changes
import PackageController from "../Controllers/PackageController.js";

const router = express.Router();

<<<<<<< Updated upstream
router.post("/", upload.single("image"), PackageController.createPackage);

router.get("/", PackageController.getAllPackages);

router.get("/:id", PackageController.getPackageById);

router.put("/:id", upload.single("image"), PackageController.updatePackageById);

=======
router.post("/", PackageController.createPackage);
router.get("/", PackageController.getAllPackages);
router.get("/:id", PackageController.getPackageById);
router.put("/:id", PackageController.updatePackageById);
>>>>>>> Stashed changes
router.delete("/:id", PackageController.deletePackageById);

export default router;
