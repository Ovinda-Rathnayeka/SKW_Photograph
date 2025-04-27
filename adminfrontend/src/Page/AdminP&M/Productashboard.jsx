import React from "react";
import Navbar from "../../components/AdminP&M/Navbar.jsx";
import Sidebar from "../../components/AdminP&M/Sidebar.jsx";

function ProductDashboard() {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1">
        <Navbar />

        {/* Empty Page Content */}
        <div className="p-6 bg-gray-100 min-h-screen">
          {/* You can add your Product Dashboard content here */}
          <h1 className="text-3xl font-bold">Product Management Dashboard</h1>
        </div>
      </div>
    </div>
  );
}

export default ProductDashboard;
