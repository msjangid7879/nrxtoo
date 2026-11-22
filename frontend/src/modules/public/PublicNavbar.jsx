import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Gem,
  ChevronDown,
  Sparkles,
  Users,
  Receipt,
  ShoppingBag,
  ShieldCheck,
  ArrowRight,
  Menu,
  X,
  ExternalLink,
  Layers,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import { PRODUCTS_DATA } from '../../data/productsData.js';

export const PublicNavbar = () => {
  const [isProductsDropdownOpen, setIsProductsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { token, user, activeShop } = useAuth();

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsProductsDropdownOpen(false);
      }
    };
    if (isProductsDropdownOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isProductsDropdownOpen]);

  const handleProductsClick = (e) => {
    e.preventDefault();
    setIsProductsDropdownOpen(false);
    setIsMobileMenuOpen(false);

    if (location.pathname === '/' || location.pathname === '/products') {
      const section = document.getElementById('products-section');
      if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
        return;
      }
    }
    navigate('/#products');
  };

  const getProductIcon = (name) => {
    switch (name) {
      case 'Gem':
        return <Gem className="w-5 h-5" />;
      case 'Users':
        return <Users className="w-5 h-5" />;
      case 'Receipt':
        return <Receipt className="w-5 h-5" />;
      case 'ShoppingBag':
        return <ShoppingBag className="w-5 h-5" />;
      case 'ShieldCheck':
        return <ShieldCheck className="w-5 h-5" />;
      default:
        return <Gem className="w-5 h-5" />;
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-stone-950/90 backdrop-blur-md border-b border-amber-900/30 text-white selection:bg-amber-500 selection:text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Left: Brand Logo & Title */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-600 via-amber-500 to-yellow-400 p-0.5 shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform flex items-center justify-center">
              <div className="w-full h-full bg-stone-950 rounded-[14px] flex items-center justify-center">
                <Gem className="w-6 h-6 text-amber-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl tracking-wider text-white font-serif">NRXTOO</span>
                <span className="text-[10px] uppercase font-bold tracking-widest text-amber-400 bg-amber-500/10 border border-amber-500/30 px-1.5 py-0.5 rounded">
                  SUITE
                </span>
              </div>
              <p className="text-[11px] text-amber-200/60 font-medium tracking-wide">
                Jewellery & Stones Operating System
              </p>
            </div>
          </Link>

          {/* Center: Navigation Links */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              to="/"
              className={`text-sm font-medium transition-colors hover:text-amber-400 ${
                location.pathname === '/' ? 'text-amber-400 font-semibold' : 'text-slate-300'
              }`}
            >
              Home
            </Link>

            {/* Products Dropdown / Tab */}
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setIsProductsDropdownOpen(!isProductsDropdownOpen)}
                className={`flex items-center gap-1.5 text-sm font-medium transition-colors hover:text-amber-400 focus:outline-none ${
                  location.pathname.startsWith('/products') ? 'text-amber-400 font-semibold' : 'text-slate-300'
                }`}
              >
                <span>Products & Modules</span>
                <ChevronDown
                  className={`w-4 h-4 text-amber-400 transition-transform duration-200 ${
                    isProductsDropdownOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {/* Mega Dropdown Menu */}
              {isProductsDropdownOpen && (
                <div className="absolute top-12 left-1/2 -translate-x-1/2 w-[520px] bg-stone-900 border border-amber-900/50 rounded-3xl p-4 shadow-2xl shadow-black/80 backdrop-blur-xl animate-in fade-in zoom-in-95 duration-150 z-50">
                  <div className="flex items-center justify-between pb-3 px-2 border-b border-white/10 mb-3">
                    <span className="text-xs uppercase font-bold tracking-widest text-amber-400 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      NRXTOO Suite Modules
                    </span>
                    <button
                      onClick={handleProductsClick}
                      className="text-[11px] font-semibold text-slate-400 hover:text-amber-300 transition-colors"
                    >
                      View All Product Cards &rarr;
                    </button>
                  </div>

                  <div className="space-y-1.5">
                    {PRODUCTS_DATA.map((prod) => (
                      <Link
                        key={prod.slug}
                        to={`/products/${prod.slug}`}
                        onClick={() => setIsProductsDropdownOpen(false)}
                        className="flex items-start gap-3.5 p-3 rounded-2xl hover:bg-white/5 border border-transparent hover:border-amber-500/20 transition-all group"
                      >
                        <div
                          className={`w-10 h-10 rounded-xl bg-gradient-to-br ${prod.accentColor} text-white flex items-center justify-center flex-shrink-0 shadow-md group-hover:scale-105 transition-transform`}
                        >
                          {getProductIcon(prod.iconName)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors">
                              {prod.title}
                            </span>
                            <span className="text-[10px] font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                              {prod.badge}
                            </span>
                          </div>
                          <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">
                            {prod.tagline}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>

                  <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between px-2 text-[11px] text-slate-400">
                    <span>Showroom Cloud Architecture</span>
                    <button
                      onClick={handleProductsClick}
                      className="text-amber-400 hover:underline font-semibold"
                    >
                      Compare all 5 modules on Home Page &rarr;
                    </button>
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={handleProductsClick}
              className="text-sm font-medium text-slate-300 hover:text-amber-400 transition-colors"
            >
              Explore Modules
            </button>
          </div>

          {/* Right: Actions (Sign In / Register / Launcher) */}
          <div className="hidden sm:flex items-center gap-3">
            {token ? (
              <Link
                to="/launcher"
                className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-semibold text-xs rounded-xl shadow-lg shadow-amber-600/30 transition-all cursor-pointer"
              >
                <Layers className="w-4 h-4 text-amber-300" />
                <span>Go to App Launcher</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 text-xs font-semibold text-slate-200 hover:text-white hover:bg-white/10 rounded-xl transition-all border border-white/10"
                >
                  Sign In (User ID)
                </Link>

                <Link
                  to="/signup"
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-semibold text-xs rounded-xl shadow-lg shadow-amber-600/30 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer border border-amber-500/40"
                >
                  <span>Register Boutique & Account</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-stone-900 border-b border-amber-900/40 px-4 py-5 space-y-4">
          <Link
            to="/"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block text-sm font-semibold text-slate-200 hover:text-amber-400"
          >
            Home
          </Link>

          <div className="pt-2 border-t border-white/10">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400 block mb-2">
              Products & Modules
            </span>
            <div className="space-y-2">
              {PRODUCTS_DATA.map((prod) => (
                <Link
                  key={prod.slug}
                  to={`/products/${prod.slug}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-between p-2 rounded-xl bg-white/5 text-xs text-slate-200 hover:text-amber-300"
                >
                  <span className="font-semibold">{prod.title}</span>
                  <span className="text-[10px] text-amber-400 font-mono">{prod.badge}</span>
                </Link>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-white/10 space-y-2">
            {token ? (
              <Link
                to="/launcher"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full py-2.5 bg-amber-600 text-white font-semibold text-xs rounded-xl flex items-center justify-center gap-2"
              >
                <span>Enter App Launcher</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full py-2.5 bg-white/10 text-white font-semibold text-xs rounded-xl flex items-center justify-center"
                >
                  Sign In with User ID
                </Link>

                <Link
                  to="/signup"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full py-2.5 bg-gradient-to-r from-amber-600 to-amber-700 text-white font-semibold text-xs rounded-xl flex items-center justify-center gap-1.5"
                >
                  <span>Register Boutique & Account</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};
