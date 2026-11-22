import React, { useState, useEffect } from 'react';
import { X, Gem, AlertCircle, Check } from 'lucide-react';
import { apiRequest } from '../../services/api.js';
import { useAuth } from '../../context/AuthContext.jsx';

export const ItemFormModal = ({
  isOpen,
  onClose,
  onSaved,
  initialItem,
}) => {
  const { activeShop } = useAuth();
  const isEditing = !!initialItem;

  const [category, setCategory] = useState('Jewellery');
  const [formData, setFormData] = useState({
    sku: '',
    name: '',
    category: 'Jewellery',
    description: '',
    image_url: '',
    cost_price: '',
    selling_price: '',
    current_stock: '1',
    minimum_stock: '1',
    unit: 'pcs',
    // Jewellery dynamic fields
    metal_type: 'Gold',
    purity: '22K (916)',
    gross_weight: '',
    net_weight: '',
    stone_weight: '0',
    making_charges: '',
    huid_hallmark: '',
    // Stones dynamic fields
    stone_type: 'Diamond',
    shape_cut: 'Round Brilliant',
    color: 'D (Colorless)',
    clarity: 'VVS1',
    carat_weight: '',
    treatment_origin: 'Natural Untreated',
    lab_certificate_no: '',
  });

  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    if (initialItem) {
      setCategory(initialItem.category);
      setFormData({
        sku: initialItem.sku || '',
        name: initialItem.name || '',
        category: initialItem.category || 'Jewellery',
        description: initialItem.description || '',
        image_url: initialItem.image_url || '',
        cost_price: initialItem.cost_price || '',
        selling_price: initialItem.selling_price || '',
        current_stock: initialItem.current_stock || '1',
        minimum_stock: initialItem.minimum_stock || '1',
        unit: initialItem.unit || 'pcs',
        // Jewellery
        metal_type: initialItem.metal_type || 'Gold',
        purity: initialItem.purity || '22K (916)',
        gross_weight: initialItem.gross_weight || '',
        net_weight: initialItem.net_weight || '',
        stone_weight: initialItem.stone_weight || '0',
        making_charges: initialItem.making_charges || '',
        huid_hallmark: initialItem.huid_hallmark || '',
        // Stones
        stone_type: initialItem.stone_type || 'Diamond',
        shape_cut: initialItem.shape_cut || 'Round Brilliant',
        color: initialItem.color || 'D (Colorless)',
        clarity: initialItem.clarity || 'VVS1',
        carat_weight: initialItem.carat_weight || '',
        treatment_origin: initialItem.treatment_origin || 'Natural Untreated',
        lab_certificate_no: initialItem.lab_certificate_no || '',
      });
    } else {
      const randomCode = Math.floor(100 + Math.random() * 900);
      setFormData((prev) => ({
        ...prev,
        sku: category === 'Jewellery' ? `JWL-GLD-${randomCode}` : `STN-GEM-${randomCode}`,
      }));
    }
  }, [initialItem, isOpen]);

  if (!isOpen) return null;

  const handleCategorySwitch = (newCat) => {
    setCategory(newCat);
    setFormData((prev) => {
      const randomCode = Math.floor(100 + Math.random() * 900);
      return {
        ...prev,
        category: newCat,
        sku: !isEditing ? (newCat === 'Jewellery' ? `JWL-GLD-${randomCode}` : `STN-GEM-${randomCode}`) : prev.sku,
      };
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setErrorMsg(null);

    try {
      const payload = {
        ...formData,
        category,
        cost_price: parseFloat(formData.cost_price) || 0,
        selling_price: parseFloat(formData.selling_price) || 0,
        current_stock: parseFloat(formData.current_stock) || 0,
        minimum_stock: parseFloat(formData.minimum_stock) || 1,
      };

      if (isEditing && initialItem) {
        await apiRequest(`/inventory/${initialItem.id}`, {
          method: 'PUT',
          body: JSON.stringify(payload),
        });
      } else {
        await apiRequest('/inventory', {
          method: 'POST',
          body: JSON.stringify(payload),
        });
      }

      onSaved();
      onClose();
    } catch (err) {
      setErrorMsg(err.message || 'Failed to save inventory item.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-200">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur-md z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center">
              <Gem className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-800">
                {isEditing ? 'Edit Item' : 'New Inventory Item'}
              </h2>
              <p className="text-xs text-slate-500">
                Dynamic category fields for Hallmark Jewellery or Certified Stones
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Category Switcher Tabs */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Select Category (Controls Dynamic Spec Fields) *
            </label>
            <div className="grid grid-cols-2 gap-3 p-1 bg-slate-100 rounded-2xl">
              <button
                type="button"
                onClick={() => handleCategorySwitch('Jewellery')}
                className={`py-3 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  category === 'Jewellery'
                    ? 'bg-white text-amber-800 shadow-sm ring-1 ring-amber-300'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <div className="w-2.5 h-2.5 rounded-full bg-amber-500"></div>
                <span>Jewellery (Gold, Silver, Platinum & HUID)</span>
              </button>

              <button
                type="button"
                onClick={() => handleCategorySwitch('Stones')}
                className={`py-3 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  category === 'Stones'
                    ? 'bg-white text-indigo-800 shadow-sm ring-1 ring-indigo-300'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <div className="w-2.5 h-2.5 rounded-full bg-indigo-500"></div>
                <span>Stones (Diamonds, Sapphires, Rubies & Certs)</span>
              </button>
            </div>
          </div>

          {/* Common General Fields */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              General Item Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  SKU / Item Code *
                </label>
                <input
                  type="text"
                  name="sku"
                  value={formData.sku}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g. JWL-GLD-001"
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono uppercase text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Item Title / Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  placeholder={
                    category === 'Jewellery'
                      ? 'e.g. 22K Royal Bridal Kundan Necklace'
                      : 'e.g. Natural Ceylon Royal Blue Sapphire (Neelam)'
                  }
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Description & Craftsmanship Notes
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={2}
                placeholder="Details regarding crafting, origin, luster, and certification..."
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Selling Price ({activeShop?.currency_symbol || '₹'}) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  name="selling_price"
                  value={formData.selling_price}
                  onChange={handleInputChange}
                  required
                  placeholder="0.00"
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Cost Price ({activeShop?.currency_symbol || '₹'})
                </label>
                <input
                  type="number"
                  step="0.01"
                  name="cost_price"
                  value={formData.cost_price}
                  onChange={handleInputChange}
                  placeholder="0.00"
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Initial Stock Qty *
                </label>
                <input
                  type="number"
                  step="0.001"
                  name="current_stock"
                  value={formData.current_stock}
                  onChange={handleInputChange}
                  required
                  placeholder="1.000"
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Min Stock Alert
                </label>
                <input
                  type="number"
                  step="0.001"
                  name="minimum_stock"
                  value={formData.minimum_stock}
                  onChange={handleInputChange}
                  placeholder="1.000"
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Image URL (Item Visual)
              </label>
              <input
                type="text"
                name="image_url"
                value={formData.image_url}
                onChange={handleInputChange}
                placeholder="https://images.unsplash.com/photo-..."
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          {/* DYNAMIC CATEGORY FIELDS: JEWELLERY */}
          {category === 'Jewellery' && (
            <div className="p-5 bg-amber-50/60 rounded-2xl border border-amber-200 space-y-4 animate-in fade-in duration-200">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-amber-600"></div>
                <h3 className="text-xs font-bold text-amber-900 uppercase tracking-wider">
                  Dynamic Category Fields — Jewellery Specs
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-amber-900 mb-1">
                    Metal Type *
                  </label>
                  <select
                    name="metal_type"
                    value={formData.metal_type}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-white border border-amber-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="Gold">Yellow Gold</option>
                    <option value="Rose Gold">Rose Gold</option>
                    <option value="White Gold">White Gold</option>
                    <option value="Silver">Silver</option>
                    <option value="Platinum">Platinum</option>
                    <option value="Kundan Polki">Kundan Polki</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-amber-900 mb-1">
                    Purity *
                  </label>
                  <select
                    name="purity"
                    value={formData.purity}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-white border border-amber-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="24K (999)">24K (999) Pure</option>
                    <option value="22K (916)">22K (916) Hallmark</option>
                    <option value="18K (750)">18K (750) Hallmark</option>
                    <option value="14K (585)">14K (585)</option>
                    <option value="925 Sterling">925 Sterling Silver</option>
                    <option value="950 Platinum">950 Pure Platinum</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-amber-900 mb-1">
                    Gross Weight (g) *
                  </label>
                  <input
                    type="number"
                    step="0.001"
                    name="gross_weight"
                    value={formData.gross_weight}
                    onChange={handleInputChange}
                    placeholder="e.g. 15.420"
                    className="w-full px-3 py-2 bg-white border border-amber-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-amber-900 mb-1">
                    Net Weight (g) *
                  </label>
                  <input
                    type="number"
                    step="0.001"
                    name="net_weight"
                    value={formData.net_weight}
                    onChange={handleInputChange}
                    placeholder="e.g. 13.200"
                    className="w-full px-3 py-2 bg-white border border-amber-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                <div>
                  <label className="block text-[11px] font-semibold text-amber-900 mb-1">
                    Stone Weight (g / cts)
                  </label>
                  <input
                    type="number"
                    step="0.001"
                    name="stone_weight"
                    value={formData.stone_weight}
                    onChange={handleInputChange}
                    placeholder="e.g. 2.220"
                    className="w-full px-3 py-2 bg-white border border-amber-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-amber-900 mb-1">
                    Making Charges ({activeShop?.currency_symbol || '₹'})
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    name="making_charges"
                    value={formData.making_charges}
                    onChange={handleInputChange}
                    placeholder="e.g. 4500.00"
                    className="w-full px-3 py-2 bg-white border border-amber-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-amber-900 mb-1">
                    HUID Hallmark (6-char Alphanumeric) *
                  </label>
                  <input
                    type="text"
                    maxLength={10}
                    name="huid_hallmark"
                    value={formData.huid_hallmark}
                    onChange={handleInputChange}
                    placeholder="e.g. HA7912"
                    className="w-full px-3 py-2 bg-white border border-amber-200 rounded-xl text-xs font-mono uppercase text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* DYNAMIC CATEGORY FIELDS: STONES */}
          {category === 'Stones' && (
            <div className="p-5 bg-indigo-50/60 rounded-2xl border border-indigo-200 space-y-4 animate-in fade-in duration-200">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-indigo-600"></div>
                <h3 className="text-xs font-bold text-indigo-900 uppercase tracking-wider">
                  Dynamic Category Fields — Certified Stones Specs
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-indigo-900 mb-1">
                    Stone Type *
                  </label>
                  <select
                    name="stone_type"
                    value={formData.stone_type}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-white border border-indigo-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="Diamond">Natural Diamond</option>
                    <option value="Blue Sapphire">Blue Sapphire (Neelam)</option>
                    <option value="Yellow Sapphire">Yellow Sapphire (Pukhraj)</option>
                    <option value="Emerald">Emerald (Panna)</option>
                    <option value="Ruby">Ruby (Manik)</option>
                    <option value="Opal">Natural Opal</option>
                    <option value="Pearl">South Sea Pearl (Moti)</option>
                    <option value="Tanzanite">Tanzanite</option>
                    <option value="Lab-Grown Diamond">Lab-Grown Diamond</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-indigo-900 mb-1">
                    Shape & Cut *
                  </label>
                  <select
                    name="shape_cut"
                    value={formData.shape_cut}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-white border border-indigo-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="Round Brilliant">Round Brilliant</option>
                    <option value="Princess Cut">Princess Cut</option>
                    <option value="Cushion Mixed Cut">Cushion Mixed Cut</option>
                    <option value="Oval Brilliant">Oval Brilliant</option>
                    <option value="Emerald Cut">Octagonal Emerald Cut</option>
                    <option value="Pear Shape">Pear Shape</option>
                    <option value="Radiant Cut">Radiant Cut</option>
                    <option value="Marquise">Marquise</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-indigo-900 mb-1">
                    Color Grade *
                  </label>
                  <input
                    type="text"
                    name="color"
                    value={formData.color}
                    onChange={handleInputChange}
                    placeholder="e.g. D / Royal Blue / Pigeon Blood"
                    className="w-full px-3 py-2 bg-white border border-indigo-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-indigo-900 mb-1">
                    Clarity Grade *
                  </label>
                  <select
                    name="clarity"
                    value={formData.clarity}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-white border border-indigo-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="FL">FL (Flawless)</option>
                    <option value="IF">IF (Internally Flawless)</option>
                    <option value="VVS1">VVS1 (Very Very Slightly Included 1)</option>
                    <option value="VVS2">VVS2 (Very Very Slightly Included 2)</option>
                    <option value="VS1">VS1 (Very Slightly Included 1)</option>
                    <option value="VS2">VS2 (Very Slightly Included 2)</option>
                    <option value="SI1">SI1 (Slightly Included)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                <div>
                  <label className="block text-[11px] font-semibold text-indigo-900 mb-1">
                    Carat Weight (cts) *
                  </label>
                  <input
                    type="number"
                    step="0.001"
                    name="carat_weight"
                    value={formData.carat_weight}
                    onChange={handleInputChange}
                    placeholder="e.g. 1.520"
                    className="w-full px-3 py-2 bg-white border border-indigo-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-indigo-900 mb-1">
                    Treatment & Origin *
                  </label>
                  <input
                    type="text"
                    name="treatment_origin"
                    value={formData.treatment_origin}
                    onChange={handleInputChange}
                    placeholder="e.g. Natural Unheated - Ceylon"
                    className="w-full px-3 py-2 bg-white border border-indigo-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-indigo-900 mb-1">
                    Lab Certificate Number (GIA / IGI / SGL)
                  </label>
                  <input
                    type="text"
                    name="lab_certificate_no"
                    value={formData.lab_certificate_no}
                    onChange={handleInputChange}
                    placeholder="e.g. GIA-6451928371"
                    className="w-full px-3 py-2 bg-white border border-indigo-200 rounded-xl text-xs font-mono uppercase text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Footer CTA */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-400">
              * Required fields for inventory tracking
            </span>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={saving}
                className="px-6 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold rounded-xl shadow-md shadow-amber-600/30 transition-all flex items-center gap-2 cursor-pointer"
              >
                {saving ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    <span>{isEditing ? 'Save Changes' : 'Create Inventory Item'}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
