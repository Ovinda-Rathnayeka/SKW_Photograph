<<<<<<< HEAD
import express from "express"
import EmployeeController from "../Controllers/EmployeeController.js"

const router = express.Router();

router.post('/', EmployeeController.createEmployee);
router.get('/', EmployeeController.getAllEmployees);
router.get('/:id', EmployeeController.getEmployeeById);
router.put('/:id', EmployeeController.updateEmployee);
router.delete('/:id', EmployeeController.deleteEmployee);
=======
import express from "express";
import {
  createEmployee,
  getEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
  loginEmployee,
} from "../Controllers/EmployeeController.js";

const router = express.Router();

router.post("/", createEmployee);

router.post("/login", loginEmployee);

router.get("/", getEmployees);

router.get("/:id", getEmployeeById);

router.put("/:id", updateEmployee);

router.delete("/:id", deleteEmployee);
>>>>>>> main

export default router;
