import axios from "axios";

// Base URL for the cart API
const api = axios.create({
  baseURL: "http://localhost:5000/cart", // Change this to your backend cart API URL
});

export const fetchCartItems = async (customerId) => {
  try {
    const response = await api.get(`/${customerId}`); // customerId is passed in the URL
    console.log("Cart items fetched successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching cart items:",
      error.response?.data?.message || error.message
    );
    throw new Error("Error fetching cart items");
  }
};

// Add a product to the cart
export const addToCart = async (productId, quantity, price, customerId) => {
  try {
    const response = await api.post("/", {
      productId,
      quantity,
      price,
      customerId, // Include customerId in the request body
    });
    console.log("Product added to cart:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "Error adding to cart:",
      error.response?.data?.message || error.message
    );
    throw new Error("Error adding to cart");
  }
};

// Update the quantity of a cart item
export const updateCartItem = async (cartItemId, quantity) => {
  try {
    // Pass the cartItemId and quantity in the body of the request
    const response = await api.put(`/update`, { cartItemId, quantity });
    console.log("Cart item updated successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "Error updating cart item:",
      error.response?.data?.message || error.message
    );
    throw new Error("Error updating cart item");
  }
};

// Remove a product from the cart
export const removeFromCart = async (cartItemId) => {
  try {
    const response = await api.delete(`/${cartItemId}`); // cartItemId is passed in the URL
    console.log("Product removed from cart:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "Error removing product from cart:",
      error.response?.data?.message || error.message
    );
    throw new Error("Error removing product from cart");
  }
};
