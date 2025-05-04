import Employee from "../Models/EmployeeModel.js";
import bcrypt from "bcryptjs";
import crypto from "crypto";

// POST /employees/login (No JWT token, just login logic without token)
export const loginEmployee = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await Employee.findOne({ email });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: "Invalid credentials" });

    // Since no JWT is being used, simply return the employee data (no token)
    const { password: pw, ...userData } = user.toObject();
    res.json({ user: userData });
  } catch (err) {
    console.error("loginEmployee error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// GET /employees (No authentication required)
export const getAllEmployees = async (req, res) => {
  try {
    const list = await Employee.find().select("-password");
    res.json(list);
  } catch (err) {
    console.error("getAllEmployees error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// GET /employees/:id (No authentication required)
export const getEmployeeById = async (req, res) => {
  try {
    const emp = await Employee.findById(req.params.id).select("-password");
    if (!emp) return res.status(404).json({ message: "Not found" });
    res.json(emp);
  } catch (err) {
    console.error("getEmployeeById error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// POST /employees (No authentication required)
export const createEmployee = async (req, res) => {
  try {
    const { name, nic, phone, address, email, password, jobRole } = req.body;
    if (await Employee.findOne({ $or: [{ nic }, { email }] })) {
      return res.status(400).json({ message: "NIC or email in use" });
    }
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    const emp = new Employee({
      name,
      nic,
      phone,
      address,
      email,
      password: hash,
      jobRole,
    });
    await emp.save();
    const { password: pw, ...data } = emp.toObject();
    res.status(201).json(data);
  } catch (err) {
    console.error("createEmployee error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// PUT /employees/:id (No authentication required)
export const updateEmployee = async (req, res) => {
  try {
    const updates = { ...req.body };
    delete updates.password;
    const updated = await Employee.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    }).select("-password");
    if (!updated) return res.status(404).json({ message: "Not found" });
    res.json(updated);
  } catch (err) {
    console.error("updateEmployee error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// DELETE /employees/:id (No authentication required)
export const deleteEmployee = async (req, res) => {
  try {
    const del = await Employee.findByIdAndDelete(req.params.id);
    if (!del) return res.status(404).json({ message: "Not found" });
    res.json({ message: "Deleted" });
  } catch (err) {
    console.error("deleteEmployee error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// POST /employees/:id/reset-password (No authentication required)
export const resetEmployeePassword = async (req, res) => {
  try {
    const emp = await Employee.findById(req.params.id);
    if (!emp) return res.status(404).json({ message: "Not found" });

    const newPwd = crypto.randomBytes(4).toString("hex"); // 8-char
    const salt = await bcrypt.genSalt(10);
    emp.password = await bcrypt.hash(newPwd, salt);
    await emp.save();

    res.json({ newPassword: newPwd });
  } catch (err) {
    console.error("resetEmployeePassword error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
