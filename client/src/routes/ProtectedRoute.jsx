import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ allowedRoles = [] }) => {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 text-xs text-slate-500">
        Authenticating session...
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    // If unauthorized for this specific role, redirect to their home dashboard
    if (user.role === 'admin') return <Navigate to="/admin" replace />;
    if (user.role === 'charity') return <Navigate to="/charity" replace />;
    return <Navigate to="/donor" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
