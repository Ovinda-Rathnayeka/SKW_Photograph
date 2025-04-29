import axios from "axios";


const api = axios.create({
  baseURL: "http://localhost:5000/cart", 
});

export const fetchCartItems = async (customerId) => {
  try {
    const response = await api.get(`/${customerId}`); 
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


export const addToCart = async (productId, quantity, price, customerId) => {
  try {
    const response = await api.post("/", {
      productId,
      quantity,
      price,
      customerId, 
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


export const updateCartItem = async (cartItemId, quantity) => {
  try {
    
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


export const removeFromCart = async (cartItemId) => {
  try {
    const response = await api.delete(`/${cartItemId}`); 
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
