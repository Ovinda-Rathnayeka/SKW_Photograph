import mongoose from "mongoose";

<<<<<<< HEAD
const EmployeeSchema = new mongoose.Schema({
    empID: { type: String, required: true, unique: true },
    empName: { type: String, required: true },
    role: { type: String, required: true },
    empPhone: { type: Number, required: true },
    empAddress: { type: String, required: true},
    empMail: { type: String, required: true},
});

const Employee = mongoose.model('Employee', EmployeeSchema);
=======
const employeeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  nic: {
    type: String,
    required: true,
    unique: true,
  },
  phone: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  jobRole: {
    type: String,
    required: true,
  },
});

const Employee = mongoose.model("Employee", employeeSchema);
>>>>>>> main

export default Employee;
