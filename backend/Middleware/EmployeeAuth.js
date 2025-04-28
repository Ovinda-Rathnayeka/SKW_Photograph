import jwt from "jsonwebtoken";
import Employee from "../Models/EmployeeModel.js";

/**
 * Verifies JWT and attaches the employee doc to req.employee.
 */
export const employeeAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Missing or invalid token" });
  }
  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const employee = await Employee.findById(decoded.id);
    if (!employee) {
      return res.status(401).json({ message: "Employee not found" });
    }
    req.employee = employee;
    next();
  } catch (err) {
    console.error("employeeAuth error:", err);
    return res.status(403).json({ message: "Invalid or expired token" });
  }
};

/**
 * Allows only HR Managers through.
 * Must be used after employeeAuth.
 */
export const hrManagerOnly = (req, res, next) => {
  if (!req.employee) {
    return res.status(401).json({ message: "Not authenticated" });
  }
  if (req.employee.jobRole !== "hrManager") {
    return res.status(403).json({ message: "Forbidden: HR Manager only" });
  }
  next();
};
