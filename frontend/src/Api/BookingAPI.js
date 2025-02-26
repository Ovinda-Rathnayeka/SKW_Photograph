import axios from "axios";
import mongoose from "mongoose"; // Ensure ObjectId validation

const api = axios.create({
  baseURL: "http://localhost:5000/booking",
});

// ✅ Function to check if an ID is a valid MongoDB ObjectId
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// ✅ CREATE NEW BOOKING
export const createBooking = async (bookingData) => {
  try {
    console.log("📦 Creating booking with data:", bookingData);
    const response = await api.post("/", bookingData, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    console.log("✅ Booking created successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "❌ Error creating booking:",
      error.response?.data || error.message
    );
    throw new Error(error.response?.data?.message || "Error creating booking");
  }
};

// ✅ FETCH ALL BOOKINGS
export const fetchAllBookings = async () => {
  try {
    console.log("📦 Fetching all bookings...");
    const response = await api.get("/");
    console.log("✅ Fetched bookings:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Error fetching bookings:", error.message);
    throw new Error("Error fetching bookings");
  }
};

// ✅ FETCH BOOKING BY ID (Ensuring it's a valid ObjectId)
export const fetchBookingById = async (bookingId) => {
  if (!isValidObjectId(bookingId)) {
    console.error("❌ Invalid booking ID format:", bookingId);
    throw new Error("Invalid booking ID format");
  }

  try {
    console.log("🔍 Fetching booking with ID:", bookingId);
    const response = await api.get(`/${bookingId}`);

    if (!response.data) {
      console.warn("⚠️ Booking data is missing for ID:", bookingId);
      return null;
    }

    console.log("✅ Booking Data:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "❌ Error fetching booking:",
      error.response?.data || error.message
    );
    throw new Error("Error fetching booking");
  }
};

// ✅ UPDATE BOOKING (Ensuring valid ObjectId)
export const updateBooking = async (bookingId, updatedData) => {
  if (!isValidObjectId(bookingId)) {
    console.error("❌ Invalid booking ID format:", bookingId);
    throw new Error("Invalid booking ID format");
  }

  try {
    console.log("✏️ Updating booking:", bookingId, updatedData);
    const response = await api.put(`/${bookingId}`, updatedData, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    console.log("✅ Booking updated successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "❌ Error updating booking:",
      error.response?.data || error.message
    );
    throw new Error("Error updating booking");
  }
};

// ✅ DELETE BOOKING (Ensuring valid ObjectId)
export const deleteBooking = async (bookingId) => {
  if (!isValidObjectId(bookingId)) {
    console.error("❌ Invalid booking ID format:", bookingId);
    throw new Error("Invalid booking ID format");
  }

  try {
    console.log("🗑️ Deleting booking with ID:", bookingId);
    const response = await api.delete(`/${bookingId}`);
    console.log("✅ Booking deleted successfully:", response.data.message);
    return response.data.message;
  } catch (error) {
    console.error(
      "❌ Error deleting booking:",
      error.response?.data || error.message
    );
    throw new Error("Error deleting booking");
  }
};
