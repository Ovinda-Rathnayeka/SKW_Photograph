import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const UnauthorizedPage = () => {
  const { currentUser } = useAuth();
  
  // Determine where to redirect the user based on their role
  const getDashboardLink = () => {
    const roleToRoute = {
      packageBookingManager: "/PDashboard",
      resourceManager: "/RDashbaord",
      feedbackManager: "/feedback-dashboard",
      hrManager: "/HRDashbaord",
      photographers: "/photographers/dashboard",
      videographers: "/videographers/dashboard",
      helpers: "/helpers/dashboard",
    };
    
    return roleToRoute[currentUser?.jobRole] || "/";
  };
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 text-center">
        <h1 className="text-3xl font-bold text-red-600 mb-4">Access Denied</h1>
        <p className="text-gray-700 mb-6">
          You do not have permission to access this page. Please contact your administrator if you believe this is a mistake.
        </p>
        <Link 
          to={getDashboardLink()}
          className="inline-block px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default UnauthorizedPage;