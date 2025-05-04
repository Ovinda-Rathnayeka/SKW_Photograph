import React from "react";
import Navbar from "../../components/AdminP&M/Navbar.jsx";
import Sidebar from "../../components/AdminP&M/Sidebar.jsx";
import { useNavigate } from "react-router-dom";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const statsData = [
  { name: "Products", value: 120 },
  { name: "Users", value: 45 },
  { name: "Orders", value: 8 },
];

function ProductDashboard() {
  const navigate = useNavigate();
  const handleButtonClick = () => {
    navigate("/adminproductpage");
  };
  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />
        <main className="flex-1 p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
            <button onClick={handleButtonClick} className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg shadow hover:opacity-90 transition">
              + Add New Product
            </button>
          </div>

          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow p-5 hover:shadow-md transition">
              <h2 className="text-gray-500 text-sm">Total Products</h2>
              <p className="text-3xl font-semibold text-blue-600">120</p>
            </div>
            <div className="bg-white rounded-xl shadow p-5 hover:shadow-md transition">
              <h2 className="text-gray-500 text-sm">Active Users</h2>
              <p className="text-3xl font-semibold text-green-600">45</p>
            </div>
            <div className="bg-white rounded-xl shadow p-5 hover:shadow-md transition">
              <h2 className="text-gray-500 text-sm">Pending Orders</h2>
              <p className="text-3xl font-semibold text-yellow-600">8</p>
            </div>
          </section>

          <section className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Overview</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={statsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="value" fill="#6366f1" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </section>
        </main>
      </div>
    </div>
  );
}

export default ProductDashboard;
