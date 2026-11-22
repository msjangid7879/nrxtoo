import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Receipt,
  Layers,
  ArrowRight,
  TrendingUp,
  FileText,
  DollarSign,
  Building2,
  CheckCircle,
  Gem,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { TopNavBar } from '../../components/TopNavBar';
import { apiRequest } from '../../services/api';

export const AccountingModulePage = () => {
  const { activeShop } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState(null);

  useEffect(() => {
    apiRequest('/placeholders/accounting-overview')
      .then((res) => {
        if (res.success) setData(res.summary);
      })
      .catch(() => {});
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <TopNavBar currentModuleName="Accounting & Billing" />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-8 space-y-6">
        {/* Module Header */}
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center shadow-xs">
              <Receipt className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl md:text-2xl font-bold text-slate-900 font-serif">
                  Accounting & Billing Module
                </h1>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                  Fiscal Ledger Active
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                GST Tax Invoices, Bullion Purchase Vouchers, and General Ledger Reconciliation.
              </p>
            </div>
          </div>

          <button
            onClick={() => navigate('/inventory')}
            className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold rounded-xl shadow-md shadow-emerald-700/30 flex items-center gap-1.5 self-start md:self-auto cursor-pointer"
          >
            <Gem className="w-4 h-4" />
            <span>Go to Shop & Inventory &rarr;</span>
          </button>
        </div>

        {/* Ledger Overview Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              Gross Revenue (FY 26-27)
            </span>
            <div className="text-2xl font-extrabold text-slate-900 font-mono mt-1">
              {activeShop?.currency_symbol || '₹'} 1,45,00,000.00
            </div>
            <div className="flex items-center gap-1 text-[11px] text-emerald-600 mt-1">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>+18.4% YoY Growth</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              Total Purchases & Bullion
            </span>
            <div className="text-2xl font-extrabold text-slate-900 font-mono mt-1">
              {activeShop?.currency_symbol || '₹'} 89,00,000.00
            </div>
            <span className="text-[11px] text-slate-400 mt-1 block">Hallmarked gold & certified gems</span>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              GST Tax Collected (3%)
            </span>
            <div className="text-2xl font-extrabold text-slate-900 font-mono mt-1">
              {activeShop?.currency_symbol || '₹'} 4,35,00,000.00
            </div>
            <span className="text-[11px] text-emerald-600 font-medium mt-1 block">GST Return GSTR-1 Filed</span>
          </div>
        </div>

        {/* Interactive Placeholder Sandbox */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-800">
            Recent Accounting Tax Vouchers (Synced with Inventory Sales)
          </h3>

          <div className="divide-y divide-slate-100 text-xs">
            <div className="py-3 flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-800">INV-2026-1042 — Wedding Bridal Collection</span>
                <p className="text-[11px] text-slate-400">Customer: Mrs. Ananya Rathore • Payment: UPI</p>
              </div>
              <span className="font-bold font-mono text-emerald-700">₹4,25,000.00</span>
            </div>

            <div className="py-3 flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-800">INV-2026-1049 — Astrological Ceylon Blue Sapphire</span>
                <p className="text-[11px] text-slate-400">Customer: Vikramaditya Roy • Payment: Card</p>
              </div>
              <span className="font-bold font-mono text-emerald-700">₹2,30,000.00</span>
            </div>

            <div className="py-3 flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-800">PUR-2026-081 — Bullion Procurement Lot</span>
                <p className="text-[11px] text-slate-400">Vendor: Jaipur Heritage Bullion • Payment: Bank Transfer</p>
              </div>
              <span className="font-bold font-mono text-blue-700">₹13,80,000.00</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
