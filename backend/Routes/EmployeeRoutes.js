import express from "express";
import { employeeAuth, hrManagerOnly } from "../middleware/EmployeeAuth.js";
import * as ctrl from "../controllers/EmployeeController.js";

const router = express.Router();

// public
router.post("/login", ctrl.loginEmployee);

// protected: require valid JWT
router.use(employeeAuth);

// HR Manager only routes
router.get("/", hrManagerOnly, ctrl.getAllEmployees);
router.get("/:id", hrManagerOnly, ctrl.getEmployeeById);
router.post("/", hrManagerOnly, ctrl.createEmployee);
router.put("/:id", hrManagerOnly, ctrl.updateEmployee);
router.delete("/:id", hrManagerOnly, ctrl.deleteEmployee);
router.post("/:id/reset-password", hrManagerOnly, ctrl.resetEmployeePassword);

export default router;
