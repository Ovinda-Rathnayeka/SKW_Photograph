// src/pages/AdminCR/Dashbaord.jsx
import React, { useState, useEffect } from "react";
import Navbar from "../../components/AdminCR/Navbar.jsx";
import Sidebar from "../../components/AdminCR/Sidebar.jsx";
import { getEmployees } from "../../API/AdminAPI.js";

const managerRoles = [
  "packageBookingManager",
  "resourceManager",
  "feedbackManager",
  "hrManager",
];
const staffRoles = ["photographers", "videographers", "helpers"];

function Dashbaord() {
  const [counts, setCounts] = useState({
    total: 0,
    managers: 0,
    staff: 0,
    photographers: 0,
    videographers: 0,
  });

  useEffect(() => {
    async function fetchCounts() {
      try {
        const employees = await getEmployees();
        const total = employees.length;
        const managers = employees.filter((e) =>
          managerRoles.includes(e.jobRole)
        ).length;
        const staff = employees.filter((e) =>
          staffRoles.includes(e.jobRole)
        ).length;
        const photographers = employees.filter(
          (e) => e.jobRole === "photographers"
        ).length;
        const videographers = employees.filter(
          (e) => e.jobRole === "videographers"
        ).length;

        setCounts({
          total,
          managers,
          staff,
          photographers,
          videographers,
        });
      } catch (err) {
        console.error("Failed to load employee counts", err);
      }
    }
    fetchCounts();
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <Navbar />

        <main className="p-6">
          <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {/* Total Employees */}
            <div className="bg-white shadow-lg rounded-xl p-6 flex flex-col items-center">
              <span className="text-gray-500">Total Employees</span>
              <span className="mt-4 text-4xl font-semibold text-indigo-600">
                {counts.total}
              </span>
            </div>

            {/* Managers */}
            <div className="bg-white shadow-lg rounded-xl p-6 flex flex-col items-center">
              <span className="text-gray-500">Managers</span>
              <span className="mt-4 text-4xl font-semibold text-indigo-600">
                {counts.managers}
              </span>
            </div>

            {/* Staff */}
            <div className="bg-white shadow-lg rounded-xl p-6 flex flex-col items-center">
              <span className="text-gray-500">Staff (all roles)</span>
              <span className="mt-4 text-4xl font-semibold text-indigo-600">
                {counts.staff}
              </span>
            </div>

            {/* Photographers */}
            <div className="bg-white shadow-lg rounded-xl p-6 flex flex-col items-center">
              <span className="text-gray-500">Photographers</span>
              <span className="mt-4 text-4xl font-semibold text-indigo-600">
                {counts.photographers}
              </span>
            </div>

            {/* Videographers */}
            <div className="bg-white shadow-lg rounded-xl p-6 flex flex-col items-center">
              <span className="text-gray-500">Videographers</span>
              <span className="mt-4 text-4xl font-semibold text-indigo-600">
                {counts.videographers}
              </span>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Dashbaord;
