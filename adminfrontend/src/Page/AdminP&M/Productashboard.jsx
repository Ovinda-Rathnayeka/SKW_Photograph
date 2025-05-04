import React, { useEffect, useState } from "react";
import Navbar from "../../components/AdminP&M/Navbar.jsx";
import Sidebar from "../../components/AdminP&M/Sidebar.jsx";
import { useNavigate } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import axios from "axios";

function ProductDashboard() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleButtonClick = () => {
    navigate("/adminproductpage");
  };

  useEffect(() => {
    const fetchAllOrders = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/cart-payment",
          {
            withCredentials: true,
          }
        );
        setOrders(response.data);
      } catch (error) {
        console.error(
          "Error fetching orders:",
          error.response?.data || error.message
        );
      } finally {
        setLoading(false);
      }
    };
    fetchAllOrders();
  }, []);

  const productSalesMap = {};
  orders.forEach((order) => {
    order.cartItems.forEach((item) => {
      const productName = item.productId?.name || "Unknown Product";
      productSalesMap[productName] =
        (productSalesMap[productName] || 0) + item.quantity;
    });
  });

  const chartData = Object.entries(productSalesMap).map(([name, quantity]) => ({
    name,
    quantity,
  }));

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />
        <main className="flex-1 p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800">
              Admin Dashboard
            </h1>
            <button
              onClick={handleButtonClick}
              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg shadow hover:opacity-90 transition"
            >
              + Add New Product
            </button>
          </div>

          {/* Analytics Chart */}
          <section className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
            <h2 className="text-xl font-semibold text-gray-700 mb-4 text-center">
              Product Sales Analytics
            </h2>
            {loading ? (
              <p className="text-center text-gray-500">Loading analytics...</p>
            ) : chartData.length === 0 ? (
              <p className="text-center text-gray-500">
                No sales data available.
              </p>
            ) : (
              <ResponsiveContainer width="100%" height={400}>
                <BarChart
                  data={chartData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 50 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="name"
                    angle={-45}
                    textAnchor="end"
                    interval={0}
                  />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="quantity" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </section>
        </main>
      </div>
    </div>
  );
}

export default ProductDashboard;
