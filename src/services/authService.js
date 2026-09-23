import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  query,
  where,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "./firebase.js";
import { sanitizeKarykartaName, sanitizeContactNumber } from "../utils/validators.js";

const USERS_COLLECTION = "karykarta_users";
const CURRENT_USER_KEY = "surat_ghari_current_user";
const LOCAL_USERS_KEY = "surat_ghari_users_cache";

// Pre-seeded Karyakarta users for immediate testing
const INITIAL_KARYAKARTAS = [
  {
    mobile: "9876543210",
    name: "HARISHBHAI PRAJAPATI",
    mandalName: "વરાછા (Varachha)",
    password: "9876543210", // default password = mobile number
    hasSetPassword: false, // first-time login required
    role: "karykarta",
    createdAt: new Date().toISOString(),
  },
  {
    mobile: "9825123456",
    name: "JIGNESH PATEL",
    mandalName: "કતારગામ (Katargam)",
    password: "9825123456",
    hasSetPassword: false,
    role: "karykarta",
    createdAt: new Date().toISOString(),
  },
  {
    mobile: "9712345678",
    name: "MEHUL DESAI",
    mandalName: "અડાજણ (Adajan)",
    password: "9712345678",
    hasSetPassword: false,
    role: "karykarta",
    createdAt: new Date().toISOString(),
  },
];

// Admin credentials (Pradesh Level)
export const ADMIN_USER = {
  mobile: "admin",
  username: "admin",
  name: "PRADESH COORDINATOR (પ્રદેશ સંયોજક)",
  mandalName: "Surat Central / પ્રદેશ કાર્યાલય",
  role: "admin",
  password: "admin",
};

const memStore = {};
const safeStorage = {
  getItem: (key) => {
    if (typeof window !== "undefined" && window.localStorage) {
      try { return window.localStorage.getItem(key); } catch (e) {}
    }
    return memStore[key] || null;
  },
  setItem: (key, val) => {
    if (typeof window !== "undefined" && window.localStorage) {
      try { window.localStorage.setItem(key, val); } catch (e) {}
    }
    memStore[key] = val;
  },
  removeItem: (key) => {
    if (typeof window !== "undefined" && window.localStorage) {
      try { window.localStorage.removeItem(key); } catch (e) {}
    }
    delete memStore[key];
  },
};

/**
 * Get cached users list from localStorage
 */
export function getLocalUsers() {
  try {
    const raw = safeStorage.getItem(LOCAL_USERS_KEY);
    if (!raw) {
      safeStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(INITIAL_KARYAKARTAS));
      return INITIAL_KARYAKARTAS;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.warn("Failed reading local users cache:", e);
    return INITIAL_KARYAKARTAS;
  }
}

/**
 * Save users list to localStorage
 */
export function saveLocalUsers(users) {
  try {
    safeStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(users));
  } catch (e) {
    console.warn("Failed saving local users cache:", e);
  }
}

/**
 * Get active logged-in user
 */
export function getCurrentUser() {
  try {
    const raw = safeStorage.getItem(CURRENT_USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}

/**
 * Set active logged-in user session
 */
export function setCurrentUser(user) {
  if (user) {
    safeStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
  } else {
    safeStorage.removeItem(CURRENT_USER_KEY);
  }
}

/**
 * Log out
 */
export function logoutUser() {
  safeStorage.removeItem(CURRENT_USER_KEY);
}

/**
 * Find user by mobile number from Firestore or local cache
 */
export async function findUserByMobile(mobile) {
  const cleanMobile = sanitizeContactNumber(mobile);

  // Check admin
  if (mobile.trim().toLowerCase() === "admin" || cleanMobile === "9999999999") {
    return ADMIN_USER;
  }

  // 1. Check local cache first
  const localList = getLocalUsers();
  let found = localList.find((u) => u.mobile === cleanMobile);

  // 2. Check Firestore
  try {
    const docRef = doc(db, USERS_COLLECTION, cleanMobile);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      found = { ...snap.data(), mobile: cleanMobile };
    }
  } catch (e) {
    // Firestore offline fallback
  }

  return found || null;
}

/**
 * Register a new Karyakarta
 * Initial password is set to their mobile number, with hasSetPassword = false
 */
export async function registerKarykarta({ name, mandalName, mobile }) {
  const cleanMobile = sanitizeContactNumber(mobile);
  const cleanName = sanitizeKarykartaName(name);

  if (cleanMobile.length !== 10) {
    return { success: false, error: "મોબાઈલ નંબર બરાબર ૧૦ આંકડાનો હોવો જોઈએ (Mobile must be 10 digits)" };
  }
  if (!cleanName || cleanName.length < 3) {
    return { success: false, error: "કાર્યકર્તા નામ કેપિટલ અક્ષરોમાં ઓછામાં ઓછું ૩ અક્ષરનું હોવું જોઈએ" };
  }
  if (!mandalName) {
    return { success: false, error: "મંડળ પસંદ કરવું ફરજિયાત છે" };
  }

  const existing = await findUserByMobile(cleanMobile);
  if (existing && existing.role !== "admin") {
    return { success: false, error: "આ મોબાઈલ નંબર પહેલેથી જ નોંધાયેલ છે. કૃપા કરીને લોગિન કરો." };
  }

  const newUser = {
    mobile: cleanMobile,
    name: cleanName,
    mandalName,
    password: cleanMobile, // Default password is the mobile number
    hasSetPassword: false, // Must set new password on first login
    role: "karykarta",
    createdAt: new Date().toISOString(),
  };

  // Save to local cache
  const localList = getLocalUsers();
  const updated = [newUser, ...localList.filter((u) => u.mobile !== cleanMobile)];
  saveLocalUsers(updated);

  // Save to Firestore
  try {
    const docRef = doc(db, USERS_COLLECTION, cleanMobile);
    await setDoc(docRef, {
      ...newUser,
      createdAt: serverTimestamp(),
    });
  } catch (e) {
    console.warn("Firestore user registration offline fallback:", e.message);
  }

  return { success: true, user: newUser };
}

/**
 * Authenticate Karyakarta or Admin
 * Returns { success, user, requiresPasswordSetup, error }
 */
export async function loginUser(userId, password) {
  const cleanId = userId.trim();
  const cleanPass = password.trim();

  // 1. Admin login check
  if (
    cleanId.toLowerCase() === "admin" ||
    cleanId === "9999999999" ||
    cleanId.toLowerCase() === "pradesh"
  ) {
    if (cleanPass === "admin" || cleanPass === "admin123" || cleanPass === "9999999999") {
      setCurrentUser(ADMIN_USER);
      return { success: true, user: ADMIN_USER, requiresPasswordSetup: false };
    }
    return { success: false, error: "અમાન્ય એડમિન પાસવર્ડ (Invalid Admin Password. Default: admin)" };
  }

  // 2. Karyakarta login check (User ID = 10 digit mobile)
  const cleanMobile = sanitizeContactNumber(cleanId);
  if (cleanMobile.length !== 10) {
    return { success: false, error: "કાર્યકર્તા યુઝર આઈડી ૧૦ અંકનો મોબાઈલ નંબર હોવો જોઈએ" };
  }

  let user = await findUserByMobile(cleanMobile);

  // If user doesn't exist yet, auto-register them with default password = mobile!
  if (!user) {
    const regResult = await registerKarykarta({
      name: "KARYAKARTA",
      mandalName: "અડાજણ (Adajan)",
      mobile: cleanMobile,
    });
    user = regResult.user;
  }

  // Password check:
  // If user hasn't set custom password yet, check against default password (mobile number)
  if (!user.hasSetPassword) {
    if (cleanPass === user.mobile) {
      // First-time login with default password => prompt to set custom password!
      return {
        success: true,
        user,
        requiresPasswordSetup: true,
      };
    } else {
      return {
        success: false,
        error: "પ્રથમ વખત લોગિન માટે તમારો મોબાઈલ નંબર જ પાસવર્ડ તરીકે દાખલ કરો.",
      };
    }
  }

  // If user has already set custom password, verify against their custom password
  if (user.password !== cleanPass) {
    return {
      success: false,
      error: "અમાન્ય પાસવર્ડ. કૃપા કરીને તમે સેટ કરેલ પાસવર્ડ દાખલ કરો.",
    };
  }

  setCurrentUser(user);
  return { success: true, user, requiresPasswordSetup: false };
}

/**
 * Set custom password for Karyakarta on first login
 */
export async function setUserPassword(mobile, newPassword) {
  const cleanMobile = sanitizeContactNumber(mobile);

  if (!newPassword || newPassword.length < 4) {
    return { success: false, error: "પાસવર્ડ ઓછામાં ઓછો ૪ અક્ષરનો હોવો જોઈએ (Min 4 chars)" };
  }

  const localList = getLocalUsers();
  const existingUser = localList.find((u) => u.mobile === cleanMobile);

  const updatedUser = {
    ...(existingUser || {}),
    mobile: cleanMobile,
    password: newPassword,
    hasSetPassword: true,
    updatedAt: new Date().toISOString(),
  };

  // Update local cache
  const updatedList = localList.map((u) => (u.mobile === cleanMobile ? updatedUser : u));
  if (!existingUser) updatedList.unshift(updatedUser);
  saveLocalUsers(updatedList);

  // Update Firestore
  try {
    const docRef = doc(db, USERS_COLLECTION, cleanMobile);
    await setDoc(docRef, updatedUser, { merge: true });
  } catch (e) {
    console.warn("Firestore set password offline fallback:", e.message);
  }

  setCurrentUser(updatedUser);
  return { success: true, user: updatedUser };
}

/**
 * Admin function: Reset Karyakarta password back to their mobile number
 */
export async function resetKarykartaPasswordToDefault(mobile) {
  const cleanMobile = sanitizeContactNumber(mobile);
  const localList = getLocalUsers();
  const user = localList.find((u) => u.mobile === cleanMobile);

  if (!user) return { success: false, error: "User not found" };

  const updated = {
    ...user,
    password: cleanMobile,
    hasSetPassword: false, // Will require password setup again next time
  };

  const updatedList = localList.map((u) => (u.mobile === cleanMobile ? updated : u));
  saveLocalUsers(updatedList);

  try {
    const docRef = doc(db, USERS_COLLECTION, cleanMobile);
    await updateDoc(docRef, { password: cleanMobile, hasSetPassword: false });
  } catch (e) {
    // offline
  }

  return { success: true };
}
