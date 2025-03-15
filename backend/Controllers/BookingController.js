import Booking from "../Models/BookingModel.js";
import Customer from "../Models/CustomerModel.js";
import PhotoPackage from "../Models/PackageModel.js";
import mongoose from "mongoose";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

export const createBooking = async (req, res) => {
  const {
    customerId,
    packageId,
    bookingDate,
    bookingTime,
    totalPrice,
    additionalNotes,
    email,
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

    const savedBooking = await newBooking.save();
    const populatedBooking = await savedBooking.populate([
      "customerId",
      "packageId",
    ]);

    await sendBookingReviwEmail(email, populatedBooking);

    res.status(201).json({
      message: "Booking created successfully! Confirmation email sent.",
      booking: populatedBooking,
    });
  } catch (error) {
    console.error("Error creating booking:", error);
    res
      .status(500)
      .json({ message: "Error creating booking", error: error.message });
  }
};

const sendBookingReviwEmail = async (email, booking) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "📸 Your Booking is Under Review",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 10px; overflow: hidden;">
          
          <!-- Header Image -->
          <div style="text-align: center; background-color: #000;">
            <img src="https://i.pinimg.com/736x/2d/5a/0b/2d5a0b7d1be84bcf932f40f53402259b.jpg" 
                 alt="Photography Banner" 
                 style="width: 100%; max-height: 200px; object-fit: cover;">
          </div>
    
          <!-- Booking Review Message -->
          <div style="padding: 20px; background-color: #f9f9f9; text-align: center;">
            <h2 style="color: #333;">📷 Your Booking is Under Review</h2>
            <p style="font-size: 16px; color: #666;">
              Thank you for booking with us! Our team is currently reviewing your request.  
              You will receive an update once your booking is confirmed.
            </p>
    
            <div style="background-color: #fff; padding: 15px; border-radius: 8px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
              <ul style="list-style: none; padding: 0; text-align: left; font-size: 16px; color: #444;">
                <li><strong>📅 Date:</strong> ${booking.bookingDate}</li>
                <li><strong>⏰ Time:</strong> ${booking.bookingTime}</li>
                <li><strong>🎨 Package:</strong> ${
                  booking.packageId.packageName
                }</li>
                <li><strong>💰 Total Price:</strong> $${booking.totalPrice}</li>
                <li><strong>📝 Add-ons:</strong> ${
                  booking.additionalNotes || "None"
                }</li>
              </ul>
            </div>
    
            <p style="margin-top: 20px; font-size: 14px; color: #666;">
              If you have any questions, feel free to reach out. We will notify you via email once your booking is confirmed.
            </p>
    
            <!-- CTA Button -->
            <a href="#" style="display: inline-block; background-color: #000; color: #fff; text-decoration: none; padding: 12px 24px; border-radius: 5px; margin-top: 15px; font-size: 16px;">Check Booking Status</a>
          </div>
    
          <!-- Footer -->
          <div style="text-align: center; padding: 10px; background-color: #000; color: #fff; font-size: 14px;">
            <p>📷 Your Photography Team</p>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Booking review email sent to ${email}`);
  } catch (error) {
    console.error("Error sending email:", error.message);
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
export const updateBookingStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  // Check if status is valid
  if (!["Pending", "Confirmed", "Cancelled"].includes(status)) {
    return res.status(400).json({
      message:
        "Invalid status. Valid statuses are: Pending, Confirmed, Cancelled.",
    });
  }

  try {
    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid booking ID format" });
    }

    // Update the booking status
    const updatedBooking = await Booking.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    )
      .populate("customerId", "name email phone")
      .populate("packageId", "packageName price");

    if (!updatedBooking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Send confirmation email if booking is confirmed
    if (status === "Confirmed") {
      await sendBookingConfirmedEmail(
        updatedBooking.customerId.email,
        updatedBooking
      );
    }

    // Send cancellation email if booking is cancelled
    if (status === "Cancelled") {
      await sendBookingCancelledEmail(
        updatedBooking.customerId.email,
        updatedBooking
      );
    }

    res.status(200).json({
      message: `Booking status updated to ${status}!`,
      booking: updatedBooking,
    });
  } catch (error) {
    console.error("Error updating booking status:", error);
    res
      .status(500)
      .json({ message: "Error updating booking status", error: error.message });
  }
};
const sendBookingCancelledEmail = async (email, booking) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "📸 Your Booking has been Cancelled",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 10px; overflow: hidden;">
          
          <!-- Header Image -->
          <div style="text-align: center; background-color: #000;">
            <img src="https://i.pinimg.com/736x/2d/5a/0b/2d5a0b7d1be84bcf932f40f53402259b.jpg" 
                 alt="Photography Banner" 
                 style="width: 100%; max-height: 200px; object-fit: cover;">
          </div>
    
          <!-- Booking Cancellation Message -->
          <div style="padding: 20px; background-color: #f9f9f9; text-align: center;">
            <h2 style="color: #333;">📷 Your Booking Has Been Cancelled</h2>
            <p style="font-size: 16px; color: #666;">
              We regret to inform you that your booking has been cancelled. Below are the details:
            </p>
    
            <div style="background-color: #fff; padding: 15px; border-radius: 8px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
              <ul style="list-style: none; padding: 0; text-align: left; font-size: 16px; color: #444;">
                <li><strong>📅 Date:</strong> ${booking.bookingDate}</li>
                <li><strong>⏰ Time:</strong> ${booking.bookingTime}</li>
                <li><strong>🎨 Package:</strong> ${
                  booking.packageId.packageName
                }</li>
                <li><strong>💰 Total Price:</strong> $${booking.totalPrice}</li>
                <li><strong>📝 Add-ons:</strong> ${
                  booking.additionalNotes || "None"
                }</li>
              </ul>
            </div>
    
            <p style="margin-top: 20px; font-size: 14px; color: #666;">
              If this was a mistake or you need assistance, please contact our team.
            </p>
    
            <!-- CTA Button -->
            <a href="#" style="display: inline-block; background-color: #d9534f; color: #fff; text-decoration: none; padding: 12px 24px; border-radius: 5px; margin-top: 15px; font-size: 16px;">Contact Support</a>
          </div>
    
          <!-- Footer -->
          <div style="text-align: center; padding: 10px; background-color: #000; color: #fff; font-size: 14px;">
            <p>📷 Your Photography Team</p>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Booking cancellation email sent to ${email}`);
  } catch (error) {
    console.error("Error sending cancellation email:", error.message);
  }
};
