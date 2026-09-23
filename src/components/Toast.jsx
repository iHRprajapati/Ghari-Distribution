import React from "react";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";

export default function Toast({ toast, onClose }) {
  if (!toast) return null;

  const isSuccess = toast.type === "success";
  const isError = toast.type === "error";

  return (
    <div className="fixed bottom-5 right-5 z-50 animate-in fade-in slide-in-from-bottom-5 duration-300">
      <div
        className={`flex items-center gap-3 px-4 py-3 rounded-2xl shadow-lg border text-xs font-semibold max-w-md ${
          isSuccess
            ? "bg-emerald-600 text-white border-emerald-500 shadow-emerald-500/20"
            : isError
            ? "bg-red-600 text-white border-red-500 shadow-red-500/20"
            : "bg-stone-800 text-white border-stone-700 shadow-stone-900/20"
        }`}
      >
        {isSuccess ? (
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-200" />
        ) : isError ? (
          <AlertCircle className="w-4 h-4 shrink-0 text-red-200" />
        ) : (
          <Info className="w-4 h-4 shrink-0 text-amber-300" />
        )}

        <div className="flex-1">{toast.message}</div>

        <button
          onClick={onClose}
          className="p-1 rounded-lg hover:bg-white/20 text-white/80 hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
