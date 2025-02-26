import axios from "axios";

// ✅ Create an axios instance with the base URL for the API
const api = axios.create({
  baseURL: "http://localhost:5000/auth",
  withCredentials: true,
});

// ================== 📱 AUTH API FUNCTIONS ================== //

// ✅ Signup (Register new customer)
export const signup = async (userData) => {
  try {
    const response = await api.post("/signup", userData, {
      withCredentials: true,
    });
    return response.data; // Assuming the response contains success message and customer data
  } catch (error) {
    console.error(
      "❌ Error during signup:",
      error.response?.data || error.message
    );
    throw new Error("Error during signup");
  }
};

// ✅ Login (Authenticate existing customer)
export const login = async (credentials) => {
  try {
    const response = await api.post("/login", credentials, {
      withCredentials: true,
    });
    return response.data; // Assuming the response contains JWT token and customer data
  } catch (error) {
    console.error(
      "❌ Error during login:",
      error.response?.data || error.message
    );
    throw new Error("Error during login");
  }
};

// ✅ Logout (Clear session/cookie)
export const logout = async () => {
  try {
    const response = await api.post("/logout", {}, { withCredentials: true });
    return response.data.message; // Assuming response contains a success message
  } catch (error) {
    console.error(
      "❌ Error during logout:",
      error.response?.data || error.message
    );
    throw new Error("Error during logout");
  }
};

export default api;
