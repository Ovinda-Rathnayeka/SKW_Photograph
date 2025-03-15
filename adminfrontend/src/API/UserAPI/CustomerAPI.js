import axios from "axios";

// Base URL for the customer API
const api = axios.create({
  baseURL: "http://localhost:5000/customer", // Adjust this according to your backend API
});

// Function to create a new customer
export const createCustomer = async (customerData) => {
  try {
    const response = await api.post("/", customerData); // POST request to create a new customer
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

// Function to fetch all customers
export const fetchAllCustomers = async () => {
  try {
    const response = await api.get("/"); // GET request to fetch all customers
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

// Function to fetch a customer by ID
export const fetchCustomerById = async (customerId) => {
  try {
    const response = await api.get(`/${customerId}`); // GET request to fetch a customer by ID
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

// Function to update customer data
export const updateCustomer = async (customerId, updatedData) => {
  try {
    const response = await api.put(`/${customerId}`, updatedData); // PUT request to update customer data
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

// Function to deactivate (delete) customer
export const deactivateCustomer = async (customerId) => {
  try {
    const response = await api.delete(`/${customerId}`); // DELETE request to deactivate a customer
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

// Function to send OTP to the customer's email
export const sendOTP = async (email) => {
  try {
    const response = await api.post(`/otp`, { email }); // POST request to send OTP
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

// Function to verify OTP for customer login/verification
export const verifyOTP = async (email, otp) => {
  try {
    const response = await api.post(`/verify-otp`, { email, otp }); // POST request to verify OTP
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
