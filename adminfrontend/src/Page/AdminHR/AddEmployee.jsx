// src/pages/AddEmployee.jsx
import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { createEmployee } from "../../API/AdminAPI.js";

const managerRoles = [
  { label: "Package & Booking Manager", value: "packageBookingManager" },
  { label: "Resource Manager", value: "resourceManager" },
  { label: "Feedback Manager", value: "feedbackManager" },
  { label: "HR Manager", value: "hrManager" },
  { label: "Product Manager", value: "PrManager" },
];

const employeeRoles = [
  { label: "Photographer", value: "photographers" },
  { label: "Videographer", value: "videographers" },
  { label: "Helper", value: "helpers" },
];

const AddEmployee = () => {
  const [accountType, setAccountType] = useState("manager"); // "manager" or "employee"
  const [formData, setFormData] = useState({
    name: "",
    nic: "",
    phone: "",
    address: "",
    jobRole: "",
    email: "",
    password: "",
  });

  // auto‐populate email when manager role selected
  useEffect(() => {
    if (accountType === "manager" && formData.jobRole) {
      setFormData((prev) => ({
        ...prev,
        email: `${prev.jobRole}@skwphotography.com`,
      }));
    }
  }, [accountType, formData.jobRole]);

  const handleTypeChange = (type) => {
    setAccountType(type);
    setFormData({
      name: "",
      nic: "",
      phone: "",
      address: "",
      jobRole: "",
      email: "",
      password: "",
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRoleChange = (e) => {
    setFormData((prev) => ({ ...prev, jobRole: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createEmployee(formData);
      Swal.fire({
        icon: "success",
        title: "Account Created",
        text: `A new ${formData.jobRole} account has been created.`,
        timer: 2000,
        showConfirmButton: false,
      });
      setFormData({
        name: "",
        nic: "",
        phone: "",
        address: "",
        jobRole: "",
        email: "",
        password: "",
      });
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: err.message || "Failed to create account",
      });
    }
  };

  const roles = accountType === "manager" ? managerRoles : employeeRoles;

  return (
    <div className="max-w-2xl mx-auto mt-10 p-8 bg-white rounded-xl shadow-xl">
      <h2 className="text-4xl font-semibold text-center mb-8">
        Add {accountType === "manager" ? "Manager" : "Employee"} Account
      </h2>

      {/* Account Type Toggle */}
      <div className="flex justify-center mb-6 space-x-4">
        {["manager", "employee"].map((type) => (
          <button
            key={type}
            onClick={() => handleTypeChange(type)}
            className={`px-6 py-2 rounded-lg transition ${
              accountType === type
                ? "bg-indigo-600 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            {type === "manager" ? "Manager" : "Employee"}
          </button>
        ))}
      </div>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        {/* Name */}
        <div className="flex flex-col">
          <label className="text-gray-700 mb-2">Name</label>
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
            placeholder="Full Name"
          />
        </div>

        {/* NIC */}
        <div className="flex flex-col">
          <label className="text-gray-700 mb-2">NIC</label>
          <input
            name="nic"
            value={formData.nic}
            onChange={handleChange}
            required
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
            placeholder="NIC Number"
          />
        </div>

        {/* Phone */}
        <div className="flex flex-col">
          <label className="text-gray-700 mb-2">Phone</label>
          <input
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
            placeholder="Mobile Number"
          />
        </div>

        {/* Address */}
        <div className="flex flex-col">
          <label className="text-gray-700 mb-2">Address</label>
          <input
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
            placeholder="Residential Address"
          />
        </div>

        {/* Role */}
        <div className="flex flex-col">
          <label className="text-gray-700 mb-2">
            {accountType === "manager" ? "Manager Role" : "Employee Role"}
          </label>
          <select
            name="jobRole"
            value={formData.jobRole}
            onChange={handleRoleChange}
            required
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 transition bg-white"
          >
            <option value="">
              Select {accountType === "manager" ? "manager" : "employee"}
            </option>
            {roles.map(({ label, value }) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>

        {/* Email */}
        <div className="flex flex-col">
          <label className="text-gray-700 mb-2">Email</label>
          <input
            name="email"
            value={formData.email}
            onChange={handleChange}
            readOnly={accountType === "manager"}
            required
            className={`px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition ${
              accountType === "manager"
                ? "bg-gray-100 border-gray-300 focus:ring-indigo-400"
                : "bg-white border-gray-300 focus:ring-indigo-400"
            }`}
            placeholder={
              accountType === "manager" ? "auto-generated" : "you@example.com"
            }
          />
        </div>

        {/* Password */}
        <div className="flex flex-col md:col-span-2">
          <label className="text-gray-700 mb-2">Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
            placeholder="Enter a secure password"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="md:col-span-2 py-3 bg-indigo-600 text-white text-lg font-medium rounded-lg hover:bg-indigo-700 transition"
        >
          Create {accountType === "manager" ? "Manager" : "Employee"} Account
        </button>
      </form>
    </div>
  );
};

export default AddEmployee;
