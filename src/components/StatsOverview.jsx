import React from "react";
import { Users, Weight, Box, IndianRupee, MapPin } from "lucide-react";
import { formatCurrency, formatWeight } from "../utils/formatters";

export default function StatsOverview({ orders = [] }) {
  // Compute aggregated stats
  const totalOrders = orders.length;
  const total500g = orders.reduce((sum, o) => sum + (parseInt(o.qty500g, 10) || 0), 0);
  const total1kg = orders.reduce((sum, o) => sum + (parseInt(o.qty1kg, 10) || 0), 0);
  const totalWeightKg = orders.reduce((sum, o) => sum + (parseFloat(o.totalWeightKg) || 0), 0);
  const totalAmount = orders.reduce((sum, o) => sum + (parseInt(o.totalPrice, 10) || 0), 0);

  const uniqueMandals = new Set(orders.map((o) => o.mandalName).filter(Boolean)).size;

  const stats = [
    {
      label: "કુલ કાર્યકર્તા (Orders)",
      sublabel: "Registered Karyakartas",
      value: totalOrders,
      icon: Users,
      bg: "bg-orange-50",
      border: "border-orange-200",
      text: "text-orange-700",
      iconBg: "bg-orange-100 text-orange-600",
    },
    {
      label: "કુલ ઘારી વિતરણ",
      sublabel: "Total Ghari Distributed",
      value: formatWeight(totalWeightKg),
      icon: Weight,
      bg: "bg-amber-50",
      border: "border-amber-200",
      text: "text-amber-800",
      iconBg: "bg-amber-100 text-amber-700",
    },
    {
      label: "૫૦૦ ગ્રા. & ૧ કિ.ગ્રા. પેકેટ",
      sublabel: "500g & 1Kg Packets",
      value: `${total500g} / ${total1kg}`,
      note: `500g: ${total500g} | 1Kg: ${total1kg}`,
      icon: Box,
      bg: "bg-yellow-50",
      border: "border-yellow-200",
      text: "text-yellow-800",
      iconBg: "bg-yellow-100 text-yellow-700",
    },
    {
      label: "કુલ રકમ (Total Revenue)",
      sublabel: "Price: ₹500/500g | ₹1000/1kg",
      value: formatCurrency(totalAmount),
      icon: IndianRupee,
      bg: "bg-emerald-50",
      border: "border-emerald-200",
      text: "text-emerald-700",
      iconBg: "bg-emerald-100 text-emerald-600",
    },
    {
      label: "સક્રિય મંડળો (Mandals)",
      sublabel: "Surat Mandals Covered",
      value: uniqueMandals,
      icon: MapPin,
      bg: "bg-blue-50",
      border: "border-blue-200",
      text: "text-blue-700",
      iconBg: "bg-blue-100 text-blue-600",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-4 my-6">
      {stats.map((stat, idx) => {
        const Icon = stat.icon;
        return (
          <div
            key={idx}
            className={`p-4 rounded-2xl bg-white border ${stat.border} shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between`}
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-xs font-bold text-stone-700 line-clamp-1">{stat.label}</p>
                <p className="text-[11px] text-stone-500 font-medium">{stat.sublabel}</p>
              </div>
              <div className={`p-2 rounded-xl ${stat.iconBg} shrink-0`}>
                <Icon className="w-4 h-4" />
              </div>
            </div>

            <div className="mt-3">
              <span className={`text-xl sm:text-2xl font-black ${stat.text} tracking-tight`}>
                {stat.value}
              </span>
              {stat.note && (
                <p className="text-[10px] text-stone-500 font-medium mt-0.5">{stat.note}</p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
