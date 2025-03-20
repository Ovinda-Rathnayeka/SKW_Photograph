import express from "express";
import upload from "../Middleware/MulterConfig.js";
import ProductController from "../Controllers/ProductController.js";

const router = express.Router();

router.post("/", upload.single("image"), ProductController.createProduct);

router.get("/", ProductController.getAllProducts);

router.get("/:id", ProductController.getProductById);

router.put("/:id", upload.single("image"), ProductController.updateProductById);

router.delete("/:id", ProductController.deleteProductById);

export default router;
