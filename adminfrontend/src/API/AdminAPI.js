import axios from "axios";

// Set up Axios instance
const api = axios.create({
  baseURL: "http://localhost:5000/employee", // Replace with your backend base URL
});

export const loginEmployee = async (email, password) => {
  try {
    const response = await api.post("/login", { email, password });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Something went wrong");
  }
};

export const createEmployee = async (employeeData) => {
  try {
    const response = await api.post("/", employeeData);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to create employee"
    );
  }
};

export const getEmployees = async () => {
  try {
    const response = await api.get("/");
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch employees"
    );
  }
};

export const getEmployeeById = async (id) => {
  try {
    const response = await api.get(`/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch employee"
    );
  }
};

export const updateEmployee = async (id, updatedData) => {
  try {
    const response = await api.put(`/${id}`, updatedData);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to update employee"
    );
  }
};

export const deleteEmployee = async (id) => {
  try {
    const response = await api.delete(`/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to delete employee"
    );
  }
};
