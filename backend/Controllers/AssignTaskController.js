import AssignTask from "../Models/AssignTaskModel.js";
import Employee from "../Models/EmployeeModel.js";
import Resource from "../Models/ResourceModel.js";

// Create a new AssignTask
export const createAssignTask = async (req, res) => {
  try {
    const { taskId, employeeIds, resourcesId, dateRange, timeRange } = req.body;

    console.log("Received taskData:", req.body); // Log incoming data

    // Check if employees exist
    const employees = await Employee.find({ _id: { $in: employeeIds } });
    if (employees.length !== employeeIds.length) {
      return res.status(400).json({ message: "Some employees not found" });
    }

    // Check if resources exist (optional)
    if (resourcesId.length > 0) {
      const resources = await Resource.find({ _id: { $in: resourcesId } });
      if (resources.length !== resourcesId.length) {
        return res.status(400).json({ message: "Some resources not found" });
      }
    }

    // Create the new task assignment
    const newAssignTask = new AssignTask({
      taskId,
      employeeIds, // Assign multiple employee IDs
      resourcesId,
      dateRange,
      timeRange,
    });

    // Log before saving to the database
    console.log("Saving new task:", newAssignTask);

    const savedTask = await newAssignTask.save(); // Save to the database

    // Log successful creation
    console.log("Task created:", savedTask);

    // Send response back to the frontend
    res.status(201).json(savedTask);
  } catch (error) {
    console.error("Error creating AssignTask:", error);
    res
      .status(500)
      .json({ message: "Error creating AssignTask", error: error.message });
  }
};

// Get all AssignTasks
export const getAllAssignTasks = async (req, res) => {
  try {
    const assignTasks = await AssignTask.find()
      .populate("employeeIds", "name role email") // Populate employee info
      .populate("resourcesId", "name type quantity"); // Populate resource info
    res.status(200).json(assignTasks);
  } catch (error) {
    console.error("Error fetching AssignTasks:", error);
    res
      .status(500)
      .json({ message: "Error fetching AssignTasks", error: error.message });
  }
};

// Get a single AssignTask by ID
export const getAssignTaskById = async (req, res) => {
  try {
    const { id } = req.params;
    const assignTask = await AssignTask.findById(id)
      .populate("employeeIds", "name role email") // Populate employee info
      .populate("resourcesId", "name type quantity"); // Populate resource info

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

// Update an existing AssignTask
export const updateAssignTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { taskId, employeeIds, resourcesId, dateRange, timeRange } = req.body;

    // Check if employees exist
    const employees = await Employee.find({ _id: { $in: employeeIds } });
    if (employees.length !== employeeIds.length) {
      return res.status(400).json({ message: "Some employees not found" });
    }

    // Check if resources exist
    const resources = await Resource.find({ _id: { $in: resourcesId } });
    if (resources.length !== resourcesId.length) {
      return res.status(400).json({ message: "Some resources not found" });
    }

    // Update the AssignTask
    const updatedAssignTask = await AssignTask.findByIdAndUpdate(
      id,
      { taskId, employeeIds, resourcesId, dateRange, timeRange },
      { new: true }
    )
      .populate("employeeIds", "name role email") // Populate employee info
      .populate("resourcesId", "name type quantity"); // Populate resource info

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

// Delete an AssignTask
export const deleteAssignTask = async (req, res) => {
  try {
    const { id } = req.params;

    // Delete the AssignTask
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
