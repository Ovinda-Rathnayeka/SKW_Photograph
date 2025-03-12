import axios from "axios";

const API_URL = "http://localhost:5000/payment";

export const createPayment = async (paymentData, proofImage) => {
  const formData = new FormData();

  if (paymentData.amount) formData.append("amount", paymentData.amount);
  if (paymentData.bookingId)
    formData.append("bookingId", paymentData.bookingId);
  if (paymentData.customerId)
    formData.append("customerId", paymentData.customerId);
  if (paymentData.packageId)
    formData.append("packageId", paymentData.packageId);
  if (paymentData.halfPaymentAmount)
    formData.append("halfPaymentAmount", paymentData.halfPaymentAmount);
  if (paymentData.paymentMethod)
    formData.append("paymentMethod", paymentData.paymentMethod);

  const toPayAmount = paymentData.amount - paymentData.halfPaymentAmount;
  formData.append("toPayAmount", toPayAmount);

  if (proofImage) {
    formData.append("proofImage", proofImage);
  }

  try {
    const response = await axios.post(API_URL, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error creating payment:", error);
    throw error;
  }
};

export const getAllPayments = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error("Error fetching payments:", error);
    throw error;
  }
};

export const getPaymentById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching payment:", error);
    throw error;
  }
};

export const updatePaymentById = async (id, paymentData, proofImage) => {
  const formData = new FormData();
  formData.append("amount", paymentData.amount);
  formData.append("bookingId", paymentData.bookingId);
  formData.append("customerId", paymentData.customerId);
  formData.append("packageId", paymentData.packageId);
  formData.append("halfPaymentAmount", paymentData.halfPaymentAmount);
  formData.append("paymentMethod", paymentData.paymentMethod);
  formData.append("paymentStatus", paymentData.paymentStatus);

  const toPayAmount = paymentData.amount - paymentData.halfPaymentAmount;
  formData.append("toPayAmount", toPayAmount);

  if (proofImage) {
    formData.append("proofImage", proofImage);
  }

  try {
    const response = await axios.put(`${API_URL}/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error updating payment:", error);
    throw error;
  }
};

export const deletePaymentById = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting payment:", error);
    throw error;
  }
};
