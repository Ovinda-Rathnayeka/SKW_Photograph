import axios from "axios";

// Replace this URL with your backend API URL
const API_URL = "http://localhost:5000/rental";

// Create Rental Product
export const createRentalProduct = async (data) => {
  try {
    const response = await axios.post(API_URL, data, {
      headers: {
        "Content-Type": "multipart/form-data", // for file upload
      },
    });
    return response.data; // Returning the saved rental product data
  } catch (error) {
    console.error("Error creating rental product:", error);
    throw error;
  }
};

// Get all Rental Products
export const getAllRentalProducts = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data; // Returning all rental products
  } catch (error) {
    console.error("Error fetching rental products:", error);
    throw error;
  }
};

// Get Rental Product by ID
export const getRentalProductById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data; // Returning rental product data by ID
  } catch (error) {
    console.error("Error fetching rental product:", error);
    throw error;
  }
};

// Update Rental Product by ID
export const updateRentalProductById = async (id, data) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, data, {
      headers: {
        "Content-Type": "multipart/form-data", // for file upload
      },
    });
    return response.data; // Returning updated rental product data
  } catch (error) {
    console.error("Error updating rental product:", error);
    throw error;
  }
};

// Delete Rental Product by ID
export const deleteRentalProductById = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data; // Returning success message
  } catch (error) {
    console.error("Error deleting rental product:", error);
    throw error;
  }
};
