import axios from "axios";

const API_URL = "http://localhost:5000/customer";

export const updateUserProfile = async (id, user) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, user);
    console.log(`This is response ${response}`);
    return response.data;
  } catch (error) {
    console.error(
      "Error updating user details:",
      error.response?.data || error.message
    );
    console.log(error)
    throw new Error(
      error.response?.data?.message || "Error updating user details"
    );
  }
};
  