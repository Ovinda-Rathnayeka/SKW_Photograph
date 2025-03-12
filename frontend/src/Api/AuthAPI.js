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
<<<<<<< Updated upstream
      "Error during signup:",
=======
      "❌ Error during signup:",
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
    console.error("Error during login:", error.response?.data || error.message);
=======
    console.error(
      "❌ Error during login:",
      error.response?.data || error.message
    );
>>>>>>> Stashed changes
    throw new Error(error.response?.data?.message || "Error during login");
  }
};

export const logout = async () => {
  try {
    const response = await api.post("/logout");
    return response.data.message;
  } catch (error) {
    console.error(
<<<<<<< Updated upstream
      "Error during logout:",
=======
      "❌ Error during logout:",
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
      "Error fetching user details:",
=======
      "❌ Error fetching user details:",
>>>>>>> Stashed changes
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "Error fetching user details"
    );
  }
};

<<<<<<< Updated upstream
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

=======
>>>>>>> Stashed changes
export default api;
