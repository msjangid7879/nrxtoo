import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShoppingBag,
  ExternalLink,
  Globe,
  CheckCircle2,
  RefreshCw,
  Gem,
  Package,
  ShoppingCart,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { TopNavBar } from '../../components/TopNavBar';
import { apiRequest } from '../../services/api';

export const EcommerceModulePage: React.FC = () => {
  const { activeShop } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    apiRequest('/placeholders/ecommerce-overview')
      .then((res) => {
        if (res.success) setData(res.summary);
      })
      .catch(() => {});
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <TopNavBar currentModuleName="Online Shop & E-Commerce" />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-8 space-y-6">
        {/* Module Header */}
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 flex items-center justify-center shadow-xs">
              <ShoppingBag className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl md:text-2xl font-bold text-slate-900 font-serif">
                  Online Shop & E-Commerce Module
                </h1>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-200">
                  Online Storefront
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Public customer boutique, live catalogue synchronization, and online cart checkouts.
              </p>
            </div>
          </div>

          <button
            onClick={() => navigate('/inventory')}
            className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-xl shadow-md shadow-rose-600/30 flex items-center gap-1.5 self-start md:self-auto cursor-pointer"
          >
            <Gem className="w-4 h-4" />
            <span>Go to Shop & Inventory &rarr;</span>
          </button>
        </div>

        {/* Storefront Status Banner */}
        <div className="bg-gradient-to-r from-stone-900 via-rose-950 to-stone-900 rounded-3xl p-6 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-lg border border-rose-900/30">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold font-mono text-emerald-400">● LIVE ON WEB</span>
                <span className="text-xs text-slate-400">SSL 256-bit Encrypted</span>
              </div>
              <p className="text-sm font-bold text-white mt-0.5">
                https://store.nrxtoo.com/{activeShop?.slug || 'royal-jewellers'}
              </p>
            </div>
          </div>

          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              alert(`Simulating opening public online boutique for ${activeShop?.name}`);
            }}
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold border border-white/20 flex items-center gap-1.5 transition-colors self-start sm:self-auto"
          >
            <span>Preview Customer Storefront</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* E-Commerce Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              Published Web Products
            </span>
            <div className="text-2xl font-extrabold text-slate-900 font-serif mt-1">
              48 Items
            </div>
            <span className="text-[10px] text-emerald-600 font-medium mt-1 block">
              ✓ Synchronized in real-time with Inventory
            </span>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              Pending Web Orders
            </span>
            <div className="text-2xl font-extrabold text-slate-900 font-serif mt-1">
              5 Orders
            </div>
            <span className="text-[10px] text-amber-600 font-medium mt-1 block">
              2 dispatch pending • 3 insured transit
            </span>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              Cart Conversion Rate
            </span>
            <div className="text-2xl font-extrabold text-slate-900 font-serif mt-1">
              3.4%
            </div>
            <span className="text-[10px] text-slate-400 mt-1 block">Average order value: ₹85,000</span>
          </div>
        </div>
      </main>
    </div>
  );
};
