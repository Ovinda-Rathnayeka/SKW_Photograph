import axios from "axios";

const API_URL = "http://localhost:5000/resource";

export const createResource = async (formData) => {
  try {
    const response = await axios.post(API_URL, formData, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error creating resource:", error);
    throw error;
  }
};

export const getResourceById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching resource by ID:", error);
    throw error;
  }
};

export const getAllResources = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error("Error fetching all resources:", error);
    throw error;
  }
};

export const deleteResourceById = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting resource:", error);
    throw error;
  }
};

export const updateResourceStockAndRentalStock = async (
  id,
  stock,
  rentalStock
) => {
  try {
    console.log(
      `Updating resource: ${id}, stock: ${stock}, rentalStock: ${rentalStock}`
    );

    const response = await axios.put(`${API_URL}/${id}/stockAndRental`, {
      stock,
      rentalStock,
    });

    console.log("Response from backend:", response.data);

    return response.data;
  } catch (error) {
    console.error(
      "Error updating resource stock and rentalStock:",
      error.response || error
    );
    throw error;
  }
};

export const updateResourceAvailability = async (id, availabilityStatus) => {
  try {
    const response = await axios.put(`${API_URL}/${id}/availability`, {
      availabilityStatus,
    });
    return response.data;
  } catch (error) {
    console.error("Error updating resource availability:", error);
    throw error;
  }
};
