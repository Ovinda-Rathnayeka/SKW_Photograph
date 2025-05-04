import AssignTask from "../Models/AssignTaskModel.js";
import Employee from "../Models/EmployeeModel.js";
import Resource from "../Models/ResourceModel.js";

export const createAssignTask = async (req, res) => {
  try {
    const { taskId, employeeIds, resourcesId, dateRange, timeRange } = req.body;

    console.log("Received taskData:", req.body);

    const employees = await Employee.find({ _id: { $in: employeeIds } });
    if (employees.length !== employeeIds.length) {
      return res.status(400).json({ message: "Some employees not found" });
    }

    if (resourcesId.length > 0) {
      const resources = await Resource.find({ _id: { $in: resourcesId } });
      if (resources.length !== resourcesId.length) {
        return res.status(400).json({ message: "Some resources not found" });
      }
    }

    const newAssignTask = new AssignTask({
      taskId,
      employeeIds,
      resourcesId,
      dateRange,
      timeRange,
    });

    console.log("Saving new task:", newAssignTask);

    const savedTask = await newAssignTask.save();

    console.log("Task created:", savedTask);

    res.status(201).json(savedTask);
  } catch (error) {
    console.error("Error creating AssignTask:", error);
    res
      .status(500)
      .json({ message: "Error creating AssignTask", error: error.message });
  }
};

export const getAllAssignTasks = async (req, res) => {
  try {
    const assignTasks = await AssignTask.find()
      .populate("employeeIds", "name role email")
      .populate("resourcesId", "name type quantity");
    res.status(200).json(assignTasks);
  } catch (error) {
    console.error("Error fetching AssignTasks:", error);
    res
      .status(500)
      .json({ message: "Error fetching AssignTasks", error: error.message });
  }
};

export const getAssignTaskById = async (req, res) => {
  try {
    const { id } = req.params;
    const assignTask = await AssignTask.findById(id)
      .populate("employeeIds", "name role email")
      .populate("resourcesId", "name type quantity");

    if (!assignTask) {
      return res.status(404).json({ message: "AssignTask not found" });
    }

    res.status(200).json(assignTask);
  } catch (error) {
    console.error("Error fetching AssignTask:", error);
    res
      .status(500)
      .json({ message: "Error fetching AssignTask", error: error.message });
  }
};

export const updateAssignTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { taskId, employeeIds, resourcesId, dateRange, timeRange } = req.body;

    const employees = await Employee.find({ _id: { $in: employeeIds } });
    if (employees.length !== employeeIds.length) {
      return res.status(400).json({ message: "Some employees not found" });
    }

    const resources = await Resource.find({ _id: { $in: resourcesId } });
    if (resources.length !== resourcesId.length) {
      return res.status(400).json({ message: "Some resources not found" });
    }

    const updatedAssignTask = await AssignTask.findByIdAndUpdate(
      id,
      { taskId, employeeIds, resourcesId, dateRange, timeRange },
      { new: true }
    )
      .populate("employeeIds", "name role email")
      .populate("resourcesId", "name type quantity");

    if (!updatedAssignTask) {
      return res.status(404).json({ message: "AssignTask not found" });
    }

    res.status(200).json(updatedAssignTask);
  } catch (error) {
    console.error("Error updating AssignTask:", error);
    res
      .status(500)
      .json({ message: "Error updating AssignTask", error: error.message });
  }
};

export const deleteAssignTask = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedAssignTask = await AssignTask.findByIdAndDelete(id);

    if (!deletedAssignTask) {
      return res.status(404).json({ message: "AssignTask not found" });
    }

    res.status(200).json({ message: "AssignTask deleted successfully" });
  } catch (error) {
    console.error("Error deleting AssignTask:", error);
    res
      .status(500)
      .json({ message: "Error deleting AssignTask", error: error.message });
  }
};
