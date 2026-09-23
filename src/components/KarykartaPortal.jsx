import React, { useState } from "react";
import {
  User,
  ShoppingBag,
  MapPin,
  Phone,
  Package,
  Plus,
  Minus,
  CheckCircle,
  AlertCircle,
  Receipt,
  Sparkles,
  CloudCheck,
  History,
} from "lucide-react";
import { calculateOrderTotals, formatCurrency, formatWeight, formatDateTime } from "../utils/formatters";

export default function KarykartaPortal({
  currentUser,
  allOrders = [],
  onSubmitOrder,
  onViewReceipt,
  isLoading = false,
}) {
  const [qty500g, setQty500g] = useState(1);
  const [qty1kg, setQty1kg] = useState(0);
  const [paymentStatus, setPaymentStatus] = useState("PAID");
  const [notes, setNotes] = useState("");
  const [formError, setFormError] = useState("");

  // Derived totals
  const totals = calculateOrderTotals(qty500g, qty1kg);

  // Filter orders placed by this Karyakarta (by mobile or name)
  const myOrders = allOrders.filter(
    (o) =>
      o.contactNumber === currentUser.mobile ||
      (o.karykartaName &&
        o.karykartaName.toUpperCase() === (currentUser.name || "").toUpperCase())
  );

  // Steppers
  const updateQuantity = (type, delta) => {
    if (type === "500g") {
      setQty500g((prev) => Math.max(0, prev + delta));
    } else {
      setQty1kg((prev) => Math.max(0, prev + delta));
    }
  };

  const handleOrderSubmit = (e) => {
    e.preventDefault();
    setFormError("");

    if (qty500g === 0 && qty1kg === 0) {
      setFormError("કૃપા કરીને ઓછામાં ઓછું ૧ પેકેટ (૫૦૦ ગ્રા. અથવા ૧ કિ.ગ્રા.) પસંદ કરો.");
      return;
    }

    const orderPayload = {
      karykartaName: currentUser.name,
      mandalName: currentUser.mandalName,
      contactNumber: currentUser.mobile,
      qty500g,
      qty1kg,
      paymentStatus,
      notes,
    };

    onSubmitOrder(orderPayload);

    // Reset pack selectors to default
    setQty500g(1);
    setQty1kg(0);
    setNotes("");
  };

  return (
    <div className="space-y-6">
      {/* Karyakarta Profile Banner */}
      <div className="bg-linear-to-r from-amber-500 via-orange-500 to-amber-600 rounded-3xl p-6 text-white shadow-md shadow-orange-500/15 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-white border border-white/30 text-2xl font-black">
            {currentUser?.name ? currentUser.name.charAt(0) : "ક"}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase tracking-wider font-extrabold bg-white/20 px-2.5 py-0.5 rounded-full border border-white/30">
                કાર્યકર્તા પોર્ટલ (Karykarta Portal)
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black uppercase tracking-wide mt-1">
              {currentUser?.name || "KARYAKARTA"}
            </h2>
            <div className="flex flex-wrap items-center gap-3 text-xs text-amber-100 font-medium mt-1">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" />
                <strong>{currentUser?.mandalName}</strong>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1 font-mono">
                <Phone className="w-3.5 h-3.5" />
                {currentUser?.mobile}
              </span>
            </div>
          </div>
        </div>

        {/* Live sync to Pradesh notice */}
        <div className="bg-white/15 backdrop-blur-xs rounded-2xl p-3 border border-white/25 text-right flex flex-col items-end">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-100">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
            </span>
            <span>પ્રદેશ કક્ષાએ લાઈવ પ્રતિબિંબિત</span>
          </div>
          <span className="text-[11px] text-white/80 mt-0.5">
            Reflecting instantly at Pradesh Level Dashboard
          </span>
        </div>
      </div>

      {/* Main Grid: Order Form on Left, Past Orders on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Order Form (500 Gm & 1 Kg) */}
        <div className="lg:col-span-6 bg-white rounded-3xl border border-amber-200 shadow-xs overflow-hidden">
          <div className="bg-amber-50/80 px-6 py-4 border-b border-amber-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-orange-600" />
              <h3 className="text-base font-bold text-stone-900">
                નવો ઘારી ઓર્ડર કરો (Place Ghari Order)
              </h3>
            </div>
            <span className="text-xs font-bold text-orange-700 bg-orange-100 px-2.5 py-0.5 rounded-full border border-orange-200">
              500g = ₹500 | 1Kg = ₹1000
            </span>
          </div>

          <form onSubmit={handleOrderSubmit} className="p-6 space-y-5">
            {/* Auto-filled Karyakarta info row */}
            <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200 text-xs flex flex-wrap justify-between gap-2">
              <div>
                <span className="text-stone-500 font-medium">ઓર્ડર કરનાર:</span>{" "}
                <strong className="text-stone-900 uppercase">{currentUser?.name}</strong>
              </div>
              <div>
                <span className="text-stone-500 font-medium">મંડળ:</span>{" "}
                <strong className="text-orange-700">{currentUser?.mandalName}</strong>
              </div>
            </div>

            {/* Ghari Pack Selectors */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* 500 Gm */}
              <div className="p-4 rounded-2xl border-2 border-amber-200 bg-linear-to-br from-amber-50/50 to-orange-50/30">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
                      ૫૦૦ ગ્રામ
                    </span>
                    <h4 className="text-sm font-extrabold text-stone-800 mt-1">500 Gm Pack</h4>
                  </div>
                  <div className="text-right">
                    <span className="text-base font-black text-orange-600">₹500</span>
                    <span className="text-[10px] text-stone-500 block">/ બોક્સ</span>
                  </div>
                </div>

                {/* Counter */}
                <div className="flex items-center justify-between mt-3 bg-white p-2 rounded-xl border border-amber-200">
                  <button
                    type="button"
                    onClick={() => updateQuantity("500g", -1)}
                    className="w-8 h-8 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-800 flex items-center justify-center font-bold cursor-pointer"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-base font-black text-stone-900">{qty500g}</span>
                  <button
                    type="button"
                    onClick={() => updateQuantity("500g", 1)}
                    className="w-8 h-8 rounded-lg bg-orange-600 hover:bg-orange-700 text-white flex items-center justify-center font-bold cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="flex justify-between text-xs font-semibold text-stone-600 mt-2 px-1">
                  <span>સબટોટલ:</span>
                  <span className="text-amber-800 font-bold">{formatCurrency(qty500g * 500)}</span>
                </div>
              </div>

              {/* 1 Kg */}
              <div className="p-4 rounded-2xl border-2 border-orange-200 bg-linear-to-br from-orange-50/50 to-amber-50/30">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-orange-800 bg-orange-100 px-2 py-0.5 rounded">
                      ૧ કિલોગ્રામ
                    </span>
                    <h4 className="text-sm font-extrabold text-stone-800 mt-1">1 Kg Pack</h4>
                  </div>
                  <div className="text-right">
                    <span className="text-base font-black text-orange-600">₹1000</span>
                    <span className="text-[10px] text-stone-500 block">/ બોક્સ</span>
                  </div>
                </div>

                {/* Counter */}
                <div className="flex items-center justify-between mt-3 bg-white p-2 rounded-xl border border-orange-200">
                  <button
                    type="button"
                    onClick={() => updateQuantity("1kg", -1)}
                    className="w-8 h-8 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-800 flex items-center justify-center font-bold cursor-pointer"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-base font-black text-stone-900">{qty1kg}</span>
                  <button
                    type="button"
                    onClick={() => updateQuantity("1kg", 1)}
                    className="w-8 h-8 rounded-lg bg-orange-600 hover:bg-orange-700 text-white flex items-center justify-center font-bold cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="flex justify-between text-xs font-semibold text-stone-600 mt-2 px-1">
                  <span>સબટોટલ:</span>
                  <span className="text-orange-800 font-bold">{formatCurrency(qty1kg * 1000)}</span>
                </div>
              </div>
            </div>

            {formError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600 font-medium flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            {/* Dynamic Calculation Summary */}
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200/90 flex justify-between items-center">
              <div>
                <span className="text-xs font-bold text-stone-700 block">ઓર્ડર સારાંશ:</span>
                <span className="text-xs text-stone-600">
                  કુલ બોક્સ: <strong>{totals.totalPacks}</strong> | કુલ વજન:{" "}
                  <strong>{formatWeight(totals.totalWeightKg)}</strong>
                </span>
              </div>
              <div className="text-right">
                <span className="text-[11px] text-stone-500 font-medium block">કુલ રકમ</span>
                <span className="text-xl font-black text-orange-600">
                  {formatCurrency(totals.totalPrice)}
                </span>
              </div>
            </div>

            {/* Payment & Remarks */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block font-bold text-stone-700 mb-1">ચુકવણી સ્થિતિ</label>
                <select
                  value={paymentStatus}
                  onChange={(e) => setPaymentStatus(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-white font-semibold text-stone-800 focus:border-orange-500 focus:outline-hidden"
                >
                  <option value="PAID">Paid / ચુકવેલ</option>
                  <option value="PENDING">Payment Pending / બાકી</option>
                  <option value="SEVA_FREE">Mandal Seva (Complimentary)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">નોંધ / રીમાર્કસ</label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Optional delivery notes"
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 font-medium text-stone-800 focus:border-orange-500 focus:outline-hidden"
                />
              </div>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-2xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold shadow-md shadow-orange-600/20 flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-50"
            >
              <CheckCircle className="w-4 h-4" />
              <span>{isLoading ? "ઓર્ડર મોકલી રહ્યું છે..." : "ઓર્ડર કન્ફર્મ કરો (Confirm Ghari Order)"}</span>
            </button>
          </form>
        </div>

        {/* My Orders / History Column */}
        <div className="lg:col-span-6 bg-white rounded-3xl border border-amber-200 shadow-xs overflow-hidden">
          <div className="bg-amber-50/80 px-6 py-4 border-b border-amber-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <History className="w-5 h-5 text-orange-600" />
              <h3 className="text-base font-bold text-stone-900">
                મારા ઓર્ડર્સ & ટોકન સ્લિપ (My Orders)
              </h3>
            </div>
            <span className="text-xs font-bold text-stone-600">
              {myOrders.length} ઓર્ડર્સ
            </span>
          </div>

          <div className="p-6">
            {myOrders.length === 0 ? (
              <div className="text-center py-12 px-4">
                <Package className="w-12 h-12 text-amber-300 mx-auto mb-3" />
                <h4 className="text-sm font-bold text-stone-700">તમે હજી સુધી કોઈ ઓર્ડર કર્યો નથી</h4>
                <p className="text-xs text-stone-500 mt-1">
                  તમારી ઘારીની જરૂરિયાત મુજબ ડાબી બાજુના ફોર્મમાંથી ઓર્ડર કરો.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {myOrders.map((order) => (
                  <div
                    key={order.id}
                    className="p-4 rounded-2xl border border-amber-200 bg-amber-50/30 hover:bg-amber-50/60 transition-colors flex flex-wrap items-center justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-black bg-stone-900 text-white px-2 py-0.5 rounded">
                          {order.tokenNo}
                        </span>
                        <span className="text-xs text-stone-500">
                          {formatDateTime(order.createdAt)}
                        </span>
                      </div>
                      <div className="mt-1.5 text-xs text-stone-700 font-semibold flex items-center gap-2">
                        {order.qty500g > 0 && <span>{order.qty500g} × 500g</span>}
                        {order.qty1kg > 0 && <span>{order.qty1kg} × 1Kg</span>}
                        <span>•</span>
                        <span className="text-amber-900 font-bold">
                          {formatWeight(order.totalWeightKg)}
                        </span>
                      </div>
                      <div className="mt-1 flex items-center gap-2 text-xs">
                        <span className="font-black text-orange-600">
                          {formatCurrency(order.totalPrice)}
                        </span>
                        <span
                          className={`px-2 py-0.2 rounded-full text-[10px] font-bold ${
                            order.paymentStatus === "PAID"
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-amber-100 text-amber-800"
                          }`}
                        >
                          {order.paymentStatus || "PAID"}
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => onViewReceipt(order)}
                      className="px-3 py-1.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                    >
                      <Receipt className="w-3.5 h-3.5" />
                      <span>ટોકન સ્લિપ (View Token)</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
