import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./Page/LoginPage.jsx";
import PackageAdd from "./Page/AdminP&B/PackageAdd.jsx";
import PackageDisplay from "./Page/AdminP&B/PackageDisplay.jsx";
import PDashboard from "./Page/AdminP&B/Dashboard.jsx";

import PaymentPage from "./Page/AdminP&B/PaymentPage.jsx";
import DisplayBooking from "./Page/AdminP&B/DisplayBooking.jsx";

function App() {
  return (
    <Router>
      <div className="flex h-screen bg-gray-100">
        {/* Sidebar - Fixed height */}

        {/* Main Content Area */}
        <div className="flex flex-col flex-1">
          {/* Navbar - Fixed at the top */}

          {/* Page Content */}
          <div className="flex-1 overflow-auto p-6">
            <Routes>
              <Route path="/" element={<LoginPage />} />
              <Route path="/PDashboard" element={<PDashboard />} />
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
