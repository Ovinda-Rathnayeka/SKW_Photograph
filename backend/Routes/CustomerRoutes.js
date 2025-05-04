import express from "express";
import {
  createCustomer,
  getAllCustomers,
  getCustomerById,
  updateCustomer,
  deleteCustomer,
} from "../Controllers/CustomerController.js";

const router = express.Router();

router.post("/", createCustomer);

router.get("/", getAllCustomers);

router.get("/:id", getCustomerById);

router.put("/update/:id", updateCustomer);

router.delete("/delete/:id", deleteCustomer);

export default router;
