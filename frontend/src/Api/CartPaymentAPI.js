import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/cart-payment", 
  withCredentials: true,
});

export const createCartPayment = async (paymentData, proofImage) => {
  const formData = new FormData();
  formData.append("customerId", paymentData.customerId);
  formData.append("address", paymentData.address);
  formData.append("totalAmount", paymentData.totalAmount);

  if (proofImage) {
    formData.append("proofImage", proofImage); 
  }

  try {
    const response = await api.post("/", formData);
    return response.data;
  } catch (error) {
    console.error("Error creating cart payment:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Failed to create payment");
  }
};