import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./Page/AdminP&B/LoginPage.jsx";
import PackageAdd from "./Page/AdminP&B/PackageAdd.jsx";
import PackageDisplay from "./Page/AdminP&B/PackageDisplay.jsx";
import Dashboard from "./Page/AdminP&B/Dashboard.jsx";
import Navbar from "./components/AdminP&B/Navbar.jsx";
import Sidebar from "./components/AdminP&B/Sidebar.jsx";
import PaymentPage from "./Page/AdminP&B/PaymentPage.jsx";
import DisplayBooking from "./Page/AdminP&B/DisplayBooking.jsx";
import AdminProductPage from "./Page/AdminP&B/AdminProductPage.jsx";
import AdminOrderManagement from "./Page/AdminP&B/AdminOrderManagement.jsx";
import ProductTablePage from "./Page/AdminP&B/ProductTablePage.jsx";
import Analytics from "./Page/AdminP&B/Analytics.jsx";

function App() {
  return (
    <Router>
      <div className="flex h-screen bg-gray-100">
        {/* Sidebar - Fixed height */}
        <Sidebar />

        {/* Main Content Area */}
        <div className="flex flex-col flex-1">
          {/* Navbar - Fixed at the top */}
          <Navbar />

          {/* Page Content */}
          <div className="flex-1 overflow-auto p-6">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/add-package" element={<PackageAdd />} />
              <Route path="/packagedisplay" element={<PackageDisplay />} />
              <Route path="/payment" element={<PaymentPage />} />
              <Route path="/displaybooking" element={<DisplayBooking />} />
              <Route path="/AdminProduct" element={<AdminProductPage />} />
              <Route path="/AdminOrder" element={<AdminOrderManagement />} />
              <Route path="/ProductTable" element={<ProductTablePage />} />
              <Route path="/analytics" element={<Analytics/>} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
