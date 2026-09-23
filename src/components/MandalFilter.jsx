import React from "react";
import { MapPin } from "lucide-react";
import { SURAT_MANDALS } from "../utils/suratMandals";

export default function MandalFilter({ selectedMandal, onSelectMandal, orders = [] }) {
  // Count orders per mandal
  const counts = orders.reduce((acc, o) => {
    acc[o.mandalName] = (acc[o.mandalName] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="bg-white p-3 sm:p-4 rounded-2xl border border-amber-200/80 shadow-xs mb-4">
      <div className="flex items-center justify-between mb-2.5">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-orange-600" />
          <h4 className="text-xs font-bold text-stone-800">
            સૂરત મંડળ વાઈઝ ફિલ્ટર (Mandal-wise Filter)
          </h4>
        </div>
        <span className="text-[11px] text-stone-500 font-medium">
          કુલ ૧૩ મંડળ (13 Mandals)
        </span>
      </div>

      <div className="flex flex-wrap gap-1.5 sm:gap-2">
        <button
          onClick={() => onSelectMandal("ALL")}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            selectedMandal === "ALL"
              ? "bg-orange-600 text-white shadow-xs"
              : "bg-stone-100 text-stone-600 hover:bg-stone-200"
          }`}
        >
          તમામ મંડળ (All) ({orders.length})
        </button>

        {SURAT_MANDALS.map((mandal) => {
          const count = counts[mandal.name] || 0;
          const isSelected = selectedMandal === mandal.name;

          return (
            <button
              key={mandal.id}
              onClick={() => onSelectMandal(mandal.name)}
              className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                isSelected
                  ? "bg-amber-600 text-white font-bold shadow-xs"
                  : count > 0
                  ? "bg-amber-50 text-amber-900 border border-amber-200 hover:bg-amber-100 font-bold"
                  : "bg-stone-50 text-stone-600 border border-stone-200 hover:bg-stone-100"
              }`}
              title={mandal.name}
            >
              <span>{mandal.gujarati}</span>
              {count > 0 && (
                <span
                  className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
                    isSelected ? "bg-white/30 text-white" : "bg-amber-200 text-amber-900"
                  }`}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
