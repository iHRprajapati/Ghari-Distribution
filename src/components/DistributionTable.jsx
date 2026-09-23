import React, { useState } from "react";
import {
  Search,
  Download,
  Receipt,
  Edit2,
  Trash2,
  Phone,
  AlertTriangle,
  User,
  PackageCheck,
  Hash,
} from "lucide-react";
import { formatCurrency, formatWeight, formatDateTime } from "../utils/formatters";
import { exportOrdersToCSV } from "../services/ghariService";

export default function DistributionTable({
  orders = [],
  onEdit,
  onDelete,
  onViewReceipt,
  selectedMandal,
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteCandidate, setDeleteCandidate] = useState(null);

  // Filter orders by search query and selected mandal
  const filteredOrders = orders.filter((order) => {
    // Mandal filter
    if (selectedMandal !== "ALL" && order.mandalName !== selectedMandal) {
      return false;
    }

    // Search filter
    if (!searchTerm.trim()) return true;
    const query = searchTerm.toLowerCase().trim();
    const nameMatch = (order.karykartaName || "").toLowerCase().includes(query);
    const rollMatch = (order.rollNo || "").toString().toLowerCase().includes(query);
    const phoneMatch = (order.contactNumber || "").includes(query);
    const mandalMatch = (order.mandalName || "").toLowerCase().includes(query);
    const tokenMatch = (order.tokenNo || "").toLowerCase().includes(query);

    return nameMatch || rollMatch || phoneMatch || mandalMatch || tokenMatch;
  });

  const handleExport = () => {
    exportOrdersToCSV(filteredOrders);
  };

  const confirmDelete = () => {
    if (deleteCandidate) {
      onDelete(deleteCandidate.id);
      setDeleteCandidate(null);
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-amber-200/90 shadow-xs overflow-hidden">
      {/* Table Header Controls */}
      <div className="p-4 sm:p-6 border-b border-amber-100 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-stone-900">
            ઘારી વિતરણ યાદી (Distribution Records)
          </h3>
          <p className="text-xs text-stone-500 font-medium">
            Showing {filteredOrders.length} of {orders.length} Karyakarta records
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          {/* Search bar */}
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-3 pointer-events-none" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search name, roll, phone..."
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-stone-300 text-xs font-medium focus:border-orange-500 focus:outline-hidden"
            />
          </div>

          {/* Export to CSV */}
          <button
            onClick={handleExport}
            disabled={filteredOrders.length === 0}
            className="px-3.5 py-2 rounded-xl border border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-900 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
            title="Download CSV for Excel"
          >
            <Download className="w-4 h-4 text-amber-700" />
            <span className="hidden sm:inline">CSV Export</span>
          </button>
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        {filteredOrders.length === 0 ? (
          <div className="text-center py-16 px-4">
            <PackageCheck className="w-12 h-12 text-amber-300 mx-auto mb-3" />
            <h4 className="text-sm font-bold text-stone-700">કોઈ ઓર્ડર મળ્યો નથી (No Orders Found)</h4>
            <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
              There are no matching Ghari distribution records. Add a new order using the form above.
            </p>
          </div>
        ) : (
          <table className="w-full text-left text-xs">
            <thead className="bg-amber-50/70 border-b border-amber-100 text-stone-700 uppercase tracking-wider text-[11px] font-bold">
              <tr>
                <th className="py-3 px-4">રોલ નં. (Roll)</th>
                <th className="py-3 px-4">કાર્યકર્તા નામ (Karykarta Name)</th>
                <th className="py-3 px-4">સૂરત મંડળ (Mandal)</th>
                <th className="py-3 px-4">સંપર્ક (Contact)</th>
                <th className="py-3 px-4">ઘારી ઓર્ડર (Packs)</th>
                <th className="py-3 px-4">કુલ વજન (Weight)</th>
                <th className="py-3 px-4">રકમ (Amount)</th>
                <th className="py-3 px-4">સ્થિતિ (Status)</th>
                <th className="py-3 px-4 text-right">ક્રિયાઓ (Actions)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-amber-100/60">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-amber-50/40 transition-colors">
                  {/* Roll No */}
                  <td className="py-3.5 px-4 font-mono font-bold text-stone-800">
                    <span className="bg-stone-100 text-stone-700 px-2 py-0.5 rounded border border-stone-200">
                      #{order.rollNo}
                    </span>
                  </td>

                  {/* Karykarta Name (CAPITAL LETTERS) */}
                  <td className="py-3.5 px-4">
                    <div className="font-extrabold text-stone-900 tracking-wide uppercase">
                      {order.karykartaName}
                    </div>
                    {order.tokenNo && (
                      <span className="text-[10px] text-stone-400 font-mono">
                        {order.tokenNo}
                      </span>
                    )}
                  </td>

                  {/* Mandal */}
                  <td className="py-3.5 px-4">
                    <span className="font-semibold text-orange-800 bg-orange-50 px-2 py-0.5 rounded border border-orange-200/60">
                      {order.mandalName}
                    </span>
                  </td>

                  {/* Contact */}
                  <td className="py-3.5 px-4">
                    <a
                      href={`tel:${order.contactNumber}`}
                      className="font-mono font-semibold text-stone-700 hover:text-orange-600 flex items-center gap-1"
                    >
                      <Phone className="w-3 h-3 text-stone-400" />
                      {order.contactNumber}
                    </a>
                  </td>

                  {/* Ghari Packs */}
                  <td className="py-3.5 px-4">
                    <div className="space-y-0.5 text-[11px]">
                      {order.qty500g > 0 && (
                        <span className="inline-block mr-1 text-amber-900 font-medium">
                          <strong>{order.qty500g}</strong> × 500g
                        </span>
                      )}
                      {order.qty1kg > 0 && (
                        <span className="inline-block text-orange-900 font-medium">
                          <strong>{order.qty1kg}</strong> × 1Kg
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Total Weight */}
                  <td className="py-3.5 px-4 font-bold text-amber-900">
                    {formatWeight(order.totalWeightKg)}
                  </td>

                  {/* Total Price */}
                  <td className="py-3.5 px-4 font-black text-orange-600">
                    {formatCurrency(order.totalPrice)}
                  </td>

                  {/* Payment Status */}
                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        order.paymentStatus === "PAID"
                          ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                          : order.paymentStatus === "SEVA_FREE"
                          ? "bg-blue-100 text-blue-800 border border-blue-200"
                          : "bg-amber-100 text-amber-800 border border-amber-200"
                      }`}
                    >
                      {order.paymentStatus || "PAID"}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {/* Receipt View */}
                      <button
                        type="button"
                        onClick={() => onViewReceipt(order)}
                        title="View & Print Token Slip"
                        className="p-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 transition-colors cursor-pointer"
                      >
                        <Receipt className="w-3.5 h-3.5" />
                      </button>

                      {/* Edit */}
                      <button
                        type="button"
                        onClick={() => onEdit(order)}
                        title="Edit Order"
                        className="p-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors cursor-pointer"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>

                      {/* Delete */}
                      <button
                        type="button"
                        onClick={() => setDeleteCandidate(order)}
                        title="Delete Order"
                        className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteCandidate && (
        <div className="fixed inset-0 z-50 bg-stone-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 border border-stone-200 shadow-xl">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-stone-900 text-center">ઓર્ડર ડિલીટ કરો?</h4>
            <p className="text-xs text-stone-600 text-center mt-1">
              Are you sure you want to delete the Ghari distribution order for{" "}
              <strong className="text-stone-900 uppercase">{deleteCandidate.karykartaName}</strong> (Roll #{deleteCandidate.rollNo})?
            </p>

            <div className="mt-6 flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setDeleteCandidate(null)}
                className="px-4 py-2 rounded-xl border border-stone-300 text-stone-700 text-xs font-bold hover:bg-stone-100 cursor-pointer"
              >
                રદ કરો (Cancel)
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold cursor-pointer"
              >
                હા, ડિલીટ કરો (Delete)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
