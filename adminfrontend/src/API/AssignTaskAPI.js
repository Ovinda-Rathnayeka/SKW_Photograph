import axios from "axios";

// Set up Axios instance with base URL
const api = axios.create({
  baseURL: "http://localhost:5000/assign-task", // Adjust the URL as needed
  headers: { "Content-Type": "application/json" },
});

// Create a new AssignTask
export const createAssignTask = async (taskData) => {
  try {
    const response = await api.post("/", taskData); // POST request to create new task
    if (response.status === 201) {
      return response.data; // Return the created task data
    } else {
      throw new Error("Failed to create AssignTask, unexpected response");
    }
  } catch (error) {
    console.error(
      "Error creating AssignTask:",
      error.response ? error.response.data : error.message
    );
    throw error; // Re-throw the error to propagate it
  }
};

// Get all AssignTasks
export const getAllAssignTasks = async () => {
  try {
    const response = await api.get("/"); // GET request to fetch all tasks
    return response.data; // Return the fetched tasks data
  } catch (error) {
    console.error(
      "Error fetching AssignTasks:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
};

// Get a single AssignTask by ID
export const getAssignTaskById = async (taskId) => {
  try {
    const response = await api.get(`/${taskId}`); // GET request for a single task by ID
    return response.data; // Return the fetched task data
  } catch (error) {
    console.error(
      "Error fetching AssignTask by ID:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
};

// Update an AssignTask by ID
export const updateAssignTask = async (taskId, updatedData) => {
  try {
    const response = await api.put(`/${taskId}`, updatedData); // PUT request to update the task by ID
    return response.data; // Return the updated task data
  } catch (error) {
    console.error(
      "Error updating AssignTask:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
};

// Delete an AssignTask by ID
export const deleteAssignTask = async (taskId) => {
  try {
    const response = await api.delete(`/${taskId}`); // DELETE request to remove a task by ID
    return response.data; // Return the response after successful deletion
  } catch (error) {
    console.error(
      "Error deleting AssignTask:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
};
