import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./Page/LoginPage.jsx";
import PackageAdd from "./Page/PackageAdd.jsx";
import PackageDisplay from "./Page/PackageDisplay.jsx";
import Dashboard from "./Page/Dashboard.jsx";
import Navbar from "./components/Navbar.jsx";
import Sidebar from "./components/Sidebar.jsx";
import PaymentPage from "./Page/PaymentPage.jsx";
import DisplayBooking from "./Page/DisplayBooking.jsx";

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
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
