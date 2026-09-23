import React from "react";
import { Sparkles, ShoppingBag, Database, ShieldCheck } from "lucide-react";

export default function Navbar({ connectionStatus, totalOrders, totalWeightKg }) {
  return (
    <header className="bg-white/90 backdrop-blur-md sticky top-0 z-30 border-b border-amber-200/80 shadow-xs">
      {/* Top promotional / festive sub-bar */}
      <div className="bg-linear-to-r from-amber-600 via-orange-600 to-amber-700 text-white text-xs sm:text-sm py-1.5 px-4 text-center font-medium tracking-wide flex items-center justify-center gap-2">
        <Sparkles className="w-4 h-4 animate-spin-slow text-amber-200" />
        <span>સૂરત પ્રખ્યાત ઘારી વિતરણ સેવા - ચાંદની પડવા મહોત્સવ | Karyakarta Seva Portal</span>
        <Sparkles className="w-4 h-4 animate-spin-slow text-amber-200" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
        {/* Brand identity */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-linear-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white shadow-md shadow-orange-500/20">
            <span className="text-2xl font-bold select-none">ઘા</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-extrabold text-stone-900 tracking-tight">
                સૂરત ઘારી <span className="text-orange-600">વિતરણ</span>
              </h1>
              <span className="hidden sm:inline-block px-2.5 py-0.5 text-xs font-bold text-orange-700 bg-orange-100 rounded-full border border-orange-200">
                મંડળ વાઈઝ
              </span>
            </div>
            <p className="text-xs text-stone-500 font-medium">
              Surat Mandal-wise Karyakarta Ghari Distribution & Order Management
            </p>
          </div>
        </div>

        {/* Live Counters & Firebase Status */}
        <div className="flex items-center gap-3">
          {/* Quick Metrics Badge */}
          <div className="hidden md:flex items-center gap-2 bg-amber-50 border border-amber-200/80 rounded-xl px-3 py-1.5 text-xs">
            <ShoppingBag className="w-4 h-4 text-amber-600" />
            <span className="text-stone-600 font-medium">વિતરણ:</span>
            <span className="font-bold text-amber-900">{totalOrders} ઓર્ડર</span>
            <span className="text-stone-300">|</span>
            <span className="font-bold text-orange-700">{totalWeightKg} Kg ઘારી</span>
          </div>

          {/* Firebase Status indicator */}
          <div
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border ${
              connectionStatus?.isConnected
                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                : "bg-amber-50 text-amber-700 border-amber-200"
            }`}
            title={connectionStatus?.isConnected ? "Firebase Firestore Connected" : "Local Sync / Offline Mode"}
          >
            <Database className="w-3.5 h-3.5" />
            <span className="relative flex h-2 w-2">
              <span
                className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                  connectionStatus?.isConnected ? "bg-emerald-400" : "bg-amber-400"
                }`}
              ></span>
              <span
                className={`relative inline-flex rounded-full h-2 w-2 ${
                  connectionStatus?.isConnected ? "bg-emerald-500" : "bg-amber-500"
                }`}
              ></span>
            </span>
            <span className="hidden sm:inline">
              {connectionStatus?.isConnected ? "Firestore Live" : "Local Sync Active"}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
