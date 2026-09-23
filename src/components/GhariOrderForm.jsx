import React, { useState, useEffect } from "react";
import {
  User,
  MapPin,
  Phone,
  Package,
  Plus,
  Minus,
  CheckCircle,
  AlertCircle,
  RotateCcw,
  Sparkles,
  ShoppingBag,
} from "lucide-react";
import { SURAT_MANDALS, PAYMENT_STATUSES } from "../utils/suratMandals";
import {
  sanitizeKarykartaName,
  sanitizeContactNumber,
  validateDistributionForm,
} from "../utils/validators";
import { calculateOrderTotals, formatCurrency, formatWeight } from "../utils/formatters";

const INITIAL_FORM_STATE = {
  karykartaName: "",
  mandalName: "અડાજણ (Adajan)",
  contactNumber: "",
  qty500g: 1,
  qty1kg: 0,
  paymentStatus: "PAID",
  notes: "",
};

export default function GhariOrderForm({
  onSubmit,
  editingOrder = null,
  onCancelEdit = null,
  isLoading = false,
}) {
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [customMandal, setCustomMandal] = useState(false);

  // Sync form when editing an existing order
  useEffect(() => {
    if (editingOrder) {
      setFormData({
        karykartaName: editingOrder.karykartaName || "",
        mandalName: editingOrder.mandalName || "અડાજણ (Adajan)",
        contactNumber: editingOrder.contactNumber || "",
        qty500g: editingOrder.qty500g ?? 1,
        qty1kg: editingOrder.qty1kg ?? 0,
        paymentStatus: editingOrder.paymentStatus || "PAID",
        notes: editingOrder.notes || "",
      });
      setErrors({});
      setTouched({});
    } else {
      setFormData(INITIAL_FORM_STATE);
    }
  }, [editingOrder]);

  // Derived calculations
  const totals = calculateOrderTotals(formData.qty500g, formData.qty1kg);

  // Handle Karykarta Name change with CAPITAL only and NO special characters
  const handleNameChange = (e) => {
    const rawValue = e.target.value;
    const sanitized = sanitizeKarykartaName(rawValue);
    setFormData((prev) => ({ ...prev, karykartaName: sanitized }));

    if (touched.karykartaName) {
      const validation = validateDistributionForm({ ...formData, karykartaName: sanitized });
      setErrors((prev) => ({ ...prev, karykartaName: validation.errors.karykartaName }));
    }
  };

  // Handle Contact Number change: strictly numeric, max 10 digits
  const handleContactChange = (e) => {
    const rawValue = e.target.value;
    const sanitized = sanitizeContactNumber(rawValue);
    setFormData((prev) => ({ ...prev, contactNumber: sanitized }));

    if (touched.contactNumber) {
      const validation = validateDistributionForm({ ...formData, contactNumber: sanitized });
      setErrors((prev) => ({ ...prev, contactNumber: validation.errors.contactNumber }));
    }
  };

  // Steppers for Ghari pack quantities
  const updateQuantity = (packType, delta) => {
    setFormData((prev) => {
      const current = parseInt(prev[packType], 10) || 0;
      const updated = Math.max(0, current + delta);
      return { ...prev, [packType]: updated };
    });
    setTouched((prev) => ({ ...prev, ghariOrder: true }));
  };

  const setDirectQuantity = (packType, val) => {
    const num = Math.max(0, parseInt(val, 10) || 0);
    setFormData((prev) => ({ ...prev, [packType]: num }));
    setTouched((prev) => ({ ...prev, ghariOrder: true }));
  };

  // Blur handler for live field validation
  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const validation = validateDistributionForm(formData);
    setErrors((prev) => ({ ...prev, [field]: validation.errors[field] }));
  };

  // Form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // Mark all touched
    const allTouched = {
      karykartaName: true,
      mandalName: true,
      contactNumber: true,
      ghariOrder: true,
    };
    setTouched(allTouched);

    const validation = validateDistributionForm(formData);
    setErrors(validation.errors);

    if (!validation.isValid) {
      return;
    }

    onSubmit({
      ...formData,
      ...totals,
    });

    if (!editingOrder) {
      setFormData(INITIAL_FORM_STATE);
      setTouched({});
      setErrors({});
    }
  };

  const handleReset = () => {
    if (editingOrder && onCancelEdit) {
      onCancelEdit();
    } else {
      setFormData(INITIAL_FORM_STATE);
      setErrors({});
      setTouched({});
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-amber-200/90 shadow-sm overflow-hidden">
      {/* Header Banner */}
      <div className="bg-linear-to-r from-amber-500 via-orange-500 to-amber-600 px-6 py-4 text-white flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-white/20 rounded-xl backdrop-blur-xs">
            <ShoppingBag className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold">
              {editingOrder ? "ઓર્ડર ફેરફાર (Edit Order)" : "નવો ઘારી ઓર્ડર / નોંધણી (New Ghari Order)"}
            </h2>
            <p className="text-xs text-amber-100 font-medium">
              સૂરત મંડળ વાઈઝ કાર્યકર્તા ઘારી વિતરણ ફોર્મ
            </p>
          </div>
        </div>

        {editingOrder && (
          <span className="px-3 py-1 bg-white/20 text-white rounded-full text-xs font-semibold backdrop-blur-xs border border-white/30">
            Editing: {editingOrder.tokenNo || editingOrder.karykartaName}
          </span>
        )}
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {/* Section 1: Karykarta Details */}
        <div>
          <div className="flex items-center gap-2 mb-3 pb-2 border-b border-amber-100">
            <User className="w-4 h-4 text-orange-600" />
            <h3 className="text-sm font-bold text-stone-800">
              કાર્યકર્તા વિગત (Karykarta Details)
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Karykarta Name */}
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-stone-700 mb-1">
                કાર્યકર્તા નામ (Karykarta Name){" "}
                <span className="text-red-500">*</span>
                <span className="ml-2 font-normal text-[11px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                  CAPITAL LETTERS ONLY • NO SPECIAL CHARACTERS
                </span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="karykartaName"
                  value={formData.karykartaName}
                  onChange={handleNameChange}
                  onBlur={() => handleBlur("karykartaName")}
                  placeholder="e.g. HARISHBHAI PRAJAPATI"
                  className={`w-full px-4 py-2.5 rounded-xl border text-sm font-semibold tracking-wide uppercase transition-all ${
                    errors.karykartaName
                      ? "border-red-400 bg-red-50/50 focus:ring-2 focus:ring-red-400 focus:outline-hidden"
                      : "border-stone-300 bg-white focus:border-orange-500 focus:ring-2 focus:ring-orange-200 focus:outline-hidden"
                  }`}
                />
                {formData.karykartaName && !errors.karykartaName && (
                  <CheckCircle className="w-4 h-4 text-emerald-500 absolute right-3 top-3.5" />
                )}
              </div>
              {errors.karykartaName && (
                <p className="mt-1 text-xs text-red-600 flex items-center gap-1 font-medium">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  {errors.karykartaName}
                </p>
              )}
              <p className="mt-1 text-[11px] text-stone-400">
                Type directly: automatically converted to uppercase; numbers & symbols are blocked.
              </p>
            </div>

            {/* Mandal Name (Surat Mandal-wise) */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-stone-700">
                  મંડળ નામ (Mandal Name) <span className="text-red-500">*</span>
                </label>
                <button
                  type="button"
                  onClick={() => setCustomMandal(!customMandal)}
                  className="text-[11px] text-orange-600 hover:text-orange-700 font-semibold cursor-pointer underline"
                >
                  {customMandal ? "Select from list" : "+ Other Mandal"}
                </button>
              </div>

              {!customMandal ? (
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <select
                    name="mandalName"
                    value={formData.mandalName}
                    onChange={(e) => setFormData({ ...formData, mandalName: e.target.value })}
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-stone-300 bg-white text-sm font-semibold text-stone-800 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 focus:outline-hidden"
                  >
                    {SURAT_MANDALS.map((mandal) => (
                      <option key={mandal.id} value={mandal.name}>
                        {mandal.gujarati} ({mandal.english})
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    name="customMandalName"
                    value={formData.mandalName}
                    onChange={(e) => setFormData({ ...formData, mandalName: e.target.value })}
                    onBlur={() => handleBlur("mandalName")}
                    placeholder="Enter custom mandal name..."
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-stone-300 bg-white text-sm font-semibold text-stone-800 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 focus:outline-hidden"
                  />
                </div>
              )}
              {errors.mandalName && (
                <p className="mt-1 text-xs text-red-600 flex items-center gap-1 font-medium">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  {errors.mandalName}
                </p>
              )}
            </div>

            {/* Contact Number */}
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                સંપર્ક નંબર (Contact Number) <span className="text-red-500">*</span>
                <span className="ml-2 font-normal text-[11px] text-stone-500">
                  Strictly 10 Digits
                </span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
                  <Phone className="w-4 h-4" />
                </div>
                <input
                  type="tel"
                  inputMode="numeric"
                  name="contactNumber"
                  value={formData.contactNumber}
                  onChange={handleContactChange}
                  onBlur={() => handleBlur("contactNumber")}
                  placeholder="10-digit mobile (e.g. 9876543210)"
                  className={`w-full pl-9 pr-14 py-2.5 rounded-xl border text-sm font-semibold transition-all ${
                    errors.contactNumber
                      ? "border-red-400 bg-red-50/50 focus:ring-2 focus:ring-red-400 focus:outline-hidden"
                      : "border-stone-300 bg-white focus:border-orange-500 focus:ring-2 focus:ring-orange-200 focus:outline-hidden"
                  }`}
                />
                <span className="absolute right-3 top-3 text-[11px] font-bold text-stone-400">
                  {formData.contactNumber.length}/10
                </span>
              </div>
              {errors.contactNumber && (
                <p className="mt-1 text-xs text-red-600 flex items-center gap-1 font-medium">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  {errors.contactNumber}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Section 2: Ghari Order Form (500 Gm & 1 Kg) */}
        <div>
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-amber-100">
            <div className="flex items-center gap-2">
              <Package className="w-4 h-4 text-orange-600" />
              <h3 className="text-sm font-bold text-stone-800">
                ઘારી ઓર્ડર વિગત (Ghari Order Selection)
              </h3>
            </div>
            <span className="text-xs font-bold text-orange-700 bg-orange-100/80 px-2.5 py-0.5 rounded-full border border-orange-200">
              500 Gm = ₹500 | 1 Kg = ₹1000
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* 500 Gm Packet Card */}
            <div className="p-4 rounded-2xl border-2 border-amber-200 bg-linear-to-br from-amber-50/60 to-orange-50/40 relative">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <span className="text-xs font-extrabold uppercase tracking-wider text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
                    ૫૦૦ ગ્રામ બોક્સ
                  </span>
                  <h4 className="text-base font-black text-stone-800 mt-1">500 Gm Ghari Pack</h4>
                </div>
                <div className="text-right">
                  <span className="text-lg font-black text-orange-600">₹500</span>
                  <span className="text-[11px] text-stone-500 block">/ બોક્સ (Box)</span>
                </div>
              </div>

              {/* Stepper */}
              <div className="flex items-center justify-between mt-4 bg-white p-2 rounded-xl border border-amber-200">
                <button
                  type="button"
                  onClick={() => updateQuantity("qty500g", -1)}
                  className="w-9 h-9 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 flex items-center justify-center font-bold transition-colors cursor-pointer"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <div className="text-center">
                  <input
                    type="number"
                    min="0"
                    value={formData.qty500g}
                    onChange={(e) => setDirectQuantity("qty500g", e.target.value)}
                    className="w-16 text-center text-lg font-black text-stone-900 border-none focus:outline-hidden"
                  />
                  <span className="text-[10px] text-stone-400 block -mt-1">
                    {formData.qty500g * 0.5} Kg
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => updateQuantity("qty500g", 1)}
                  className="w-9 h-9 rounded-lg bg-orange-600 hover:bg-orange-700 text-white flex items-center justify-center font-bold transition-colors cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* Subtotal */}
              <div className="flex items-center justify-between text-xs font-semibold text-stone-600 mt-2 px-1">
                <span>સબટોટલ (Subtotal):</span>
                <span className="text-amber-800 font-bold">
                  {formatCurrency(formData.qty500g * 500)}
                </span>
              </div>
            </div>

            {/* 1 Kg Packet Card */}
            <div className="p-4 rounded-2xl border-2 border-orange-200 bg-linear-to-br from-orange-50/60 to-amber-50/40 relative">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <span className="text-xs font-extrabold uppercase tracking-wider text-orange-800 bg-orange-100 px-2 py-0.5 rounded">
                    ૧ કિલો બોક્સ
                  </span>
                  <h4 className="text-base font-black text-stone-800 mt-1">1 Kg Ghari Pack</h4>
                </div>
                <div className="text-right">
                  <span className="text-lg font-black text-orange-600">₹1000</span>
                  <span className="text-[11px] text-stone-500 block">/ બોક્સ (Box)</span>
                </div>
              </div>

              {/* Stepper */}
              <div className="flex items-center justify-between mt-4 bg-white p-2 rounded-xl border border-orange-200">
                <button
                  type="button"
                  onClick={() => updateQuantity("qty1kg", -1)}
                  className="w-9 h-9 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 flex items-center justify-center font-bold transition-colors cursor-pointer"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <div className="text-center">
                  <input
                    type="number"
                    min="0"
                    value={formData.qty1kg}
                    onChange={(e) => setDirectQuantity("qty1kg", e.target.value)}
                    className="w-16 text-center text-lg font-black text-stone-900 border-none focus:outline-hidden"
                  />
                  <span className="text-[10px] text-stone-400 block -mt-1">
                    {formData.qty1kg * 1.0} Kg
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => updateQuantity("qty1kg", 1)}
                  className="w-9 h-9 rounded-lg bg-orange-600 hover:bg-orange-700 text-white flex items-center justify-center font-bold transition-colors cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* Subtotal */}
              <div className="flex items-center justify-between text-xs font-semibold text-stone-600 mt-2 px-1">
                <span>સબટોટલ (Subtotal):</span>
                <span className="text-orange-800 font-bold">
                  {formatCurrency(formData.qty1kg * 1000)}
                </span>
              </div>
            </div>
          </div>

          {errors.ghariOrder && (
            <p className="mt-2 text-xs text-red-600 flex items-center gap-1 font-medium bg-red-50 p-2 rounded-lg border border-red-200">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {errors.ghariOrder}
            </p>
          )}

          {/* Dynamic Live Order Summary Box */}
          <div className="mt-4 p-4 rounded-2xl bg-amber-50/70 border border-amber-200/90 flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-orange-600" />
                <span className="text-xs font-bold text-stone-700">ઓર્ડર સારાંશ (Order Summary):</span>
              </div>
              <p className="text-xs text-stone-600">
                {formData.qty500g} × 500g ({formData.qty500g * 0.5} kg) + {formData.qty1kg} × 1kg ({formData.qty1kg} kg)
              </p>
              <div className="flex items-center gap-3 text-xs font-semibold text-amber-900">
                <span>કુલ બોક્સ: {totals.totalPacks}</span>
                <span>•</span>
                <span>કુલ વજન: {formatWeight(totals.totalWeightKg)}</span>
              </div>
            </div>

            <div className="text-right">
              <span className="text-xs font-bold text-stone-500 uppercase tracking-wider block">
                કુલ રકમ (Grand Total)
              </span>
              <span className="text-2xl font-black text-orange-600 tracking-tight">
                {formatCurrency(totals.totalPrice)}
              </span>
            </div>
          </div>
        </div>

        {/* Section 3: Payment Status & Remarks */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-amber-100">
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">
              ચુકવણી સ્થિતિ (Payment Status)
            </label>
            <select
              value={formData.paymentStatus}
              onChange={(e) => setFormData({ ...formData, paymentStatus: e.target.value })}
              className="w-full px-3 py-2.5 rounded-xl border border-stone-300 bg-white text-xs font-semibold text-stone-800 focus:border-orange-500 focus:outline-hidden"
            >
              {PAYMENT_STATUSES.map((status) => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">
              નોંધ / રીમાર્કસ (Remarks / Notes)
            </label>
            <input
              type="text"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="e.g. Mandal pickup token, paid via UPI"
              className="w-full px-3 py-2.5 rounded-xl border border-stone-300 bg-white text-xs font-medium text-stone-800 focus:border-orange-500 focus:outline-hidden"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-2 flex flex-wrap items-center justify-end gap-3">
          <button
            type="button"
            onClick={handleReset}
            disabled={isLoading}
            className="px-4 py-2.5 rounded-xl border border-stone-300 hover:bg-stone-100 text-stone-700 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{editingOrder ? "રદ કરો (Cancel)" : "રીસેટ (Reset)"}</span>
          </button>

          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-2.5 rounded-xl bg-linear-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white text-xs font-bold shadow-md shadow-orange-600/20 flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50"
          >
            <CheckCircle className="w-4 h-4" />
            <span>
              {isLoading
                ? "સાચવી રહ્યું છે..."
                : editingOrder
                ? "ઓર્ડર અપડેટ કરો (Update Order)"
                : "ઓર્ડર સાચવો (Submit Ghari Order)"}
            </span>
          </button>
        </div>
      </form>
    </div>
  );
}
