import axios from "axios";
import { fetchBookingById } from "./UserAPI/BookingAPI.js";
import { fetchCustomerById } from "./UserAPI/CustomerAPI.js";
import { fetchPhotoPackageById } from "./UserAPI/PackageAPI.js";

const API_URL = "http://localhost:5000/payment";

const isValidObjectId = (id) => {
  return typeof id === "string" && id.length === 24;
};

export const getPaymentWithDetails = async (paymentId) => {
  try {
    const paymentResponse = await axios.get(`${API_URL}/${paymentId}`);
    const payment = paymentResponse.data;

    console.log("Booking ID:", payment.bookingId);
    console.log("Customer ID:", payment.customerId);
    console.log("Package ID:", payment.packageId);

    const bookingId = payment.bookingId._id || payment.bookingId;
    const customerId = payment.customerId._id || payment.customerId;
    const packageId = payment.packageId._id || payment.packageId;

    if (!isValidObjectId(bookingId)) {
      throw new Error("Invalid booking ID format");
    }
    if (!isValidObjectId(customerId)) {
      throw new Error("Invalid customer ID format");
    }
    if (!isValidObjectId(packageId)) {
      throw new Error("Invalid package ID format");
    }

    const bookingDetails = await fetchBookingById(bookingId);
    const customerDetails = await fetchCustomerById(customerId);
    const packageDetails = await fetchPhotoPackageById(packageId);

    return {
      payment,
      bookingDetails,
      customerDetails,
      packageDetails,
    };
  } catch (error) {
    console.error(
      "Error fetching payment with related details:",
      error.message
    );
    throw new Error("Error fetching payment with related details");
  }
};

export const fetchAllPayments = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching payments:",
      error.response?.data?.message || error.message
    );
    throw new Error("Error fetching payments");
  }
};

export const updatePaymentStatus = async (paymentId, status) => {
  try {
    const response = await axios.put(`${API_URL}/${paymentId}`, {
      paymentStatus: status,
    });
    return response.data;
  } catch (error) {
    console.error(
      "Error updating payment status:",
      error.response?.data?.message || error.message
    );
    throw new Error("Error updating payment status");
  }
};
