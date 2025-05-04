import express from "express";
import {
  createAssignTask,
  getAllAssignTasks,
  getAssignTaskById,
  updateAssignTask,
  deleteAssignTask,
} from "../Controllers/AssignTaskController.js";

const router = express.Router();

router.post("/", createAssignTask);

router.get("/", getAllAssignTasks);

router.get("/:id", getAssignTaskById);

router.put("/:id", updateAssignTask);

router.delete("/:id", deleteAssignTask);

export default router;
