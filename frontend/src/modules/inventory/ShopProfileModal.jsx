import React, { useState } from 'react';
import { X, Building2, Upload, Check, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import { apiRequest } from '../../services/api.js';

export const ShopProfileModal = ({ isOpen, onClose }) => {
  const { activeShop, updateActiveShop, hasRole } = useAuth();

  const [formData, setFormData] = useState({
    name: activeShop?.name || '',
    tagline: activeShop?.tagline || '',
    logo_url: activeShop?.logo_url || '',
    banner_url: activeShop?.banner_url || '',
    address: activeShop?.address || '',
    phone: activeShop?.phone || '',
    email: activeShop?.email || '',
    gstin: activeShop?.gstin || '',
    currency: activeShop?.currency || 'INR',
    currency_symbol: activeShop?.currency_symbol || '₹',
  });

  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  if (!isOpen) return null;

  const canEdit = hasRole(['ADMIN']);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setFormData((prev) => ({ ...prev, logo_url: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBannerUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setFormData((prev) => ({ ...prev, banner_url: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!canEdit) {
      setErrorMsg('Only Admin users can modify the shop profile.');
      return;
    }

    setSaving(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const res = await apiRequest('/shops/current', {
        method: 'PUT',
        body: JSON.stringify(formData),
      });

      if (res.success && res.shop) {
        updateActiveShop(res.shop);
        setSuccessMsg('Shop profile updated successfully!');
        setTimeout(() => {
          onClose();
        }, 1200);
      }
    } catch (err) {
      setErrorMsg(err.message || 'Failed to update shop profile.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur-md z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-800">Shop Profile & Branding</h2>
              <p className="text-xs text-slate-500">Configure shop details, logo, and banner</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl text-xs flex items-center gap-2">
              <Check className="w-4 h-4 flex-shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Banner */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Shop Header Banner
            </label>
            <div className="relative h-32 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 flex items-center justify-center group">
              {formData.banner_url ? (
                <img
                  src={formData.banner_url}
                  alt="Shop Banner"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-xs text-slate-400 font-medium">No banner specified</span>
              )}

              {canEdit && (
                <label className="absolute inset-0 bg-black/40 text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 cursor-pointer text-xs font-semibold">
                  <Upload className="w-4 h-4" />
                  <span>Upload / Replace Banner</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleBannerUpload}
                    className="hidden"
                  />
                </label>
              )}
            </div>

            <div className="mt-1.5">
              <input
                type="text"
                name="banner_url"
                value={formData.banner_url}
                onChange={handleInputChange}
                disabled={!canEdit}
                placeholder="Or paste banner image URL..."
                className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 font-mono focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>
          </div>

          {/* Logo & Basic Info */}
          <div className="flex flex-col sm:flex-row gap-5 items-start">
            <div className="w-28 flex-shrink-0">
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Shop Logo
              </label>
              <div className="relative w-24 h-24 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 flex items-center justify-center group mx-auto sm:mx-0">
                {formData.logo_url ? (
                  <img
                    src={formData.logo_url}
                    alt="Logo"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Building2 className="w-8 h-8 text-slate-300" />
                )}

                {canEdit && (
                  <label className="absolute inset-0 bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1 cursor-pointer text-[10px] font-semibold text-center p-1">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload Logo</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            </div>

            <div className="flex-1 space-y-3 w-full">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Shop Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  disabled={!canEdit}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Tagline / Slogan
                </label>
                <input
                  type="text"
                  name="tagline"
                  value={formData.tagline}
                  onChange={handleInputChange}
                  disabled={!canEdit}
                  placeholder="e.g. Certified Hallmark Jewellery & Fine Stones"
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>
          </div>

          {/* Contact Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Contact Phone
              </label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                disabled={!canEdit}
                placeholder="+91 98290 12345"
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Official Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                disabled={!canEdit}
                placeholder="contact@shop.com"
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          {/* GSTIN & Currency */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                GSTIN / Tax ID
              </label>
              <input
                type="text"
                name="gstin"
                value={formData.gstin}
                onChange={handleInputChange}
                disabled={!canEdit}
                placeholder="08AABCN1234F1Z5"
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono uppercase text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Currency Code
              </label>
              <input
                type="text"
                name="currency"
                value={formData.currency}
                onChange={handleInputChange}
                disabled={!canEdit}
                placeholder="INR"
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono uppercase text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Currency Symbol
              </label>
              <input
                type="text"
                name="currency_symbol"
                value={formData.currency_symbol}
                onChange={handleInputChange}
                disabled={!canEdit}
                placeholder="₹"
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Showroom / Boutique Address
            </label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              rows={2}
              disabled={!canEdit}
              placeholder="Suite 401, Gold Souk Heritage Plaza, MG Road, Jaipur..."
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <span className="text-[11px] text-slate-400">
              {!canEdit && '⚠️ Only Admin role can save changes.'}
            </span>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
              >
                Cancel
              </button>

              {canEdit && (
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold rounded-xl shadow-md shadow-amber-600/30 transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  {saving ? 'Saving...' : 'Save Profile Changes'}
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
