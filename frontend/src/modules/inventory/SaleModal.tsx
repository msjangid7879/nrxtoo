import React, { useState } from 'react';
import { X, ArrowUpRight, AlertCircle, Check, ShoppingBag } from 'lucide-react';
import { InventoryItem } from '../../types';
import { apiRequest } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

interface SaleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  items: InventoryItem[];
  preselectedItem?: InventoryItem | null;
}

export const SaleModal: React.FC<SaleModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  items,
  preselectedItem,
}) => {
  const { activeShop } = useAuth();

  const [itemId, setItemId] = useState<string>(
    preselectedItem?.id || (items.length > 0 ? items[0].id : '')
  );
  const [quantity, setQuantity] = useState<string>('1');
  const [unitPrice, setUnitPrice] = useState<string>(
    preselectedItem ? String(preselectedItem.selling_price) : ''
  );
  const [partyName, setPartyName] = useState<string>('');
  const [partyContact, setPartyContact] = useState<string>('');
  const [invoiceNo, setInvoiceNo] = useState<string>(`INV-${Date.now().toString().slice(-6)}`);
  const [paymentMethod, setPaymentMethod] = useState<string>('UPI');
  const [notes, setNotes] = useState<string>('');

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const selectedItem = items.find((i) => i.id === itemId);

  const handleItemChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newId = e.target.value;
    setItemId(newId);
    const it = items.find((i) => i.id === newId);
    if (it) {
      setUnitPrice(String(it.selling_price));
    }
  };

  const parsedQty = parseFloat(quantity) || 0;
  const parsedPrice = parseFloat(unitPrice) || 0;
  const totalAmount = parsedQty * parsedPrice;
  const availableStock = selectedItem ? parseFloat(String(selectedItem.current_stock)) : 0;
  const isStockInsufficient = parsedQty > availableStock;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!itemId) {
      setErrorMsg('Please select an item to bill.');
      return;
    }
    if (parsedQty <= 0) {
      setErrorMsg('Quantity must be greater than zero.');
      return;
    }
    if (isStockInsufficient) {
      setErrorMsg(`Insufficient stock! Available in inventory: ${availableStock}`);
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    try {
      await apiRequest('/transactions/sale', {
        method: 'POST',
        body: JSON.stringify({
          item_id: itemId,
          quantity: parsedQty,
          unit_price: parsedPrice,
          party_name: partyName || 'Walk-in Boutique Client',
          party_contact: partyContact,
          invoice_no: invoiceNo,
          payment_method: paymentMethod,
          notes,
        }),
      });

      onSuccess();
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to record sale transaction.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-200">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur-md z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center">
              <ArrowUpRight className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-800">Record Sales Invoice</h2>
              <p className="text-xs text-slate-500">Outward customer billing & stock deduction</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Item Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Select Jewellery / Stone Item *
            </label>
            <select
              value={itemId}
              onChange={handleItemChange}
              required
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              {items.map((i) => (
                <option key={i.id} value={i.id}>
                  [{i.sku}] {i.name} — Available: {i.current_stock} {i.unit} ({i.status})
                </option>
              ))}
            </select>
          </div>

          {selectedItem && (
            <div
              className={`p-3 rounded-xl border flex items-center justify-between text-xs ${
                availableStock <= 0
                  ? 'bg-rose-50 border-rose-200 text-rose-800'
                  : 'bg-emerald-50/60 border-emerald-200 text-emerald-900'
              }`}
            >
              <span>Available Quantity in Vault:</span>
              <span className="font-bold font-mono">
                {availableStock} {selectedItem.unit}
              </span>
            </div>
          )}

          {/* Quantity & Unit Sale Price */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Quantity to Sell *
              </label>
              <input
                type="number"
                step="0.001"
                min="0.001"
                max={availableStock > 0 ? availableStock : undefined}
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                required
                className={`w-full px-3.5 py-2 bg-slate-50 border rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 ${
                  isStockInsufficient
                    ? 'border-rose-400 focus:ring-rose-500'
                    : 'border-slate-200 focus:ring-emerald-500'
                }`}
              />
              {isStockInsufficient && (
                <span className="text-[10px] text-rose-600 font-semibold block mt-1">
                  Exceeds stock of {availableStock}!
                </span>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Selling Price ({activeShop?.currency_symbol || '₹'}) *
              </label>
              <input
                type="number"
                step="0.01"
                value={unitPrice}
                onChange={(e) => setUnitPrice(e.target.value)}
                required
                placeholder="0.00"
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Total Calculation Display */}
          <div className="p-3.5 bg-emerald-50/80 border border-emerald-200 rounded-xl flex items-center justify-between">
            <span className="text-xs font-medium text-emerald-900">Total Invoice Amount:</span>
            <span className="text-sm font-extrabold text-emerald-800 font-mono">
              {activeShop?.currency_symbol || '₹'} {totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </span>
          </div>

          {/* Customer Info */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Customer Full Name
              </label>
              <input
                type="text"
                value={partyName}
                onChange={(e) => setPartyName(e.target.value)}
                placeholder="e.g. Mrs. Ananya Rathore"
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Customer Phone
              </label>
              <input
                type="text"
                value={partyContact}
                onChange={(e) => setPartyContact(e.target.value)}
                placeholder="+91 99887 76655"
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Tax Invoice Reference #
              </label>
              <input
                type="text"
                value={invoiceNo}
                onChange={(e) => setInvoiceNo(e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono uppercase text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Payment Mode
              </label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="UPI">UPI / QR Code</option>
                <option value="Card">Credit / Debit Card</option>
                <option value="Cash">Cash Counter</option>
                <option value="Bank Transfer">Bank Transfer / IMPS</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Sale Remarks / Certificate Warranty
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Issued Hallmark HUID certificate & guarantee card"
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Footer */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading || isStockInsufficient || availableStock <= 0}
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl shadow-md shadow-emerald-600/30 transition-all flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>Generate Sale & Deduct Stock</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
