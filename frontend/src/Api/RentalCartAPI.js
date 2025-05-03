import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/rentalcart", // adjust if needed
  headers: {
    "Content-Type": "application/json",
  },
});

// Add item to rental cart
export const addToRentalCart = async (data) => {
  try {
    const response = await api.post("/", data);
    return response.data;
  } catch (error) {
    console.error(
      "Error adding to rental cart:",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "Failed to add to rental cart"
    );
  }
};

// Get rental cart items by user ID
export const getRentalCartByUserId = async (userId) => {
  try {
    const response = await api.get(`/user/${userId}`);
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching rental cart:",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "Failed to fetch rental cart"
    );
  }
};

// Update a rental cart item
export const updateRentalCartItem = async (updateData) => {
  try {
    const response = await api.put("/update", updateData);
    return response.data;
  } catch (error) {
    console.error(
      "Error updating rental cart item:",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "Failed to update rental cart item"
    );
  }
};

// Remove item from rental cart by rentalCartItemId
export const removeFromRentalCart = async (rentalCartItemId) => {
  try {
    const response = await api.delete(`/delete/${rentalCartItemId}`);
    return response.data;
  } catch (error) {
    console.error(
      "Error removing rental cart item:",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "Failed to remove rental cart item"
    );
  }
};

export default {
  addToRentalCart,
  getRentalCartByUserId,
  updateRentalCartItem,
  removeFromRentalCart,
};
