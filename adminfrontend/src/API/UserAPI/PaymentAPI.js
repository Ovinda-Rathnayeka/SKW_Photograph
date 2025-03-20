import axios from "axios";

const API_URL = "http://localhost:5000/payment";

// Create Payment API function
export const createPayment = async (paymentData, proofImage) => {
  const formData = new FormData();

  if (paymentData.amount) formData.append("amount", paymentData.amount);
  if (paymentData.bookingId)
    formData.append("bookingId", paymentData.bookingId);
  if (paymentData.customerId)
    formData.append("customerId", paymentData.customerId);
  if (paymentData.packageId)
    formData.append("packageId", paymentData.packageId);
  if (paymentData.paymentMethod)
    formData.append("paymentMethod", paymentData.paymentMethod);
  if (paymentData.paymentType)
    formData.append("paymentType", paymentData.paymentType); // Include paymentType

  // Add halfPaymentAmount only if paymentType is 'half'
  if (paymentData.paymentType === "half" && paymentData.halfPaymentAmount) {
    formData.append("halfPaymentAmount", paymentData.halfPaymentAmount);
  }

  // Calculate the toPayAmount only for half payments
  const toPayAmount =
    paymentData.paymentType === "half"
      ? paymentData.amount - paymentData.halfPaymentAmount
      : 0; // For full payments, set to 0
  formData.append("toPayAmount", toPayAmount);

  // If proof image is provided, append it to the form data
  if (proofImage) {
    formData.append("proofImage", proofImage);
  }

  try {
    const response = await axios.post(API_URL, formData, {
      headers: {
        "Content-Type": "multipart/form-data", // Set content type for file uploads
      },
    });
    return response.data; // Return the created payment response
  } catch (error) {
    console.error("Error creating payment:", error);
    throw error;
  }
};

// Get all payments API function
export const getAllPayments = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data; // Return list of payments
  } catch (error) {
    console.error("Error fetching payments:", error);
    throw error;
  }
};

// Get payment by ID API function
export const getPaymentById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data; // Return specific payment
  } catch (error) {
    console.error("Error fetching payment:", error);
    throw error;
  }
};

// Update payment by ID API function
export const updatePaymentById = async (id, paymentData, proofImage) => {
  const formData = new FormData();

  formData.append("amount", paymentData.amount);
  formData.append("bookingId", paymentData.bookingId);
  formData.append("customerId", paymentData.customerId);
  formData.append("packageId", paymentData.packageId);
  formData.append("paymentMethod", paymentData.paymentMethod);
  formData.append("paymentStatus", paymentData.paymentStatus);
  formData.append("paymentType", paymentData.paymentType); // Include paymentType

  // Add halfPaymentAmount only if paymentType is 'half'
  if (paymentData.paymentType === "half" && paymentData.halfPaymentAmount) {
    formData.append("halfPaymentAmount", paymentData.halfPaymentAmount);
  }

  // Calculate toPayAmount only for half payments
  const toPayAmount =
    paymentData.paymentType === "half"
      ? paymentData.amount - paymentData.halfPaymentAmount
      : 0; // For full payments, toPayAmount is 0
  formData.append("toPayAmount", toPayAmount);

  // If proof image is provided, append it to the form data
  if (proofImage) {
    formData.append("proofImage", proofImage);
  }

  try {
    const response = await axios.put(`${API_URL}/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data", // Set content type for file uploads
      },
    });
    return response.data; // Return updated payment response
  } catch (error) {
    console.error("Error updating payment:", error);
    throw error;
  }
};

// Delete payment by ID API function
export const deletePaymentById = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data; // Return success message on delete
  } catch (error) {
    console.error("Error deleting payment:", error);
    throw error;
  }
};
