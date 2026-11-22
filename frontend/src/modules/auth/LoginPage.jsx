import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import {
  Gem,
  Lock,
  User,
  ShieldCheck,
  Building2,
  ArrowRight,
  Sparkles,
  AlertCircle,
  Eye,
  EyeOff,
  UserPlus,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';

export const LoginPage = () => {
  const [userId, setUserId] = useState('admin_royal');
  const [password, setPassword] = useState('Admin123!');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/launcher';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await login(userId, password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || 'Login failed. Please verify your User ID and password.');
    } finally {
      setLoading(false);
    }
  };

  const setDemoCredentials = (uid, pass) => {
    setUserId(uid);
    setPassword(pass);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-stone-900 to-amber-950 flex flex-col justify-center items-center p-4 selection:bg-amber-500 selection:text-white">
      {/* Ambient background glow */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-600/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-md relative z-10">
        {/* Top Branding */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-600 via-amber-500 to-yellow-400 p-0.5 shadow-xl shadow-amber-600/30 mb-3">
            <div className="w-full h-full bg-stone-950 rounded-2xl flex items-center justify-center">
              <Gem className="w-7 h-7 text-amber-400" />
            </div>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-wide font-serif">
            NRXTOO
          </h1>
          <p className="text-xs uppercase tracking-widest font-semibold text-amber-400 mt-0.5">
            Jewellery & Stones Suite
          </p>
          <p className="text-xs text-slate-400 mt-1">
            Sign in with your unique <strong>User ID</strong> and Password
          </p>
        </div>

        {/* Card */}
        <div className="bg-white/95 backdrop-blur-xl border border-white/20 rounded-3xl p-6 md:p-8 shadow-2xl shadow-black/40">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-800">User ID Sign In</h2>
              <p className="text-xs text-slate-500">
                Enter your unique User ID & Password
              </p>
            </div>
            <span className="text-[10px] font-mono font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded border border-amber-300">
              No Email Required
            </span>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2 text-rose-700 text-xs animate-in fade-in duration-200">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* User ID (NOT Email) */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Unique User ID *
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  required
                  placeholder="e.g. admin_royal, senior_hr, staff_kavita"
                  className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 transition-all"
                />
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Password *
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full pl-9 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 transition-all"
                />
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 focus:outline-none"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-semibold rounded-xl text-xs shadow-md shadow-amber-600/30 flex items-center justify-center gap-2 transition-all duration-150 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <span>Sign In with User ID</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Staff Role Sign-In */}
          <div className="mt-6 pt-5 border-t border-slate-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                Quick Staff Role Access
              </span>
              <span className="text-[10px] text-amber-600 font-medium">Instant Sign-In</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setDemoCredentials('admin_royal', 'Admin123!')}
                className="text-left p-2 rounded-xl border border-amber-200 bg-amber-50/60 hover:bg-amber-100/60 transition-all text-xs"
              >
                <div className="font-bold text-amber-900 flex items-center gap-1">
                  <span>👑 Admin</span>
                </div>
                <div className="text-[10px] text-amber-700 font-mono">admin_royal</div>
              </button>

              <button
                type="button"
                onClick={() => setDemoCredentials('senior_hr', 'HrSenior123!')}
                className="text-left p-2 rounded-xl border border-indigo-200 bg-indigo-50/60 hover:bg-indigo-100/60 transition-all text-xs"
              >
                <div className="font-bold text-indigo-900 flex items-center gap-1">
                  <span>⭐ Senior HR</span>
                </div>
                <div className="text-[10px] text-indigo-700 font-mono">senior_hr</div>
              </button>

              <button
                type="button"
                onClick={() => setDemoCredentials('junior_hr', 'HrJunior123!')}
                className="text-left p-2 rounded-xl border border-blue-200 bg-blue-50/60 hover:bg-blue-100/60 transition-all text-xs"
              >
                <div className="font-bold text-blue-900 flex items-center gap-1">
                  <span>🔹 Junior HR</span>
                </div>
                <div className="text-[10px] text-blue-700 font-mono">junior_hr</div>
              </button>

              <button
                type="button"
                onClick={() => setDemoCredentials('staff_kavita', 'Staff123!')}
                className="text-left p-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 transition-all text-xs"
              >
                <div className="font-bold text-slate-800 flex items-center gap-1">
                  <span>👤 Staff</span>
                </div>
                <div className="text-[10px] text-slate-600 font-mono">staff_kavita</div>
              </button>
            </div>
          </div>

          {/* New Shop Owner Signup Link */}
          <div className="mt-5 pt-4 border-t border-slate-100 text-center">
            <Link
              to="/signup"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-700 hover:text-amber-800 bg-amber-50 hover:bg-amber-100/80 px-3.5 py-2 rounded-xl transition-colors border border-amber-200/80"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>New Shop Owner? Register Boutique & Account &rarr;</span>
            </Link>
          </div>
        </div>

        {/* Super Admin & Home Links */}
        <div className="mt-5 text-center flex flex-col items-center gap-2">
          <Link
            to="/platform-admin/login"
            className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-amber-300 font-medium transition-colors"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
            <span>Platform Super Admin Portal (/platform-admin) &rarr;</span>
          </Link>

          <Link
            to="/"
            className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-slate-300 transition-colors"
          >
            <span>&larr; Back to NRXTOO Public Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
