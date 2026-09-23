import React, { useState } from "react";
import {
  KeyRound,
  ShieldCheck,
  AlertCircle,
  Eye,
  EyeOff,
  CheckCircle,
  ArrowRight,
  Sparkles,
  ShoppingBag,
  Lock,
} from "lucide-react";
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
    <div className="min-h-screen bg-linear-to-br from-amber-50 via-orange-50/40 to-yellow-50 flex flex-col justify-center items-center p-4 sm:p-6">
      {/* Brand Header */}
      <div className="text-center mb-6 max-w-lg mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-amber-100 border border-amber-200 text-amber-900 rounded-full text-xs font-bold mb-3 shadow-xs">
          <Sparkles className="w-4 h-4 text-orange-600 animate-spin-slow" />
          <span>પ્રથમ વખત લોગિન: સુરક્ષા સેટઅપ (Step 2 of 2)</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
          નવો પાસવર્ડ <span className="text-orange-600">સેટ કરો</span>
        </h1>
        <p className="text-xs sm:text-sm text-stone-600 font-medium mt-1">
          તમારો નવો પાસવર્ડ સેટ કર્યા પછી આપ સીધા ઘારી ઓર્ડર ડેશબોર્ડમાં પ્રવેશ કરશો.
        </p>
      </div>

      {/* Progress Stepper */}
      <div className="w-full max-w-md mb-6 flex items-center justify-between text-xs font-bold px-4">
        <div className="flex items-center gap-1.5 text-emerald-700">
          <div className="w-6 h-6 rounded-full bg-emerald-100 border border-emerald-300 flex items-center justify-center text-xs font-black">
            ✓
          </div>
          <span>1. મોબાઈલ લોગિન</span>
        </div>

        <div className="h-0.5 flex-1 mx-3 bg-orange-300"></div>

        <div className="flex items-center gap-1.5 text-orange-700">
          <div className="w-6 h-6 rounded-full bg-orange-600 text-white flex items-center justify-center text-xs font-black shadow-xs">
            2
          </div>
          <span className="font-extrabold">2. નવો પાસવર્ડ</span>
        </div>

        <div className="h-0.5 flex-1 mx-3 bg-stone-200"></div>

        <div className="flex items-center gap-1.5 text-stone-400">
          <div className="w-6 h-6 rounded-full bg-stone-200 text-stone-600 flex items-center justify-center text-xs font-black">
            3
          </div>
          <span>3. ઘારી ઓર્ડર</span>
        </div>
      </div>

      {/* Main Card */}
      <div className="w-full max-w-md bg-white rounded-3xl border border-amber-200 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Card Header Banner */}
        <div className="bg-linear-to-r from-amber-500 via-orange-500 to-amber-600 px-6 py-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center">
              <KeyRound className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-base font-bold">પાસવર્ડ બદલો (Set Password)</h2>
              <p className="text-xs text-amber-100 font-medium">
                Set a secure password for your account
              </p>
            </div>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* User info badge */}
          <div className="p-3.5 bg-amber-50/80 rounded-2xl border border-amber-200 text-xs space-y-1">
            <div className="flex justify-between items-center text-stone-600">
              <span>કાર્યકર્તા યુઝર આઈડી:</span>
              <span className="font-bold font-mono text-stone-900 bg-white px-2 py-0.5 rounded border border-amber-200">
                {user?.mobile}
              </span>
            </div>
            {user?.name && (
              <div className="flex justify-between items-center text-stone-600">
                <span>કાર્યકર્તા નામ:</span>
                <span className="font-black text-orange-800 uppercase">{user.name}</span>
              </div>
            )}
            {user?.mandalName && (
              <div className="flex justify-between items-center text-stone-600">
                <span>સૂરત મંડળ:</span>
                <span className="font-bold text-stone-800">{user.mandalName}</span>
              </div>
            )}
          </div>

          {error && (
            <div className="p-3 bg-red-50 rounded-xl border border-red-200 text-xs text-red-600 flex items-center gap-2 font-medium">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* New Password Field */}
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">
              નવો પાસવર્ડ (New Password) <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password (min 4 characters)"
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
            <p className="mt-1 text-[11px] text-stone-400">
              પાસવર્ડ ઓછામાં ઓછો ૪ અક્ષરનો હોવો જોઈએ.
            </p>
          </div>

          {/* Confirm Password Field */}
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">
              પાસવર્ડ કન્ફર્મ કરો (Confirm Password) <span className="text-red-500">*</span>
            </label>
            <input
              type={showPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter new password to confirm"
              className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm font-semibold focus:border-orange-500 focus:outline-hidden"
              required
            />
          </div>

          {/* Action Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold shadow-md shadow-orange-600/20 flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-50"
            >
              <CheckCircle className="w-4 h-4" />
              <span>
                {isSubmitting
                  ? "સેવ કરી રહ્યું છે..."
                  : "પાસવર્ડ સાચવો & ઘારી ઓર્ડર ડેશબોર્ડમાં જાઓ"}
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Cancel button */}
          {onCancel && (
            <div className="text-center pt-1">
              <button
                type="button"
                onClick={onCancel}
                className="text-xs text-stone-500 hover:text-stone-800 font-semibold cursor-pointer underline"
              >
                પાછા લૉગિન પેજ પર જાઓ (Back to Login)
              </button>
            </div>
          )}
        </form>
      </div>

      {/* Footer reassurance */}
      <div className="mt-6 text-center text-xs text-stone-500 flex items-center gap-1.5">
        <ShoppingBag className="w-4 h-4 text-orange-600" />
        <span>તમારો ઓર્ડર પ્રદેશ કક્ષા ડેશબોર્ડ પર તુરંત જ લાઈવ દેખાશે.</span>
      </div>
    </div>
  );
}
