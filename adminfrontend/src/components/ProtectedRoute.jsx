import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ element, allowedRoles = [] }) => {
  const { currentUser, isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    // Redirect to login if not authenticated
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  // If allowedRoles is empty, allow any authenticated user
  if (allowedRoles.length === 0) {
    return element;
  }

  // Check if user has the required role
  if (allowedRoles.includes(currentUser.jobRole)) {
    return element;
  }

  // Redirect to unauthorized page if user doesn't have the required role
  return <Navigate to="/unauthorized" replace />;
};

export default ProtectedRoute;