import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/package",
});

export const fetchPhotoPackages = async () => {
  try {
    console.log("Fetching all photo packages...");
    const response = await api.get("/");
    console.log("Photo packages fetched successfully!", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching photo packages:",
      error.response?.data?.message || error.message
    );
    throw new Error("Error fetching photo packages");
  }
};

export const fetchPhotoPackageById = async (packageId) => {
  try {
    console.log("Fetching photo package with ID:", packageId);
    const response = await api.get(`/${packageId}`);

    if (!response.data) {
      console.warn("Photo package data missing for ID:", packageId);
      return null;
    }

    console.log("Photo Package Data:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching photo package:",
      error.response?.data?.message || error.message
    );
    throw new Error("Error fetching photo package");
  }
};

export const deletePhotoPackage = async (packageId) => {
  try {
    console.log("Deleting photo package with ID:", packageId);
    const response = await api.delete(`/${packageId}`);
    console.log("Package deleted successfully!", response.data);
    return response.data.message;
  } catch (error) {
    console.error(
      "Error deleting photo package:",
      error.response?.data?.message || error.message
    );
    throw new Error("Error deleting photo package");
  }
};

export const updatePhotoPackage = async (packageId, updatedData) => {
  try {
    console.log("Updating photo package:", packageId);
    const response = await api.put(`/${packageId}`, updatedData, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    console.log("Package updated successfully!", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "Error updating photo package:",
      error.response?.data?.message || error.message
    );
    throw new Error("Error updating photo package");
  }
};
