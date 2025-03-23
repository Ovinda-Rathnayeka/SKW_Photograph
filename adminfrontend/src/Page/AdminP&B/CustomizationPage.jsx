import React, { useEffect, useState } from "react";
import axios from "axios";

function CustomizationPage() {
  const [customPackages, setCustomPackages] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch customized packages from backend
  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const response = await axios.get("http://localhost:5000/customization"); // Adjust API endpoint
        setCustomPackages(response.data);
      } catch (error) {
        console.error("Error fetching packages:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPackages();
  }, []);

  // Handle status update
  const handleUpdateStatus = async (packageId, newStatus) => {
    try {
      const response = await axios.put(
        `http://localhost:5000/customization/${packageId}`,
        {
          status: newStatus,
        }
      );
      // Update the status in the state without refetching
      setCustomPackages((prevPackages) =>
        prevPackages.map((pkg) =>
          pkg._id === packageId ? { ...pkg, status: newStatus } : pkg
        )
      );
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  if (loading) {
    return <p>Loading packages...</p>;
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6 text-center text-yellow-400">
        Customize Packages
      </h2>

      <table className="min-w-full table-auto border-collapse border border-gray-200">
        <thead>
          <tr>
            <th className="border px-4 py-2">Customer ID</th>
            <th className="border px-4 py-2">Service Type</th>
            <th className="border px-4 py-2">Event Type</th>
            <th className="border px-4 py-2">Total Price</th>
            <th className="border px-4 py-2">Status</th>
            <th className="border px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {customPackages.map((pkg) => (
            <tr key={pkg._id}>
              <td className="border px-4 py-2">{pkg.customerId}</td>
              <td className="border px-4 py-2">{pkg.serviceType}</td>
              <td className="border px-4 py-2">{pkg.eventType}</td>
              <td className="border px-4 py-2">{pkg.totalPrice}</td>
              <td className="border px-4 py-2">{pkg.status}</td>
              <td className="border px-4 py-2">
                <button
                  onClick={() =>
                    handleUpdateStatus(
                      pkg._id,
                      pkg.status === "Pending" ? "Confirmed" : "Pending"
                    )
                  }
                  className="bg-blue-500 text-white px-4 py-2 rounded-md"
                >
                  {pkg.status === "Pending" ? "Confirm" : "Revert to Pending"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default CustomizationPage;
