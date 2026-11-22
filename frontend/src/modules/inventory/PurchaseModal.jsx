import React, { useState } from 'react';
import { X, AlertCircle, Check, ArrowDownLeft } from 'lucide-react';
import { apiRequest } from '../../services/api.js';
import { useAuth } from '../../context/AuthContext.jsx';

export const PurchaseModal = ({
  isOpen,
  onClose,
  onSuccess,
  items,
  preselectedItem,
}) => {
  const { activeShop } = useAuth();

  const [itemId, setItemId] = useState(
    preselectedItem?.id || (items.length > 0 ? items[0].id : '')
  );
  const [quantity, setQuantity] = useState('1');
  const [unitPrice, setUnitPrice] = useState(
    preselectedItem ? String(preselectedItem.cost_price || preselectedItem.selling_price) : ''
  );
  const [partyName, setPartyName] = useState('');
  const [partyContact, setPartyContact] = useState('');
  const [invoiceNo, setInvoiceNo] = useState(`PUR-${Date.now().toString().slice(-6)}`);
  const [paymentMethod, setPaymentMethod] = useState('Bank Transfer');
  const [notes, setNotes] = useState('');

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  if (!isOpen) return null;

  const selectedItem = items.find((i) => i.id === itemId);

  const handleItemChange = (e) => {
    const newId = e.target.value;
    setItemId(newId);
    const it = items.find((i) => i.id === newId);
    if (it && !unitPrice) {
      setUnitPrice(String(it.cost_price || it.selling_price));
    }
  };

  const parsedQty = parseFloat(quantity) || 0;
  const parsedPrice = parseFloat(unitPrice) || 0;
  const totalAmount = parsedQty * parsedPrice;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!itemId) {
      setErrorMsg('Please select an item to purchase stock for.');
      return;
    }
    if (parsedQty <= 0) {
      setErrorMsg('Quantity must be greater than zero.');
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    try {
      await apiRequest('/transactions/purchase', {
        method: 'POST',
        body: JSON.stringify({
          item_id: itemId,
          quantity: parsedQty,
          unit_price: parsedPrice,
          party_name: partyName || 'Bullion / Gem Supplier',
          party_contact: partyContact,
          invoice_no: invoiceNo,
          payment_method: paymentMethod,
          notes,
        }),
      });

      onSuccess();
      onClose();
    } catch (err) {
      setErrorMsg(err.message || 'Failed to record purchase entry.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-200">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur-md z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 text-blue-700 flex items-center justify-center">
              <ArrowDownLeft className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-800">Record Stock Purchase</h2>
              <p className="text-xs text-slate-500">Inward inventory procurement & stock increment</p>
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

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Select Inventory Item *
            </label>
            <select
              value={itemId}
              onChange={handleItemChange}
              required
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {items.map((i) => (
                <option key={i.id} value={i.id}>
                  [{i.sku}] {i.name} (Cur. Stock: {i.current_stock} {i.unit})
                </option>
              ))}
            </select>
          </div>

          {selectedItem && (
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
              <span className="text-slate-500">Current Stock in System:</span>
              <span className="font-bold text-slate-800">
                {selectedItem.current_stock} {selectedItem.unit}
              </span>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Quantity to Inward *
              </label>
              <input
                type="number"
                step="0.001"
                min="0.001"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                required
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Purchase Rate / Cost ({activeShop?.currency_symbol || '₹'}) *
              </label>
              <input
                type="number"
                step="0.01"
                value={unitPrice}
                onChange={(e) => setUnitPrice(e.target.value)}
                required
                placeholder="0.00"
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="p-3.5 bg-blue-50/80 border border-blue-200 rounded-xl flex items-center justify-between">
            <span className="text-xs font-medium text-blue-900">Total Purchase Value:</span>
            <span className="text-sm font-extrabold text-blue-800 font-mono">
              {activeShop?.currency_symbol || '₹'} {totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Supplier / Bullion House
              </label>
              <input
                type="text"
                value={partyName}
                onChange={(e) => setPartyName(e.target.value)}
                placeholder="Jaipur Bullion Traders"
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Supplier Phone
              </label>
              <input
                type="text"
                value={partyContact}
                onChange={(e) => setPartyContact(e.target.value)}
                placeholder="+91 94140 ..."
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Purchase Voucher / Bill No
              </label>
              <input
                type="text"
                value={invoiceNo}
                onChange={(e) => setInvoiceNo(e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono uppercase text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Payment Method
              </label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Bank Transfer">Bank Transfer / NEFT</option>
                <option value="Cheque">Bank Cheque</option>
                <option value="Cash">Cash Voucher</option>
                <option value="RTGS">RTGS Immediate</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Internal Notes / Hallmark Batch
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. BIS Hallmarked lot batch #42"
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

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
              disabled={loading}
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-md shadow-blue-600/30 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>Confirm Inward Purchase</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
