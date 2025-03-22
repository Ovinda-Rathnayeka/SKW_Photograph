import CartPayment from "../Models/CartPaymentModel.js";
import Cart from "../Models/CartModel.js";
import cloudinary from "../Middleware/CloudinaryConfig.js";
import nodemailer from "nodemailer";

const generateTransactionId = () => `TRCART${Math.floor(Math.random() * 1000000)}`;

// ✅ Create cart payment (slip optional)
export const createCartPayment = async (req, res) => {
  const { customerId, address, totalAmount, paymentMethod } = req.body;

  try {
    const cartItems = await Cart.find({ customerId });
    if (cartItems.length === 0) {
      return res.status(400).json({ message: "No items found in cart." });
    }

    // ✅ Optional proof image
    let proofImageUrl = "";
    if (req.file) {
      const uploaded = await cloudinary.uploader.upload(req.file.path, {
        folder: "cart-payments",
      });
      proofImageUrl = uploaded.secure_url;
    }

    const cartData = cartItems.map(item => ({
      productId: item.productId,
      quantity: item.quantity,
      price: item.price,
    }));

    const newPayment = new CartPayment({
      customerId,
      cartItems: cartData,
      totalAmount,
      address,
      paymentMethod,
      proofImageUrl,
      transactionId: generateTransactionId(),
      paymentStatus: "Pending",
    });

    await newPayment.save();
    await Cart.deleteMany({ customerId });

    res.status(201).json({ message: "Payment successful", newPayment });
  } catch (error) {
    console.error("Error processing cart payment:", error);
    res.status(500).json({ message: "Error processing cart payment", error });
  }
};

// ✅ Get all cart payments
export const getAllCartPayments = async (req, res) => {
  try {
    const payments = await CartPayment.find()
      .populate("customerId")
      .populate("cartItems.productId");

    res.status(200).json(payments);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch cart payments", error });
  }
};

// ✅ Accept cart payment and send confirmation email
export const acceptCartPayment = async (req, res) => {
  try {
    const payment = await CartPayment.findById(req.params.id).populate("customerId");

    if (!payment) return res.status(404).json({ message: "Order not found" });

    payment.paymentStatus = "Accepted";
    await payment.save();

    const customerEmail = payment.customerId?.email;
    const customerName = payment.customerId?.name || "Customer";

    if (customerEmail) {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: customerEmail,
        subject: "Order Confirmed - SKW Photography",
        html: `
          <h2>Dear ${customerName},</h2>
          <p>Your order totaling <strong>$${payment.totalAmount}</strong> has been <strong>accepted</strong>.</p>
          <p>Thank you for choosing SKW Photography!</p>
        `,
      });
    }

    res.json({ message: "Order accepted and email sent." });
  } catch (err) {
    console.error("Error accepting order:", err);
    res.status(500).json({ message: "Failed to accept order" });
  }
};