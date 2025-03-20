import mongoose from "mongoose";

const EmployeeSchema = new mongoose.Schema({
    empID: { type: String, required: true, unique: true },
    empName: { type: String, required: true },
    role: { type: String, required: true },
    empPhone: { type: Number, required: true },
    empAddress: { type: String, required: true},
    empMail: { type: String, required: true},
});

const Employee = mongoose.model('Employee', EmployeeSchema);

export default Employee;
