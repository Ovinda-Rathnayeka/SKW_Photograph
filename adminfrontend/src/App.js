import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./Page/LoginPage.jsx";
import PackageAdd from "./Page/AdminP&B/PackageAdd.jsx";
import PackageDisplay from "./Page/AdminP&B/PackageDisplay.jsx";
import ProductDashboard from "./Page/AdminP&M/Productashboard.jsx"; // ✅ Already imported
import PaymentPage from "./Page/AdminP&B/PaymentPage.jsx";
import DisplayBooking from "./Page/AdminP&B/DisplayBooking.jsx";
import Dashboard from "./Page/AdminP&B/Dashboard.jsx"; // ✅ Admin Dashboard
import AdminProductPage from "./Page/AdminP&M/AdminProductPage.jsx";
import Analytics from "./Page/AdminP&M/Analytics.jsx";
import AdminOrderManagement from "./Page/AdminP&M/AdminOrderManagement.jsx"; // ✅ Already imported
import ProductTablePage from "./Page/AdminP&M/ProductTablePage.jsx"; // ✅ Newly added import

function App() {
  return (
    <Router>
      <Routes>
        {/* Login pages */}
        <Route path="/lg" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />

        {/* Admin and Product Dashboards */}
        <Route path="/" element={<ProductDashboard />} />
        <Route path="/adminproductpage" element={<AdminProductPage />} />
        <Route path="/adminproducttable" element={<ProductTablePage />} /> {/* ✅ New Route */}
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/adminordermanage" element={<AdminOrderManagement />} />

        {/* Other pages */}
        <Route path="/admindashboard" element={<Dashboard />} />
        <Route path="/add-package" element={<PackageAdd />} />
        <Route path="/packagedisplay" element={<PackageDisplay />} />
        <Route path="/payment" element={<PaymentPage />} />
        <Route path="/displaybooking" element={<DisplayBooking />} />
      </Routes>
    </Router>
  );
}

export default App;
