import React, { useEffect, useState } from "react";
import axios from "axios";
import "./AdminProductPage.css";

function AdminOrderManagement() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAllOrders = async () => {
    try {
      const response = await axios.get("http://localhost:5000/cart-payment", {
        withCredentials: true,
      });
      setOrders(response.data);
    } catch (error) {
      console.error("Failed to fetch orders:", error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllOrders();
  }, []);

  const handleUpdateStatus = async (orderId, status) => {
    try {
      const res = await axios.patch(
        `http://localhost:5000/cart-payment/${orderId}/status`,
        { status },
        { withCredentials: true }
      );

      alert(res.data.message);

      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId ? { ...order, paymentStatus: status } : order
        )
      );
    } catch (error) {
      console.error("Failed to update order status:", error.response?.data || error.message);
      alert("Failed to update order status.");
    }
  };

  if (loading) return <div className="text-center mt-10">Loading orders...</div>;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">Order Management</h1>

      {orders.length === 0 ? (
        <p className="text-center text-gray-600">No orders found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
            <thead className="bg-gray-800 text-white">
              <tr>
                <th className="px-4 py-3 text-left">Customer</th>
                <th className="px-4 py-3 text-left">Email</th>
                <th className="px-4 py-3 text-left">Address</th>
                <th className="px-4 py-3 text-left">Total</th>
                <th className="px-4 py-3 text-left">Items</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Proof</th>
                <th className="px-4 py-3 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id} className="border-b">
                  <td className="px-4 py-2">{order.customerId?.name || "Unknown"}</td>
                  <td className="px-4 py-2">{order.customerId?.email || "-"}</td>
                  <td className="px-4 py-2">{order.address}</td>
                  <td className="px-4 py-2">${order.totalAmount.toFixed(2)}</td>
                  <td className="px-4 py-2">
                    <ul className="list-disc pl-4">
                      {order.cartItems.map((item, idx) => (
                        <li key={idx}>
                          {item.productId?.name || "Product"} × {item.quantity}
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td className="px-4 py-2">
                    <span
                      className={`px-2 py-1 rounded text-sm ${
                        order.paymentStatus === "Accepted"
                          ? "bg-green-100 text-green-800"
                          : order.paymentStatus === "Denied"
                          ? "bg-red-100 text-red-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {order.paymentStatus}
                    </span>
                  </td>
                  <td className="px-4 py-2">
                    {order.proofImageUrl ? (
                      <a
                        href={order.proofImageUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline"
                      >
                        View Slip
                      </a>
                    ) : (
                      <span className="text-gray-500">N/A</span>
                    )}
                  </td>
                  <td className="px-4 py-2">
                    {order.paymentStatus === "Pending" ? (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleUpdateStatus(order._id.toString(), "Accepted")}
                          className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => handleUpdateStatus(order._id.toString(), "Denied")}
                          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                        >
                          Deny
                        </button>
                      </div>
                    ) : (
                      <span
                        className={
                          order.paymentStatus === "Accepted"
                            ? "text-green-600 font-semibold"
                            : "text-red-600 font-semibold"
                        }
                      >
                        {order.paymentStatus}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default AdminOrderManagement;