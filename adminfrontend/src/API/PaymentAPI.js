import axios from "axios";

// Create an axios instance with base URL configured
const api = axios.create({
  baseURL: "http://localhost:5000/payment", // Adjust this according to your API
});

// Fetch all payments
export const fetchAllPayments = async () => {
  try {
    console.log("Fetching all payments...");
    const response = await api.get("/"); // Fetch all payments
    console.log("Payments fetched successfully!", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching payments:",
      error.response?.data?.message || error.message
    );
    throw new Error("Error fetching payments");
  }
};

// Update payment status
export const updatePaymentStatus = async (paymentId, status) => {
  try {
    console.log(
      "Updating payment status for ID:",
      paymentId,
      "Status:",
      status
    );

    const response = await api.put(`/${paymentId}`, { paymentStatus: status }); // Use the api instance for PUT request

    console.log("Payment status updated successfully!", response.data);
    return response.data; // Return the updated payment details
  } catch (error) {
    console.error(
      "Error updating payment status:",
      error.response?.data?.message || error.message
    );
    throw new Error("Error updating payment status");
  }
};
