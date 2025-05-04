import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import LoginPage from "./Page/LoginPage.jsx";
import UnauthorizedPage from "./Page/UnauthorizedPage";

import PackageAdd from "./Page/AdminP&B/PackageAdd.jsx";
import PackageDisplay from "./Page/AdminP&B/PackageDisplay.jsx";
import PDashboard from "./Page/AdminP&B/Dashboard.jsx";
import PaymentPage from "./Page/AdminP&B/PaymentPage.jsx";
import DisplayBooking from "./Page/AdminP&B/DisplayBooking.jsx";

import RentalAdd from "./Page/AdminR&T/RentalAdd.jsx";
import RDashbaord from "./Page/AdminR&T/Dashboard.jsx";

import ResourcesPage from "./Page/AdminR&T/ResourcesPage.jsx";
import CustomizationPage from "./Page/AdminP&B/CustomizationPage.jsx";

import HRDashbaord from "./Page/AdminHR/Dashbaord.jsx";
import AddEmployee from "./Page/AdminHR/AddEmployee.jsx";
import DisplayHR from "./Page/AdminHR/DisplayHR.jsx";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<LoginPage />} />
          <Route path="/unauthorized" element={<UnauthorizedPage />} />
          
          {/* Package Manager Routes */}
          <Route path="/PDashboard" element={
            <ProtectedRoute 
              element={<PDashboard />} 
              allowedRoles={["packageBookingManager", "hrManager"]} 
            />
          } />
          <Route path="/payment" element={
            <ProtectedRoute 
              element={<PaymentPage />} 
              allowedRoles={["packageBookingManager", "hrManager"]} 
            />
          } />
          <Route path="/displaybooking" element={
            <ProtectedRoute 
              element={<DisplayBooking />} 
              allowedRoles={["packageBookingManager", "hrManager"]} 
            />
          } />
          <Route path="/customization" element={
            <ProtectedRoute 
              element={<CustomizationPage />} 
              allowedRoles={["packageBookingManager", "hrManager"]} 
            />
          } />
          
          {/* Resource Manager Routes */}
          <Route path="/RDashbaord" element={
            <ProtectedRoute 
              element={<RDashbaord />} 
              allowedRoles={["resourceManager", "hrManager"]} 
            />
          } />
          <Route path="/re" element={
            <ProtectedRoute 
              element={<ResourcesPage />} 
              allowedRoles={["resourceManager", "hrManager"]} 
            />
          } />
          <Route path="/rental/:id" element={
            <ProtectedRoute 
              element={<RentalAdd />} 
              allowedRoles={["resourceManager", "hrManager"]} 
            />
          } />
          
          {/* HR Manager Routes */}
          <Route path="/HRDashbaord" element={
            <ProtectedRoute 
              element={<HRDashbaord />} 
              allowedRoles={["hrManager"]} 
            />
          } />
          <Route path="/add-employee" element={
            <ProtectedRoute 
              element={<AddEmployee />} 
              allowedRoles={["hrManager"]} 
            />
          } />
          <Route path="/displayHR" element={
            <ProtectedRoute 
              element={<DisplayHR />} 
              allowedRoles={["hrManager"]} 
            />
          } />
          
          {/* Shared Routes */}
          <Route path="/add-package" element={
            <ProtectedRoute 
              element={<PackageAdd />} 
              allowedRoles={["resourceManager", "packageBookingManager", "hrManager"]} 
            />
          } />
          <Route path="/packagedisplay" element={
            <ProtectedRoute 
              element={<PackageDisplay />} 
              allowedRoles={["packageBookingManager", "resourceManager", "hrManager"]} 
            />
          } />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;