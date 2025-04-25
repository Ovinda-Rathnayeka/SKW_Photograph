import bcrypt from "bcryptjs";
import Customer from "../Models/CustomerModel.js";
import sendOTP from "../Middleware/Auth.js";
import { Types } from 'mongoose';

const createCustomer = async (req, res) => {
  try {
    const { name, email, password, phone, nic, address } = req.body;

    const existingCustomer = await Customer.findOne({ email });
    if (existingCustomer) {
      return res.status(400).json({ message: "Email already in use" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newCustomer = new Customer({
      name,
      email,
      password: hashedPassword,
      phone,
      nic,
      address,
    });

    await newCustomer.save();

    res.status(201).json({
      message: "Customer created successfully",
      customer: newCustomer,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const sendOTPForCustomer = async (email) => {
  const customer = await Customer.findOne({ email });
  if (!customer) {
    throw new Error("Customer not found");
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString(); 
  customer.otp = otp;
  customer.otpExpiration = Date.now() + 5 * 60 * 1000; 
  await customer.save();

  await sendOTP(email, otp);
};

const getAllCustomers = async (req, res) => {
  try {
    const customers = await Customer.find();
    res.status(200).json(customers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getCustomerById = async (req, res) => {
  try {
    const { id } = req.params;
    const customer = await Customer.findById(id);

    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    res.status(200).json(customer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id)
  
    const _id = new Types.ObjectId(id.replace(/"/g, ''));
    const updateData = { ...req.body };

    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 10);
    }

    const updatedCustomer = await Customer.findOneAndUpdate(
      { _id },
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedCustomer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    res.status(200).json({
      message: "Customer updated successfully",
      customer: updatedCustomer,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

const deleteCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedCustomer = await Customer.findByIdAndUpdate(
      id,
      { active: false },
      { new: true }
    );

    if (!deletedCustomer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    res.status(200).json({
      message: "Customer deactivated successfully",
      customer: deletedCustomer,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const verifyOTPForCustomer = async (req, res) => {
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
      return res.status(400).json({ message: "OTP has expired" });
    }

    customer.otpVerified = true;
    customer.otp = undefined;
    customer.otpExpiration = undefined;
    await customer.save();

    res.status(200).json({ message: "OTP verified successfully", customer });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export {
  createCustomer,
  getAllCustomers,
  getCustomerById,
  updateCustomer,
  deleteCustomer,
  verifyOTPForCustomer,
};
