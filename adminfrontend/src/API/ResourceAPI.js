import axios from "axios";

const API_URL = "http://localhost:5000/resource";
// Create a new resource
export const createResource = async (formData) => {
  try {
    const response = await axios.post(API_URL, formData, {
      headers: {
        "Content-Type": "application/json", // Sending JSON instead of multipart/form-data
      },
    });
    return response.data; // Return the created resource from the backend
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

// Update resource stock by ID
export const updateResourceStockAndRentalStock = async (
  id,
  stock,
  rentalStock
) => {
  try {
    // Log the data being sent to the backend for debugging
    console.log(
      `Updating resource: ${id}, stock: ${stock}, rentalStock: ${rentalStock}`
    );

    const response = await axios.put(`${API_URL}/${id}/stockAndRental`, {
      stock,
      rentalStock,
    });

    // Log the response for debugging
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

// Update resource availability by ID
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
