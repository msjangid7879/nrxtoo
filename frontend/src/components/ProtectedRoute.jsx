import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { Lock, AlertTriangle } from 'lucide-react';

export const ProtectedRoute = ({ children, requiredModule, allowedRoles }) => {
  const { token, isLoading, isModuleEnabled, hasRole, activeShop } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-amber-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest">
            Loading NRXTOO Suite...
          </p>
        </div>
      </div>
    );
  }

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requiredModule && !isModuleEnabled(requiredModule)) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl p-6 shadow-xl border border-slate-200 text-center">
          <div className="w-12 h-12 bg-amber-100 text-amber-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Lock className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-bold text-slate-800">Module Currently Disabled</h2>
          <p className="text-xs text-slate-500 mt-2">
            The module <span className="font-semibold text-slate-700 font-mono">[{requiredModule}]</span> is not enabled for{' '}
            <span className="font-semibold text-slate-700">{activeShop?.name || 'this shop'}</span>.
          </p>
          <div className="mt-6 flex flex-col gap-2">
            <a
              href="/launcher"
              className="w-full py-2.5 px-4 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-xl text-xs transition-colors"
            >
              Return to App Launcher
            </a>
            <a
              href="/platform-admin/login"
              className="text-xs text-slate-400 hover:text-slate-600 transition-colors"
            >
              Platform Admin Module Manager &rarr;
            </a>
          </div>
        </div>
      </div>
    );
  }

  if (allowedRoles && !hasRole(allowedRoles)) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl p-6 shadow-xl border border-rose-200 text-center">
          <div className="w-12 h-12 bg-rose-100 text-rose-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-bold text-slate-800">Restricted Access</h2>
          <p className="text-xs text-slate-500 mt-2">
            Your current role does not have permission to access this area. Allowed roles:{' '}
            <span className="font-semibold text-slate-700">{allowedRoles.join(', ')}</span>.
          </p>
          <div className="mt-6">
            <a
              href="/launcher"
              className="inline-block py-2.5 px-6 bg-slate-800 hover:bg-slate-900 text-white font-semibold rounded-xl text-xs transition-colors"
            >
              Back to Launcher Hub
            </a>
          </div>
        </div>
      </div>
    );
  }

  return children;
};
