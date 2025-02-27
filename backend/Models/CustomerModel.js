import mongoose from "mongoose";

const customerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String },
  nic: { type: String, required: true, unique: true },
  address: { type: String },
  createdAt: { type: Date, default: Date.now },
  active: { type: Boolean, default: true },
});

const Customer = mongoose.model("Customer", customerSchema);
export default Customer;
