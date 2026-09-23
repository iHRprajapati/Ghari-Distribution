import React, { useState } from "react";
import { Database, CheckCircle2, AlertCircle, Info, ChevronDown, ChevronUp } from "lucide-react";
import { firebaseConfigInfo } from "../services/firebase";

export default function FirebaseStatusBanner({ status }) {
  const [showDetails, setShowDetails] = useState(false);

  if (!status) return null;

  const isConnected = status.isConnected;

  return (
    <div className="bg-white/80 border-b border-amber-100 px-4 py-2 text-xs">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          {isConnected ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
          )}
          <span className="text-stone-700">
            {isConnected ? (
              <>
                <strong className="text-emerald-700">Firebase Firestore Realtime Sync:</strong> Data is synchronized directly with Cloud Firestore collection <code className="bg-amber-100/70 px-1.5 py-0.5 rounded text-amber-900 font-mono">surat_ghari_distributions</code>.
              </>
            ) : (
              <>
                <strong className="text-amber-700">Offline / Local Sync Mode:</strong> Working smoothly with local storage. All orders, edits, and receipts are preserved locally.
              </>
            )}
          </span>
        </div>

        <button
          onClick={() => setShowDetails(!showDetails)}
          className="text-stone-500 hover:text-stone-800 font-medium inline-flex items-center gap-1 cursor-pointer"
        >
          <span>Firebase Config</span>
          {showDetails ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
        </button>
      </div>

      {showDetails && (
        <div className="max-w-7xl mx-auto mt-2 pt-2 border-t border-amber-100 flex flex-wrap gap-4 text-[11px] text-stone-600">
          <div>
            <span className="font-semibold text-stone-500">Project ID:</span>{" "}
            <code className="bg-stone-100 px-1 py-0.5 rounded">{firebaseConfigInfo.projectId}</code>
          </div>
          <div>
            <span className="font-semibold text-stone-500">Auth Domain:</span>{" "}
            <code className="bg-stone-100 px-1 py-0.5 rounded">{firebaseConfigInfo.authDomain}</code>
          </div>
          <div>
            <span className="font-semibold text-stone-500">Collection:</span>{" "}
            <code className="bg-stone-100 px-1 py-0.5 rounded">surat_ghari_distributions</code>
          </div>
        </div>
      )}
    </div>
  );
}
