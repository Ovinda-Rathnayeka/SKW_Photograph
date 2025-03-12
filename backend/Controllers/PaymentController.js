import mongoose from "mongoose";
import Payment from "../Models/PaymentModel.js";
import Booking from "../Models/BookingModel.js";
import Customer from "../Models/CustomerModel.js";
import PhotoPackage from "../Models/PackageModel.js";
import cloudinary from "../Middleware/CloudinaryConfig.js";
import nodemailer from "nodemailer";

const generateTransactionId = () => {
  return `TR${Math.floor(Math.random() * 1000000)}`;
};

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

const createPayment = async (req, res) => {
  const {
    bookingId,
    amount,
    halfPaymentAmount,
    customerId,
    packageId,
    paymentMethod,
    paymentType,
  } = req.body;

  try {
    if (
      !isValidObjectId(bookingId) ||
      !isValidObjectId(customerId) ||
      !isValidObjectId(packageId)
    ) {
      return res.status(400).json({
        message: "Invalid ObjectId format for booking, customer, or package",
      });
    }

    let toPayAmount = 0;
    if (paymentType === "half") {
      if (
        !halfPaymentAmount ||
        halfPaymentAmount <= 0 ||
        halfPaymentAmount > amount
      ) {
        return res.status(400).json({ message: "Invalid half payment amount" });
      }
      toPayAmount = amount - halfPaymentAmount;
    }

    let proofImageUrl = "";
    if (req.file) {
      const cloudinaryResult = await cloudinary.uploader.upload(req.file.path, {
        folder: "skw-photography/payment-proof",
        allowed_formats: ["jpg", "jpeg", "png"],
      });
      proofImageUrl = cloudinaryResult.secure_url;
    }

    const newPayment = new Payment({
      bookingId,
      customerId,
      packageId,
      amount,
      halfPaymentAmount: paymentType === "half" ? halfPaymentAmount : 0,
      toPayAmount,
      paymentMethod,
      paymentType,
      proofImageUrl,
      transactionId: generateTransactionId(),
      paymentStatus: "Pending",
    });

    const savedPayment = await newPayment.save();

    const booking = await Booking.findById(bookingId)
      .populate("customerId")
      .populate("packageId");
    const customer = await Customer.findById(customerId);
    const photoPackage = await PhotoPackage.findById(packageId);

    if (!booking || !customer || !photoPackage) {
      return res
        .status(404)
        .json({ message: "Booking, Customer, or Package not found" });
    }

    await sendPaymentConfirmationEmail(
      customer.email,
      booking,
      photoPackage,
      savedPayment,
      paymentType
    );

    res.status(201).json(savedPayment);
  } catch (error) {
    console.error("Error creating payment:", error);
    res.status(500).json({ message: "Error creating payment", error });
  }
};

const sendPaymentConfirmationEmail = async (
  email,
  booking,
  photoPackage,
  payment,
  paymentType
) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    let paymentDetails = `
      <li><strong>💸 Half Payment:</strong> $${payment.halfPaymentAmount}</li>
      <li><strong>💰 Remaining Amount:</strong> $${payment.toPayAmount}</li>
    `;

    if (paymentType === "full") {
      paymentDetails = `
        <li><strong>💸 Full Payment:</strong> $${booking.totalPrice}</li>
      `;
    }

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "📸 Payment Confirmation - Thank You!",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 10px; overflow: hidden;">
          <!-- Header Image -->
          <div style="text-align: center; background-color: #000;">
            <img src="https://i.pinimg.com/736x/2d/5a/0b/2d5a0b7d1be84bcf932f40f53402259b.jpg" 
                 alt="Photography Banner" 
                 style="width: 100%; max-height: 200px; object-fit: cover;">
          </div>
    
          <!-- Booking, Package, and Payment Details -->
          <div style="padding: 20px; background-color: #f9f9f9; text-align: center;">
            <h2 style="color: #333;">📷 Thank You for Your Payment!</h2>
            <p style="font-size: 16px; color: #666;">We appreciate your trust in us to capture your special moments.</p>
    
            <div style="background-color: #fff; padding: 15px; border-radius: 8px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
              <h3 style="color: #333;">📦 Booking Details:</h3>
              <ul style="list-style: none; padding: 0; text-align: left; font-size: 16px; color: #444;">
                <li><strong>📅 Date:</strong> ${booking.bookingDate}</li>
                <li><strong>⏰ Time:</strong> ${booking.bookingTime}</li>
                <li><strong>🎨 Package:</strong> ${
                  photoPackage.packageName
                }</li>
                <li><strong>💰 Total Price:</strong> $${booking.totalPrice}</li>
                <li><strong>📝 Add-ons:</strong> ${
                  booking.additionalNotes || "None"
                }</li>
              </ul>
    
              <h3 style="color: #333;">💳 Payment Details:</h3>
              <ul style="list-style: none; padding: 0; text-align: left; font-size: 16px; color: #444;">
                ${paymentDetails}
                <li><strong>📈 Transaction ID:</strong> ${
                  payment.transactionId
                }</li>
              </ul>
              <p style="color: red; font-weight: bold;">💡 Finance Manager Review Your Payment</p>
            </div>
    
            <p style="margin-top: 20px; font-size: 14px; color: #666;">
              If you have any questions, feel free to reach out. <br>
              We look forward to capturing your moments!
            </p>
    
            <!-- CTA Button -->
            <a href="#" style="display: inline-block; background-color: #000; color: #fff; text-decoration: none; padding: 12px 24px; border-radius: 5px; margin-top: 15px; font-size: 16px;">View Your Booking</a>
          </div>
    
          <!-- Footer -->
          <div style="text-align: center; padding: 10px; background-color: #000; color: #fff; font-size: 14px;">
            <p>📷 Your Photography Team</p>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Payment confirmation email sent to ${email}`);
  } catch (error) {
    console.error("Error sending email:", error.message);
  }
};

const getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.find().populate("bookingId");
    res.status(200).json(payments);
  } catch (error) {
    console.error("Error fetching payments:", error);
    res.status(500).json({ message: "Error fetching payments", error });
  }
};

const getPaymentById = async (req, res) => {
  const { id } = req.params;
  if (!isValidObjectId(id)) {
    return res.status(400).json({ message: "Invalid payment ID format" });
  }

  try {
    const paymentData = await Payment.findById(id).populate("bookingId");
    if (!paymentData) {
      return res.status(404).json({ message: "Payment not found" });
    }
    res.status(200).json(paymentData);
  } catch (error) {
    console.error("Error fetching payment:", error);
    res.status(500).json({ message: "Error fetching payment", error });
  }
};

const updatePaymentStatus = async (req, res) => {
  const { id } = req.params;

  if (!isValidObjectId(id)) {
    return res.status(400).json({ message: "Invalid payment ID format" });
  }

  try {
    const updatedPayment = await Payment.findByIdAndUpdate(
      id,
      { paymentStatus: req.body.paymentStatus },
      { new: true }
    );
    if (!updatedPayment) {
      return res.status(404).json({ message: "Payment not found" });
    }
    res.status(200).json(updatedPayment);
  } catch (error) {
    console.error("Error updating payment:", error);
    res.status(500).json({ message: "Error updating payment", error });
  }
};

export default {
  createPayment,
  getAllPayments,
  getPaymentById,
  updatePaymentStatus,
};
