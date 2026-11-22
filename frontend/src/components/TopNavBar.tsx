import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Grid,
  Sparkles,
  LogOut,
  ChevronDown,
  Building2,
  Store,
  Shield,
  Layers,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { AppLauncherModal } from './AppLauncherModal';

interface TopNavBarProps {
  currentModuleName?: string;
  onOpenShopProfile?: () => void;
}

export const TopNavBar: React.FC<TopNavBarProps> = ({ currentModuleName, onOpenShopProfile }) => {
  const { user, activeShop, role, logout } = useAuth();
  const [isLauncherOpen, setIsLauncherOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
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

  const getRoleBadge = (r?: string | null) => {
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
      {/* Left side: Brand, Shop branding, and Module Breadcrumb */}
      <div className="flex items-center gap-3 md:gap-5">
        {/* Brand Suite Icon */}
        <button
          onClick={() => navigate('/launcher')}
          className="flex items-center gap-2 group text-left focus:outline-none"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-600 via-amber-500 to-yellow-400 p-0.5 shadow-md shadow-amber-500/20 group-hover:scale-105 transition-transform flex items-center justify-center">
            <span className="text-white font-extrabold text-sm tracking-wider font-serif">N</span>
          </div>
          <div className="hidden sm:block">
            <div className="flex items-center gap-1">
              <span className="font-extrabold text-sm tracking-wider text-slate-900 font-serif">NRXTOO</span>
              <span className="text-[10px] uppercase font-semibold text-amber-600 bg-amber-50 px-1 rounded">SUITE</span>
            </div>
            <p className="text-[10px] text-slate-400 font-medium -mt-0.5">Jewellery & Stones</p>
          </div>
        </button>

        <span className="text-slate-300 hidden sm:inline">/</span>

        {/* Shop Name & Logo */}
        <div className="flex items-center gap-2 max-w-[200px] md:max-w-[320px]">
          {activeShop?.logo_url ? (
            <img
              src={activeShop.logo_url}
              alt={activeShop.name}
              className="w-7 h-7 rounded-lg object-cover border border-slate-200 shadow-2xs"
            />
          ) : (
            <div className="w-7 h-7 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700">
              <Store className="w-4 h-4" />
            </div>
          )}

          <div className="truncate">
            <h2 className="text-xs md:text-sm font-semibold text-slate-800 truncate" title={activeShop?.name}>
              {activeShop?.name || 'Active Shop'}
            </h2>
            {currentModuleName && (
              <span className="inline-block text-[10px] font-medium text-amber-700 bg-amber-50/80 px-1.5 py-0.2 rounded">
                {currentModuleName}
              </span>
            )}
          </div>
        </div>
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
            {/* 9-dot grid icon */}
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

          {/* 9-Dots Modal Dropdown */}
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
              <span className="text-[10px] text-slate-400 leading-tight">
                {user?.designation || role}
              </span>
            </div>

            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-500 to-amber-700 text-white flex items-center justify-center font-bold text-xs shadow-xs">
              {user?.full_name ? user.full_name[0].toUpperCase() : 'U'}
            </div>

            <ChevronDown className="w-3.5 h-3.5 text-slate-400 pr-0.5" />
          </button>

          {/* User Menu Dropdown */}
          {isUserMenuOpen && (
            <div className="absolute right-0 top-12 w-64 bg-white rounded-2xl shadow-xl border border-slate-200 p-3 z-50 animate-in fade-in zoom-in-95 duration-100">
              <div className="px-2 py-2 border-b border-slate-100">
                <p className="text-xs font-bold text-slate-800">{user?.full_name}</p>
                <p className="text-xs text-slate-500 truncate">{user?.email}</p>
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
                  className="w-full text-left px-2.5 py-1.5 text-xs font-medium text-purple-700 hover:bg-purple-50 rounded-lg flex items-center gap-2"
                >
                  <Shield className="w-4 h-4 text-purple-600" />
                  <span>Platform Super Admin</span>
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
