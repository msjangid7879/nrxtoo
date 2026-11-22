import React, { useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Gem,
  Users,
  Receipt,
  ShoppingBag,
  ExternalLink,
  ShieldCheck,
  Building,
  CheckCircle2,
  Lock,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { ModuleKey, AppLauncherModuleDef } from '../types';

interface AppLauncherModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ALL_MODULE_DEFS: AppLauncherModuleDef[] = [
  {
    key: 'inventory',
    title: 'Shop & Inventory',
    description: 'Jewellery, Gems, HUID Hallmark, Purchases & Sales Billing',
    path: '/inventory',
    iconName: 'Gem',
    badge: 'Core Active',
    colorBg: 'bg-gradient-to-br from-amber-500 to-amber-700 text-white shadow-amber-500/20',
    colorText: 'text-amber-600',
    isCore: true,
  },
  {
    key: 'hr',
    title: 'Admin, HR & Clients',
    description: 'Staff Roster, Hierarchical Roles & Client CRM',
    path: '/hr',
    iconName: 'Users',
    badge: 'HR Suite',
    colorBg: 'bg-gradient-to-br from-indigo-500 to-indigo-700 text-white shadow-indigo-500/20',
    colorText: 'text-indigo-600',
  },
  {
    key: 'accounting',
    title: 'Accounting & Billing',
    description: 'General Ledger, GST Tax Invoices & Cashbooks',
    path: '/accounting',
    iconName: 'Receipt',
    badge: 'Finance',
    colorBg: 'bg-gradient-to-br from-emerald-500 to-emerald-700 text-white shadow-emerald-500/20',
    colorText: 'text-emerald-600',
  },
  {
    key: 'ecommerce',
    title: 'Online Shop & E-Commerce',
    description: 'Online Storefront, Catalog Sync & Web Orders',
    path: '/ecommerce',
    iconName: 'ShoppingBag',
    badge: 'Storefront',
    colorBg: 'bg-gradient-to-br from-rose-500 to-rose-700 text-white shadow-rose-500/20',
    colorText: 'text-rose-600',
  },
];

export const AppLauncherModal: React.FC<AppLauncherModalProps> = ({ isOpen, onClose }) => {
  const { enabledModules, activeShop } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Filter modules: show only enabled ones, but also show subtle disabled indicator if applicable
  const availableModules = ALL_MODULE_DEFS.filter((m) => enabledModules.includes(m.key));

  const renderModuleIcon = (key: ModuleKey) => {
    switch (key) {
      case 'inventory':
        return <Gem className="w-6 h-6" />;
      case 'hr':
        return <Users className="w-6 h-6" />;
      case 'accounting':
        return <Receipt className="w-6 h-6" />;
      case 'ecommerce':
        return <ShoppingBag className="w-6 h-6" />;
      default:
        return <Gem className="w-6 h-6" />;
    }
  };

  return (
    <div
      ref={dropdownRef}
      className="absolute right-0 top-14 w-96 max-w-[95vw] bg-white rounded-2xl shadow-2xl border border-slate-200/80 p-5 z-50 animate-in fade-in zoom-in-95 duration-150 backdrop-blur-md"
      style={{ boxShadow: '0 20px 40px -15px rgba(0,0,0,0.15), 0 0 1px 1px rgba(0,0,0,0.05)' }}
    >
      {/* Header */}
      <div className="flex items-center justify-between pb-3.5 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="grid grid-cols-3 gap-0.5 p-1 bg-amber-50 rounded-lg">
            {[...Array(9)].map((_, i) => (
              <span key={i} className="w-1.5 h-1.5 bg-amber-600 rounded-sm"></span>
            ))}
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-800 tracking-tight">NRXTOO App Launcher</h3>
            <p className="text-xs text-slate-400 font-medium truncate max-w-[190px]">
              {activeShop?.name || 'Active Shop'}
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            navigate('/launcher');
            onClose();
          }}
          className="text-xs font-semibold text-amber-600 hover:text-amber-700 bg-amber-50 hover:bg-amber-100/80 px-2.5 py-1 rounded-full transition-colors flex items-center gap-1"
        >
          <span>All Apps</span>
          <ExternalLink className="w-3 h-3" />
        </button>
      </div>

      {/* Google-style Bento App Tiles */}
      <div className="grid grid-cols-2 gap-3 py-4">
        {availableModules.map((mod) => {
          const isActive = location.pathname.startsWith(mod.path);
          return (
            <button
              key={mod.key}
              onClick={() => {
                navigate(mod.path);
                onClose();
              }}
              className={`group flex flex-col items-center text-center p-3 rounded-xl border transition-all duration-200 relative ${
                isActive
                  ? 'border-amber-400 bg-amber-50/50 shadow-sm ring-1 ring-amber-300'
                  : 'border-slate-100 hover:border-slate-200 hover:bg-slate-50/80'
              }`}
            >
              {isActive && (
                <span className="absolute top-2 right-2 flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-600"></span>
                </span>
              )}

              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center mb-2 shadow-sm transition-transform group-hover:scale-105 ${mod.colorBg}`}
              >
                {renderModuleIcon(mod.key)}
              </div>

              <span className="text-xs font-semibold text-slate-800 line-clamp-1 group-hover:text-amber-600 transition-colors">
                {mod.title}
              </span>

              <span className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">
                {mod.badge}
              </span>
            </button>
          );
        })}
      </div>

      {/* Modules Disabled Info if some are turned off for tenant */}
      {availableModules.length < ALL_MODULE_DEFS.length && (
        <div className="pt-2 pb-1 border-t border-slate-100">
          <div className="flex items-center gap-1.5 text-[11px] text-slate-400 bg-slate-50 p-2 rounded-lg">
            <Lock className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
            <span>
              {ALL_MODULE_DEFS.length - availableModules.length} module(s) disabled by Platform Admin for this shop.
            </span>
          </div>
        </div>
      )}

      {/* Footer Quick Links */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
        <button
          onClick={() => {
            navigate('/launcher');
            onClose();
          }}
          className="hover:text-slate-900 font-medium transition-colors"
        >
          Launcher Hub
        </button>
        <span className="text-slate-300">•</span>
        <span className="text-[11px] text-slate-400">Suite v1.0 • Multi-tenant</span>
      </div>
    </div>
  );
};
