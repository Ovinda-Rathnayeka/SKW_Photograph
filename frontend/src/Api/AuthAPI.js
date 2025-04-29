import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/auth",
  withCredentials: true,
});



export const signup = async (userData) => {
  try {
    const response = await api.post("/signup", userData);
    return response.data;
  } catch (error) {
    console.error(
      "Error during signup:",
      error.response?.data || error.message
    );
    throw new Error(error.response?.data?.message || "Error during signup");
  }
};

export const login = async (credentials) => {
  try {
    const response = await api.post("/login", credentials);
    return response.data;
  } catch (error) {
    console.error("Error during login:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Error during login");
  }
};

export const logout = async () => {
  try {
    const response = await api.post("/logout");
    return response.data.message;
  } catch (error) {
    console.error(
      "Error during logout:",
      error.response?.data || error.message
    );
    throw new Error(error.response?.data?.message || "Error during logout");
  }
};

export const fetchUserDetails = async () => {
  try {
    const response = await api.get("/me");
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching user details:",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "Error fetching user details"
    );
  }
};

export const updateUserProfile = async (userId, updatedData) => {
  const userData = JSON.parse(sessionStorage.getItem("user"));
  const token = userData ? userData.token : null;

  if (!token) {
    throw new Error("Token not found");
  }

  try {
    const response = await api.put(`/me`, updatedData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data; // Return updated user data from the backend
  } catch (error) {
    console.error("Error updating user details:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Error updating user details");
  }
};

export const verifyOTP = async (otpData) => {
  try {
    const response = await api.post("/verify-otp", otpData);
    return response.data;
  } catch (error) {
    console.error(
      "Error during OTP verification:",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "Error during OTP verification"
    );
  }
};

export default api;
