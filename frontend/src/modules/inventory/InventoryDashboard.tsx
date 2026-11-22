import React, { useState, useEffect } from 'react';
import {
  Gem,
  Plus,
  ArrowDownLeft,
  ArrowUpRight,
  Search,
  Filter,
  Building2,
  Trash2,
  Edit,
  History,
  ShieldCheck,
  Tag,
  Scale,
  Award,
  Layers,
  Sparkles,
  AlertTriangle,
  RefreshCw,
  ShoppingBag,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { TopNavBar } from '../../components/TopNavBar';
import { InventoryItem, StockTransaction, InventoryCategory } from '../../types';
import { apiRequest } from '../../services/api';
import { ItemFormModal } from './ItemFormModal';
import { PurchaseModal } from './PurchaseModal';
import { SaleModal } from './SaleModal';
import { ShopProfileModal } from './ShopProfileModal';

export const InventoryDashboard: React.FC = () => {
  const { activeShop, role, hasRole } = useAuth();

  const [items, setItems] = useState<InventoryItem[]>([]);
  const [stats, setStats] = useState<any>({
    total_items: 0,
    jewellery_count: 0,
    stones_count: 0,
    low_stock_count: 0,
    total_valuation: 0,
  });
  const [transactions, setTransactions] = useState<StockTransaction[]>([]);

  const [loading, setLoading] = useState(true);
  const [activeCategoryTab, setActiveCategoryTab] = useState<'ALL' | 'Jewellery' | 'Stones'>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('table');

  // Modals state
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false);
  const [isSaleModalOpen, setIsSaleModalOpen] = useState(false);
  const [modalSelectedItem, setModalSelectedItem] = useState<InventoryItem | null>(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isHistoryDrawerOpen, setIsHistoryDrawerOpen] = useState(false);

  const canCreate = hasRole(['ADMIN', 'SENIOR_HR', 'STAFF']);
  const canDelete = hasRole(['ADMIN']);

  const fetchData = async () => {
    setLoading(true);
    try {
      // 1. Fetch Items
      const itemsRes = await apiRequest('/inventory');
      if (itemsRes.success) {
        setItems(itemsRes.items || []);
      }

      // 2. Fetch Stats
      const statsRes = await apiRequest('/inventory/stats');
      if (statsRes.success) {
        setStats(statsRes.stats);
      }

      // 3. Fetch Transactions
      const txnRes = await apiRequest('/transactions?limit=50');
      if (txnRes.success) {
        setTransactions(txnRes.transactions || []);
      }
    } catch (err) {
      console.error('Failed to load inventory data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDeleteItem = async (item: InventoryItem) => {
    if (!window.confirm(`Are you sure you want to delete ${item.sku} - "${item.name}"?`)) {
      return;
    }
    try {
      await apiRequest(`/inventory/${item.id}`, { method: 'DELETE' });
      fetchData();
    } catch (err: any) {
      alert(err.message || 'Failed to delete item.');
    }
  };

  // Filter items
  const filteredItems = items.filter((item) => {
    // Category tab filter
    if (activeCategoryTab !== 'ALL' && item.category !== activeCategoryTab) {
      return false;
    }
    // Status filter
    if (statusFilter !== 'ALL' && item.status !== statusFilter) {
      return false;
    }
    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchSku = item.sku.toLowerCase().includes(q);
      const matchName = item.name.toLowerCase().includes(q);
      const matchHuid = item.huid_hallmark ? item.huid_hallmark.toLowerCase().includes(q) : false;
      const matchCert = item.lab_certificate_no ? item.lab_certificate_no.toLowerCase().includes(q) : false;
      const matchStone = item.stone_type ? item.stone_type.toLowerCase().includes(q) : false;
      const matchMetal = item.metal_type ? item.metal_type.toLowerCase().includes(q) : false;
      return matchSku || matchName || matchHuid || matchCert || matchStone || matchMetal;
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <TopNavBar
        currentModuleName="Shop & Inventory"
        onOpenShopProfile={() => setIsProfileModalOpen(true)}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 py-6 space-y-6">
        {/* Shop Branding Banner */}
        <div className="relative rounded-3xl overflow-hidden shadow-lg border border-slate-200/80 bg-white">
          {/* Banner image or gradient */}
          <div className="h-32 md:h-44 w-full relative overflow-hidden bg-gradient-to-r from-stone-900 via-amber-950 to-stone-900">
            {activeShop?.banner_url && (
              <img
                src={activeShop.banner_url}
                alt="Shop Banner"
                className="w-full h-full object-cover opacity-60"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950/90 via-stone-950/40 to-transparent"></div>
          </div>

          {/* Shop Profile Details Overlay */}
          <div className="px-6 pb-6 pt-0 relative -mt-12 md:-mt-14 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="flex items-end gap-4">
              {activeShop?.logo_url ? (
                <img
                  src={activeShop.logo_url}
                  alt={activeShop.name}
                  className="w-20 h-20 md:w-24 md:h-24 rounded-2xl object-cover border-4 border-white shadow-xl bg-white"
                />
              ) : (
                <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-amber-600 border-4 border-white shadow-xl flex items-center justify-center text-white font-serif text-2xl font-bold">
                  N
                </div>
              )}

              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-xl md:text-2xl font-extrabold text-slate-900 tracking-tight font-serif">
                    {activeShop?.name}
                  </h1>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300">
                    BIS Hallmark Certified
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5 max-w-xl">
                  {activeShop?.tagline || 'Finest Hallmark Jewellery & Rare Certified Stones Suite'}
                </p>
                <div className="flex items-center gap-3 mt-1.5 text-[11px] text-slate-400 font-mono">
                  <span>GST: {activeShop?.gstin || '08AABCN1234F1Z5'}</span>
                  <span>•</span>
                  <span>Base Currency: {activeShop?.currency_symbol} ({activeShop?.currency})</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 self-start md:self-end">
              <button
                onClick={() => setIsProfileModalOpen(true)}
                className="px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <Building2 className="w-3.5 h-3.5 text-slate-500" />
                <span>Shop Profile Setup</span>
              </button>

              <button
                onClick={() => setIsHistoryDrawerOpen(true)}
                className="px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <History className="w-3.5 h-3.5 text-slate-500" />
                <span>Stock Ledger ({transactions.length})</span>
              </button>
            </div>
          </div>
        </div>

        {/* Real-time Inventory Metric Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3.5">
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              Total Items
            </span>
            <div className="flex items-baseline justify-between mt-1">
              <span className="text-2xl font-extrabold text-slate-900 font-serif">
                {stats.total_items}
              </span>
              <Gem className="w-5 h-5 text-amber-500" />
            </div>
            <span className="text-[10px] text-slate-400 mt-1 block">In stock & listed</span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-amber-200/80 shadow-xs bg-amber-50/20">
            <span className="text-[11px] font-semibold text-amber-900 uppercase tracking-wider block">
              Jewellery
            </span>
            <div className="flex items-baseline justify-between mt-1">
              <span className="text-2xl font-extrabold text-amber-900 font-serif">
                {stats.jewellery_count}
              </span>
              <Sparkles className="w-5 h-5 text-amber-600" />
            </div>
            <span className="text-[10px] text-amber-700 mt-1 block">Hallmark Gold/Silver</span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-indigo-200/80 shadow-xs bg-indigo-50/20">
            <span className="text-[11px] font-semibold text-indigo-900 uppercase tracking-wider block">
              Certified Stones
            </span>
            <div className="flex items-baseline justify-between mt-1">
              <span className="text-2xl font-extrabold text-indigo-900 font-serif">
                {stats.stones_count}
              </span>
              <Award className="w-5 h-5 text-indigo-600" />
            </div>
            <span className="text-[10px] text-indigo-700 mt-1 block">Diamonds & Sapphires</span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              Stock Valuation
            </span>
            <div className="flex items-baseline justify-between mt-1">
              <span className="text-xl font-extrabold text-slate-900 font-mono">
                {activeShop?.currency_symbol || '₹'}
                {(stats.total_valuation || 0).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
              </span>
            </div>
            <span className="text-[10px] text-emerald-600 font-medium mt-1 block">Current retail value</span>
          </div>

          <div
            className={`p-4 rounded-2xl border shadow-xs ${
              stats.low_stock_count > 0
                ? 'bg-rose-50 border-rose-200 text-rose-900'
                : 'bg-white border-slate-200 text-slate-700'
            }`}
          >
            <span className="text-[11px] font-semibold uppercase tracking-wider block">
              Stock Warnings
            </span>
            <div className="flex items-baseline justify-between mt-1">
              <span className="text-2xl font-extrabold font-serif">
                {stats.low_stock_count}
              </span>
              <AlertTriangle className={`w-5 h-5 ${stats.low_stock_count > 0 ? 'text-rose-500' : 'text-slate-300'}`} />
            </div>
            <span className="text-[10px] mt-1 block opacity-80">Needs inward reorder</span>
          </div>
        </div>

        {/* Toolbar & Category Switcher */}
        <div className="bg-white rounded-3xl p-4 md:p-5 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Category Selector Tabs */}
            <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-2xl w-fit">
              <button
                onClick={() => setActiveCategoryTab('ALL')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  activeCategoryTab === 'ALL'
                    ? 'bg-white text-slate-900 shadow-xs ring-1 ring-slate-300'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                All Items ({items.length})
              </button>

              <button
                onClick={() => setActiveCategoryTab('Jewellery')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  activeCategoryTab === 'Jewellery'
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'text-amber-800 hover:text-amber-900'
                }`}
              >
                <Gem className="w-3.5 h-3.5" />
                <span>Jewellery ({stats.jewellery_count})</span>
              </button>

              <button
                onClick={() => setActiveCategoryTab('Stones')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  activeCategoryTab === 'Stones'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-indigo-800 hover:text-indigo-900'
                }`}
              >
                <Award className="w-3.5 h-3.5" />
                <span>Stones ({stats.stones_count})</span>
              </button>
            </div>

            {/* Inward / Outward / New Item Actions */}
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => {
                  setModalSelectedItem(null);
                  setIsPurchaseModalOpen(true);
                }}
                className="px-3.5 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold border border-blue-200 transition-colors flex items-center gap-1.5 cursor-pointer"
                title="Inward Purchase (Adds to stock)"
              >
                <ArrowDownLeft className="w-4 h-4 text-blue-600" />
                <span>Purchase Stock</span>
              </button>

              <button
                onClick={() => {
                  setModalSelectedItem(null);
                  setIsSaleModalOpen(true);
                }}
                className="px-3.5 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-200 transition-colors flex items-center gap-1.5 cursor-pointer"
                title="Outward Sale (Deducts stock)"
              >
                <ArrowUpRight className="w-4 h-4 text-emerald-600" />
                <span>Record Sale</span>
              </button>

              {canCreate && (
                <button
                  onClick={() => {
                    setEditingItem(null);
                    setIsItemModalOpen(true);
                  }}
                  className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-md shadow-amber-600/20 transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>+ New Item</span>
                </button>
              )}
            </div>
          </div>

          {/* Search & Filter Row */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-100">
            {/* Search */}
            <div className="relative w-full sm:w-80">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search SKU, name, HUID, cert #, metal..."
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            </div>

            {/* Status & View controls */}
            <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
              <div className="flex items-center gap-1 text-xs">
                <span className="text-slate-400 text-[11px] font-medium">Status:</span>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 focus:outline-none"
                >
                  <option value="ALL">All Status</option>
                  <option value="IN_STOCK">In Stock</option>
                  <option value="LOW_STOCK">Low Stock</option>
                  <option value="OUT_OF_STOCK">Out of Stock</option>
                </select>
              </div>

              <button
                onClick={fetchData}
                className="p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                title="Refresh table"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Inventory Items List */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
          {loading ? (
            <div className="p-12 text-center text-slate-400 text-xs flex flex-col items-center gap-2">
              <div className="w-8 h-8 border-3 border-amber-600 border-t-transparent rounded-full animate-spin"></div>
              <span>Loading jewellery & stones vault...</span>
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="p-12 text-center text-slate-500">
              <Gem className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <p className="text-sm font-bold text-slate-700">No inventory items found</p>
              <p className="text-xs text-slate-400 mt-1">
                Try adjusting your search query or category filter.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    <th className="py-3.5 px-4">Item Details</th>
                    <th className="py-3.5 px-4">Category & Dynamic Specs</th>
                    <th className="py-3.5 px-4">Stock Balance</th>
                    <th className="py-3.5 px-4">Pricing</th>
                    <th className="py-3.5 px-4 text-right">Quick Stock Flows</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {filteredItems.map((item) => (
                    <tr
                      key={item.id}
                      className="hover:bg-amber-50/30 transition-colors group"
                    >
                      {/* Item Details */}
                      <td className="py-4 px-4 align-top">
                        <div className="flex items-start gap-3">
                          {item.image_url ? (
                            <img
                              src={item.image_url}
                              alt={item.name}
                              className="w-12 h-12 rounded-xl object-cover border border-slate-200 shadow-2xs flex-shrink-0"
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400 flex-shrink-0">
                              <Gem className="w-6 h-6" />
                            </div>
                          )}

                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="font-mono font-bold text-slate-900 bg-slate-100 px-1.5 py-0.5 rounded text-[11px]">
                                {item.sku}
                              </span>
                              {item.category === 'Jewellery' ? (
                                <span className="text-[10px] font-bold text-amber-800 bg-amber-100/80 px-1.5 py-0.5 rounded">
                                  Jewellery
                                </span>
                              ) : (
                                <span className="text-[10px] font-bold text-indigo-800 bg-indigo-100/80 px-1.5 py-0.5 rounded">
                                  Stones
                                </span>
                              )}
                            </div>

                            <h4 className="font-bold text-slate-800 text-xs md:text-sm mt-1 max-w-xs">
                              {item.name}
                            </h4>

                            {item.description && (
                              <p className="text-[11px] text-slate-400 line-clamp-1 max-w-xs mt-0.5">
                                {item.description}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Dynamic Specs based on Category */}
                      <td className="py-4 px-4 align-top">
                        {item.category === 'Jewellery' ? (
                          <div className="space-y-1 text-[11px]">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-amber-900">
                                {item.metal_type} • {item.purity}
                              </span>
                              {item.huid_hallmark && (
                                <span className="font-mono text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300 px-1.5 py-0.2 rounded">
                                  HUID: {item.huid_hallmark}
                                </span>
                              )}
                            </div>

                            <div className="text-slate-500 text-[11px] flex items-center gap-2">
                              <span>Gross: {item.gross_weight}g</span>
                              <span>•</span>
                              <span>Net: {item.net_weight}g</span>
                              {Number(item.stone_weight) > 0 && (
                                <>
                                  <span>•</span>
                                  <span>Stone: {item.stone_weight}g</span>
                                </>
                              )}
                            </div>

                            {item.making_charges && (
                              <span className="text-[10px] text-slate-400 block">
                                Making: {activeShop?.currency_symbol || '₹'} {item.making_charges}
                              </span>
                            )}
                          </div>
                        ) : (
                          <div className="space-y-1 text-[11px]">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-indigo-900">
                                {item.stone_type} • {item.shape_cut}
                              </span>
                              {item.carat_weight && (
                                <span className="font-mono text-[10px] font-bold bg-indigo-100 text-indigo-900 border border-indigo-300 px-1.5 py-0.2 rounded">
                                  {item.carat_weight} ct
                                </span>
                              )}
                            </div>

                            <div className="text-slate-500 text-[11px] flex items-center gap-2">
                              <span>Color: {item.color}</span>
                              <span>•</span>
                              <span>Clarity: {item.clarity}</span>
                            </div>

                            {item.lab_certificate_no && (
                              <span className="text-[10px] font-mono text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded inline-block">
                                Cert: {item.lab_certificate_no}
                              </span>
                            )}
                          </div>
                        )}
                      </td>

                      {/* Stock Balance & Status */}
                      <td className="py-4 px-4 align-top">
                        <div className="flex items-center gap-1.5">
                          <span className="text-sm font-extrabold text-slate-900 font-mono">
                            {item.current_stock}
                          </span>
                          <span className="text-[11px] text-slate-500">{item.unit}</span>
                        </div>

                        <div className="mt-1">
                          {item.status === 'IN_STOCK' ? (
                            <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                              ● In Stock
                            </span>
                          ) : item.status === 'LOW_STOCK' ? (
                            <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 animate-pulse">
                              ▲ Low Stock
                            </span>
                          ) : (
                            <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800">
                              ✕ Out of Stock
                            </span>
                          )}
                        </div>

                        <span className="text-[10px] text-slate-400 block mt-0.5">
                          Min Alert: {item.minimum_stock}
                        </span>
                      </td>

                      {/* Pricing */}
                      <td className="py-4 px-4 align-top">
                        <div className="text-sm font-extrabold text-slate-900 font-mono">
                          {activeShop?.currency_symbol || '₹'} {Number(item.selling_price).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                        </div>
                        {item.cost_price > 0 && (
                          <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                            Cost: {activeShop?.currency_symbol || '₹'} {Number(item.cost_price).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                          </div>
                        )}
                      </td>

                      {/* Quick Stock Actions */}
                      <td className="py-4 px-4 align-top text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Purchase Button */}
                          <button
                            onClick={() => {
                              setModalSelectedItem(item);
                              setIsPurchaseModalOpen(true);
                            }}
                            className="p-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors"
                            title="Inward Purchase (Add Stock)"
                          >
                            <ArrowDownLeft className="w-4 h-4" />
                          </button>

                          {/* Sale Button */}
                          <button
                            onClick={() => {
                              setModalSelectedItem(item);
                              setIsSaleModalOpen(true);
                            }}
                            disabled={item.current_stock <= 0}
                            className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                            title="Bill Customer (Deduct Stock)"
                          >
                            <ArrowUpRight className="w-4 h-4" />
                          </button>

                          {/* Edit Item */}
                          {canCreate && (
                            <button
                              onClick={() => {
                                setEditingItem(item);
                                setIsItemModalOpen(true);
                              }}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                              title="Edit item specs"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                          )}

                          {/* Delete Item */}
                          {canDelete && (
                            <button
                              onClick={() => handleDeleteItem(item)}
                              className="p-1.5 rounded-lg text-rose-400 hover:text-rose-700 hover:bg-rose-50 transition-colors"
                              title="Delete Item (Admin Only)"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* Item Form Modal */}
      {isItemModalOpen && (
        <ItemFormModal
          isOpen={isItemModalOpen}
          onClose={() => {
            setIsItemModalOpen(false);
            setEditingItem(null);
          }}
          onSaved={fetchData}
          initialItem={editingItem}
        />
      )}

      {/* Purchase Modal */}
      {isPurchaseModalOpen && (
        <PurchaseModal
          isOpen={isPurchaseModalOpen}
          onClose={() => {
            setIsPurchaseModalOpen(false);
            setModalSelectedItem(null);
          }}
          onSuccess={fetchData}
          items={items}
          preselectedItem={modalSelectedItem}
        />
      )}

      {/* Sale Modal */}
      {isSaleModalOpen && (
        <SaleModal
          isOpen={isSaleModalOpen}
          onClose={() => {
            setIsSaleModalOpen(false);
            setModalSelectedItem(null);
          }}
          onSuccess={fetchData}
          items={items}
          preselectedItem={modalSelectedItem}
        />
      )}

      {/* Shop Profile Modal */}
      {isProfileModalOpen && (
        <ShopProfileModal
          isOpen={isProfileModalOpen}
          onClose={() => setIsProfileModalOpen(false)}
        />
      )}

      {/* Stock Ledger Drawer */}
      {isHistoryDrawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white w-full max-w-xl h-full shadow-2xl p-6 overflow-y-auto flex flex-col">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <History className="w-5 h-5 text-amber-600" />
                <h3 className="text-base font-bold text-slate-800">
                  Stock Movements & Ledger
                </h3>
              </div>
              <button
                onClick={() => setIsHistoryDrawerOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              >
                ✕
              </button>
            </div>

            <div className="py-4 flex-1 space-y-3">
              {transactions.length === 0 ? (
                <div className="text-center py-12 text-slate-400 text-xs">
                  No stock movements recorded yet.
                </div>
              ) : (
                transactions.map((txn) => (
                  <div
                    key={txn.id}
                    className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50/50 flex items-start justify-between gap-3 text-xs"
                  >
                    <div className="flex items-start gap-2.5">
                      <div
                        className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${
                          txn.transaction_type === 'PURCHASE'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-emerald-100 text-emerald-700'
                        }`}
                      >
                        {txn.transaction_type === 'PURCHASE' ? (
                          <ArrowDownLeft className="w-4 h-4" />
                        ) : (
                          <ArrowUpRight className="w-4 h-4" />
                        )}
                      </div>

                      <div>
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`font-bold px-1.5 py-0.2 rounded text-[10px] ${
                              txn.transaction_type === 'PURCHASE'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-emerald-100 text-emerald-800'
                            }`}
                          >
                            {txn.transaction_type}
                          </span>
                          <span className="font-mono text-slate-500 font-bold">
                            {txn.item_sku}
                          </span>
                        </div>

                        <p className="font-semibold text-slate-800 mt-1">
                          {txn.item_name}
                        </p>
                        <p className="text-[11px] text-slate-500">
                          Party: <span className="font-medium text-slate-700">{txn.party_name || 'Counter'}</span>
                          {txn.invoice_no && ` • Ref: ${txn.invoice_no}`}
                        </p>
                        {txn.notes && (
                          <p className="text-[10px] text-slate-400 italic mt-0.5">
                            "{txn.notes}"
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="text-right">
                      <span
                        className={`text-sm font-bold font-mono ${
                          txn.transaction_type === 'PURCHASE' ? 'text-blue-700' : 'text-emerald-700'
                        }`}
                      >
                        {txn.transaction_type === 'PURCHASE' ? '+' : '-'}
                        {txn.quantity} units
                      </span>
                      <p className="font-bold text-slate-900 mt-0.5">
                        {activeShop?.currency_symbol || '₹'}{' '}
                        {Number(txn.total_amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </p>
                      <span className="text-[10px] text-slate-400 block mt-0.5">
                        {new Date(txn.transaction_date).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
