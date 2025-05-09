import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./Page/LoginPage.jsx";

import PackageAdd from "./Page/AdminP&B/PackageAdd.jsx";
import PackageDisplay from "./Page/AdminP&B/PackageDisplay.jsx";
import PDashboard from "./Page/AdminP&B/Dashboard.jsx";
import PaymentPage from "./Page/AdminP&B/PaymentPage.jsx";
import DisplayBooking from "./Page/AdminP&B/DisplayBooking.jsx";

import RDashbaord from "./Page/AdminR&T/Dashboard.jsx";
import ResourcesPage from "./Page/AdminR&T/ResourcesPage.jsx";
import CustomizationPage from "./Page/AdminP&B/CustomizationPage.jsx";

import HRDashbaord from "./Page/AdminHR/Dashbaord.jsx";
import AddEmployee from "./Page/AdminHR/AddEmployee.jsx";
import DisplayHR from "./Page/AdminHR/DisplayHR.jsx";
import AssignTask from "./Page/AdminHR/AssignTask.jsx";

import FeedbackDashboard from "./Page/AdminF/Dashboard.jsx";
import FeedbackTable from "./Page/AdminF/Feedbacks.jsx";

import ProductDashboard from "./Page/AdminP&M/Productashboard.jsx";
import AdminProductPage from "./Page/AdminP&M/AdminProductPage.jsx";
import ProductTablePage from "./Page/AdminP&M/ProductTablePage.jsx";
import Analytics from "./Page/AdminP&M/Analytics.jsx";
import AdminOrderManagement from "./Page/AdminP&M/AdminOrderManagement.jsx";
import AssignResources from "./Page/AdminR&T/AssignResources.jsx";

function App() {
  return (
    <Router>
      <div>
        <Routes>
          {/* Admin and Product Dashboards */}
          <Route path="/productdashboard" element={<ProductDashboard />} />
          <Route path="/adminproductpage" element={<AdminProductPage />} />
          <Route
            path="/adminproducttable"
            element={<ProductTablePage />}
          />{" "}
          {/*  New Route */}
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/adminordermanage" element={<AdminOrderManagement />} />
          {/* ----------- */}
          <Route path="/" element={<LoginPage />} />
          <Route path="/PDashboard" element={<PDashboard />} />
          <Route path="/add-package" element={<PackageAdd />} />
          <Route path="/packagedisplay" element={<PackageDisplay />} />
          <Route path="/payment" element={<PaymentPage />} />
          <Route path="/displaybooking" element={<DisplayBooking />} />
          <Route path="/RDashbaord" element={<RDashbaord />} />
          <Route path="/re" element={<ResourcesPage />} />
          <Route path="/customization" element={<CustomizationPage />} />
          <Route path="/HRDashbaord" element={<HRDashbaord />} />
          <Route path="/add-employee" element={<AddEmployee />} />
          <Route path="/displayHR" element={<DisplayHR />} />
          <Route path="/feedbackDashboard" element={<FeedbackDashboard />} />
          <Route path="/feedbackTable" element={<FeedbackTable />} />
          <Route path="/assign-task" element={<AssignTask />} />
          <Route path="/assign-resources" element={<AssignResources />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
