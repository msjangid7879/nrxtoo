import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LogOut,
  ChevronDown,
  Building2,
  Store,
  Shield,
  Layers,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { AppLauncherModal } from './AppLauncherModal.jsx';

export const TopNavBar = ({ currentModuleName, onOpenShopProfile }) => {
  const { user, activeShop, role, logout } = useAuth();
  const [isLauncherOpen, setIsLauncherOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const navigate = useNavigate();
  const userMenuRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setIsUserMenuOpen(false);
      }
    };
    if (isUserMenuOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isUserMenuOpen]);

  const getRoleBadge = (r) => {
    switch (r) {
      case 'ADMIN':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300">
            👑 Admin
          </span>
        );
      case 'SENIOR_HR':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800 border border-indigo-300">
            ⭐ Senior HR
          </span>
        );
      case 'JUNIOR_HR':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 border border-blue-300">
            🔹 Junior HR
          </span>
        );
      case 'STAFF':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-300">
            👤 Staff
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 lg:px-6 h-16 flex items-center justify-between shadow-xs">
      {/* Left side: Prominent Shop Logo, Shop Name, and Module Breadcrumb */}
      <div className="flex items-center gap-3 md:gap-4">
        <button
          onClick={() => navigate('/launcher')}
          className="flex items-center gap-3 group text-left focus:outline-none cursor-pointer"
          title="Return to Boutique App Launcher"
        >
          {activeShop?.logo_url ? (
            <img
              src={activeShop.logo_url}
              alt={activeShop.name}
              className="w-10 h-10 rounded-xl object-cover border border-amber-200/80 shadow-xs group-hover:scale-105 transition-transform"
            />
          ) : (
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-600 via-amber-500 to-yellow-400 p-0.5 shadow-sm group-hover:scale-105 transition-transform flex items-center justify-center">
              <div className="w-full h-full bg-stone-900 rounded-[10px] flex items-center justify-center text-amber-400 font-bold font-serif text-sm">
                {activeShop?.name ? activeShop.name.charAt(0).toUpperCase() : <Store className="w-5 h-5 text-amber-400" />}
              </div>
            </div>
          )}

          <div className="max-w-[200px] sm:max-w-[340px] truncate">
            <h1 className="text-sm sm:text-base font-bold text-slate-900 font-serif truncate leading-tight group-hover:text-amber-700 transition-colors">
              {activeShop?.name || 'My Jewellery Boutique'}
            </h1>
            <p className="text-[11px] text-slate-400 font-medium truncate leading-tight mt-0.5">
              {activeShop?.tagline || 'Fine Jewellery & Rare Gemstones'}
            </p>
          </div>
        </button>

        {currentModuleName && (
          <div className="hidden sm:flex items-center gap-2 pl-2 border-l border-slate-200">
            <span className="text-xs font-semibold text-amber-800 bg-amber-50 border border-amber-200/80 px-2.5 py-1 rounded-lg">
              {currentModuleName}
            </span>
          </div>
        )}
      </div>

      {/* Right side: Google-Style 9-Dots Launcher Switcher + User Profile */}
      <div className="flex items-center gap-2 md:gap-3">
        {/* Persistent 9-Dots Google-Style App Switcher */}
        <div className="relative">
          <button
            onClick={() => setIsLauncherOpen(!isLauncherOpen)}
            className={`p-2.5 rounded-full transition-all duration-150 flex items-center justify-center relative focus:outline-none ${
              isLauncherOpen
                ? 'bg-amber-100 text-amber-800 ring-2 ring-amber-400/50'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
            title="Google-style App Launcher (9-Dots)"
            aria-label="App Launcher"
          >
            <div className="grid grid-cols-3 gap-[3px] w-4 h-4">
              {[...Array(9)].map((_, i) => (
                <span
                  key={i}
                  className={`w-1 h-1 rounded-[1px] transition-colors ${
                    isLauncherOpen ? 'bg-amber-700' : 'bg-slate-600 group-hover:bg-slate-900'
                  }`}
                />
              ))}
            </div>
          </button>

          <AppLauncherModal isOpen={isLauncherOpen} onClose={() => setIsLauncherOpen(false)} />
        </div>

        {/* Shop Settings / Profile Quick Button */}
        {onOpenShopProfile && (
          <button
            onClick={onOpenShopProfile}
            className="hidden md:flex items-center gap-1.5 text-xs font-medium text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200/80 px-3 py-1.5 rounded-lg transition-colors border border-slate-200/60"
            title="Shop Branding & Profile Setup"
          >
            <Building2 className="w-3.5 h-3.5 text-slate-500" />
            <span>Shop Profile</span>
          </button>
        )}

        {/* User Profile & Role Dropdown */}
        <div className="relative" ref={userMenuRef}>
          <button
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            className="flex items-center gap-2 p-1.5 pl-2.5 rounded-full hover:bg-slate-100 border border-slate-200/80 transition-all focus:outline-none"
          >
            <div className="flex flex-col text-right hidden lg:block">
              <span className="text-xs font-semibold text-slate-800 leading-tight">
                {user?.full_name || 'User'}
              </span>
              <span className="text-[10px] text-slate-400 font-mono leading-tight">
                ID: {user?.user_id}
              </span>
            </div>

            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-500 to-amber-700 text-white flex items-center justify-center font-bold text-xs shadow-xs">
              {user?.full_name ? user.full_name[0].toUpperCase() : 'U'}
            </div>

            <ChevronDown className="w-3.5 h-3.5 text-slate-400 pr-0.5" />
          </button>

          {isUserMenuOpen && (
            <div className="absolute right-0 top-12 w-64 bg-white rounded-2xl shadow-xl border border-slate-200 p-3 z-50 animate-in fade-in zoom-in-95 duration-100">
              <div className="px-2 py-2 border-b border-slate-100">
                <p className="text-xs font-bold text-slate-800">{user?.full_name}</p>
                <p className="text-xs text-amber-700 font-mono font-semibold">User ID: {user?.user_id}</p>
                {user?.email && <p className="text-[11px] text-slate-400 truncate">{user.email}</p>}
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">Current Role:</span>
                  {getRoleBadge(role)}
                </div>
              </div>

              <div className="py-2 space-y-1">
                <button
                  onClick={() => {
                    navigate('/launcher');
                    setIsUserMenuOpen(false);
                  }}
                  className="w-full text-left px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 rounded-lg flex items-center gap-2"
                >
                  <Layers className="w-4 h-4 text-slate-400" />
                  <span>Launcher Hub</span>
                </button>

                {onOpenShopProfile && (
                  <button
                    onClick={() => {
                      onOpenShopProfile();
                      setIsUserMenuOpen(false);
                    }}
                    className="w-full text-left px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 rounded-lg flex items-center gap-2"
                  >
                    <Building2 className="w-4 h-4 text-slate-400" />
                    <span>Shop Profile & Branding</span>
                  </button>
                )}

                <button
                  onClick={() => {
                    navigate('/platform-admin/login');
                    setIsUserMenuOpen(false);
                  }}
                  className="w-full text-left px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 rounded-lg flex items-center gap-2"
                >
                  <Shield className="w-4 h-4 text-purple-600" />
                  <span>Network Administrator Portal</span>
                </button>
              </div>

              <div className="pt-2 border-t border-slate-100">
                <button
                  onClick={() => {
                    logout();
                    navigate('/login');
                  }}
                  className="w-full text-left px-2.5 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-lg flex items-center gap-2 transition-colors"
                >
                  <LogOut className="w-4 h-4 text-rose-600" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
