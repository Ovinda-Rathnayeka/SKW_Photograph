import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import Customer from "../Models/CustomerModel.js";
import cookieParser from "cookie-parser";
import express from "express";

dotenv.config();

const jwtSecret = process.env.JWT_SECRET;

const app = express();
app.use(express.json());
app.use(cookieParser());

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

    const token = jwt.sign({ id: customer._id }, jwtSecret, {
      expiresIn: "1h",
    });

    res.cookie("authToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Lax",
      maxAge: 3600000,
    });

    res.status(200).json({ message: "Login successful", token, customer });
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

const getProfile = async (req, res) => {
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

export { signup, login, logout, verifyToken, getProfile };
