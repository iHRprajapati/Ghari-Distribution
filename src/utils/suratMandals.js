/**
 * Surat Mandal Wise Master Data
 * List of prominent mandals across Surat zones for Karyakarta Ghari distribution.
 */

export const SURAT_MANDALS = [
  { id: "varachha", name: "Varachha Mandal", gujarati: "વરાછા મંડળ", zone: "East Zone" },
  { id: "katargam", name: "Katargam Mandal", gujarati: "કતારગામ મંડળ", zone: "North Zone" },
  { id: "adajan", name: "Adajan Mandal", gujarati: "અડાજણ મંડળ", zone: "West Zone" },
  { id: "rander", name: "Rander Mandal", gujarati: "રાંદેર મંડળ", zone: "West Zone" },
  { id: "majura", name: "Majura Mandal", gujarati: "મજુરા મંડળ", zone: "South-West Zone" },
  { id: "udhna", name: "Udhna Mandal", gujarati: "ઉધના મંડળ", zone: "South Zone" },
  { id: "limbayat", name: "Limbayat Mandal", gujarati: "લીંબાયત મંડળ", zone: "East Zone" },
  { id: "athwa", name: "Athwa Mandal", gujarati: "અઠવા મંડળ", zone: "South-West Zone" },
  { id: "city-central", name: "Surat City Central Mandal", gujarati: "સૂરત સિટી સેન્ટ્રલ મંડળ", zone: "Central Zone" },
  { id: "sarthana", name: "Sarthana Mandal", gujarati: "સરથાણા મંડળ", zone: "East Zone" },
  { id: "amroli", name: "Amroli Mandal", gujarati: "અમરોલી મંડળ", zone: "North Zone" },
  { id: "nanpura", name: "Nanpura Mandal", gujarati: "નાનપુરા મંડળ", zone: "Central Zone" },
  { id: "pal-palanpur", name: "Pal-Palanpur Mandal", gujarati: "પાલ-પાલનપુર મંડળ", zone: "West Zone" },
  { id: "pandesara", name: "Pandesara Mandal", gujarati: "પાંડેસરા મંડળ", zone: "South Zone" },
  { id: "sachin", name: "Sachin Mandal", gujarati: "સચિન મંડળ", zone: "South Zone" },
  { id: "dindoli", name: "Dindoli Mandal", gujarati: "ડિંડોલી મંડળ", zone: "East Zone" },
  { id: "kamrej", name: "Kamrej Mandal", gujarati: "કામરેજ મંડળ", zone: "North-East Zone" },
  { id: "mota-varachha", name: "Mota Varachha Mandal", gujarati: "મોટા વરાછા મંડળ", zone: "North-East Zone" },
  { id: "vesu", name: "Vesu Mandal", gujarati: "વેસુ મંડળ", zone: "South-West Zone" },
  { id: "althan", name: "Althan Mandal", gujarati: "અલથાણ મંડળ", zone: "South-West Zone" },
];

export const GHARI_PRICING = {
  PACK_500G: {
    id: "pack_500g",
    name: "500 Gm Ghari Pack",
    weightGrams: 500,
    weightKg: 0.5,
    price: 500,
    label: "500 Gm (₹500)",
  },
  PACK_1KG: {
    id: "pack_1kg",
    name: "1 Kg Ghari Pack",
    weightGrams: 1000,
    weightKg: 1.0,
    price: 1000,
    label: "1 Kg (₹1000)",
  },
};

export const PAYMENT_STATUSES = [
  { value: "PAID", label: "Paid / ચુકવેલ", color: "emerald" },
  { value: "PENDING", label: "Payment Pending / બાકી", color: "amber" },
  { value: "SEVA_FREE", label: "Mandal Seva (Complimentary)", color: "blue" },
];
