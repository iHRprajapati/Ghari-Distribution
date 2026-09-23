/**
 * Formatting and calculation utilities for Ghari Distribution
 */

export const PRICE_500G = 500;  // ₹500 for 500 Gm
export const PRICE_1KG = 1000;  // ₹1000 for 1 Kg

/**
 * Calculates total order cost and weight
 * @param {number} qty500g 
 * @param {number} qty1kg 
 * @returns {{ qty500g: number, qty1kg: number, totalPacks: number, totalWeightKg: number, totalPrice: number }}
 */
export function calculateOrderTotals(qty500g = 0, qty1kg = 0) {
  const q500 = Math.max(0, parseInt(qty500g, 10) || 0);
  const q1k = Math.max(0, parseInt(qty1kg, 10) || 0);

  const totalPacks = q500 + q1k;
  const totalWeightKg = (q500 * 0.5) + (q1k * 1.0);
  const totalPrice = (q500 * PRICE_500G) + (q1k * PRICE_1KG);

  return {
    qty500g: q500,
    qty1kg: q1k,
    totalPacks,
    totalWeightKg,
    totalPrice,
  };
}

/**
 * Formats Indian Currency (₹)
 * @param {number} amount 
 * @returns {string} e.g. "₹1,500"
 */
export function formatCurrency(amount) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount || 0);
}

/**
 * Formats weight nicely
 * @param {number} weightKg 
 * @returns {string} e.g. "1.5 Kg" or "500 Gm"
 */
export function formatWeight(weightKg) {
  if (!weightKg || weightKg === 0) return "0 Kg";
  if (weightKg < 1) {
    return `${Math.round(weightKg * 1000)} Gm`;
  }
  return `${Number(weightKg).toFixed(1)} Kg`;
}

/**
 * Formats standard date-time
 * @param {string|number|Date} date 
 * @returns {string} e.g. "23 Sep 2026, 06:30 PM"
 */
export function formatDateTime(date) {
  if (!date) return "-";
  const d = date?.toDate ? date.toDate() : new Date(date);
  if (isNaN(d.getTime())) return "-";
  return d.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
