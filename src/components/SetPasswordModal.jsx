import React, { useState } from "react";
import { KeyRound, ShieldCheck, AlertCircle, Eye, EyeOff, CheckCircle } from "lucide-react";
import { setUserPassword } from "../services/authService";

export default function SetPasswordModal({ user, onSuccess, onCancel }) {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!newPassword || newPassword.length < 4) {
      setError("પાસવર્ડ ઓછામાં ઓછો ૪ અક્ષરનો હોવો જોઈએ (Password must be at least 4 characters)");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("બંને પાસવર્ડ મેળ ખાતા નથી (Passwords do not match)");
      return;
    }

    if (newPassword === user.mobile) {
      setError("નવો પાસવર્ડ તમારા મોબાઈલ નંબરથી અલગ હોવો જોઈએ (New password cannot be your mobile number)");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await setUserPassword(user.mobile, newPassword);
      if (res.success) {
        onSuccess(res.user);
      } else {
        setError(res.error || "પાસવર્ડ સેટ કરવામાં ભૂલ આવી.");
      }
    } catch (err) {
      setError("Error saving password. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full border border-amber-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-linear-to-r from-amber-500 via-orange-500 to-amber-600 px-6 py-5 text-white text-center">
          <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center mx-auto mb-2.5">
            <KeyRound className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-lg font-black tracking-tight">નવો પાસવર્ડ સેટ કરો</h3>
          <p className="text-xs text-amber-100 font-medium">
            First-Time Login Security Setup
          </p>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* User info badge */}
          <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200/80 text-xs">
            <div className="flex justify-between items-center text-stone-600">
              <span>કાર્યકર્તા યુઝર આઈડી:</span>
              <span className="font-bold font-mono text-stone-900">{user?.mobile}</span>
            </div>
            {user?.name && (
              <div className="flex justify-between items-center text-stone-600 mt-1">
                <span>નામ:</span>
                <span className="font-black text-orange-800 uppercase">{user.name}</span>
              </div>
            )}
            <p className="mt-2 text-[11px] text-amber-800 font-medium">
              પ્રથમ વખત લોગિન સફળ થયું છે! સુરક્ષા માટે કૃપા કરીને તમારો વ્યક્તિગત પાસવર્ડ સેટ કરો.
            </p>
          </div>

          {error && (
            <div className="p-3 bg-red-50 rounded-xl border border-red-200 text-xs text-red-600 flex items-center gap-2 font-medium">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* New Password */}
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">
              નવો પાસવર્ડ (New Password) <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password (min 4 chars)"
                className="w-full px-4 py-2.5 pr-10 rounded-xl border border-stone-300 text-sm font-semibold focus:border-orange-500 focus:outline-hidden"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-stone-400 hover:text-stone-600 cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">
              પાસવર્ડ કન્ફર્મ કરો (Confirm Password) <span className="text-red-500">*</span>
            </label>
            <input
              type={showPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter new password"
              className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm font-semibold focus:border-orange-500 focus:outline-hidden"
              required
            />
          </div>

          {/* Buttons */}
          <div className="pt-2 flex items-center justify-end gap-3">
            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2.5 rounded-xl border border-stone-300 text-stone-700 text-xs font-bold hover:bg-stone-100 cursor-pointer"
              >
                રદ કરો (Cancel)
              </button>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold shadow-md shadow-orange-600/20 flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-50"
            >
              <CheckCircle className="w-4 h-4" />
              <span>{isSubmitting ? "સેવ કરી રહ્યું છે..." : "પાસવર્ડ સાચવો અને પોર્ટલમાં પ્રવેશો"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
