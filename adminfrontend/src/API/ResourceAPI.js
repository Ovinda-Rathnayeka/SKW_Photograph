import axios from "axios";

const API_URL = "http://localhost:5000/resource";

// Create a new resource
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

// Get resource by ID
export const getResourceById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching resource by ID:", error);
    throw error;
  }
};

// Get all resources
export const getAllResources = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error("Error fetching all resources:", error);
    throw error;
  }
};

// Delete resource by ID
export const deleteResourceById = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting resource:", error);
    throw error;
  }
};

// Update resource stock by ID (stock + rentalStock)
export const updateResourceStockAndRentalStock = async (
  id,
  stock,
  rentalStock
) => {
  try {
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

// Update availability status
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

// Reduce stock quantity of a resource
export const deleteResourceStock = async (id, quantity) => {
  try {
    const response = await axios.put(`${API_URL}/${id}/reduce-stock`, {
      quantity,
    });
    return response.data;
  } catch (error) {
    console.error("Error reducing resource stock:", error);
    throw error;
  }
};

// Full update of resource
export const updateResource = async (id, resourceData) => {
  try {
    const response = await axios.put(`${API_URL}/${id}/update`, resourceData, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error updating full resource:", error);
    throw error;
  }
};
