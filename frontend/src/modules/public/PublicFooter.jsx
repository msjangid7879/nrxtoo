import React from 'react';
import { Link } from 'react-router-dom';
import { Gem, ShieldCheck, ArrowRight, Heart } from 'lucide-react';
import { PRODUCTS_DATA } from '../../data/productsData.js';

export const PublicFooter = () => {
  return (
    <footer className="bg-stone-950 border-t border-amber-900/30 text-white pt-14 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-white/10">
          {/* Col 1: Brand & Mission */}
          <div className="md:col-span-1 space-y-4">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-600 to-yellow-400 p-0.5 shadow-md flex items-center justify-center">
                <div className="w-full h-full bg-stone-950 rounded-[10px] flex items-center justify-center">
                  <Gem className="w-5 h-5 text-amber-400" />
                </div>
              </div>
              <span className="font-extrabold text-xl tracking-wider text-white font-serif">NRXTOO</span>
            </Link>
            <p className="text-xs text-slate-400 leading-relaxed">
              The modern multi-tenant operating suite engineered exclusively for fine hallmarked jewellery, bullion merchants, and gemstone ateliers.
            </p>
            <div className="pt-2 text-xs text-amber-400/80 font-mono">
              Pure JavaScript • PostgreSQL • Local Ready
            </div>
          </div>

          {/* Col 2: Products & Modules */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-4">
              NRXTOO Products
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              {PRODUCTS_DATA.map((prod) => (
                <li key={prod.slug}>
                  <Link
                    to={`/products/${prod.slug}`}
                    className="hover:text-amber-300 transition-colors flex items-center justify-between"
                  >
                    <span>{prod.title}</span>
                    <span className="text-[10px] font-mono text-slate-500">{prod.badge}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Portal Access & Portals */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-4">
              Boutique Portals
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <Link to="/login" className="hover:text-amber-300 transition-colors">
                  Staff Sign In (User ID)
                </Link>
              </li>
              <li>
                <Link to="/signup" className="hover:text-amber-300 transition-colors">
                  New Shop Owner Registration
                </Link>
              </li>
              <li>
                <Link to="/launcher" className="hover:text-amber-300 transition-colors">
                  Google-Style App Launcher Hub
                </Link>
              </li>
              <li>
                <Link
                  to="/platform-admin/login"
                  className="hover:text-purple-400 transition-colors flex items-center gap-1.5"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
                  <span>Platform Super Admin</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Boutique Verification & Security */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-4">
              Industry Standards
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed mb-3">
              Built to comply with BIS Hallmarking HUID mandates, GIA/IGI gemstone grading parameters, GST Chapter 71 schedules, and encrypted multi-tenant data boundaries.
            </p>
            <div className="flex flex-wrap gap-1.5">
              <span className="text-[10px] bg-white/5 border border-white/10 px-2 py-0.5 rounded text-amber-300">
                BIS 22K 916
              </span>
              <span className="text-[10px] bg-white/5 border border-white/10 px-2 py-0.5 rounded text-amber-300">
                GIA Diamonds
              </span>
              <span className="text-[10px] bg-white/5 border border-white/10 px-2 py-0.5 rounded text-amber-300">
                GST E-Way Bill
              </span>
              <span className="text-[10px] bg-white/5 border border-white/10 px-2 py-0.5 rounded text-amber-300">
                Multi-Tenant
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} NRXTOO Multi-Tenant Jewellery & Stones Suite. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link to="/login" className="hover:text-slate-300">Sign In</Link>
            <Link to="/signup" className="hover:text-slate-300">Register</Link>
            <Link to="/platform-admin/login" className="text-purple-400 hover:text-purple-300">Super Admin</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
