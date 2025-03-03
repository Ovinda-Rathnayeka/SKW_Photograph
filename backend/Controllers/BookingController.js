import Booking from "../Models/BookingModel.js";
import Customer from "../Models/CustomerModel.js";
import PhotoPackage from "../Models/PackageModel.js";
import mongoose from "mongoose";

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

export const createBooking = async (req, res) => {
  const {
    customerId,
    packageId,
    bookingDate,
    bookingTime,
    totalPrice,
    additionalNotes,
  } = req.body;

  try {
    if (!isValidObjectId(customerId) || !isValidObjectId(packageId)) {
      return res
        .status(400)
        .json({ message: "Invalid ObjectId format for customer or package" });
    }

    const customer = await Customer.findById(customerId);
    if (!customer)
      return res.status(404).json({ message: "Customer not found" });

    const photoPackage = await PhotoPackage.findById(packageId);
    if (!photoPackage)
      return res.status(404).json({ message: "Photo package not found" });

    const newBooking = new Booking({
      customerId,
      packageId,
      bookingDate,
      bookingTime,
      totalPrice,
      additionalNotes,
    });
    await newBooking.save();

    const populatedBooking = await newBooking.populate([
      "customerId",
      "packageId",
    ]);

    res.status(201).json({
      message: "Booking created successfully!",
      booking: populatedBooking,
    });
  } catch (error) {
    console.error("Error creating booking:", error);
    res
      .status(500)
      .json({ message: "Error creating booking", error: error.message });
  }
};

export const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("customerId", "name email phone")
      .populate("packageId", "packageName price");

    res.status(200).json(bookings);
  } catch (error) {
    console.error("Error fetching bookings:", error);
    res
      .status(500)
      .json({ message: "Error fetching bookings", error: error.message });
  }
};

export const getBookingById = async (req, res) => {
  const { id } = req.params;

  try {
    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid booking ID format" });
    }

    const booking = await Booking.findById(id)
      .populate("customerId", "name email phone")
      .populate("packageId", "packageName price");

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.status(200).json(booking);
  } catch (error) {
    console.error("Error fetching booking:", error);
    res
      .status(500)
      .json({ message: "Error fetching booking", error: error.message });
  }
};

export const updateBooking = async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  try {
    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid booking ID format" });
    }

    const updatedBooking = await Booking.findByIdAndUpdate(id, updateData, {
      new: true,
    }).populate("customerId packageId");

    if (!updatedBooking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.status(200).json({
      message: "Booking updated successfully!",
      booking: updatedBooking,
    });
  } catch (error) {
    console.error("Error updating booking:", error);
    res
      .status(500)
      .json({ message: "Error updating booking", error: error.message });
  }
};

export const deleteBooking = async (req, res) => {
  const { id } = req.params;

  try {
    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid booking ID format" });
    }

    const deletedBooking = await Booking.findByIdAndDelete(id);

    if (!deletedBooking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.status(200).json({ message: "Booking deleted successfully!" });
  } catch (error) {
    console.error("Error deleting booking:", error);
    res
      .status(500)
      .json({ message: "Error deleting booking", error: error.message });
  }
};
