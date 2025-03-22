import React from "react";
import Navbar from "../../components/AdminP&B/Navbar.jsx";
import Sidebar from "../../components/AdminP&B/Sidebar.jsx";

function Dashboard() {
  return (
    <div className="flex">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main Content */}
      <div className="flex-1">
        {/* Navbar */}
        <Navbar />
        
        <div className="p-6 bg-gray-100 min-h-screen">
          <h2 className="text-2xl font-bold mb-6">Dashboard Overview</h2>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-blue-500 text-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold">Users</h3>
              <p className="text-2xl">26K</p>
              <span className="text-sm">-12.4% ↓</span>
            </div>

            <div className="bg-green-500 text-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold">Income</h3>
              <p className="text-2xl">$6,200</p>
              <span className="text-sm">40.9% ↑</span>
            </div>

            <div className="bg-yellow-500 text-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold">Conversion Rate</h3>
              <p className="text-2xl">2.49%</p>
              <span className="text-sm">84.7% ↑</span>
            </div>

            <div className="bg-red-500 text-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold">Sessions</h3>
              <p className="text-2xl">44K</p>
              <span className="text-sm">-23.6% ↓</span>
            </div>
          </div>

          {/* Traffic Chart Placeholder */}
          <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-4">Traffic Overview</h3>
            <p className="text-gray-600">[Chart will be placed here]</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
