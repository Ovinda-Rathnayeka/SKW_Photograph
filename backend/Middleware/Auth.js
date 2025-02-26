import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import Customer from "../Models/CustomerModel.js";

// Signup (Register Customer)
const signup = async (req, res) => {
  try {
    const { name, nic, phone, email, password } = req.body;

    // Check if email already exists
    const existingCustomer = await Customer.findOne({ email });
    if (existingCustomer) {
      return res.status(400).json({ message: "Email already in use" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new customer
    const newCustomer = new Customer({
      name,
      nic,
      phone,
      email,
      password: hashedPassword,
    });
    await newCustomer.save();

    res
      .status(201)
      .json({
        message: "Customer registered successfully",
        customer: newCustomer,
      });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find customer by email
    const customer = await Customer.findOne({ email });
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    // Compare passwords
    const isPasswordValid = await bcrypt.compare(password, customer.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign({ id: customer._id }, "your_jwt_secret", {
      expiresIn: "1h",
    });

    // Store customerId in cookie
    res.cookie("customerId", customer._id, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 3600000, // 1 hour
    });

    res.status(200).json({ message: "Login successful", token, customer });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Logout (Clear Cookie)
const logout = (req, res) => {
  res.clearCookie("customerId");
  res.status(200).json({ message: "Logout successful" });
};

// Verify Token (middleware)
const verifyToken = (req, res, next) => {
  const token =
    req.cookies.customerId || req.headers["authorization"]?.split(" ")[1];

  if (!token) {
    return res
      .status(403)
      .json({ message: "Token is required for authentication" });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, "your_jwt_secret");
    req.customerId = decoded.id; // Attach customer ID to request for further use
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

// Export functions
export { signup, login, logout, verifyToken };
