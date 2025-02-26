import Booking from "../Models/BookingModel.js";
import Customer from "../Models/CustomerModel.js";
import PhotoPackage from "../Models/PackageModel.js";
import mongoose from "mongoose";

// ✅ Function to validate MongoDB ObjectId
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// ✅ CREATE NEW BOOKING
export const createBooking = async (req, res) => {
  const { customerId, packageId, totalPrice, additionalNotes } = req.body;

  try {
    // Validate ObjectId format
    if (!isValidObjectId(customerId) || !isValidObjectId(packageId)) {
      return res
        .status(400)
        .json({ message: "Invalid ObjectId format for customer or package" });
    }

    // Check if the customer exists
    const customer = await Customer.findById(customerId);
    if (!customer)
      return res.status(404).json({ message: "Customer not found" });

    // Check if the package exists
    const photoPackage = await PhotoPackage.findById(packageId);
    if (!photoPackage)
      return res.status(404).json({ message: "Photo package not found" });

    // Create new booking
    const newBooking = new Booking({
      customerId,
      packageId,
      totalPrice,
      additionalNotes,
    });
    await newBooking.save();

    // Populate customer & package details in response
    const populatedBooking = await newBooking.populate([
      "customerId",
      "packageId",
    ]);

    res.status(201).json({
      message: "🎉 Booking created successfully!",
      booking: populatedBooking,
    });
  } catch (error) {
    console.error("❌ Error creating booking:", error);
    res
      .status(500)
      .json({ message: "Error creating booking", error: error.message });
  }
};

// ✅ GET ALL BOOKINGS
export const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("customerId", "name email phone")
      .populate("packageId", "packageName price");

    res.status(200).json(bookings);
  } catch (error) {
    console.error("❌ Error fetching bookings:", error);
    res
      .status(500)
      .json({ message: "Error fetching bookings", error: error.message });
  }
};

// ✅ GET A SINGLE BOOKING BY ID
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
    console.error("❌ Error fetching booking:", error);
    res
      .status(500)
      .json({ message: "Error fetching booking", error: error.message });
  }
};

// ✅ UPDATE A BOOKING
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
      message: "✅ Booking updated successfully!",
      booking: updatedBooking,
    });
  } catch (error) {
    console.error("❌ Error updating booking:", error);
    res
      .status(500)
      .json({ message: "Error updating booking", error: error.message });
  }
};

// ✅ DELETE A BOOKING
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

    res.status(200).json({ message: "🗑️ Booking deleted successfully!" });
  } catch (error) {
    console.error("❌ Error deleting booking:", error);
    res
      .status(500)
      .json({ message: "Error deleting booking", error: error.message });
  }
};
