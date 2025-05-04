import express from "express";
import {
  createAssignTask,
  getAllAssignTasks,
  getAssignTaskById,
  updateAssignTask,
  deleteAssignTask,
} from "../Controllers/AssignTaskController.js";

const router = express.Router();

// POST: Create a new AssignTask
router.post("/", createAssignTask);

// GET: Get all AssignTasks
router.get("/", getAllAssignTasks);

// GET: Get a single AssignTask by ID
router.get("/:id", getAssignTaskById);

// PUT: Update an existing AssignTask by ID
router.put("/:id", updateAssignTask);

// DELETE: Delete an AssignTask by ID
router.delete("/:id", deleteAssignTask);

export default router;
