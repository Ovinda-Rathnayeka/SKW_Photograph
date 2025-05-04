import mongoose from "mongoose";

// AssignTask schema
const assignTaskSchema = new mongoose.Schema(
  {
    taskId: { type: String, required: true, unique: true }, // Unique task ID
    employeeIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Employee", // Reference to Employee model
        required: true,
      },
    ], // Now allowing multiple employee references
    resourcesId: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Resource",
      },
    ], // Array of Resource references
    dateRange: {
      startDate: { type: Date, required: true },
      endDate: { type: Date, required: true },
    }, // Date range for the task
    timeRange: {
      startTime: { type: String, required: true },
      endTime: { type: String, required: true },
    }, // Time range for the task
  },
  { timestamps: true }
); // Adds createdAt and updatedAt fields

const AssignTask = mongoose.model("AssignTask", assignTaskSchema);

export default AssignTask;
