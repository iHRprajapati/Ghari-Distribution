import React from "react";
import { Sparkles, ShoppingBag, Database, ShieldCheck, User, LogOut } from "lucide-react";

export default function Navbar({
  connectionStatus,
  totalOrders,
  totalWeightKg,
  currentUser,
  onLogout,
}) {
  const isAdmin = currentUser?.role === "admin";

  return (
    <header className="bg-white/90 backdrop-blur-md sticky top-0 z-30 border-b border-amber-200/80 shadow-xs">
      {/* Top promotional / festive sub-bar */}
      <div className="bg-linear-to-r from-amber-600 via-orange-600 to-amber-700 text-white text-xs sm:text-sm py-1.5 px-4 text-center font-medium tracking-wide flex items-center justify-center gap-2">
        <Sparkles className="w-4 h-4 animate-spin-slow text-amber-200" />
        <span>સૂરત પ્રખ્યાત ઘારી વિતરણ સેવા - ચાંદની પડવા મહોત્સવ | Karyakarta Seva Portal</span>
        <Sparkles className="w-4 h-4 animate-spin-slow text-amber-200" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap items-center justify-between gap-4">
        {/* Brand identity */}
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-linear-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white shadow-md shadow-orange-500/20">
            <span className="text-xl font-black select-none">ઘા</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-extrabold text-stone-900 tracking-tight">
                સૂરત ઘારી <span className="text-orange-600">વિતરણ</span>
              </h1>
              <span className="hidden sm:inline-block px-2.5 py-0.5 text-[11px] font-bold text-orange-700 bg-orange-100 rounded-full border border-orange-200">
                ૧૩ મંડળ સેવા
              </span>
            </div>
            <p className="text-[11px] text-stone-500 font-medium">
              Surat Mandal-wise Ghari Order & Pradesh Level Distribution
            </p>
          </div>
        </div>

        {/* User profile, Live Counters & Logout */}
        <div className="flex items-center flex-wrap gap-2.5 sm:gap-3">
          {/* Quick Metrics Badge */}
          <div className="hidden lg:flex items-center gap-2 bg-amber-50 border border-amber-200/80 rounded-xl px-3 py-1.5 text-xs">
            <ShoppingBag className="w-4 h-4 text-amber-600" />
            <span className="text-stone-600 font-medium">વિતરણ:</span>
            <span className="font-bold text-amber-900">{totalOrders} ઓર્ડર</span>
            <span className="text-stone-300">|</span>
            <span className="font-bold text-orange-700">{totalWeightKg} Kg</span>
          </div>

          {/* Current User Pill */}
          {currentUser && (
            <div
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs ${
                isAdmin
                  ? "bg-stone-900 text-white border-stone-800"
                  : "bg-orange-50 text-orange-900 border-orange-200"
              }`}
            >
              {isAdmin ? (
                <ShieldCheck className="w-4 h-4 text-amber-400" />
              ) : (
                <User className="w-4 h-4 text-orange-600" />
              )}
              <div className="leading-tight">
                <span className="font-extrabold uppercase block text-[11px] max-w-[130px] sm:max-w-[200px] truncate">
                  {currentUser.name}
                </span>
                <span className="text-[10px] opacity-80 block">
                  {isAdmin ? "પ્રદેશ સંયોજક (Admin)" : currentUser.mandalName}
                </span>
              </div>
            </div>
          )}

          {/* Logout Button */}
          {currentUser && (
            <button
              type="button"
              onClick={onLogout}
              className="px-3 py-1.5 rounded-xl border border-stone-300 bg-white hover:bg-red-50 hover:text-red-700 hover:border-red-300 text-stone-700 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Logout from portal"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">લૉગ આઉટ (Logout)</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
