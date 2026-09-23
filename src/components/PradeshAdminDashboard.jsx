import React, { useState } from "react";
import {
  ShieldCheck,
  Building2,
  Users,
  PlusCircle,
  ListFilter,
  KeyRound,
  RotateCcw,
  CheckCircle,
} from "lucide-react";
import StatsOverview from "./StatsOverview";
import MandalFilter from "./MandalFilter";
import DistributionTable from "./DistributionTable";
import GhariOrderForm from "./GhariOrderForm";
import { getLocalUsers, resetKarykartaPasswordToDefault } from "../services/authService";

export default function PradeshAdminDashboard({
  orders = [],
  selectedMandal,
  onSelectMandal,
  onEditOrder,
  onDeleteOrder,
  onViewReceipt,
  onSubmitOrder,
  editingOrder,
  onCancelEdit,
  isLoading,
  showToast,
}) {
  const [activeAdminTab, setActiveAdminTab] = useState("distributions"); // "distributions", "add_order", "karyakarta_directory"
  const [userList, setUserList] = useState(getLocalUsers());

  const handleResetPassword = async (mobile, name) => {
    if (window.confirm(`Reset password for ${name} (${mobile}) to default (their mobile number)?`)) {
      await resetKarykartaPasswordToDefault(mobile);
      setUserList(getLocalUsers());
      showToast(`Password for ${name} reset to ${mobile}`, "success");
    }
  };

  return (
    <div className="space-y-6">
      {/* Pradesh Level Header Banner */}
      <div className="bg-linear-to-r from-stone-900 via-stone-800 to-amber-950 rounded-3xl p-6 text-white shadow-lg border border-amber-500/30 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-400 shadow-inner">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase tracking-wider font-extrabold bg-amber-500/20 text-amber-300 px-2.5 py-0.5 rounded-full border border-amber-400/30">
                પ્રદેશ કક્ષા નિયંત્રણ કક્ષ (Pradesh Level Central Portal)
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-wide mt-1">
              સૂરત મહાનગર ઘારી વિતરણ મોનિટરિંગ
            </h2>
            <p className="text-xs text-stone-300 font-medium mt-1">
              Centralized state tracking: All Karyakarta orders across 13 Surat Mandals reflect here in real-time.
            </p>
          </div>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex items-center gap-2 bg-stone-800/80 p-1.5 rounded-2xl border border-stone-700">
          <button
            onClick={() => setActiveAdminTab("distributions")}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeAdminTab === "distributions"
                ? "bg-amber-600 text-white shadow-sm"
                : "text-stone-400 hover:text-white"
            }`}
          >
            <ListFilter className="w-4 h-4" />
            <span>તમામ ઓર્ડર્સ (All Orders)</span>
          </button>

          <button
            onClick={() => setActiveAdminTab("add_order")}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeAdminTab === "add_order"
                ? "bg-amber-600 text-white shadow-sm"
                : "text-stone-400 hover:text-white"
            }`}
          >
            <PlusCircle className="w-4 h-4" />
            <span>મેન્યુઅલ એન્ટ્રી (New Order)</span>
          </button>

          <button
            onClick={() => {
              setActiveAdminTab("karyakarta_directory");
              setUserList(getLocalUsers());
            }}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeAdminTab === "karyakarta_directory"
                ? "bg-amber-600 text-white shadow-sm"
                : "text-stone-400 hover:text-white"
            }`}
          >
            <Users className="w-4 h-4" />
            <span>કાર્યકર્તા લિસ્ટ (Users)</span>
          </button>
        </div>
      </div>

      {/* KPI Stats across whole Pradesh */}
      <StatsOverview orders={orders} />

      {/* TAB 1: ALL DISTRIBUTIONS (WITH MANDAL FILTER) */}
      {activeAdminTab === "distributions" && (
        <div className="space-y-4">
          <MandalFilter
            selectedMandal={selectedMandal}
            onSelectMandal={onSelectMandal}
            orders={orders}
          />

          <DistributionTable
            orders={orders}
            selectedMandal={selectedMandal}
            onEdit={onEditOrder}
            onDelete={onDeleteOrder}
            onViewReceipt={onViewReceipt}
          />
        </div>
      )}

      {/* TAB 2: MANUAL ENTRY FORM */}
      {activeAdminTab === "add_order" && (
        <div className="max-w-2xl mx-auto">
          <GhariOrderForm
            onSubmit={(data) => {
              onSubmitOrder(data);
              setActiveAdminTab("distributions");
            }}
            editingOrder={editingOrder}
            onCancelEdit={onCancelEdit}
            isLoading={isLoading}
          />
        </div>
      )}

      {/* TAB 3: KARYAKARTA DIRECTORY & PASSWORD RESET */}
      {activeAdminTab === "karyakarta_directory" && (
        <div className="bg-white rounded-3xl border border-amber-200 shadow-xs overflow-hidden">
          <div className="p-6 border-b border-amber-100 flex justify-between items-center">
            <div>
              <h3 className="text-base font-bold text-stone-900">
                નોંધાયેલ કાર્યકર્તાઓ (Registered Karyakartas)
              </h3>
              <p className="text-xs text-stone-500">
                User ID is mobile number. First-time default password is mobile number.
              </p>
            </div>
            <span className="text-xs font-bold bg-amber-100 text-amber-900 px-3 py-1 rounded-full">
              {userList.length} કાર્યકર્તાઓ
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 border-b border-stone-200 text-stone-600 font-bold uppercase">
                <tr>
                  <th className="py-3 px-4">નામ (Name)</th>
                  <th className="py-3 px-4">મંડળ (Mandal)</th>
                  <th className="py-3 px-4">મોબાઈલ / User ID</th>
                  <th className="py-3 px-4">પાસવર્ડ સ્થિતિ (Status)</th>
                  <th className="py-3 px-4 text-right">ક્રિયા (Action)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {userList.map((user) => (
                  <tr key={user.mobile} className="hover:bg-amber-50/40">
                    <td className="py-3 px-4 font-bold uppercase text-stone-900">
                      {user.name}
                    </td>
                    <td className="py-3 px-4 font-semibold text-orange-700">
                      {user.mandalName}
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-stone-800">
                      {user.mobile}
                    </td>
                    <td className="py-3 px-4">
                      {user.hasSetPassword ? (
                        <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full text-[10px] font-bold">
                          ✓ કસ્ટમ પાસવર્ડ સેટ છે
                        </span>
                      ) : (
                        <span className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full text-[10px] font-bold">
                          ડિફોલ્ટ પાસવર્ડ (મોબાઈલ નંબર)
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => handleResetPassword(user.mobile, user.name)}
                        className="px-2.5 py-1 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold flex items-center gap-1 ml-auto cursor-pointer"
                        title="Reset password to mobile number"
                      >
                        <RotateCcw className="w-3 h-3" />
                        <span>રીસેટ પાસવર્ડ</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
