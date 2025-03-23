import axios from "axios";


const BASE_URL = "http://localhost:5000/package"; 


export const createPackage = async (packageData, imageFile) => {
  try {
    const formData = new FormData();
    formData.append("image", imageFile);
    for (const key in packageData) {
      formData.append(key, packageData[key]);
    }

    const response = await axios.post(BASE_URL, formData, {
      headers: {
        "Content-Type": "multipart/form-data", 
      },
    });
    return response.data; 
  } catch (error) {
    console.error("Error creating package:", error);
    throw error; 
  }
};


export const getAllPackages = async () => {
  try {
    const response = await axios.get(BASE_URL);
    return response.data; 
  } catch (error) {
    console.error("Error fetching packages:", error);
    throw error; 
  }
};


export const getPackageById = async (id) => {
  try {
    const response = await axios.get(`${BASE_URL}/${id}`);
    return response.data; 
  } catch (error) {
    console.error("Error fetching package by ID:", error);
    throw error; 
  }
};


export const updatePackageById = async (id, packageData, imageFile) => {
  try {
    const formData = new FormData();
    if (imageFile) {
      formData.append("image", imageFile);
    }
    for (const key in packageData) {
      formData.append(key, packageData[key]); 
    }

    const response = await axios.put(`${BASE_URL}/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data", 
      },
    });
    return response.data; 
  } catch (error) {
    console.error("Error updating package:", error);
    throw error; 
  }
};

export const deletePackageById = async (id) => {
  try {
    const response = await axios.delete(`${BASE_URL}/${id}`);
    return response.data; 
  } catch (error) {
    console.error("Error deleting package:", error);
    throw error; 
  }
};
