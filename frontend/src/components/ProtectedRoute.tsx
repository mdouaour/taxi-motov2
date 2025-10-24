import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

interface ProtectedRouteProps {
  allowedRoles?: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles }) => {
  const userInfoString = localStorage.getItem('userInfo');
  const userInfo = userInfoString ? JSON.parse(userInfoString) : null;

  if (!userInfo || !userInfo.token) {
    // User not authenticated, redirect to login page
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(userInfo.role)) {
    // User authenticated but not authorized, redirect to home or unauthorized page
    return <Navigate to="/" replace />;
  }

  // User is authenticated and authorized, render the child routes
  return <Outlet />;
};

export default ProtectedRoute;
