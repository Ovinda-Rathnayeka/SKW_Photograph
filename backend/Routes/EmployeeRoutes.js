import express from "express";
import * as ctrl from "../controllers/EmployeeController.js";

const router = express.Router();

// Public routes
router.post("/login", ctrl.loginEmployee);

// Routes accessible by anyone (no authentication required)
router.get("/", ctrl.getAllEmployees); // List all employees
router.get("/:id", ctrl.getEmployeeById); // Get employee by ID
router.post("/", ctrl.createEmployee); // Create a new employee
router.put("/:id", ctrl.updateEmployee); // Update employee info
router.delete("/:id", ctrl.deleteEmployee); // Delete employee
router.post("/:id/reset-password", ctrl.resetEmployeePassword); // Reset employee password

export default router;
