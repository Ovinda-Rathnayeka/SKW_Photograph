import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/customer",
});

export const createCustomer = async (customerData) => {
  try {
    const response = await api.post("/", customerData);
    console.log("Customer created successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "Error creating customer:",
      error.response?.data?.message || error.message
    );
    throw new Error("Error creating customer");
  }
};

export const fetchAllCustomers = async () => {
  try {
    const response = await api.get("/");
    console.log("Fetched all customers:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching customers:",
      error.response?.data?.message || error.message
    );
    throw new Error("Error fetching customers");
  }
};

export const fetchCustomerById = async (customerId) => {
  try {
    const response = await api.get(`/${customerId}`);
    console.log("Fetched customer by ID:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching customer:",
      error.response?.data?.message || error.message
    );
    throw new Error("Error fetching customer");
  }
};

export const updateCustomer = async (customerId, updatedData) => {
  try {
    const response = await api.put(`/${customerId}`, updatedData);
    console.log("Customer updated successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "Error updating customer:",
      error.response?.data?.message || error.message
    );
    throw new Error("Error updating customer");
  }
};

export const deactivateCustomer = async (customerId) => {
  try {
    const response = await api.delete(`/${customerId}`);
    console.log("Customer deactivated successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "Error deactivating customer:",
      error.response?.data?.message || error.message
    );
    throw new Error("Error deactivating customer");
  }
};

export const sendOTP = async (email) => {
  try {
    const response = await api.post(`/otp`, { email });
    console.log("OTP sent successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "Error sending OTP:",
      error.response?.data?.message || error.message
    );
    throw new Error("Error sending OTP");
  }
};

export const verifyOTP = async (email, otp) => {
  try {
    const response = await api.post(`/verify-otp`, { email, otp });
    console.log("OTP verified successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "Error verifying OTP:",
      error.response?.data?.message || error.message
    );
    throw new Error("Error verifying OTP");
  }
};
