import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "./firebase";
import { calculateOrderTotals } from "../utils/formatters";

const COLLECTION_NAME = "surat_ghari_distributions";
const LOCAL_STORAGE_KEY = "surat_ghari_distributions_cache";

// Initial sample data if collection is completely fresh
const INITIAL_SAMPLE_DATA = [
  {
    id: "sample-1",
    rollNo: "101",
    karykartaName: "HARISHBHAI PRAJAPATI",
    mandalName: "Varachha Mandal",
    contactNumber: "9876543210",
    qty500g: 2,
    qty1kg: 1,
    totalPacks: 3,
    totalWeightKg: 2.0,
    totalPrice: 2000,
    paymentStatus: "PAID",
    notes: "Festive distribution advance token",
    tokenNo: "SUR-GH-1001",
    createdAt: new Date().toISOString(),
  },
  {
    id: "sample-2",
    rollNo: "102",
    karykartaName: "JIGNESH PATEL",
    mandalName: "Katargam Mandal",
    contactNumber: "9825123456",
    qty500g: 1,
    qty1kg: 2,
    totalPacks: 3,
    totalWeightKg: 2.5,
    totalPrice: 2500,
    paymentStatus: "PAID",
    notes: "Karyakarta coordinator box",
    tokenNo: "SUR-GH-1002",
    createdAt: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: "sample-3",
    rollNo: "103",
    karykartaName: "MEHUL DESAI",
    mandalName: "Adajan Mandal",
    contactNumber: "9712345678",
    qty500g: 4,
    qty1kg: 0,
    totalPacks: 4,
    totalWeightKg: 2.0,
    totalPrice: 2000,
    paymentStatus: "PENDING",
    notes: "Collect at Mandal Seva Kendra",
    tokenNo: "SUR-GH-1003",
    createdAt: new Date(Date.now() - 7200000).toISOString(),
  },
];

/**
 * Reads cached orders from localStorage
 */
export function getLocalCache() {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(INITIAL_SAMPLE_DATA));
      return INITIAL_SAMPLE_DATA;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.warn("Failed reading localStorage cache:", e);
    return INITIAL_SAMPLE_DATA;
  }
}

/**
 * Saves orders to localStorage
 */
export function saveLocalCache(orders) {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(orders));
  } catch (e) {
    console.warn("Failed saving localStorage cache:", e);
  }
}

/**
 * Generates a unique Token Number for the receipt
 */
export function generateTokenNo() {
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  return `SUR-GH-${randomSuffix}`;
}

/**
 * Real-time subscription to Ghari distributions with fallback
 * @param {Function} onUpdate - callback when orders update
 * @param {Function} onError - callback when error occurs
 * @returns {Function} unsubscribe function
 */
export function subscribeOrders(onUpdate, onError) {
  let isFirestoreActive = true;

  try {
    const ordersCol = collection(db, COLLECTION_NAME);
    const q = query(ordersCol, orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        if (!snapshot.empty) {
          const items = snapshot.docs.map((docSnap) => {
            const data = docSnap.data();
            return {
              id: docSnap.id,
              ...data,
              // Convert Firestore timestamp to readable format if needed
              createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : data.createdAt,
            };
          });
          saveLocalCache(items);
          onUpdate(items, { isConnected: true, mode: "firestore" });
        } else {
          // If Firestore is empty, check local cache or populate initial sample
          const cached = getLocalCache();
          onUpdate(cached, { isConnected: true, mode: "firestore-empty" });
        }
      },
      (err) => {
        console.warn("Firestore listener error, using local fallback mode:", err.message);
        isFirestoreActive = false;
        const cached = getLocalCache();
        onUpdate(cached, { isConnected: false, mode: "offline", error: err.message });
        if (onError) onError(err);
      }
    );

    return () => unsubscribe();
  } catch (err) {
    console.warn("Firestore init failed, falling back to local storage:", err);
    const cached = getLocalCache();
    onUpdate(cached, { isConnected: false, mode: "offline", error: err.message });
    return () => {};
  }
}

/**
 * Add a new Ghari Distribution Order
 * @param {Object} orderData 
 */
export async function addGhariOrder(orderData) {
  const totals = calculateOrderTotals(orderData.qty500g, orderData.qty1kg);

  const payload = {
    rollNo: orderData.rollNo.toString().trim(),
    karykartaName: orderData.karykartaName.trim().toUpperCase(),
    mandalName: orderData.mandalName.trim(),
    contactNumber: orderData.contactNumber.trim(),
    qty500g: totals.qty500g,
    qty1kg: totals.qty1kg,
    totalPacks: totals.totalPacks,
    totalWeightKg: totals.totalWeightKg,
    totalPrice: totals.totalPrice,
    paymentStatus: orderData.paymentStatus || "PAID",
    notes: orderData.notes || "",
    tokenNo: generateTokenNo(),
    createdAt: new Date().toISOString(),
  };

  // Try Firestore write first
  try {
    const ordersCol = collection(db, COLLECTION_NAME);
    const docRef = await addDoc(ordersCol, {
      ...payload,
      createdAt: serverTimestamp(),
    });

    const newRecord = { ...payload, id: docRef.id };
    // Update local cache
    const cached = getLocalCache();
    saveLocalCache([newRecord, ...cached]);
    return { success: true, id: docRef.id, record: newRecord, mode: "firestore" };
  } catch (err) {
    console.warn("Firestore addDoc failed, writing to local cache:", err);
    const localId = `local-${Date.now()}`;
    const newRecord = { ...payload, id: localId };
    const cached = getLocalCache();
    saveLocalCache([newRecord, ...cached]);
    return { success: true, id: localId, record: newRecord, mode: "offline" };
  }
}

/**
 * Update an existing Ghari Distribution Order
 * @param {string} id 
 * @param {Object} orderData 
 */
export async function updateGhariOrder(id, orderData) {
  const totals = calculateOrderTotals(orderData.qty500g, orderData.qty1kg);

  const payload = {
    rollNo: orderData.rollNo.toString().trim(),
    karykartaName: orderData.karykartaName.trim().toUpperCase(),
    mandalName: orderData.mandalName.trim(),
    contactNumber: orderData.contactNumber.trim(),
    qty500g: totals.qty500g,
    qty1kg: totals.qty1kg,
    totalPacks: totals.totalPacks,
    totalWeightKg: totals.totalWeightKg,
    totalPrice: totals.totalPrice,
    paymentStatus: orderData.paymentStatus || "PAID",
    notes: orderData.notes || "",
    updatedAt: new Date().toISOString(),
  };

  // Update in local cache
  const cached = getLocalCache();
  const updatedCache = cached.map((item) => (item.id === id ? { ...item, ...payload } : item));
  saveLocalCache(updatedCache);

  try {
    if (!id.startsWith("local-") && !id.startsWith("sample-")) {
      const docRef = doc(db, COLLECTION_NAME, id);
      await updateDoc(docRef, {
        ...payload,
        updatedAt: serverTimestamp(),
      });
    }
    return { success: true };
  } catch (err) {
    console.warn("Firestore updateDoc failed, updated local cache only:", err);
    return { success: true, mode: "offline" };
  }
}

/**
 * Delete an order
 * @param {string} id 
 */
export async function deleteGhariOrder(id) {
  const cached = getLocalCache();
  const filtered = cached.filter((item) => item.id !== id);
  saveLocalCache(filtered);

  try {
    if (!id.startsWith("local-") && !id.startsWith("sample-")) {
      const docRef = doc(db, COLLECTION_NAME, id);
      await deleteDoc(docRef);
    }
    return { success: true };
  } catch (err) {
    console.warn("Firestore deleteDoc failed, deleted from local cache only:", err);
    return { success: true, mode: "offline" };
  }
}

/**
 * Export orders list to CSV file
 * @param {Array} orders 
 */
export function exportOrdersToCSV(orders) {
  if (!orders || orders.length === 0) return false;

  const headers = [
    "Token No",
    "Roll No",
    "Karykarta Name",
    "Mandal Name",
    "Contact Number",
    "500g Packets (₹500)",
    "1kg Packets (₹1000)",
    "Total Packets",
    "Total Weight (Kg)",
    "Total Amount (₹)",
    "Payment Status",
    "Notes",
    "Date",
  ];

  const rows = orders.map((o) => [
    `"${o.tokenNo || ""}"`,
    `"${o.rollNo || ""}"`,
    `"${o.karykartaName || ""}"`,
    `"${o.mandalName || ""}"`,
    `"${o.contactNumber || ""}"`,
    o.qty500g || 0,
    o.qty1kg || 0,
    o.totalPacks || 0,
    o.totalWeightKg || 0,
    o.totalPrice || 0,
    `"${o.paymentStatus || ""}"`,
    `"${(o.notes || "").replace(/"/g, '""')}"`,
    `"${new Date(o.createdAt).toLocaleString("en-IN")}"`,
  ]);

  const csvContent = "\uFEFF" + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", `Surat_Mandal_Ghari_Distribution_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
  return true;
}
