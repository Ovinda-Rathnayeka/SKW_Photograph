import axios from "axios";

// Base URL for your API (adjust it to your backend's URL)
const BASE_URL = "http://localhost:5000/package"; // Update the URL if needed

// Create a new photo package
export const createPackage = async (packageData, imageFile) => {
  try {
    const formData = new FormData();
    formData.append("image", imageFile); // Append the image file
    for (const key in packageData) {
      formData.append(key, packageData[key]); // Append other package data
    }

    const response = await axios.post(BASE_URL, formData, {
      headers: {
        "Content-Type": "multipart/form-data", // Ensure the correct content type is set
      },
    });
    return response.data; // Return the saved package
  } catch (error) {
    console.error("Error creating package:", error);
    throw error; // Throw the error so it can be caught in the calling function
  }
};

// Get all packages
export const getAllPackages = async () => {
  try {
    const response = await axios.get(BASE_URL);
    return response.data; // Return all packages
  } catch (error) {
    console.error("Error fetching packages:", error);
    throw error; // Throw the error so it can be caught in the calling function
  }
};

// Get a package by its ID
export const getPackageById = async (id) => {
  try {
    const response = await axios.get(`${BASE_URL}/${id}`);
    return response.data; // Return the package by ID
  } catch (error) {
    console.error("Error fetching package by ID:", error);
    throw error; // Throw the error so it can be caught in the calling function
  }
};

// Update an existing package
export const updatePackageById = async (id, packageData, imageFile) => {
  try {
    const formData = new FormData();
    if (imageFile) {
      formData.append("image", imageFile); // Append new image if provided
    }
    for (const key in packageData) {
      formData.append(key, packageData[key]); // Append other updated package data
    }

    const response = await axios.put(`${BASE_URL}/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data", // Ensure the correct content type is set
      },
    });
    return response.data; // Return the updated package
  } catch (error) {
    console.error("Error updating package:", error);
    throw error; // Throw the error so it can be caught in the calling function
  }
};

export const deletePackageById = async (id) => {
  try {
    const response = await axios.delete(`${BASE_URL}/${id}`);
    return response.data; // Return the response after deleting
  } catch (error) {
    console.error("Error deleting package:", error);
    throw error; // Throw the error so it can be caught in the calling function
  }
};
