/**
 * Surat Mandal Wise Master Data
 * List of 13 specific mandals for Karyakarta Ghari distribution:
 * 1. અડાજણ
 * 2. ઉધના
 * 3. ભુલાપાર્ક
 * 4. વેડ
 * 5. અમરોલી હાઉસિંગ
 * 6. કતારગામ
 * 7. અમરોલી ઉત્રાણ
 * 8. મહિધરપુરા
 * 9. સણિયા
 * 10. અમરોલી મધ્ય
 * 11. નવરત્ન
 * 12. વરાછા
 * 13. બાપા મંડળ
 */

export const SURAT_MANDALS = [
  { id: "adajan", name: "અડાજણ (Adajan)", gujarati: "અડાજણ", english: "Adajan" },
  { id: "udhna", name: "ઉધના (Udhna)", gujarati: "ઉધના", english: "Udhna" },
  { id: "bhulapark", name: "ભુલાપાર્ક (Bhulapark)", gujarati: "ભુલાપાર્ક", english: "Bhulapark" },
  { id: "ved", name: "વેડ (Ved)", gujarati: "વેડ", english: "Ved" },
  { id: "amroli-housing", name: "અમરોલી હાઉસિંગ (Amroli Housing)", gujarati: "અમરોલી હાઉસિંગ", english: "Amroli Housing" },
  { id: "katargam", name: "કતારગામ (Katargam)", gujarati: "કતારગામ", english: "Katargam" },
  { id: "amroli-utran", name: "અમરોલી ઉત્રાણ (Amroli Utran)", gujarati: "અમરોલી ઉત્રાણ", english: "Amroli Utran" },
  { id: "mahidharpura", name: "મહિધરપુરા (Mahidharpura)", gujarati: "મહિધરપુરા", english: "Mahidharpura" },
  { id: "saniya", name: "સણિયા (Saniya)", gujarati: "સણિયા", english: "Saniya" },
  { id: "amroli-madhya", name: "અમરોલી મધ્ય (Amroli Madhya)", gujarati: "અમરોલી મધ્ય", english: "Amroli Madhya" },
  { id: "navratna", name: "નવરત્ન (Navratna)", gujarati: "નવરત્ન", english: "Navratna" },
  { id: "varachha", name: "વરાછા (Varachha)", gujarati: "વરાછા", english: "Varachha" },
  { id: "bapa-mandal", name: "બાપા મંડળ (Bapa Mandal)", gujarati: "બાપા મંડળ", english: "Bapa Mandal" },
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
