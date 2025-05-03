import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/cart-payment", // Backend route
  withCredentials: true,
});

export const fetchAllOrders = async () => {
  try {
    const response = await api.get("/");
    return response.data;
  } catch (error) {
    console.error("Error fetching orders:", error.response?.data || error.message);
    throw new Error("Failed to fetch orders");
  }
};