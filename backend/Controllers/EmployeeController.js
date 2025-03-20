import Employee from "../Models/EmployeeModel.js";

const EmployeeController = {
  // Create a new employee
  createEmployee: async (req, res) => {
    try {
      const { empID, empName, role, empPhone, empAddress, empMail } = req.body;

      const newEmployee = new Employee({
        empID,
        empName,
        role,
        empPhone,
        empAddress,
        empMail,
      });
      await newEmployee.save();

      res
        .status(201)
        .json({ message: "Employee created successfully", newEmployee });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Get all employees
  getAllEmployees: async (req, res) => {
    try {
      const employees = await Employee.find();
      res.status(200).json(employees);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Get employee by ID
  getEmployeeById: async (req, res) => {
    try {
      const employee = await Employee.findById(req.params.id);
      if (!employee) {
        return res.status(404).json({ message: "Employee not found" });
      }
      res.status(200).json(employee);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  updateEmployee: async (req, res) => {
    try {
      const updatedEmployee = await Employee.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );
      if (!updatedEmployee) {
        return res.status(404).json({ message: "Employee not found" });
      }
      res
        .status(200)
        .json({ message: "Employee updated successfully", updatedEmployee });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Delete employee by ID (soft delete)
  deleteEmployee: async (req, res) => {
    try {
      const deletedEmployee = await Employee.findByIdAndDelete(req.params.id);
      if (!deletedEmployee) {
        return res.status(404).json({ message: "Employee not found" });
      }
      res.status(200).json({ message: "Employee deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};

export default EmployeeController;