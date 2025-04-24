import React, { useEffect, useState } from "react";
import axios from "axios";
import { fetchCustomerById } from "../../API/UserAPI/CustomerAPI.js";

// Skeleton row component
const FeedbackSkeletonRow = () => (
  <tr className="animate-pulse">
    {Array.from({ length: 8 }).map((_, i) => (
      <td key={i} className="px-6 py-4">
        <div className="h-4 bg-gray-300 rounded w-full"></div>
      </td>
    ))}
  </tr>
);

function Feedbacks() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [filteredFeedbacks, setFilteredFeedbacks] = useState([]);
  const [customerMap, setCustomerMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRating, setFilterRating] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [filterCategory, setFilterCategory] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:5000/feedbacks");
        const data = response.data.feedbacks || response.data || [];

        setFeedbacks(data);
        setFilteredFeedbacks(data);

        const customerIds = [
          ...new Set(data.map((fb) => fb.customerId).filter(Boolean)),
        ];

        const customers = await Promise.all(
          customerIds.map((id) => fetchCustomerById(id).catch(() => null))
        );

        const customerMapObj = {};
        customers.forEach((c) => {
          if (c && c._id) customerMapObj[c._id] = c;
        });

        setCustomerMap(customerMapObj);
      } catch (err) {
        console.error(err);
        setError("Failed to load feedbacks.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const keyword = searchTerm.trim().toLowerCase();

    const filtered = feedbacks.filter((fb) => {
      const matchSearch =
        !keyword ||
        fb.title.toLowerCase().includes(keyword) ||
        fb.comment.toLowerCase().includes(keyword);

      const matchRating = !filterRating || fb.rating === parseInt(filterRating);

      const matchDate =
        !filterDate ||
        (fb.createdAt && fb.createdAt.slice(0, 10) === filterDate);

      const matchCategory = !filterCategory || fb.category === filterCategory;

      return matchSearch && matchRating && matchDate && matchCategory;
    });

    setFilteredFeedbacks(filtered);
  }, [searchTerm, feedbacks, filterRating, filterDate, filterCategory]);

  const handleDelete = async (id) => {
    const confirm = window.confirm(
      "Are you sure you want to delete this feedback?"
    );
    if (!confirm) return;

    try {
      await axios.delete(`http://localhost:5000/feedbacks/${id}`);
      const updated = feedbacks.filter((fb) => fb._id !== id);
      setFeedbacks(updated);
      setFilteredFeedbacks(updated);
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Failed to delete feedback.");
    }
  };

  const handleApprove = async (id) => {
    try {
      await axios.patch(`http://localhost:5000/feedbacks/${id}/approve`);
      const updated = feedbacks.map((fb) =>
        fb._id === id ? { ...fb, isApproved: true } : fb
      );
      setFeedbacks(updated);
      setFilteredFeedbacks(updated);
    } catch (err) {
      console.error("Approval failed:", err);
      alert("Failed to approve feedback.");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6 text-blue-800">All Feedbacks</h1>

      <div className="mb-6">
        <input
          type="text"
          placeholder="Search by title or comment..."
          className="w-full max-w-md px-4 py-2 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring focus:border-blue-400"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <select
          className="px-4 py-2 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring"
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
        >
          <option value="">All Categories</option>
          <option value="Package">Package</option>
          <option value="Rental">Rental</option>
          <option value="Purchase">Purchase</option>
          <option value="Service">Service</option>
        </select>

        <select
          className="px-4 py-2 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring"
          value={filterRating}
          onChange={(e) => setFilterRating(e.target.value)}
        >
          <option value="">All Ratings</option>
          {[5, 4, 3, 2, 1].map((r) => (
            <option key={r} value={r}>
              {r} ★
            </option>
          ))}
        </select>

        <input
          type="date"
          value={filterDate}
          onChange={(e) => setFilterDate(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring"
        />

        {(filterRating || filterDate) && (
          <button
            onClick={() => {
              setFilterRating("");
              setFilterDate("");
              setFilterCategory("");
            }}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
          >
            Clear Filters
          </button>
        )}
      </div>

      {loading ? (
        <div className="overflow-x-auto bg-white shadow-lg rounded-xl">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-blue-600 text-white">
              <tr>
                {[...Array(8)].map((_, i) => (
                  <th
                    key={i}
                    className="px-6 py-3 text-left text-sm font-semibold"
                  >
                    Loading...
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[...Array(5)].map((_, i) => (
                <FeedbackSkeletonRow key={i} />
              ))}
            </tbody>
          </table>
        </div>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : filteredFeedbacks.length > 0 ? (
        <div className="overflow-x-auto bg-white shadow-lg rounded-xl">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold">
                  Customer ID
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold">
                  Customer Email
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold">
                  Comment
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold">
                  Rating
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-800">
              {filteredFeedbacks.map((fb) => {
                const customer = customerMap[fb.customerId];
                return (
                  <tr key={fb._id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 text-sm">
                      {fb.customerId || "N/A"}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {customer?.email || "N/A"}
                    </td>
                    <td className="px-6 py-4 text-sm">{fb.category}</td>
                    <td className="px-6 py-4 text-sm">{fb.title}</td>
                    <td className="px-6 py-4 text-sm max-w-xs truncate">
                      {fb.comment}
                    </td>
                    <td className="px-6 py-4 text-sm">{fb.rating} ★</td>
                    <td className="px-6 py-4 text-sm">
                      {fb.createdAt
                        ? new Date(fb.createdAt).toLocaleDateString()
                        : "N/A"}
                    </td>
                    <td className="px-6 py-4 text-sm space-y-2">
                      {!fb.isApproved ? (
                        <button
                          onClick={() => handleApprove(fb._id)}
                          className="bg-green-500 text-white px-4 py-1 rounded hover:bg-green-600 transition w-full"
                        >
                          Approve
                        </button>
                      ) : (
                        <span className="text-green-600 font-medium block text-center">
                          Approved
                        </span>
                      )}
                      <button
                        onClick={() => handleDelete(fb._id)}
                        className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600 transition w-full"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-center text-gray-500">No feedbacks found.</p>
      )}
    </div>
  );
}

export default Feedbacks;
