import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Gem,
  Sparkles,
  ShieldCheck,
  Users,
  Receipt,
  ShoppingBag,
  ArrowRight,
  CheckCircle2,
  Lock,
  Layers,
  ChevronRight,
  Star,
  ExternalLink,
  Sliders,
  Building2,
  Clock,
  Truck,
  FileText,
  BadgeCheck,
} from 'lucide-react';
import { PublicNavbar } from './PublicNavbar.jsx';
import { PublicFooter } from './PublicFooter.jsx';
import { PRODUCTS_DATA } from '../../data/productsData.js';

export const HomePage = ({ scrollTo }) => {
  const location = useLocation();

  useEffect(() => {
    if (scrollTo === 'products' || location.hash === '#products') {
      const el = document.getElementById('products-section');
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    }
  }, [scrollTo, location]);

  const getProductIcon = (name) => {
    switch (name) {
      case 'Gem':
        return <Gem className="w-8 h-8" />;
      case 'Users':
        return <Users className="w-8 h-8" />;
      case 'Receipt':
        return <Receipt className="w-8 h-8" />;
      case 'ShoppingBag':
        return <ShoppingBag className="w-8 h-8" />;
      case 'ShieldCheck':
        return <ShieldCheck className="w-8 h-8" />;
      default:
        return <Gem className="w-8 h-8" />;
    }
  };

  return (
    <div className="min-h-screen bg-stone-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-white">
      {/* Navigation Bar */}
      <PublicNavbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-24 lg:pt-28 lg:pb-32">
        {/* Glow Effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-amber-500/10 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute top-1/3 -left-20 w-80 h-80 bg-yellow-600/10 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute top-1/2 -right-20 w-80 h-80 bg-rose-600/10 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          {/* Eyebrow badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold mb-8 animate-in fade-in duration-300">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Next-Generation Jewellery & Gemstone Suite</span>
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
            <span className="text-slate-300">Google-Style App Launcher</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white tracking-tight font-serif max-w-5xl mx-auto leading-[1.15]">
            The Complete Operating System for{' '}
            <span className="bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 bg-clip-text text-transparent">
              Fine Jewellery & Gemstone Ateliers
            </span>
          </h1>

          <p className="mt-6 text-base sm:text-lg lg:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
            Unite your showroom vault, hallmark HUID gold, certified diamond grading, hierarchical HR operations, fiscal GST/export billing, and bespoke customer storefronts in one unified boutique suite.
          </p>

          {/* Action Buttons */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/signup"
              className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-500 hover:from-amber-700 hover:to-yellow-600 text-stone-950 font-extrabold text-sm rounded-2xl shadow-xl shadow-amber-500/20 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2.5 cursor-pointer"
            >
              <span>Register Boutique & Account</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to="/login"
              className="w-full sm:w-auto px-8 py-4 bg-white/10 hover:bg-white/15 text-white font-bold text-sm rounded-2xl border border-white/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Sign In with User ID</span>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </Link>

            <a
              href="#products-section"
              className="w-full sm:w-auto px-6 py-4 text-amber-300 hover:text-amber-200 font-semibold text-sm transition-colors flex items-center justify-center gap-1.5"
            >
              <span>Explore All 5 Modules &darr;</span>
            </a>
          </div>

          {/* Trust Highlights */}
          <div className="mt-14 pt-10 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-4 text-left max-w-4xl mx-auto">
            <div className="p-3 bg-white/5 rounded-2xl border border-white/5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 block">
                Hallmark Ready
              </span>
              <p className="text-xs text-slate-300 font-medium mt-0.5">
                BIS HUID 6-digit laser hallmark tracking
              </p>
            </div>

            <div className="p-3 bg-white/5 rounded-2xl border border-white/5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 block">
                Gemological 4Cs
              </span>
              <p className="text-xs text-slate-300 font-medium mt-0.5">
                GIA, IGI & SGL certificate linking
              </p>
            </div>

            <div className="p-3 bg-white/5 rounded-2xl border border-white/5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 block">
                User ID Login
              </span>
              <p className="text-xs text-slate-300 font-medium mt-0.5">
                No email on counter login screens
              </p>
            </div>

            <div className="p-3 bg-white/5 rounded-2xl border border-white/5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 block">
                Vault Privacy
              </span>
              <p className="text-xs text-slate-300 font-medium mt-0.5">
                Encrypted boutique data protection
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Google-Style 9-Dots App Switcher Showcase */}
      <section className="py-14 bg-stone-900/60 border-y border-amber-900/30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-stone-950/80 rounded-3xl p-6 md:p-8 border border-white/10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="grid grid-cols-3 gap-1 p-2.5 bg-amber-500/20 border border-amber-500/30 rounded-2xl">
                {[...Array(9)].map((_, i) => (
                  <span key={i} className="w-2 h-2 rounded-[2px] bg-amber-400"></span>
                ))}
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-bold text-white font-serif">
                  Google-Style 9-Dots App Launcher Built-In
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 mt-1">
                  Switch instantly between Inventory, Staff HR, GST Invoicing, and your Online Store without losing showroom context or logging in twice.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Link
                to="/signup"
                className="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer flex items-center gap-1.5"
              >
                <span>Try Live App Switcher</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* PRODUCTS SECTION: All NRXTOO Modules One by One */}
      <section id="products-section" className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold uppercase tracking-wider mb-3">
              <Gem className="w-3.5 h-3.5" />
              Comprehensive Modular Suite
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white font-serif tracking-tight">
              NRXTOO Products & Modules
            </h2>
            <p className="mt-4 text-sm sm:text-base text-slate-300">
              Each module is engineered to handle real-world jewellery showroom, manufacturing atelier, and international bullion compliance challenges. Click any card to explore its full technical specifications.
            </p>
          </div>

          {/* Product Cards Stack / Grid */}
          <div className="space-y-8">
            {PRODUCTS_DATA.map((product, idx) => (
              <div
                key={product.slug}
                className="group bg-gradient-to-br from-stone-900/90 to-stone-900/50 border border-white/10 hover:border-amber-500/40 rounded-3xl p-6 sm:p-8 lg:p-10 transition-all duration-300 shadow-xl hover:shadow-2xl hover:shadow-amber-950/20 relative overflow-hidden"
              >
                {/* Background accent glow */}
                <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl group-hover:bg-amber-500/10 transition-all pointer-events-none"></div>

                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-white/10">
                  <div className="flex items-start gap-4 sm:gap-6">
                    <div
                      className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl sm:rounded-3xl bg-gradient-to-br ${product.accentColor} text-white flex items-center justify-center flex-shrink-0 shadow-xl group-hover:scale-105 transition-transform`}
                    >
                      {getProductIcon(product.iconName)}
                    </div>

                    <div>
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <span className="text-xs font-mono font-bold text-amber-400 bg-amber-500/10 border border-amber-500/30 px-2.5 py-0.5 rounded-full">
                          {product.badge}
                        </span>
                        <span className="text-xs text-slate-400 font-medium">
                          {product.category}
                        </span>
                      </div>

                      <h3 className="text-2xl sm:text-3xl font-bold text-white font-serif mt-2 group-hover:text-amber-300 transition-colors">
                        {product.title}
                      </h3>

                      <p className="text-xs sm:text-sm text-amber-200/80 font-medium mt-1">
                        {product.tagline}
                      </p>
                    </div>
                  </div>

                  {/* Top CTA */}
                  <div className="flex items-center gap-3 self-start lg:self-center">
                    <Link
                      to={`/products/${product.slug}`}
                      className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs rounded-xl shadow-lg shadow-amber-500/20 hover:scale-105 transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>Explore {product.title} Specs</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>

                {/* Body: Narrative & Key Features */}
                <div className="py-6">
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-4xl">
                    {product.overview}
                  </p>

                  {/* Highlights Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                    {product.keyFeatures.map((kf, i) => (
                      <div
                        key={i}
                        className="p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-amber-500/20 transition-all flex items-start gap-3"
                      >
                        <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <CheckCircle2 className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-white tracking-wide">
                            {kf.title}
                          </h4>
                          <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                            {kf.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Footer specs & actions bar */}
                <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 font-mono">
                    {product.stats.map((st, i) => (
                      <div key={i} className="flex items-center gap-1.5">
                        <span className="text-slate-500">{st.label}:</span>
                        <span className="font-bold text-white">{st.value}</span>
                        {i < product.stats.length - 1 && <span className="text-slate-700 ml-2">•</span>}
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center gap-4 w-full sm:w-auto justify-end">
                    <Link
                      to="/login"
                      className="text-xs font-semibold text-slate-300 hover:text-white transition-colors"
                    >
                      Sign In to Module
                    </Link>
                    <Link
                      to={`/products/${product.slug}`}
                      className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1"
                    >
                      <span>Full Technical Breakdown</span>
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* High-Level Comparison & Architecture */}
      <section className="py-20 bg-stone-900/50 border-t border-amber-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-white font-serif">
              Built for Showrooms, Karigar Workshops & Global Exports
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-2">
              Why traditional generic ERPs and spreadsheets fail in the fine jewellery and gemstone trade:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-3xl bg-stone-950 border border-white/10 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                <Gem className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">Dynamic Field Intelligence</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Jewellery items require gross, net, and stone weights, making charges, and BIS HUID hallmarks. Gemstones require 4Cs, cut, carat weight, origin, and GIA certificates. NRXTOO changes form schemas dynamically.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-stone-950 border border-white/10 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">Role Hierarchy & Counter Security</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Sales staff must bill counter sales without seeing procurement bullion margins. Senior HR manages salary slips and digital gatepasses. Staff log in with User IDs without personal emails.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-stone-950 border border-white/10 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <Receipt className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">Tax Splits & E-Way Delivery Challans</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Automated 3% GST on bullion, differential tax on craftsmanship, karigar workshop delivery challans (Rule 55), automated E-Way bills, and international export invoicing with Chapter 71 HSN codes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Banner */}
      <section className="py-20 relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-amber-950 via-stone-900 to-amber-950 border border-amber-500/30 rounded-3xl p-8 sm:p-12 text-center shadow-2xl relative">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-600 to-yellow-400 p-0.5 shadow-xl mb-4">
              <div className="w-full h-full bg-stone-950 rounded-2xl flex items-center justify-center">
                <Gem className="w-7 h-7 text-amber-400" />
              </div>
            </div>

            <h2 className="text-2xl sm:text-4xl font-extrabold text-white font-serif">
              Elevate Your Boutique & Atelier Today
            </h2>
            <p className="mt-3 text-xs sm:text-sm text-amber-200/80 max-w-xl mx-auto">
              Register your boutique in under 2 minutes. Get instant access to the App Launcher Hub and all 5 modules.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/signup"
                className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-bold text-xs rounded-xl shadow-lg shadow-amber-600/30 transition-all flex items-center justify-center gap-2"
              >
                <span>Register Boutique & Account</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                to="/login"
                className="w-full sm:w-auto px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white font-semibold text-xs rounded-xl border border-white/20 transition-all"
              >
                Sign In with User ID
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <PublicFooter />
    </div>
  );
};
