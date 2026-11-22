import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Gem,
  Users,
  Receipt,
  ShoppingBag,
  ArrowRight,
  Sparkles,
  Building2,
  ShieldCheck,
  ChevronRight,
  ExternalLink,
  Store,
  Layers,
  CheckCircle2,
  Lock,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { TopNavBar } from '../../components/TopNavBar';
import { ALL_MODULE_DEFS } from '../../components/AppLauncherModal';
import { ShopProfileModal } from '../inventory/ShopProfileModal';

export const LauncherHubPage: React.FC = () => {
  const { user, activeShop, role, enabledModules } = useAuth();
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const navigate = useNavigate();

  // Filter modules to only those enabled for this shop
  const activeModuleDefs = ALL_MODULE_DEFS.filter((m) => enabledModules.includes(m.key));
  const disabledModuleDefs = ALL_MODULE_DEFS.filter((m) => !enabledModules.includes(m.key));

  const renderModuleIcon = (key: string) => {
    switch (key) {
      case 'inventory':
        return <Gem className="w-8 h-8" />;
      case 'hr':
        return <Users className="w-8 h-8" />;
      case 'accounting':
        return <Receipt className="w-8 h-8" />;
      case 'ecommerce':
        return <ShoppingBag className="w-8 h-8" />;
      default:
        return <Gem className="w-8 h-8" />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <TopNavBar
        currentModuleName="App Launcher Hub"
        onOpenShopProfile={() => setIsProfileModalOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-8 md:py-10">
        {/* Welcome Banner with Shop Branding */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-stone-900 via-amber-950 to-stone-900 text-white p-6 md:p-8 shadow-xl mb-10 border border-amber-900/30">
          {/* Subtle background glow */}
          <div className="absolute -right-10 -bottom-10 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              {activeShop?.logo_url ? (
                <img
                  src={activeShop.logo_url}
                  alt={activeShop.name}
                  className="w-16 h-16 md:w-20 md:h-20 rounded-2xl object-cover border-2 border-amber-400/40 shadow-lg"
                />
              ) : (
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-amber-400 shadow-lg">
                  <Store className="w-9 h-9" />
                </div>
              )}

              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/30 uppercase tracking-wider">
                    {role} WORKSPACE
                  </span>
                  <span className="text-xs text-slate-400 font-mono">
                    ID: {activeShop?.slug}
                  </span>
                </div>
                <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white font-serif">
                  {activeShop?.name || 'NRXTOO Suite'}
                </h1>
                <p className="text-xs md:text-sm text-amber-200/80 mt-1 max-w-xl">
                  {activeShop?.tagline || 'Welcome to your NRXTOO Jewellery & Stones Management Console.'}
                </p>
              </div>
            </div>

            <div className="flex flex-row md:flex-col items-center md:items-end justify-between border-t md:border-t-0 pt-4 md:pt-0 border-white/10 gap-3">
              <div className="text-left md:text-right">
                <span className="text-[11px] text-slate-400 uppercase tracking-widest block">Logged in as</span>
                <span className="text-sm font-semibold text-white block">{user?.full_name}</span>
                <span className="text-xs text-amber-300/90 font-mono block">{user?.email}</span>
              </div>

              <button
                onClick={() => setIsProfileModalOpen(true)}
                className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-medium border border-white/10 transition-colors flex items-center gap-1.5"
              >
                <Building2 className="w-3.5 h-3.5 text-amber-400" />
                <span>Shop Profile Setup</span>
              </button>
            </div>
          </div>
        </div>

        {/* Section Heading */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">Google-Style App Launcher</h2>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-amber-100 text-amber-800">
                {activeModuleDefs.length} Active Modules
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Select an enabled application below or use the 9-dots button in the top navigation bar anytime.
            </p>
          </div>
        </div>

        {/* App Launcher Tiles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-5 mb-10">
          {activeModuleDefs.map((mod) => (
            <div
              key={mod.key}
              onClick={() => navigate(mod.path)}
              className="group bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm hover:shadow-xl hover:border-amber-300 transition-all duration-200 cursor-pointer flex flex-col justify-between relative overflow-hidden"
            >
              <div className="flex items-start justify-between gap-4 mb-4">
                <div
                  className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-md transition-transform group-hover:scale-105 duration-200 ${mod.colorBg}`}
                >
                  {renderModuleIcon(mod.key)}
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                    {mod.badge}
                  </span>
                  {mod.isCore && (
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                      Primary
                    </span>
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-900 group-hover:text-amber-600 transition-colors flex items-center gap-2">
                  <span>{mod.title}</span>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-amber-600 group-hover:translate-x-1 transition-all" />
                </h3>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                  {mod.description}
                </p>
              </div>

              <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs font-semibold text-amber-700 flex items-center gap-1 group-hover:underline">
                  Launch Module
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </span>
                <span className="text-[11px] text-slate-400 font-mono">
                  Route: {mod.path}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Disabled Modules (if any are toggled off by Platform Admin) */}
        {disabledModuleDefs.length > 0 && (
          <div className="bg-slate-100/80 rounded-2xl p-5 border border-slate-200 mb-10">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-slate-500" />
                <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Modules Disabled for {activeShop?.name}
                </h3>
              </div>
              <span className="text-[11px] text-slate-400">
                Can be enabled via Platform Super Admin
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {disabledModuleDefs.map((dMod) => (
                <div
                  key={dMod.key}
                  className="bg-white/70 rounded-xl p-3 border border-slate-200 flex items-center justify-between opacity-70"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-slate-200 text-slate-500 flex items-center justify-center">
                      <Lock className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-700">{dMod.title}</h4>
                      <p className="text-[10px] text-slate-400">{dMod.badge} • Inactive</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-semibold text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                    Disabled
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quick Suite Guide & Role Hierarchy Status */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
          <h3 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-amber-600" />
            <span>Multi-Tenant Architecture & Current Session</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/60">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                Current Role & Rights
              </span>
              <p className="font-bold text-slate-800 text-sm mt-1">{role}</p>
              <p className="text-slate-500 text-[11px] mt-0.5">
                HR Level: <span className="font-semibold text-slate-700">{user?.hr_level || 'STANDARD'}</span>
              </p>
              <div className="mt-2 text-[10px] text-slate-400 font-mono">
                Permissions: {user?.permissions?.length || 0} active flags
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/60">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                Active Tenant Database Scope
              </span>
              <p className="font-bold text-slate-800 text-sm mt-1 truncate">{activeShop?.name}</p>
              <p className="text-slate-500 text-[11px] mt-0.5 truncate">
                {activeShop?.address || 'Jaipur Souk, India'}
              </p>
              <div className="mt-2 text-[10px] text-amber-700 font-semibold">
                Currency: {activeShop?.currency_symbol} ({activeShop?.currency})
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/60">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                Google 9-Dots Switcher
              </span>
              <p className="font-bold text-slate-800 text-sm mt-1">Global Bento Switcher</p>
              <p className="text-slate-500 text-[11px] mt-0.5">
                Always available in the top bar to switch between enabled modules without losing context.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Shop Profile Setup Modal */}
      {isProfileModalOpen && (
        <ShopProfileModal
          isOpen={isProfileModalOpen}
          onClose={() => setIsProfileModalOpen(false)}
        />
      )}
    </div>
  );
};
