import React, { useState } from "react";
import {
  User,
  ShieldCheck,
  Phone,
  Lock,
  ArrowRight,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  KeyRound,
  UserPlus,
  MapPin,
  Eye,
  EyeOff,
} from "lucide-react";
import { loginUser, registerKarykarta } from "../services/authService";
import { SURAT_MANDALS } from "../utils/suratMandals";
import { sanitizeKarykartaName, sanitizeContactNumber } from "../utils/validators";

export default function LoginDashboard({ onLoginSuccess, onRequirePasswordSetup }) {
  const [activeTab, setActiveTab] = useState("karykarta"); // "karykarta" or "admin"
  const [isRegisterMode, setIsRegisterMode] = useState(false);

  // Login Form States
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Registration Form States (for new Karyakarta)
  const [regName, setRegName] = useState("");
  const [regMandal, setRegMandal] = useState(SURAT_MANDALS[0].name);
  const [regMobile, setRegMobile] = useState("");
  const [regSuccess, setRegSuccess] = useState("");

  // Handle Login
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!userId.trim()) {
      setError("કૃપા કરીને યુઝર આઈડી (મોબાઈલ નંબર) દાખલ કરો.");
      return;
    }
    if (!password.trim()) {
      setError("કૃપા કરીને પાસવર્ડ દાખલ કરો.");
      return;
    }

    setIsLoading(true);
    try {
      const res = await loginUser(userId, password);
      if (res.success) {
        if (res.requiresPasswordSetup) {
          onRequirePasswordSetup(res.user);
        } else {
          onLoginSuccess(res.user);
        }
      } else {
        setError(res.error || "Login failed. Check credentials.");
      }
    } catch (err) {
      setError("લોગિન કરતી વખતે ભૂલ થઈ. કૃપા કરીને ફરી પ્રયત્ન કરો.");
    } finally {
      setIsLoading(false);
    }
  };

  // Quick Demo Logins
  const handleQuickDemo = async (type) => {
    setError("");
    if (type === "admin") {
      setActiveTab("admin");
      setUserId("admin");
      setPassword("admin");
    } else if (type === "karykarta-first") {
      // First-time Karyakarta login demo (mobile = 9876543210, password = 9876543210)
      setActiveTab("karykarta");
      setUserId("9876543210");
      setPassword("9876543210");
    }
  };

  // Handle Registration of new Karyakarta
  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setRegSuccess("");

    if (!regName.trim() || regName.trim().length < 3) {
      setError("કાર્યકર્તા નામ કેપિટલ અક્ષરોમાં ઓછામાં ઓછું ૩ અક્ષરનું હોવું જોઈએ");
      return;
    }
    if (regMobile.length !== 10) {
      setError("મોબાઈલ નંબર બરાબર ૧૦ આંકડાનો હોવો જોઈએ");
      return;
    }

    setIsLoading(true);
    try {
      const res = await registerKarykarta({
        name: regName,
        mandalName: regMandal,
        mobile: regMobile,
      });

      if (res.success) {
        setRegSuccess("નોંધણી સફળ! તમારો ડિફોલ્ટ પાસવર્ડ તમારો મોબાઈલ નંબર છે. હવે લોગિન કરો.");
        setUserId(regMobile);
        setPassword(regMobile);
        setIsRegisterMode(false);
      } else {
        setError(res.error || "Registration failed.");
      }
    } catch (err) {
      setError("નોંધણી કરતી વખતે ભૂલ થઈ.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-amber-50 via-orange-50/40 to-yellow-50 flex flex-col justify-center items-center p-4 sm:p-6">
      {/* Brand Header */}
      <div className="text-center mb-6 max-w-lg mx-auto">
        <h1 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
          સૂરત મંડળ ઘારી <span className="text-orange-600">વિતરણ પોર્ટલ</span>
        </h1>
        <p className="text-xs sm:text-sm text-stone-600 font-medium mt-1">
          Surat Mandal-wise Karyakarta Order Management & Pradesh Level Portal
        </p>
      </div>

      {/* Main Card */}
      <div className="w-full max-w-md bg-white rounded-3xl border border-amber-200 shadow-xl overflow-hidden">
        {/* Role Tabs */}
        {!isRegisterMode && (
          <div className="grid grid-cols-2 bg-stone-100 p-1.5 border-b border-stone-200">
            <button
              type="button"
              onClick={() => {
                setActiveTab("karykarta");
                setError("");
                setUserId("");
                setPassword("");
              }}
              className={`py-2.5 rounded-2xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                activeTab === "karykarta"
                  ? "bg-white text-orange-700 shadow-sm"
                  : "text-stone-600 hover:text-stone-900"
              }`}
            >
              <User className="w-4 h-4" />
              <span>કાર્યકર્તા લોગિન (Karykarta)</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab("admin");
                setError("");
                setUserId("admin");
                setPassword("admin");
              }}
              className={`py-2.5 rounded-2xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                activeTab === "admin"
                  ? "bg-white text-amber-800 shadow-sm"
                  : "text-stone-600 hover:text-stone-900"
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-amber-600" />
              <span>પ્રદેશ એડમિન (Pradesh Admin)</span>
            </button>
          </div>
        )}

        {/* Tab Banner */}
        <div
          className={`px-6 py-3.5 text-white flex items-center justify-between ${
            activeTab === "admin"
              ? "bg-linear-to-r from-stone-800 via-stone-900 to-amber-900"
              : "bg-linear-to-r from-orange-600 via-amber-600 to-orange-700"
          }`}
        >
          <div>
            <h2 className="text-sm font-bold">
              {isRegisterMode
                ? "નવા કાર્યકર્તા નોંધણી (New Registration)"
                : activeTab === "admin"
                ? "પ્રદેશ કક્ષા એડમિન લોગિન"
                : "કાર્યકર્તા પ્રવેશ (Karyakarta Login)"}
            </h2>
            <p className="text-[11px] text-amber-100 font-medium">
              {isRegisterMode
                ? "૧૩ સૂરત મંડળો માટે કાર્યકર્તા રજીસ્ટ્રેશન"
                : activeTab === "admin"
                ? "Central State Monitoring & Mandal Overview"
                : "User ID = ૧૦ અંકનો મોબાઈલ નંબર"}
            </p>
          </div>

          <div className="w-8 h-8 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center">
            {activeTab === "admin" ? (
              <ShieldCheck className="w-4 h-4 text-white" />
            ) : (
              <User className="w-4 h-4 text-white" />
            )}
          </div>
        </div>

        {/* Error / Success Notices */}
        <div className="px-6 pt-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600 font-medium flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {regSuccess && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-700 font-medium flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{regSuccess}</span>
            </div>
          )}
        </div>

        {/* Form Body */}
        {!isRegisterMode ? (
          /* LOGIN FORM */
          <form onSubmit={handleLogin} className="p-6 space-y-4">
            {/* User ID Field */}
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                {activeTab === "admin" ? "એડમિન યુઝરનેમ (Admin ID)" : "યુઝર આઈડી (User ID)"}{" "}
                <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
                  {activeTab === "admin" ? <ShieldCheck className="w-4 h-4" /> : <Phone className="w-4 h-4" />}
                </div>
                <input
                  type={activeTab === "admin" ? "text" : "tel"}
                  value={userId}
                  onChange={(e) => {
                    const val =
                      activeTab === "admin"
                        ? e.target.value
                        : sanitizeContactNumber(e.target.value);
                    setUserId(val);
                  }}
                  placeholder={
                    activeTab === "admin"
                      ? "Enter admin username (e.g. admin)"
                      : "૧૦ અંકનો મોબાઈલ નંબર (e.g. 9876543210)"
                  }
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-stone-300 text-sm font-semibold focus:border-orange-500 focus:outline-hidden"
                  required
                />
              </div>
              {activeTab === "karykarta" && (
                <p className="mt-1 text-[11px] text-stone-500">
                  કાર્યકર્તાનો ૧૦ અંકનો મોબાઈલ નંબર તમારું User ID છે.
                </p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-stone-700">
                  પાસવર્ડ (Password) <span className="text-red-500">*</span>
                </label>
                {activeTab === "karykarta" && (
                  <span className="text-[10px] font-bold text-orange-700 bg-orange-50 px-1.5 py-0.5 rounded border border-orange-200">
                    પ્રથમ વખત: મોબાઈલ નંબર
                  </span>
                )}
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={
                    activeTab === "admin"
                      ? "Admin password (admin)"
                      : "પાસવર્ડ દાખલ કરો (Default: Mobile No)"
                  }
                  className="w-full pl-9 pr-10 py-2.5 rounded-xl border border-stone-300 text-sm font-semibold focus:border-orange-500 focus:outline-hidden"
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
              {activeTab === "karykarta" && (
                <div className="mt-2 p-2.5 bg-amber-50/80 rounded-xl border border-amber-200/70 text-[11px] text-amber-900 flex items-start gap-2">
                  <KeyRound className="w-3.5 h-3.5 text-amber-700 shrink-0 mt-0.5" />
                  <span>
                    <strong>નોંધ:</strong> પ્રથમ વખત લોગિન માટે પાસવર્ડ તમારો <strong>મોબાઈલ નંબર</strong> જ છે. લોગિન કર્યા પછી સિસ્ટમ તમને નવો સુરક્ષિત પાસવર્ડ સેટ કરવા પૂછશે.
                  </span>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 rounded-xl text-white text-xs font-bold shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-50 ${
                activeTab === "admin"
                  ? "bg-stone-900 hover:bg-stone-800 shadow-stone-900/20"
                  : "bg-orange-600 hover:bg-orange-700 shadow-orange-600/20"
              }`}
            >
              <span>{isLoading ? "ચકાસી રહ્યું છે..." : "લૉગિન કરો (Login to Portal)"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Quick Demo Logins Helper */}
            <div className="pt-2 border-t border-stone-200">
              <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block text-center mb-2">
                ઝડપી ટેસ્ટિંગ (Quick Test Login):
              </span>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => handleQuickDemo("karykarta-first")}
                  className="p-2 rounded-xl bg-orange-50 hover:bg-orange-100 border border-orange-200 text-orange-800 font-semibold text-left transition-colors cursor-pointer"
                >
                  <span className="block font-bold text-[11px]">👤 કાર્યકર્તા (First Time)</span>
                  <span className="text-[10px] text-stone-500 font-mono">9876543210</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickDemo("admin")}
                  className="p-2 rounded-xl bg-stone-100 hover:bg-stone-200 border border-stone-300 text-stone-800 font-semibold text-left transition-colors cursor-pointer"
                >
                  <span className="block font-bold text-[11px]">🛡️ પ્રદેશ એડમિન</span>
                  <span className="text-[10px] text-stone-500 font-mono">admin / admin</span>
                </button>
              </div>
            </div>

            {/* New Karyakarta Link */}
            {activeTab === "karykarta" && (
              <div className="text-center pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setIsRegisterMode(true);
                    setError("");
                    setRegSuccess("");
                  }}
                  className="text-xs text-orange-600 hover:text-orange-700 font-bold hover:underline cursor-pointer inline-flex items-center gap-1"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>નવા કાર્યકર્તા છો? અહીં નોંધણી કરો (Register)</span>
                </button>
              </div>
            )}
          </form>
        ) : (
          /* REGISTRATION FORM FOR NEW KARYAKARTA */
          <form onSubmit={handleRegister} className="p-6 space-y-4">
            {/* Name */}
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                કાર્યકર્તા નામ (Karykarta Name) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={regName}
                onChange={(e) => setRegName(sanitizeKarykartaName(e.target.value))}
                placeholder="CAPITAL LETTERS ONLY (e.g. HARISHBHAI)"
                className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm font-semibold uppercase focus:border-orange-500 focus:outline-hidden"
                required
              />
              <p className="mt-1 text-[10px] text-stone-400">
                Converts automatically to CAPITAL letters. No special characters allowed.
              </p>
            </div>

            {/* Surat Mandal (13 Mandals) */}
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                સૂરત મંડળ (Surat Mandal) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
                  <MapPin className="w-4 h-4" />
                </div>
                <select
                  value={regMandal}
                  onChange={(e) => setRegMandal(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-stone-300 bg-white text-xs font-bold text-stone-800 focus:border-orange-500 focus:outline-hidden"
                >
                  {SURAT_MANDALS.map((m) => (
                    <option key={m.id} value={m.name}>
                      {m.gujarati} ({m.english})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Mobile Number */}
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                મોબાઈલ નંબર / યુઝર આઈડી (Mobile Number) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
                  <Phone className="w-4 h-4" />
                </div>
                <input
                  type="tel"
                  value={regMobile}
                  onChange={(e) => setRegMobile(sanitizeContactNumber(e.target.value))}
                  placeholder="10-digit mobile number"
                  className="w-full pl-9 pr-14 py-2.5 rounded-xl border border-stone-300 text-sm font-semibold focus:border-orange-500 focus:outline-hidden"
                  required
                />
                <span className="absolute right-3 top-3 text-[11px] font-bold text-stone-400">
                  {regMobile.length}/10
                </span>
              </div>
              <p className="mt-1 text-[11px] text-amber-800">
                નોંધણી પછી તમારો ડિફોલ્ટ પાસવર્ડ તમારો આ જ ૧૦ અંકનો મોબાઈલ નંબર રહેશે.
              </p>
            </div>

            {/* Buttons */}
            <div className="pt-2 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => {
                  setIsRegisterMode(false);
                  setError("");
                }}
                className="px-4 py-2.5 rounded-xl border border-stone-300 text-stone-700 text-xs font-bold hover:bg-stone-100 cursor-pointer"
              >
                પાછા જાઓ (Back)
              </button>

              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold shadow-md shadow-orange-600/20 cursor-pointer transition-all disabled:opacity-50"
              >
                {isLoading ? "નોંધણી કરી રહ્યું છે..." : "નોંધણી કરો (Register)"}
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Footer Info */}
      <div className="mt-8 text-center text-xs text-stone-500">
        <p className="font-semibold text-stone-600">
          સૂરત મંડળ ઘારી વિતરણ વ્યવસ્થા • પ્રદેશ કાર્યાલય કનેક્ટેડ
        </p>
        <p className="text-[11px] mt-0.5">
          500 Gm (₹500) • 1 Kg (₹1000) • Real-time Firebase Firestore Sync
        </p>
      </div>
    </div>
  );
}
