// controllers/PaymentController.js
import mongoose from "mongoose";
import Payment from "../Models/PaymentModel.js";
import cloudinary from "../Middleware/CloudinaryConfig.js";
import nodemailer from "nodemailer";

const generateTransactionId = () => {
  return `TR${Math.floor(Math.random() * 1000000)}`;
};

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);


const createRentalPayment = async (req, res) => {
  const { customerId, paymentMethod, cartItems } = req.body;

  try {
    if (!customerId || !cartItems || !Array.isArray(cartItems)) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    let totalAmount = 0;
    cartItems.forEach((item) => {
      totalAmount += item.price * item.quantity;
    });

    let proofImageUrl = "";
    if (req.file) {
      const cloudinaryResult = await cloudinary.uploader.upload(req.file.path, {
        folder: "skw-photography/payment-proof",
        allowed_formats: ["jpg", "jpeg", "png"],
      });
      proofImageUrl = cloudinaryResult.secure_url;
    }

    const newPayment = new Payment({
      customerId,
      cartItems,
      amount: totalAmount,
      paymentMethod,
      transactionId: generateTransactionId(),
      paymentStatus: "Pending",
      isCartPayment: true,
      proofImageUrl,
    });

    const savedPayment = await newPayment.save();
    res.status(201).json(savedPayment);
  } catch (error) {
    console.error("Error creating rental cart payment:", error);
    res
      .status(500)
      .json({ message: "Error creating rental cart payment", error });
  }
};

const updateRentalPaymentStatus = async (req, res) => {
  const { id } = req.params;
  const { paymentStatus } = req.body;

  try {
    const updated = await Payment.findByIdAndUpdate(
      id,
      { paymentStatus },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Payment not found" });
    }

    res.status(200).json(updated);
  } catch (error) {
    console.error("Error updating rental payment status:", error);
    res.status(500).json({ message: "Error updating payment", error });
  }
};

const deleteRentalPayment = async (req, res) => {
  const { id } = req.params;

  try {
    const deleted = await Payment.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: "Payment not found" });
    }

    res.status(200).json({ message: "Rental payment deleted", deleted });
  } catch (error) {
    console.error("Error deleting rental payment:", error);
    res.status(500).json({ message: "Error deleting rental payment", error });
  }
};


const getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.find()
      .populate("bookingId")
      .populate("customerId")
      .populate("packageId")
      .populate("cartItems.rentalId");
    res.status(200).json(payments);
  } catch (error) {
    console.error("Error fetching payments:", error);
    res.status(500).json({ message: "Error fetching payments", error });
  }
};


const getPaymentByUserId = async (req, res) => {
  const { userId } = req.params;

  try {
    const payments = await Payment.find({ customerId: userId })
      .populate("bookingId")
      .populate("packageId")
      .populate("cartItems.rentalId");

    if (!payments.length) {
      return res.status(404).json({ message: "No payments found for user" });
    }

    res.status(200).json(payments);
  } catch (error) {
    console.error("Error fetching user payments:", error);
    res.status(500).json({ message: "Error fetching user payments", error });
  }
};


const getPaymentById = async (req, res) => {
  const { id } = req.params;
  if (!isValidObjectId(id)) {
    return res.status(400).json({ message: "Invalid payment ID format" });
  }

  try {
    const payment = await Payment.findById(id)
      .populate("bookingId")
      .populate("customerId")
      .populate("packageId")
      .populate("cartItems.rentalId");
    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }
    res.status(200).json(payment);
  } catch (error) {
    console.error("Error fetching payment:", error);
    res.status(500).json({ message: "Error fetching payment", error });
  }
};

export default {
  createRentalPayment,
  updateRentalPaymentStatus,
  deleteRentalPayment,
  getAllPayments,
  getPaymentByUserId,
  getPaymentById,
};
