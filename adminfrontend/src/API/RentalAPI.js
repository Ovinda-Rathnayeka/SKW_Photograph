import axios from "axios";

const API_URL = "http://localhost:5000/rental";

export const createRentalProduct = async (data) => {
  try {
    const response = await axios.post(API_URL, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error creating rental product:", error);
    throw error;
  }
};

export const getAllRentalProducts = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error("Error fetching rental products:", error);
    throw error;
  }
};

export const getRentalProductById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching rental product:", error);
    throw error;
  }
};

export const updateRentalProductById = async (id, data) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error updating rental product:", error);
    throw error;
  }
};

export const deleteRentalProductById = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting rental product:", error);
    throw error;
  }
};
