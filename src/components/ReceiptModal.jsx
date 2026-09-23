import React from "react";
import { X, Printer, CheckCircle, Package, MapPin, User, Phone, Hash, Calendar, Sparkles } from "lucide-react";
import { formatCurrency, formatWeight, formatDateTime } from "../utils/formatters";

export default function ReceiptModal({ order, onClose }) {
  if (!order) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative bg-white rounded-3xl max-w-lg w-full border border-amber-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header bar (screen only) */}
        <div className="no-print bg-linear-to-r from-orange-600 to-amber-600 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-200" />
            <h3 className="font-bold text-sm sm:text-base">વિતરણ સ્લિપ / ટોકન (Distribution Receipt)</h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Printable Receipt Card Body */}
        <div id="printable-receipt" className="p-6 sm:p-8 bg-white text-stone-900">
          {/* Receipt Header */}
          <div className="text-center pb-4 border-b-2 border-dashed border-amber-300">
            <div className="inline-block px-3 py-1 bg-amber-100 text-amber-900 rounded-full text-[11px] font-black tracking-wider uppercase mb-1">
              સૂરત મંડળ વાઈઝ ઘારી વિતરણ સેવા
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-orange-700 tracking-tight">
              SURAT GHARI DISTRIBUTION TOKEN
            </h2>
            <p className="text-xs text-stone-500 font-medium mt-0.5">
              કાર્યકર્તા ઘારી વિતરણ રસીદ (Karyakarta Distribution Receipt)
            </p>

            <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 bg-stone-100 rounded-lg border border-stone-200 text-xs font-mono font-bold text-stone-800">
              <span>TOKEN: {order.tokenNo || `SUR-GH-${order.id?.slice(-4) || "1001"}`}</span>
            </div>
          </div>

          {/* Karyakarta Info */}
          <div className="my-4 space-y-2 text-xs">
            <div className="flex justify-between py-1 border-b border-stone-100">
              <span className="text-stone-500 font-medium">કાર્યકર્તા નામ (Karykarta):</span>
              <span className="font-black text-stone-900 uppercase">{order.karykartaName}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-stone-100">
              <span className="text-stone-500 font-medium">સૂરત મંડળ (Mandal):</span>
              <span className="font-bold text-orange-700">{order.mandalName}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-stone-100">
              <span className="text-stone-500 font-medium">સંપર્ક નંબર (Phone):</span>
              <span className="font-bold text-stone-900 font-mono">{order.contactNumber}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-stone-100">
              <span className="text-stone-500 font-medium">તારીખ (Date):</span>
              <span className="font-medium text-stone-700">{formatDateTime(order.createdAt)}</span>
            </div>
          </div>

          {/* Ghari Order Breakdown Table */}
          <div className="my-4">
            <h4 className="text-xs font-bold text-stone-800 mb-2 uppercase tracking-wide">
              ઓર્ડર વિગત (Ghari Items)
            </h4>
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-amber-200 bg-amber-50/60 text-stone-700 text-left">
                  <th className="py-1.5 px-2">Item</th>
                  <th className="py-1.5 px-2 text-center">Rate</th>
                  <th className="py-1.5 px-2 text-center">Qty</th>
                  <th className="py-1.5 px-2 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {order.qty500g > 0 && (
                  <tr>
                    <td className="py-2 px-2 font-medium">૫૦૦ ગ્રા. ઘારી (500 Gm)</td>
                    <td className="py-2 px-2 text-center font-mono">₹500</td>
                    <td className="py-2 px-2 text-center font-bold">{order.qty500g} Box</td>
                    <td className="py-2 px-2 text-right font-bold text-stone-800">
                      {formatCurrency(order.qty500g * 500)}
                    </td>
                  </tr>
                )}
                {order.qty1kg > 0 && (
                  <tr>
                    <td className="py-2 px-2 font-medium">૧ કિ.ગ્રા. ઘારી (1 Kg)</td>
                    <td className="py-2 px-2 text-center font-mono">₹1000</td>
                    <td className="py-2 px-2 text-center font-bold">{order.qty1kg} Box</td>
                    <td className="py-2 px-2 text-right font-bold text-stone-800">
                      {formatCurrency(order.qty1kg * 1000)}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            {/* Totals */}
            <div className="mt-3 p-3 bg-stone-50 rounded-xl border border-stone-200 space-y-1 text-xs">
              <div className="flex justify-between text-stone-600">
                <span>કુલ પેકેટ (Total Packs):</span>
                <span className="font-bold">{order.totalPacks} Boxes</span>
              </div>
              <div className="flex justify-between text-stone-600">
                <span>કુલ વજન (Total Weight):</span>
                <span className="font-bold text-amber-900">{formatWeight(order.totalWeightKg)}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-stone-200 text-sm font-black text-orange-700">
                <span>કુલ રકમ (Total Price):</span>
                <span>{formatCurrency(order.totalPrice)}</span>
              </div>
              <div className="flex justify-between text-xs pt-1 text-stone-600">
                <span>સ્થિતિ (Status):</span>
                <span className="font-bold text-emerald-700">{order.paymentStatus || "PAID"}</span>
              </div>
            </div>

            {order.notes && (
              <p className="mt-2 text-[11px] text-stone-500 italic">
                Note: {order.notes}
              </p>
            )}
          </div>

          {/* Footer & Signature Stamp */}
          <div className="mt-8 pt-4 border-t border-stone-200 flex items-center justify-between text-[11px] text-stone-400">
            <div className="text-center">
              <div className="h-8"></div>
              <div className="border-t border-stone-300 w-24 pt-1 text-stone-500">
                કાર્યકર્તા સહી
              </div>
            </div>
            <div className="text-center">
              <div className="h-8"></div>
              <div className="border-t border-stone-300 w-28 pt-1 text-stone-500">
                મંડળ પ્રમુખ / વિતરણ સીલ
              </div>
            </div>
          </div>
        </div>

        {/* Modal Actions (screen only) */}
        <div className="no-print bg-stone-50 px-6 py-4 border-t border-stone-200 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-stone-300 text-stone-700 text-xs font-bold hover:bg-stone-200 transition-colors cursor-pointer"
          >
            બંધ કરો (Close)
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="px-5 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold flex items-center gap-2 shadow-sm transition-colors cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>સ્લિપ પ્રિન્ટ કરો (Print Receipt)</span>
          </button>
        </div>
      </div>
    </div>
  );
}
