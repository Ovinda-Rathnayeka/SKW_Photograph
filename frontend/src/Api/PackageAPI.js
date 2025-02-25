import axios from "axios";

// ✅ Create an axios instance with the base URL for the API
const api = axios.create({
  baseURL: "http://localhost:5000/api", // Adjust to match your backend API URL
});

// ================== 📸 PHOTO PACKAGE API FUNCTIONS ================== //

// ✅ Fetch all photo packages
export const fetchPhotoPackages = async () => {
  try {
    const response = await api.get("/packages");
    return response.data; // Assuming response.data contains the list of packages
  } catch (error) {
    console.error("❌ Error fetching photo packages:", error.message);
    throw new Error("Error fetching photo packages");
  }
};

// ✅ Fetch a specific photo package by ID
export const fetchPhotoPackageById = async (packageId) => {
  try {
    console.log("🔍 Fetching photo package with ID:", packageId); // ✅ Debugging
    const response = await api.get(`/packages/${packageId}`);

    if (!response.data) {
      console.warn(
        "⚠️ Photo package data is missing in response for ID:",
        packageId
      );
      return null;
    }

    console.log("✅ Photo Package Data:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "❌ Error fetching photo package:",
      error.response?.data || error.message
    );
    throw new Error("Error fetching photo package");
  }
};

// ✅ Delete a photo package by ID
export const deletePhotoPackage = async (packageId) => {
  try {
    const response = await api.delete(`/packages/${packageId}`);
    return response.data.message; // Assuming response contains a success message
  } catch (error) {
    console.error(
      "❌ Error deleting photo package:",
      error.response?.data || error.message
    );
    throw new Error("Error deleting photo package");
  }
};

// ✅ Update a photo package
export const updatePhotoPackage = async (packageId, updatedData) => {
  try {
    const response = await api.put(`/packages/${packageId}`, updatedData, {
      headers: {
        "Content-Type": "application/json", // Adjust as needed
      },
    });
    return response.data; // Assuming the response contains the updated package
  } catch (error) {
    console.error(
      "❌ Error updating photo package:",
      error.response?.data || error.message
    );
    throw new Error("Error updating photo package");
  }
};
