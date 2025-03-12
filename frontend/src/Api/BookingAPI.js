import axios from "axios";
<<<<<<< Updated upstream
import mongoose from "mongoose";
=======
import mongoose from "mongoose"; 
>>>>>>> Stashed changes

const api = axios.create({
  baseURL: "http://localhost:5000/booking",
});

<<<<<<< Updated upstream
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);
export const createBooking = async (bookingData) => {
  try {
    console.log("Creating booking with data:", bookingData);

=======

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);


export const createBooking = async (bookingData) => {
  try {
    console.log("📦 Creating booking with data:", bookingData);
>>>>>>> Stashed changes
    const response = await api.post("/", bookingData, {
      headers: {
        "Content-Type": "application/json",
      },
    });
<<<<<<< Updated upstream

    console.log("Booking created successfully:", response.data);

    return response.data;
  } catch (error) {
    console.error(
      "Error creating booking:",
=======
    console.log("✅ Booking created successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "❌ Error creating booking:",
>>>>>>> Stashed changes
      error.response?.data || error.message
    );
    throw new Error(error.response?.data?.message || "Error creating booking");
  }
};

<<<<<<< Updated upstream
export const fetchAllBookings = async () => {
  try {
    console.log("Fetching all bookings...");
    const response = await api.get("/");
    console.log("Fetched bookings:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching bookings:", error.message);
=======

export const fetchAllBookings = async () => {
  try {
    console.log("📦 Fetching all bookings...");
    const response = await api.get("/");
    console.log("✅ Fetched bookings:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Error fetching bookings:", error.message);
>>>>>>> Stashed changes
    throw new Error("Error fetching bookings");
  }
};

<<<<<<< Updated upstream
export const fetchBookingById = async (bookingId) => {
  if (!isValidObjectId(bookingId)) {
    console.error("Invalid booking ID format:", bookingId);
=======

export const fetchBookingById = async (bookingId) => {
  if (!isValidObjectId(bookingId)) {
    console.error("❌ Invalid booking ID format:", bookingId);
>>>>>>> Stashed changes
    throw new Error("Invalid booking ID format");
  }

  try {
<<<<<<< Updated upstream
    console.log("Fetching booking with ID:", bookingId);
    const response = await api.get(`/${bookingId}`);

    if (!response.data) {
      console.warn("Booking data is missing for ID:", bookingId);
      return null;
    }

    console.log("Booking Data:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching booking:",
=======
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
>>>>>>> Stashed changes
      error.response?.data || error.message
    );
    throw new Error("Error fetching booking");
  }
};

<<<<<<< Updated upstream
export const updateBooking = async (bookingId, updatedData) => {
  if (!isValidObjectId(bookingId)) {
    console.error("Invalid booking ID format:", bookingId);
=======

export const updateBooking = async (bookingId, updatedData) => {
  if (!isValidObjectId(bookingId)) {
    console.error("❌ Invalid booking ID format:", bookingId);
>>>>>>> Stashed changes
    throw new Error("Invalid booking ID format");
  }

  try {
<<<<<<< Updated upstream
    console.log("Updating booking:", bookingId, updatedData);
=======
    console.log("✏️ Updating booking:", bookingId, updatedData);
>>>>>>> Stashed changes
    const response = await api.put(`/${bookingId}`, updatedData, {
      headers: {
        "Content-Type": "application/json",
      },
    });
<<<<<<< Updated upstream
    console.log("Booking updated successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "Error updating booking:",
=======
    console.log("✅ Booking updated successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "❌ Error updating booking:",
>>>>>>> Stashed changes
      error.response?.data || error.message
    );
    throw new Error("Error updating booking");
  }
};

export const deleteBooking = async (bookingId) => {
  if (!isValidObjectId(bookingId)) {
<<<<<<< Updated upstream
    console.error("Invalid booking ID format:", bookingId);
=======
    console.error("❌ Invalid booking ID format:", bookingId);
>>>>>>> Stashed changes
    throw new Error("Invalid booking ID format");
  }

  try {
<<<<<<< Updated upstream
    console.log("Deleting booking with ID:", bookingId);
    const response = await api.delete(`/${bookingId}`);
    console.log("Booking deleted successfully:", response.data.message);
    return response.data.message;
  } catch (error) {
    console.error(
      "Error deleting booking:",
=======
    console.log("🗑️ Deleting booking with ID:", bookingId);
    const response = await api.delete(`/${bookingId}`);
    console.log("✅ Booking deleted successfully:", response.data.message);
    return response.data.message;
  } catch (error) {
    console.error(
      "❌ Error deleting booking:",
>>>>>>> Stashed changes
      error.response?.data || error.message
    );
    throw new Error("Error deleting booking");
  }
};
