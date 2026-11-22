import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Shield, Lock, User, ArrowRight, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';

export const PlatformAdminLoginPage = () => {
  const [userId, setUserId] = useState('superadmin');
  const [password, setPassword] = useState('SuperAdmin123!');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const { platformLogin } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await platformLogin(userId, password);
      navigate('/platform-admin');
    } catch (err) {
      setError(err.message || 'Platform authentication failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-4 selection:bg-purple-600 selection:text-white">
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-purple-600/20 border border-purple-500/30 text-purple-400 p-2 shadow-xl shadow-purple-900/30 mb-3">
            <Shield className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-wide">
            Platform Super Admin
          </h1>
          <p className="text-xs text-purple-300 font-mono mt-1">
            NRXTOO Suite Multi-Tenant Master Console
          </p>
          <div className="mt-2 inline-block px-2.5 py-1 rounded-full bg-purple-900/40 border border-purple-700/50 text-[11px] text-purple-300">
            Isolated from Shop Tenancy
          </div>
        </div>

        <div className="bg-slate-900/90 border border-purple-900/40 rounded-3xl p-6 md:p-8 shadow-2xl backdrop-blur-xl">
          {error && (
            <div className="mb-4 p-3 bg-rose-950/60 border border-rose-800 text-rose-300 rounded-xl flex items-center gap-2 text-xs">
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Platform Admin User ID *
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  required
                  placeholder="e.g. superadmin"
                  className="w-full pl-9 pr-3.5 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-xs font-mono font-bold text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Master Security Password *
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-9 pr-10 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-xs font-medium text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-xl text-xs shadow-lg shadow-purple-900/50 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <span>Enter Super Admin Console</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Fill */}
          <div className="mt-5 pt-4 border-t border-slate-800 flex items-center justify-between">
            <span className="text-[11px] text-slate-400 font-mono">User ID: superadmin</span>
            <button
              type="button"
              onClick={() => {
                setUserId('superadmin');
                setPassword('SuperAdmin123!');
              }}
              className="text-[11px] text-purple-400 hover:text-purple-300 underline font-medium"
            >
              Fill Demo Pass
            </button>
          </div>
        </div>

        <div className="mt-5 text-center">
          <Link
            to="/login"
            className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 transition-colors"
          >
            <span>&larr; Return to Regular Shop Staff Login</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
