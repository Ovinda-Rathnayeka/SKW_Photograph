// src/Api/CartPaymentAPI.js

import axios from "axios";

// Create an Axios instance for cart-payment APIs
const api = axios.create({
  baseURL: "http://localhost:5000/api/cart-payment", // Adjust if backend URL is different
});

// Upload payment slip (❌ This is no longer needed, so we comment it safely)
// export const uploadPaymentSlip = async (formData) => { ... }

export const fetchPayments = async () => {
  try {
    const response = await api.get("/");
    return response.data;
  } catch (error) {
    console.error("Error fetching payments:", error);
    throw new Error("Failed to fetch payments");
  }
};

// ➡️ Corrected createCartPayment
export const createCartPayment = async (paymentData, proofImage) => {
  try {
    const formData = new FormData();

    formData.append("customerId", paymentData.customerId);
    formData.append("address", paymentData.address);
    formData.append("totalAmount", paymentData.totalAmount);

    if (proofImage) {
      formData.append("proofImage", proofImage);
    }

    const response = await api.post("/", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error creating cart payment:", error);
    throw new Error("Failed to create cart payment");
  }
};
