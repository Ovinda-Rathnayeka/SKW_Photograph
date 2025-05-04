import React, { useEffect, useState } from "react";
import Navbar from "../../components/AdminP&M/Navbar.jsx";
import Sidebar from "../../components/AdminP&M/Sidebar.jsx";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

function Analytics() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
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

  if (loading)
    return <div className="text-center mt-10">Loading analytics...</div>;

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1">
        <Navbar />
        <div className="p-6 max-w-5xl mx-auto">
          <h1 className="text-3xl font-bold mb-6 text-center">
            Product Sales Analytics
          </h1>
          {chartData.length === 0 ? (
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
        </div>
      </div>
    </div>
  );
}

export default Analytics;
