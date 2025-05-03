import Payment from "../Models/PaymentModel.js"; // ✅ Changed
import Cart from "../Models/CartModel.js";
import Customer from "../Models/CustomerModel.js";
import cloudinary from "../Middleware/CloudinaryConfig.js";
import nodemailer from "nodemailer";
import Product from "../Models/ProductModel.js"; // ✅ Already imported

const generateTransactionId = () => `TRCART${Math.floor(Math.random() * 1000000)}`;

// Create cart payment
export const createCartPayment = async (req, res) => {
  const { customerId, address, totalAmount, paymentMethod } = req.body;

  try {
    const cartItems = await Cart.find({ customerId });
    if (cartItems.length === 0) {
      return res.status(400).json({ message: "No items found in cart." });
    }

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

    const newPayment = new Payment({
      customerId,
      cartItems: cartData,
      totalAmount,
      address,
      paymentMethod,
      proofImageUrl,
      transactionId: generateTransactionId(),
      paymentStatus: "Pending",
      isCartPayment: true, // ✅ Important to identify cart payments
    });

    await newPayment.save();
    await Cart.deleteMany({ customerId });

    res.status(201).json({ message: "Payment successful", newPayment });
  } catch (error) {
    console.error("Error processing cart payment:", error);
    res.status(500).json({ message: "Error processing cart payment", error });
  }
};

// Get all cart payments
export const getAllCartPayments = async (req, res) => {
  try {
    const payments = await Payment.find({ isCartPayment: true }) // ✅ Only cart payments
      .populate("customerId")
      .populate("cartItems.productId");

    res.status(200).json(payments);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch cart payments", error });
  }
};

// Update payment status (Accept or Deny) + Send email
export const updateCartPaymentStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  console.log(`Updating order ID: ${id} to status: ${status}`);

  if (!["Accepted", "Denied"].includes(status)) {
    return res.status(400).json({ message: "Invalid status value" });
  }

  try {
    const updated = await Payment.findByIdAndUpdate(
      id,
      { paymentStatus: status === "Accepted" ? "Completed" : "Failed" },
      { new: true }
    ).populate("customerId").populate("cartItems.productId");

    if (!updated) {
      return res.status(404).json({ message: "Order not found" });
    }

    // ✅ Decrease product quantity only when accepted
    if (status === "Accepted") {
      for (const item of updated.cartItems) {
        const product = await Product.findById(item.productId);
        if (product) {
          product.quantity = Math.max(0, product.quantity - item.quantity);
          await product.save();
        }
      }
    }

    const customer = updated.customerId;
    if (!customer || !customer.email) {
      return res.status(400).json({ message: "Customer email not found" });
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const subject = `Your Order Has Been ${status}`;

    const htmlContent = `
      <div style="background-color:#000000;padding:30px 20px;font-family:'Segoe UI',sans-serif;color:#ffffff;">
        <div style="max-width:600px;margin:0 auto;background-color:#1a1a1a;border-radius:12px;padding:30px;border:1px solid #ffa500;">
          <h2 style="color:#ffa500;text-align:center;">Order ${status}</h2>
          <p style="font-size:16px;">Hi <strong>${customer.name || "Customer"}</strong>,</p>
          <p style="font-size:15px;line-height:1.6;">
            Your order with <strong style="color:#ffa500;">Transaction ID: ${updated.transactionId}</strong> has been 
            <strong style="color:#ffa500;">${status}</strong>.
          </p>
          <p style="font-size:15px;line-height:1.6;">
            We truly appreciate your trust in our service.
          </p>
          <div style="margin-top:30px;">
            <p style="font-size:14px;color:#aaa;">Best regards,</p>
            <p style="font-size:15px;font-weight:bold;color:#fff;">SKW Photography Team</p>
          </div>
        </div>
        <p style="text-align:center;margin-top:30px;font-size:12px;color:#777;">© 2024 SKW Photography. All rights reserved.</p>
      </div>
    `;

    await transporter.sendMail({
      from: `"SKW Photography" <${process.env.EMAIL_USER}>`,
      to: customer.email,
      subject,
      html: htmlContent,
    });

    res.json({ message: `Order ${status.toLowerCase()} and email sent successfully.` });
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({ message: "Failed to update order status", error });
  }
};
