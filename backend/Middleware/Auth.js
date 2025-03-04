import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import Customer from "../Models/CustomerModel.js";
import cookieParser from "cookie-parser";
import express from "express";
import nodemailer from "nodemailer";

dotenv.config();

const jwtSecret = process.env.JWT_SECRET;

const app = express();
app.use(express.json());
app.use(cookieParser());

const sendOTP = async (email, otp) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const logoUrl = "https://files.fm/f/eub8uwhnfq";

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "🔐 SKW Photography - Login OTP",
    html: `
      <div style="background: linear-gradient(to right, #0D1117, #161B22); padding: 40px; text-align: center; font-family: Arial, sans-serif; color: white;">
        
        <!-- Logo -->
        <div style="margin-bottom: 20px;">
          <img src="https://i.pinimg.com/736x/2d/5a/0b/2d5a0b7d1be84bcf932f40f53402259b.jpg" 
               alt="SKW Photography Logo" 
               width="120" 
               style="border-radius: 10px; box-shadow: 0 0 10px rgba(255, 215, 0, 0.5);">
        </div>
  
        <!-- OTP Container -->
        <div style="background: #1E252F; padding: 25px; border-radius: 12px; display: inline-block; max-width: 450px; box-shadow: 0 4px 8px rgba(0,0,0,0.2);">
          <h2 style="color: #E66A4E; margin-bottom: 12px;">🔑 Your Secure Login Code</h2>
          <p style="font-size: 18px; color: #B0B3B8;">Enter this OTP to access your account:</p>
          
          <p style="font-size: 28px; font-weight: bold; color: #FFD700; background: #333; padding: 12px 20px; display: inline-block; border-radius: 6px; letter-spacing: 3px;">
            ${otp}
          </p>
  
          <p style="font-size: 14px; color: #B0B3B8; margin-top: 15px;">
            ⚠️ This code will expire in <strong>5 minutes</strong>. Do not share it with anyone.
          </p>
        </div>
  
        <!-- Footer -->
        <p style="margin-top: 25px; font-size: 14px; color: #888;">
          If you did not request this OTP, please ignore this email.
        </p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending OTP email:", error);
    throw new Error("Failed to send OTP");
  }
};

const signup = async (req, res) => {
  try {
    const { name, nic, phone, email, password } = req.body;

    const existingCustomer = await Customer.findOne({ email });
    if (existingCustomer) {
      return res.status(400).json({ message: "Email already in use" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newCustomer = new Customer({
      name,
      nic,
      phone,
      email,
      password: hashedPassword,
    });

    await newCustomer.save();

    res.status(201).json({
      message: "Customer registered successfully",
      customer: newCustomer,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const customer = await Customer.findOne({ email });
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, customer.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    customer.otp = otp;
    customer.otpExpiration = Date.now() + 5 * 60 * 1000;
    await customer.save();

    await sendOTP(email, otp);

    res.status(200).json({ message: "OTP sent to email. Please verify." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const customer = await Customer.findOne({ email });
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    if (customer.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    if (Date.now() > customer.otpExpiration) {
      return res.status(400).json({ message: "OTP expired" });
    }

    const token = jwt.sign({ id: customer._id }, jwtSecret, {
      expiresIn: "1h",
    });

    customer.otpVerified = true;
    await customer.save();

    res.cookie("authToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Lax",
      maxAge: 3600000,
    });

    res.status(200).json({ message: "OTP verified. Login successful", token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const logout = (req, res) => {
  res.clearCookie("authToken");
  res.status(200).json({ message: "Logout successful" });
};

const verifyToken = (req, res, next) => {
  try {
    const token =
      req.cookies?.authToken || req.headers["authorization"]?.split(" ")[1];

    if (!token) {
      return res
        .status(403)
        .json({ message: "Token is required for authentication" });
    }

    const decoded = jwt.verify(token, jwtSecret);
    req.customerId = decoded.id;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

const profile = async (req, res) => {
  try {
    const customer = await Customer.findById(req.customerId).select(
      "-password"
    );
    if (!customer) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(customer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export default {
  signup,
  login,
  verifyOTP,
  logout,
  verifyToken,
  profile,
  sendOTP,
};
