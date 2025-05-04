import React, { useEffect, useState } from "react";
import Navbar from "../../components/AdminR&T/Navbar";
import Sidebar from "../../components/AdminR&T/Sidebar";
import { getAllResources } from "../../API/ResourceAPI";
import { getAllRentalCarts } from "../../API/RentalAPI";

function ResourceDashboard() {
  const [resources, setResources] = useState([]);
  const [rentalCarts, setRentalCarts] = useState([]);
  const [totalStock, setTotalStock] = useState(0);
  const [inRental, setInRental] = useState(0);
  const [remainingStock, setRemainingStock] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resData = await getAllResources();
        setResources(resData);

        let total = 0;
        let rentalCount = 0;

        resData.forEach((res) => {
          const rentalStock = parseInt(res.rentalStock) || 0;
          const stock = parseInt(res.stock) || 0;
          rentalCount += rentalStock;
          total += stock + rentalStock;
        });

        setTotalStock(total);
        setInRental(rentalCount);
        setRemainingStock(total - rentalCount);
      } catch (err) {
        console.error("Dashboard load error:", err);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1">
        <Navbar />
        <div className="p-6 bg-gray-100 min-h-screen">
          <h2 className="text-2xl font-bold mb-6">Resource Admin Dashboard</h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
            <div className="bg-indigo-500 text-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold">Total Stock</h3>
              <p className="text-3xl">{totalStock}</p>
            </div>
            <div className="bg-red-500 text-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold">In Rental</h3>
              <p className="text-3xl">{inRental}</p>
            </div>
            <div className="bg-green-600 text-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold">Available Stock</h3>
              <p className="text-3xl">{remainingStock}</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md overflow-x-auto">
            <h3 className="text-xl font-semibold mb-4">Resource Inventory</h3>
            <table className="min-w-full text-left text-gray-800">
              <thead>
                <tr>
                  <th className="px-4 py-2">Name</th>
                  <th className="px-4 py-2">Category</th>
                  <th className="px-4 py-2">Condition</th>
                  <th className="px-4 py-2">Rental</th>
                  <th className="px-4 py-2">Stock</th>
                  <th className="px-4 py-2">Availability</th>
                </tr>
              </thead>
              <tbody>
                {resources.map((res) => (
                  <tr key={res._id} className="border-t">
                    <td className="px-4 py-2">{res.name}</td>
                    <td className="px-4 py-2">{res.category}</td>
                    <td className="px-4 py-2">{res.condition}</td>
                    <td className="px-4 py-2">{res.rentalStock}</td>
                    <td className="px-4 py-2">{res.stock}</td>
                    <td className="px-4 py-2">{res.availabilityStatus}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResourceDashboard;
