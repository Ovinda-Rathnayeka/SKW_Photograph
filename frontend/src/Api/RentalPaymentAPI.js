// src/Api/RentalPaymentAPI.js
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/rentalpayment", // ✅ fixed: removed extra slash
  headers: {
    "Content-Type": "application/json",
  },
});

// Create a rental payment
export const createRentalPayment = async (paymentData) => {
  try {
    const response = await api.post("/", paymentData);
    return response.data;
  } catch (error) {
    console.error(
      "Error creating rental payment:",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "Failed to create rental payment"
    );
  }
};

// Get all rental payments
export const getAllRentalPayments = async () => {
  try {
    const response = await api.get("/");
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching all payments:",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "Failed to fetch payments"
    );
  }
};

// Get rental payments by userId
export const getRentalPaymentsByUserId = async (userId) => {
  try {
    const response = await api.get(`/user/${userId}`);
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching user's payments:",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "Failed to fetch user payments"
    );
  }
};

// Get single payment by ID
export const getRentalPaymentById = async (paymentId) => {
  try {
    const response = await api.get(`/${paymentId}`);
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching payment by ID:",
      error.response?.data || error.message
    );
    throw new Error(error.response?.data?.message || "Failed to fetch payment");
  }
};

// Update payment status
export const updateRentalPaymentStatus = async (paymentId, status) => {
  try {
    const response = await api.put(`/${paymentId}`, { paymentStatus: status });
    return response.data;
  } catch (error) {
    console.error(
      "Error updating payment status:",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "Failed to update payment status"
    );
  }
};

// Delete a payment
export const deleteRentalPayment = async (paymentId) => {
  try {
    const response = await api.delete(`/${paymentId}`);
    return response.data;
  } catch (error) {
    console.error(
      "Error deleting payment:",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "Failed to delete payment"
    );
  }
};

export default {
  createRentalPayment,
  getAllRentalPayments,
  getRentalPaymentsByUserId,
  getRentalPaymentById,
  updateRentalPaymentStatus,
  deleteRentalPayment,
};
