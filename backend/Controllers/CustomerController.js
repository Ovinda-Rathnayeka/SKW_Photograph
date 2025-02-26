import bcrypt from "bcryptjs"; // Import bcrypt
import Customer from "../Models/CustomerModel.js";

// Create (Insert) Customer
const createCustomer = async (req, res) => {
  try {
    const { name, email, password, phone, nic, address } = req.body;

    // Hash password before saving it
    const hashedPassword = await bcrypt.hash(password, 10); // 10 is the salt rounds

    const newCustomer = new Customer({
      name,
      email,
      password: hashedPassword, // Store hashed password
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

// Get All Customers
const getAllCustomers = async (req, res) => {
  try {
    const customers = await Customer.find();
    res.status(200).json(customers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get Customer by ID
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

// Update Customer
const updateCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    const { password } = req.body;

    // If password is being updated, hash it before saving
    if (password) {
      req.body.password = await bcrypt.hash(password, 10); // Hash new password
    }

    const updatedCustomer = await Customer.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (!updatedCustomer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    res.status(200).json({
      message: "Customer updated successfully",
      customer: updatedCustomer,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete Customer (Soft Delete)
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

// Export all functions
export {
  createCustomer,
  getAllCustomers,
  getCustomerById,
  updateCustomer,
  deleteCustomer,
};
