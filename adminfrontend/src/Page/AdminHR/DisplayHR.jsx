// src/pages/DisplayHR.jsx
import React, { useState, useEffect } from "react";
import {
  getEmployees,
  resetEmployeePassword,
  updateEmployee,
} from "../../API/AdminAPI.js";
import Swal from "sweetalert2";
import {
  ArrowPathIcon,
  PencilIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

const DisplayHR = () => {
  const [employees, setEmployees] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    name: "",
    nic: "",
    phone: "",
    address: "",
  });

  const loadEmployees = async () => {
    try {
      const list = await getEmployees();
      setEmployees(list);
    } catch (err) {
      console.error("Failed to load employees", err);
    }
  };

  useEffect(() => {
    loadEmployees();
  }, []);

  const handleResetPassword = async (id) => {
    const { isConfirmed } = await Swal.fire({
      title: "Reset password?",
      text: "This will generate a new random password for this user.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Reset",
    });
    if (!isConfirmed) return;

    try {
      const newPwd = await resetEmployeePassword(id);
      Swal.fire("Password Reset", `New password: ${newPwd}`, "success");
    } catch (err) {
      Swal.fire("Error", err.message, "error");
    }
  };

  const openEditModal = (emp) => {
    setEditing(emp);
    setForm({
      name: emp.name,
      nic: emp.nic,
      phone: emp.phone,
      address: emp.address,
    });
  };

  const closeEditModal = () => {
    setEditing(null);
    setForm({ name: "", nic: "", phone: "", address: "" });
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const submitEdit = async () => {
    try {
      await updateEmployee(editing._id, form);
      Swal.fire("Updated!", "Employee details have been updated.", "success");
      closeEditModal();
      loadEmployees();
    } catch (err) {
      Swal.fire("Error", err.message, "error");
    }
  };

  return (
    <div className="max-w-6xl mx-auto mt-8 p-6 bg-white rounded-xl shadow-lg">
      <h2 className="text-3xl font-semibold mb-6">User Accounts</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {["Name", "Role", "Email", "Created At", "Actions"].map((h) => (
                <th
                  key={h}
                  className="px-4 py-2 text-left text-sm font-medium text-gray-700"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {employees.map((emp) => (
              <tr key={emp._id}>
                <td className="px-4 py-3 text-sm text-gray-800">{emp.name}</td>
                <td className="px-4 py-3 text-sm text-gray-800">
                  {emp.jobRole}
                </td>
                <td className="px-4 py-3 text-sm text-gray-800">{emp.email}</td>
                <td className="px-4 py-3 text-sm text-gray-800">
                  {new Date(emp.createdAt).toLocaleDateString()}
                </td>
                <td className="px-4 py-3 text-sm space-x-2">
                  <button
                    onClick={() => handleResetPassword(emp._id)}
                    className="p-2 rounded-full hover:bg-gray-100 transition"
                  >
                    <ArrowPathIcon className="h-5 w-5 text-gray-600" />
                  </button>
                  <button
                    onClick={() => openEditModal(emp)}
                    className="p-2 rounded-full hover:bg-gray-100 transition"
                  >
                    <PencilIcon className="h-5 w-5 text-gray-600" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 relative">
            <button
              onClick={closeEditModal}
              className="absolute top-4 right-4 p-1 hover:bg-gray-200 rounded-full"
            >
              <XMarkIcon className="h-5 w-5 text-gray-600" />
            </button>
            <h3 className="text-xl font-semibold mb-4">Edit Employee</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Name
                </label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleFormChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  NIC
                </label>
                <input
                  name="nic"
                  value={form.nic}
                  onChange={handleFormChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Phone
                </label>
                <input
                  name="phone"
                  value={form.phone}
                  onChange={handleFormChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Address
                </label>
                <input
                  name="address"
                  value={form.address}
                  onChange={handleFormChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={closeEditModal}
                className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={submitEdit}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DisplayHR;
