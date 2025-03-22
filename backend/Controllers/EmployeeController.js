import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Employee from "../Models/EmployeeModel.js";

// Create a new employee
export const createEmployee = async (req, res) => {
  const { name, nic, phone, address, email, password, jobRole } = req.body;

  try {
    const employeeExists = await Employee.findOne({
      $or: [{ email }, { nic }],
    });

    if (employeeExists) {
      return res
        .status(400)
        .json({ message: "Employee with this email or NIC already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newEmployee = new Employee({
      name,
      nic,
      phone,
      address,
      email,
      password: hashedPassword,
      jobRole,
    });

    await newEmployee.save();

    res.status(201).json({
      message: "Employee created successfully",
      employee: {
        name: newEmployee.name,
        nic: newEmployee.nic,
        phone: newEmployee.phone,
        address: newEmployee.address,
        email: newEmployee.email,
        jobRole: newEmployee.jobRole,
      },
    });
  } catch (error) {
    console.error("Error creating employee:", error);
    res.status(500).json({ message: "Server error, please try again later." });
  }
};

// Get all employees
export const getEmployees = async (req, res) => {
  try {
    const employees = await Employee.find();
    res.status(200).json(employees);
  } catch (error) {
    console.error("Error fetching employees:", error);
    res.status(500).json({ message: "Server error, please try again later." });
  }
};

// Get employee by ID
export const getEmployeeById = async (req, res) => {
  const { id } = req.params;

  try {
    const employee = await Employee.findById(id);

    if (!employee) {
      return res.status(404).json({ message: "Employee not found." });
    }

    res.status(200).json(employee);
  } catch (error) {
    console.error("Error fetching employee:", error);
    res.status(500).json({ message: "Server error, please try again later." });
  }
};

// Update an employee
export const updateEmployee = async (req, res) => {
  const { id } = req.params;
  const { name, nic, phone, address, email, jobRole } = req.body;

  try {
    const updatedEmployee = await Employee.findByIdAndUpdate(
      id,
      {
        name,
        nic,
        phone,
        address,
        email,
        jobRole,
      },
      { new: true }
    );

    if (!updatedEmployee) {
      return res.status(404).json({ message: "Employee not found." });
    }

    res.status(200).json({
      message: "Employee updated successfully",
      employee: updatedEmployee,
    });
  } catch (error) {
    console.error("Error updating employee:", error);
    res.status(500).json({ message: "Server error, please try again later." });
  }
};

// Delete an employee
export const deleteEmployee = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedEmployee = await Employee.findByIdAndDelete(id);

    if (!deletedEmployee) {
      return res.status(404).json({ message: "Employee not found." });
    }

    res.status(200).json({ message: "Employee deleted successfully" });
  } catch (error) {
    console.error("Error deleting employee:", error);
    res.status(500).json({ message: "Server error, please try again later." });
  }
};

// Login an employee
export const loginEmployee = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find employee by email
    const employee = await Employee.findOne({ email });

    if (!employee) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Check if the entered password matches the hashed password in the database
    const isMatch = await bcrypt.compare(password, employee.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate a JWT token
    const token = jwt.sign(
      { id: employee._id, role: employee.jobRole }, // Payload containing employee ID and role
      process.env.JWT_SECRET, // JWT secret (make sure it's in your .env file)
      { expiresIn: "1h" } // Token expires in 1 hour
    );

    res.status(200).json({
      message: "Login successful",
      token,
      employee: {
        name: employee.name,
        nic: employee.nic,
        email: employee.email,
        jobRole: employee.jobRole,
      },
    });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Server error, please try again later." });
  }
};
