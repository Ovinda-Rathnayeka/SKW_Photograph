import axios from "axios";

// ✅ Create an axios instance with the base URL for the API
const api = axios.create({
  baseURL: "http://localhost:5000/auth",
  withCredentials: true, // Ensures cookies are sent with requests
});

// ================== 📱 AUTH API FUNCTIONS ================== //

// ✅ Signup (Register new customer)
export const signup = async (userData) => {
  try {
    const response = await api.post("/signup", userData);
    return response.data; // Assuming response contains success message and customer data
  } catch (error) {
    console.error(
      "❌ Error during signup:",
      error.response?.data || error.message
    );
    throw new Error(error.response?.data?.message || "Error during signup");
  }
};

// ✅ Login (Authenticate existing customer)
export const login = async (credentials) => {
  try {
    const response = await api.post("/login", credentials);
    return response.data; // Assuming response contains JWT token and customer data
  } catch (error) {
    console.error(
      "❌ Error during login:",
      error.response?.data || error.message
    );
    throw new Error(error.response?.data?.message || "Error during login");
  }
};

// ✅ Logout (Clear session/cookie)
export const logout = async () => {
  try {
    const response = await api.post("/logout");
    return response.data.message; // Assuming response contains a success message
  } catch (error) {
    console.error(
      "❌ Error during logout:",
      error.response?.data || error.message
    );
    throw new Error(error.response?.data?.message || "Error during logout");
  }
};

// ✅ Fetch Logged-in User Details
export const fetchUserDetails = async () => {
  try {
    const response = await api.get("/me"); // Fetch user data from /me
    return response.data; // Assuming response contains user details
  } catch (error) {
    console.error(
      "❌ Error fetching user details:",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "Error fetching user details"
    );
  }
};

export default api;
