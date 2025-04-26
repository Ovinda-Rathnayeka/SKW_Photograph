// src/Api/CartPaymentAPI.js

import axios from "axios";

// Create an Axios instance for cart-payment APIs
const api = axios.create({
  baseURL: "http://localhost:5000/api/cart-payment", // Adjust if backend URL is different
});

// Upload payment slip
export const uploadPaymentSlip = async (formData) => {
  try {
    const response = await api.post("/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error uploading payment slip:", error);
    throw new Error("Failed to upload payment slip");
  }
};

// Fetch all payments
export const fetchPayments = async () => {
  try {
    const response = await api.get("/all");
    return response.data;
  } catch (error) {
    console.error("Error fetching payments:", error);
    throw new Error("Failed to fetch payments");
  }
};

// ➡️ Add createCartPayment (new function matching your request)
export const createCartPayment = async (paymentData) => {
  try {
    const response = await api.post("/", paymentData);
    return response.data;
  } catch (error) {
    console.error("Error creating cart payment:", error);
    throw new Error("Failed to create cart payment");
  }
};
