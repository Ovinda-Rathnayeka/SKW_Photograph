import mongoose from "mongoose";

const customerSchema = new mongoose.Schema({
  customerId: {
    type: String,
    unique: true,
    required: true,
    default: function () {
      return "CUST-" + Math.floor(100000 + Math.random() * 900000);
    },
  },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String },
  nic: { type: String, required: true, unique: true },
  address: { type: String },
  createdAt: { type: Date, default: Date.now },
  active: { type: Boolean, default: true },
});

// No need for the pre-save hook anymore

const Customer = mongoose.model("Customer", customerSchema);
export default Customer;
