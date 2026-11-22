import React, { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
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
  ChevronRight,
  Layers,
  ArrowLeft,
  Calendar,
  Clock,
  Truck,
  FileText,
  BadgeCheck,
  TrendingUp,
  Globe,
  Sliders,
  BarChart3,
  Award,
  ArrowDownLeft,
  MessageSquare,
} from 'lucide-react';
import { PublicNavbar } from './PublicNavbar.jsx';
import { PublicFooter } from './PublicFooter.jsx';
import { PRODUCTS_DATA } from '../../data/productsData.js';

export const ProductDetailPage = () => {
  const { moduleSlug } = useParams();
  const navigate = useNavigate();

  // Scroll to top on load or slug change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [moduleSlug]);

  const product = PRODUCTS_DATA.find((p) => p.slug === moduleSlug) || PRODUCTS_DATA[0];

  const getProductIcon = (name) => {
    switch (name) {
      case 'Gem':
        return <Gem className="w-8 h-8 sm:w-10 sm:h-10" />;
      case 'Users':
        return <Users className="w-8 h-8 sm:w-10 sm:h-10" />;
      case 'Receipt':
        return <Receipt className="w-8 h-8 sm:w-10 sm:h-10" />;
      case 'ShoppingBag':
        return <ShoppingBag className="w-8 h-8 sm:w-10 sm:h-10" />;
      case 'ShieldCheck':
        return <ShieldCheck className="w-8 h-8 sm:w-10 sm:h-10" />;
      default:
        return <Gem className="w-8 h-8 sm:w-10 sm:h-10" />;
    }
  };

  const getFeatureIcon = (name) => {
    switch (name) {
      case 'Sparkles':
        return <Sparkles className="w-5 h-5" />;
      case 'Award':
        return <Award className="w-5 h-5" />;
      case 'ArrowDownLeft':
        return <ArrowDownLeft className="w-5 h-5" />;
      case 'FileText':
        return <FileText className="w-5 h-5" />;
      case 'Shield':
        return <ShieldCheck className="w-5 h-5" />;
      case 'Calendar':
        return <Calendar className="w-5 h-5" />;
      case 'BadgeCheck':
        return <BadgeCheck className="w-5 h-5" />;
      case 'Lock':
        return <Lock className="w-5 h-5" />;
      case 'MessageSquare':
        return <MessageSquare className="w-5 h-5" />;
      case 'TrendingUp':
        return <TrendingUp className="w-5 h-5" />;
      case 'Receipt':
        return <Receipt className="w-5 h-5" />;
      case 'Truck':
        return <Truck className="w-5 h-5" />;
      case 'Globe':
        return <Globe className="w-5 h-5" />;
      case 'ShoppingBag':
        return <ShoppingBag className="w-5 h-5" />;
      case 'Clock':
        return <Clock className="w-5 h-5" />;
      case 'Sliders':
        return <Sliders className="w-5 h-5" />;
      case 'ShieldCheck':
        return <ShieldCheck className="w-5 h-5" />;
      case 'Users':
        return <Users className="w-5 h-5" />;
      case 'BarChart3':
        return <BarChart3 className="w-5 h-5" />;
      default:
        return <CheckCircle2 className="w-5 h-5" />;
    }
  };

  return (
    <div className="min-h-screen bg-stone-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-white">
      {/* Public Navbar */}
      <PublicNavbar />

      {/* Main Content Area: Explaining ONLY this selected module */}
      <main className="flex-1">
        {/* Module Header / Hero */}
        <section className="relative overflow-hidden pt-12 pb-20 border-b border-amber-900/30">
          <div className="absolute top-0 right-1/4 w-[500px] h-[350px] bg-amber-500/10 rounded-full blur-[100px] pointer-events-none"></div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            {/* Breadcrumb Navigation */}
            <div className="flex items-center gap-2 text-xs text-slate-400 mb-8">
              <Link to="/" className="hover:text-amber-400 transition-colors">
                Home
              </Link>
              <span>/</span>
              <a href="/#products-section" className="hover:text-amber-400 transition-colors">
                Products
              </a>
              <span>/</span>
              <span className="text-amber-300 font-semibold">{product.title}</span>
            </div>

            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
              <div className="flex items-start gap-4 sm:gap-6">
                <div
                  className={`w-16 h-16 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-br ${product.accentColor} text-white flex items-center justify-center flex-shrink-0 shadow-2xl`}
                >
                  {getProductIcon(product.iconName)}
                </div>

                <div>
                  <div className="flex items-center gap-2 flex-wrap mb-2">
                    <span className="text-xs font-mono font-bold text-amber-400 bg-amber-500/10 border border-amber-500/30 px-3 py-1 rounded-full">
                      {product.badge}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">
                      Category: {product.category}
                    </span>
                  </div>

                  <h1 className="text-3xl sm:text-5xl font-extrabold text-white font-serif tracking-tight">
                    {product.title}
                  </h1>

                  <p className="text-sm sm:text-base text-amber-200/90 font-medium mt-2 max-w-2xl">
                    {product.subtitle}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 self-start lg:self-center">
                <Link
                  to="/login"
                  className="px-6 py-3.5 bg-white/10 hover:bg-white/15 text-white font-bold text-xs rounded-xl border border-white/20 transition-all text-center"
                >
                  Sign In with User ID
                </Link>

                <Link
                  to="/signup"
                  className="px-6 py-3.5 bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-500 hover:from-amber-700 hover:to-yellow-600 text-stone-950 font-extrabold text-xs rounded-xl shadow-lg shadow-amber-500/20 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  <span>Register Boutique & Account</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Quick Stat Highlights */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-12 pt-8 border-t border-white/10">
              {product.stats.map((st, i) => (
                <div key={i} className="p-4 rounded-2xl bg-white/5 border border-white/5">
                  <span className="text-[11px] font-mono text-amber-400 uppercase tracking-wider block">
                    {st.label}
                  </span>
                  <p className="text-lg sm:text-xl font-extrabold text-white font-serif mt-1">
                    {st.value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Section 1: Detailed Overview Narrative */}
        <section className="py-16 border-b border-white/10">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-400 block mb-2">
              Module Overview
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white font-serif mb-6">
              Why We Engineered {product.title}
            </h2>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              {product.overview}
            </p>
          </div>
        </section>

        {/* Section 2: Key Features Deep-Dive */}
        <section className="py-20 bg-stone-900/40 border-b border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="text-xs font-bold uppercase tracking-widest text-amber-400 block mb-2">
                Capabilities & Workflows
              </span>
              <h2 className="text-2xl sm:text-4xl font-bold text-white font-serif">
                Key Features of {product.title}
              </h2>
              <p className="mt-3 text-xs sm:text-sm text-slate-400">
                Detailed capabilities designed to replace fragile spreadsheets and disconnected legacy tools.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {product.keyFeatures.map((kf, i) => (
                <div
                  key={i}
                  className="p-6 sm:p-8 rounded-3xl bg-stone-950 border border-white/10 hover:border-amber-500/30 transition-all space-y-4"
                >
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
                    {getFeatureIcon(kf.icon)}
                  </div>
                  <h3 className="text-lg font-bold text-white tracking-wide">
                    {kf.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {kf.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Section 3: How It Works Step-by-Step */}
        <section className="py-20 border-b border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="text-xs font-bold uppercase tracking-widest text-amber-400 block mb-2">
                Operational Lifecycle
              </span>
              <h2 className="text-2xl sm:text-4xl font-bold text-white font-serif">
                How {product.title} Works
              </h2>
              <p className="mt-3 text-xs sm:text-sm text-slate-400">
                A straightforward, audit-safe workflow from initial showroom entry to customer delivery.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {product.howItWorks.map((hw, i) => (
                <div
                  key={i}
                  className="p-6 rounded-3xl bg-white/5 border border-white/10 hover:border-amber-500/30 transition-all flex flex-col justify-between"
                >
                  <div>
                    <span className="text-3xl font-extrabold text-amber-400/80 font-mono block mb-4">
                      {hw.step}
                    </span>
                    <h4 className="text-base font-bold text-white mb-2">
                      {hw.title}
                    </h4>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {hw.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Section 4: Technical Specifications & Compliance */}
        <section className="py-20 bg-stone-900/40 border-b border-white/10">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <span className="text-xs font-bold uppercase tracking-widest text-amber-400 block mb-2">
                Standards & Specifications
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-white font-serif">
                Technical & Industry Specifications
              </h2>
            </div>

            <div className="bg-stone-950 border border-white/10 rounded-3xl overflow-hidden">
              <div className="divide-y divide-white/10 text-xs sm:text-sm">
                {product.specifications.map((sp, i) => (
                  <div
                    key={i}
                    className="p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                  >
                    <span className="font-bold text-amber-300 w-full sm:w-1/3">
                      {sp.spec}
                    </span>
                    <span className="text-slate-300 w-full sm:w-2/3 font-medium">
                      {sp.detail}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Section 5: Other Modules Switcher */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-lg font-bold text-white font-serif">
                  Explore Other NRXTOO Modules
                </h3>
                <p className="text-xs text-slate-400">
                  Switch between modules or return to the complete home overview.
                </p>
              </div>

              <Link
                to="/#products"
                className="text-xs text-amber-400 hover:underline font-semibold flex items-center gap-1"
              >
                <span>View All 5 Modules on Home</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {PRODUCTS_DATA.filter((p) => p.slug !== product.slug).map((other) => (
                <Link
                  key={other.slug}
                  to={`/products/${other.slug}`}
                  className="p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-amber-500/30 hover:bg-white/10 transition-all flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-8 h-8 rounded-xl bg-gradient-to-br ${other.accentColor} text-white flex items-center justify-center flex-shrink-0`}
                    >
                      {getProductIcon(other.iconName)}
                    </div>
                    <div className="truncate">
                      <h4 className="text-xs font-bold text-white group-hover:text-amber-300 transition-colors truncate">
                        {other.title}
                      </h4>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {other.badge}
                      </span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-amber-400 group-hover:translate-x-1 transition-all flex-shrink-0" />
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Bottom CTA Card */}
        <section className="py-16 bg-gradient-to-b from-stone-900 to-stone-950 border-t border-white/10">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-white font-serif">
              Ready to deploy {product.title} for your boutique?
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-2 max-w-lg mx-auto">
              Register your boutique now or sign in with your User ID to experience our Google-style App Launcher hub.
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
                className="w-full sm:w-auto px-6 py-3.5 bg-white/10 hover:bg-white/15 text-white font-semibold text-xs rounded-xl border border-white/20 transition-all"
              >
                Sign In with User ID
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Public Footer */}
      <PublicFooter />
    </div>
  );
};
