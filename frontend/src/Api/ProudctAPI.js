import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/product", 
});

export const fetchProducts = async () => {
  try {
    console.log("Fetching all products...");
    const response = await api.get("/");
    console.log("Products fetched successfully!", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching products:",
      error.response?.data?.message || error.message
    );
    throw new Error("Error fetching products");
  }
};

export const fetchProductById = async (productId) => {
  try {
    console.log("Fetching product with ID:", productId);
    const response = await api.get(`/${productId}`);

    if (!response.data) {
      console.warn("Product data missing for ID:", productId);
      return null;
    }

    console.log("Product Data:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching product:",
      error.response?.data?.message || error.message
    );
    throw new Error("Error fetching product");
  }
};

export const deleteProduct = async (productId) => {
  try {
    console.log("Deleting product with ID:", productId);
    const response = await api.delete(`/${productId}`);
    console.log("Product deleted successfully!", response.data);
    return response.data.message;
  } catch (error) {
    console.error(
      "Error deleting product:",
      error.response?.data?.message || error.message
    );
    throw new Error("Error deleting product");
  }
};

export const updateProduct = async (productId, updatedData) => {
  try {
    console.log("Updating product:", productId);
    const response = await api.put(`/${productId}`, updatedData, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    console.log("Product updated successfully!", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "Error updating product:",
      error.response?.data?.message || error.message
    );
    throw new Error("Error updating product");
  }
};
