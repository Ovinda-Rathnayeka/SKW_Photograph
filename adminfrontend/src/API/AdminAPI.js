import axios from "axios";

// Axios instance for admin operations
const api = axios.create({
  baseURL: "http://localhost:5000/employee", // URL for your employee routes
  headers: { "Content-Type": "application/json" },
});

/** Authentication */
export const loginEmployee = async (email, password) => {
  try {
    const { data } = await api.post("/login", { email, password });
    // Since there is no JWT anymore, we no longer need to store it
    localStorage.setItem("employee", JSON.stringify(data.user));
    return data;
  } catch (err) {
    throw new Error(err.response?.data?.message || "Login failed");
  }
};

/** Create */
export const createEmployee = async (employeeData) => {
  try {
    const { data } = await api.post("/", employeeData);
    return data;
  } catch (err) {
    throw new Error(err.response?.data?.message || "Failed to create employee");
  }
};

/** Read all */
export const getEmployees = async () => {
  try {
    const { data } = await api.get("/");
    return data;
  } catch (err) {
    throw new Error(err.response?.data?.message || "Failed to fetch employees");
  }
};

/** Read one */
export const getEmployeeById = async (id) => {
  try {
    const { data } = await api.get(`/${id}`);
    return data;
  } catch (err) {
    throw new Error(err.response?.data?.message || "Failed to fetch employee");
  }
};

/** Update (fields only, no password reset here) */
export const updateEmployee = async (id, updatedData) => {
  try {
    const { data } = await api.put(`/${id}`, updatedData);
    return data;
  } catch (err) {
    throw new Error(err.response?.data?.message || "Failed to update employee");
  }
};

/** Delete */
export const deleteEmployee = async (id) => {
  try {
    const { data } = await api.delete(`/${id}`);
    return data;
  } catch (err) {
    throw new Error(err.response?.data?.message || "Failed to delete employee");
  }
};

/** Reveal password using fixed key */
export const revealEmployeePassword = async (id, revealKey) => {
  try {
    const { data } = await api.post(`/${id}/reveal-password`, { revealKey });
    return data.password;
  } catch (err) {
    throw new Error(err.response?.data?.message || "Failed to reveal password");
  }
};

/** Reset password (admin only) */
export const resetEmployeePassword = async (id) => {
  try {
    const { data } = await api.post(`/${id}/reset-password`);
    return data.newPassword;
  } catch (err) {
    throw new Error(err.response?.data?.message || "Failed to reset password");
  }
};
