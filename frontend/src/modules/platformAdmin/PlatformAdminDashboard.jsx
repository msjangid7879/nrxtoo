import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Shield,
  Building2,
  Users,
  Gem,
  Plus,
  RefreshCw,
  LogOut,
  ExternalLink,
  CheckCircle,
  Layers,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import { apiRequest } from '../../services/api.js';

export const PlatformAdminDashboard = () => {
  const { platformUser, platformLogout } = useAuth();
  const navigate = useNavigate();

  const [shops, setShops] = useState([]);
  const [stats, setStats] = useState({
    total_shops: 0,
    total_users: 0,
    total_items: 0,
    total_inventory_value: 0,
  });
  const [loading, setLoading] = useState(true);
  const [isCreateShopModalOpen, setIsCreateShopModalOpen] = useState(false);

  const [newShopData, setNewShopData] = useState({
    name: '',
    slug: '',
    tagline: '',
    phone: '',
    email: '',
    admin_name: '',
    admin_user_id: '',
    admin_password: '',
  });

  const [actionMsg, setActionMsg] = useState(null);

  const fetchPlatformData = async () => {
    setLoading(true);
    try {
      const shopsRes = await apiRequest('/platform-admin/shops', {}, true);
      if (shopsRes.success) {
        setShops(shopsRes.shops || []);
      }

      const statsRes = await apiRequest('/platform-admin/stats', {}, true);
      if (statsRes.success) {
        setStats(statsRes.stats);
      }
    } catch (err) {
      console.error('Failed to load platform data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlatformData();
  }, []);

  const handleToggleModule = async (shopId, moduleKey, currentStatus) => {
    try {
      await apiRequest(
        `/platform-admin/shops/${shopId}/modules/toggle`,
        {
          method: 'POST',
          body: JSON.stringify({
            module_key: moduleKey,
            is_enabled: !currentStatus,
          }),
        },
        true
      );

      setActionMsg(`Toggled module '${moduleKey}' for shop '${shopId}' to ${!currentStatus ? 'ENABLED' : 'DISABLED'}`);
      fetchPlatformData();
      setTimeout(() => setActionMsg(null), 3500);
    } catch (err) {
      alert(err.message || 'Failed to toggle module.');
    }
  };

  const handleCreateShop = async (e) => {
    e.preventDefault();
    try {
      await apiRequest(
        '/platform-admin/shops',
        {
          method: 'POST',
          body: JSON.stringify({
            name: newShopData.name,
            slug: newShopData.slug.toLowerCase().trim(),
            tagline: newShopData.tagline,
            phone: newShopData.phone,
            email: newShopData.email,
            initial_admin: newShopData.admin_user_id ? {
              full_name: newShopData.admin_name,
              user_id: newShopData.admin_user_id,
              password: newShopData.admin_password || 'Admin123!',
            } : undefined,
          }),
        },
        true
      );

      setIsCreateShopModalOpen(false);
      setNewShopData({
        name: '',
        slug: '',
        tagline: '',
        phone: '',
        email: '',
        admin_name: '',
        admin_user_id: '',
        admin_password: '',
      });
      fetchPlatformData();
    } catch (err) {
      alert(err.message || 'Failed to create shop.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-purple-900/40 px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-purple-600/30 border border-purple-500/40 text-purple-400 flex items-center justify-center font-bold">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-bold text-white tracking-wide">
                NRXTOO Platform Super Admin
              </h1>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-purple-900/50 text-purple-300 border border-purple-700/50">
                MASTER CONSOLE
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-mono">
              Global Tenant Management & Module Matrix
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <span className="text-xs font-semibold text-white block">
              {platformUser?.full_name || 'Super Admin'}
            </span>
            <span className="text-[10px] text-purple-300 font-mono block">
              User ID: {platformUser?.user_id}
            </span>
          </div>

          <Link
            to="/launcher"
            className="text-xs text-amber-400 hover:text-amber-300 bg-amber-950/40 border border-amber-800/60 px-3 py-1.5 rounded-xl transition-colors flex items-center gap-1.5"
          >
            <span>Open Shop App Launcher</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>

          <button
            onClick={() => {
              platformLogout();
              navigate('/platform-admin/login');
            }}
            className="p-2 rounded-xl text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 transition-colors"
            title="Log out of Super Admin"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 space-y-6">
        {actionMsg && (
          <div className="p-3 bg-purple-950/80 border border-purple-700 text-purple-200 rounded-2xl text-xs flex items-center gap-2 animate-in fade-in duration-150">
            <CheckCircle className="w-4 h-4 text-purple-400 flex-shrink-0" />
            <span>{actionMsg}</span>
          </div>
        )}

        {/* Global Platform Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-slate-900/80 border border-purple-900/30 rounded-2xl p-4">
            <span className="text-[11px] font-mono text-purple-400 uppercase tracking-wider block">
              Total Tenant Shops
            </span>
            <div className="flex items-baseline justify-between mt-2">
              <span className="text-3xl font-extrabold text-white font-mono">{stats.total_shops}</span>
              <Building2 className="w-6 h-6 text-purple-400 opacity-70" />
            </div>
            <span className="text-[10px] text-slate-400 mt-1 block">Active jewellery businesses</span>
          </div>

          <div className="bg-slate-900/80 border border-purple-900/30 rounded-2xl p-4">
            <span className="text-[11px] font-mono text-purple-400 uppercase tracking-wider block">
              Registered Staff
            </span>
            <div className="flex items-baseline justify-between mt-2">
              <span className="text-3xl font-extrabold text-white font-mono">{stats.total_users}</span>
              <Users className="w-6 h-6 text-purple-400 opacity-70" />
            </div>
            <span className="text-[10px] text-slate-400 mt-1 block">Across all tenants</span>
          </div>

          <div className="bg-slate-900/80 border border-purple-900/30 rounded-2xl p-4">
            <span className="text-[11px] font-mono text-purple-400 uppercase tracking-wider block">
              Total Vault Items
            </span>
            <div className="flex items-baseline justify-between mt-2">
              <span className="text-3xl font-extrabold text-white font-mono">{stats.total_items}</span>
              <Gem className="w-6 h-6 text-purple-400 opacity-70" />
            </div>
            <span className="text-[10px] text-slate-400 mt-1 block">Jewellery pieces & stones</span>
          </div>

          <div className="bg-slate-900/80 border border-purple-900/30 rounded-2xl p-4">
            <span className="text-[11px] font-mono text-purple-400 uppercase tracking-wider block">
              Global Valuation
            </span>
            <div className="flex items-baseline justify-between mt-2">
              <span className="text-2xl font-extrabold text-white font-mono">
                ₹{(stats.total_inventory_value || 0).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
              </span>
            </div>
            <span className="text-[10px] text-emerald-400 mt-1 block">Total platform inventory value</span>
          </div>
        </div>

        {/* Section Header */}
        <div className="flex items-center justify-between pt-4">
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
              <span>Tenant Shops & Module Activation Matrix</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Enable or disable specific modules per shop. Toggled changes immediately affect that shop's Google-style App Launcher.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={fetchPlatformData}
              className="p-2 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white rounded-xl border border-slate-800 transition-colors"
              title="Refresh tenants"
            >
              <RefreshCw className="w-4 h-4" />
            </button>

            <button
              onClick={() => setIsCreateShopModalOpen(true)}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold rounded-xl shadow-lg shadow-purple-900/40 flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Create New Shop Tenant</span>
            </button>
          </div>
        </div>

        {/* Shops & Modules Cards */}
        <div className="space-y-4">
          {shops.map((shop) => {
            const modulesMap = {};
            if (Array.isArray(shop.modules)) {
              shop.modules.forEach((m) => {
                modulesMap[m.module_key] = m.is_enabled;
              });
            }

            return (
              <div
                key={shop.id}
                className="bg-slate-900/80 border border-slate-800 hover:border-purple-800/50 rounded-3xl p-6 transition-all duration-200"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 pb-5 border-b border-slate-800">
                  <div className="flex items-start gap-4">
                    {shop.logo_url ? (
                      <img
                        src={shop.logo_url}
                        alt={shop.name}
                        className="w-14 h-14 rounded-2xl object-cover border border-slate-700 flex-shrink-0"
                      />
                    ) : (
                      <div className="w-14 h-14 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center text-purple-400 flex-shrink-0">
                        <Building2 className="w-7 h-7" />
                      </div>
                    )}

                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-base font-bold text-white">{shop.name}</h3>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                          slug: {shop.slug}
                        </span>
                        {shop.is_active ? (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800">
                            Active
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-950 text-rose-400 border border-rose-800">
                            Suspended
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-slate-400 mt-1 max-w-xl">
                        {shop.tagline || shop.address || 'Multi-tenant shop suite instance'}
                      </p>

                      <div className="flex items-center gap-4 mt-2 text-xs text-slate-400 font-mono">
                        <span>Staff: {shop.user_count || 0}</span>
                        <span>•</span>
                        <span>Vault Items: {shop.item_count || 0}</span>
                        <span>•</span>
                        <span>GSTIN: {shop.gstin || 'N/A'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-start lg:self-center">
                    <span className="text-xs text-slate-400 font-mono">
                      Shop ID: {shop.id}
                    </span>
                  </div>
                </div>

                {/* Module Toggles Row */}
                <div className="pt-5">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-3">
                    Active Modules Switcher for this Tenant:
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    {/* Inventory */}
                    <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-amber-950/60 text-amber-400 flex items-center justify-center">
                          <Gem className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-white">Shop & Inventory</h4>
                          <span className="text-[10px] text-slate-500 font-mono">key: inventory</span>
                        </div>
                      </div>

                      <button
                        onClick={() => handleToggleModule(shop.id, 'inventory', !!modulesMap['inventory'])}
                        className={`text-xs font-bold px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                          modulesMap['inventory']
                            ? 'bg-amber-600 text-white'
                            : 'bg-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        {modulesMap['inventory'] ? 'Enabled' : 'Disabled'}
                      </button>
                    </div>

                    {/* HR */}
                    <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-indigo-950/60 text-indigo-400 flex items-center justify-center">
                          <Users className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-white">Admin, HR & Clients</h4>
                          <span className="text-[10px] text-slate-500 font-mono">key: hr</span>
                        </div>
                      </div>

                      <button
                        onClick={() => handleToggleModule(shop.id, 'hr', !!modulesMap['hr'])}
                        className={`text-xs font-bold px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                          modulesMap['hr']
                            ? 'bg-indigo-600 text-white'
                            : 'bg-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        {modulesMap['hr'] ? 'Enabled' : 'Disabled'}
                      </button>
                    </div>

                    {/* Accounting */}
                    <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-emerald-950/60 text-emerald-400 flex items-center justify-center">
                          <Layers className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-white">Accounting & Billing</h4>
                          <span className="text-[10px] text-slate-500 font-mono">key: accounting</span>
                        </div>
                      </div>

                      <button
                        onClick={() => handleToggleModule(shop.id, 'accounting', !!modulesMap['accounting'])}
                        className={`text-xs font-bold px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                          modulesMap['accounting']
                            ? 'bg-emerald-600 text-white'
                            : 'bg-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        {modulesMap['accounting'] ? 'Enabled' : 'Disabled'}
                      </button>
                    </div>

                    {/* E-Commerce */}
                    <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-rose-950/60 text-rose-400 flex items-center justify-center">
                          <Building2 className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-white">Online Shop & E-Com</h4>
                          <span className="text-[10px] text-slate-500 font-mono">key: ecommerce</span>
                        </div>
                      </div>

                      <button
                        onClick={() => handleToggleModule(shop.id, 'ecommerce', !!modulesMap['ecommerce'])}
                        className={`text-xs font-bold px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                          modulesMap['ecommerce']
                            ? 'bg-rose-600 text-white'
                            : 'bg-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        {modulesMap['ecommerce'] ? 'Enabled' : 'Disabled'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* Create Shop Modal */}
      {isCreateShopModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-xl w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <h3 className="text-base font-bold text-white">Create New Tenant Shop</h3>
              <button
                onClick={() => setIsCreateShopModalOpen(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateShop} className="py-4 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Shop Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={newShopData.name}
                    onChange={(e) => setNewShopData({ ...newShopData, name: e.target.value })}
                    placeholder="e.g. NRXTOO Emerald Dynasty"
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Slug ID *
                  </label>
                  <input
                    type="text"
                    required
                    value={newShopData.slug}
                    onChange={(e) => setNewShopData({ ...newShopData, slug: e.target.value })}
                    placeholder="e.g. nrxtoo-emerald"
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs font-mono text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Tagline / Description
                </label>
                <input
                  type="text"
                  value={newShopData.tagline}
                  onChange={(e) => setNewShopData({ ...newShopData, tagline: e.target.value })}
                  placeholder="e.g. Fine Colombian Emeralds & Heritage Jewellery"
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white"
                />
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
                <span className="text-[11px] font-bold text-purple-400 uppercase tracking-wider block">
                  Initial Shop Admin User
                </span>

                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="Admin Full Name"
                    value={newShopData.admin_name}
                    onChange={(e) => setNewShopData({ ...newShopData, admin_name: e.target.value })}
                    className="w-full px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white"
                  />
                  <input
                    type="text"
                    placeholder="User ID (e.g. emerald_admin)"
                    value={newShopData.admin_user_id}
                    onChange={(e) => setNewShopData({ ...newShopData, admin_user_id: e.target.value })}
                    className="w-full px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-xs font-mono text-white"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreateShopModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold rounded-xl cursor-pointer"
                >
                  Create & Initialize Modules
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
