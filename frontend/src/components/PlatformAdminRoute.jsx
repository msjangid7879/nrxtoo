import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export const PlatformAdminRoute = ({ children }) => {
  const { platformToken, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs font-semibold text-purple-300 uppercase tracking-widest">
            Verifying Platform Super Admin Access...
          </p>
        </div>
      </div>
    );
  }

  if (!platformToken) {
    return <Navigate to="/platform-admin/login" state={{ from: location }} replace />;
  }

  return children;
};
