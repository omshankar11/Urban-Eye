import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = ({ children, staffOnly = false, adminOnly = false }) => {
  const { user, token, loading } = useContext(AuthContext);

  if (loading) return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!token) return <Navigate to="/login" replace />;

  // adminOnly: only Admin (not Officer, not Guest)
  if (adminOnly && user?.role !== 'Admin') return <Navigate to="/dashboard" replace />;

  // staffOnly: Admin or Officer (not Guest)
  if (staffOnly && user?.role !== 'Admin' && user?.role !== 'Officer') {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;
