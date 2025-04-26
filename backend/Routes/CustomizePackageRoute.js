import express from "express";
import {
  createCustomizePackage,
  getAllPackages,
  getPackageById,
  updatePackage,
  deletePackage,
} from "../Controllers/CustomizePackageController.js";

const router = express.Router();

router.post("/", createCustomizePackage);

router.get("/", getAllPackages);

router.get("/:id", getPackageById);

router.put("/:id", updatePackage);

router.delete("/:id", deletePackage);

export default router;
