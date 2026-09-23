import assert from "node:assert/strict";
import {
  loginUser,
  registerKarykarta,
  setUserPassword,
  findUserByMobile,
  ADMIN_USER,
} from "./src/services/authService.js";
import { calculateOrderTotals } from "./src/utils/formatters.js";

console.log("🚀 Testing Karyakarta & Admin Authentication & First-Time Password Setup...\n");

// Test 1: Admin Login
console.log("Test 1: Admin Login (Pradesh Level)");
const adminLogin = await loginUser("admin", "admin");
assert.equal(adminLogin.success, true);
assert.equal(adminLogin.user.role, "admin");
assert.equal(adminLogin.requiresPasswordSetup, false);
console.log("✅ Passed: Admin logs in successfully to Pradesh Level.");

// Test 2: Pre-seeded Karyakarta First-Time Login with Mobile Number
console.log("\nTest 2: Karyakarta First-Time Login (User ID = Mobile, Password = Mobile)");
const testMobile = "9" + Math.floor(100000000 + Math.random() * 900000000);
const firstLogin = await loginUser(testMobile, testMobile);
assert.equal(firstLogin.success, true, "First-time login with mobile number should succeed");
assert.equal(firstLogin.requiresPasswordSetup, true, "First-time login must require password setup");
assert.equal(firstLogin.user.mobile, testMobile);
console.log("✅ Passed: First-time login with mobile number successfully triggers password setup requirement.");

// Test 3: Set New Password for Karyakarta
console.log("\nTest 3: Set New Custom Password");
const newPass = "Harish@2026";
const passResult = await setUserPassword(testMobile, newPass);
assert.equal(passResult.success, true);
assert.equal(passResult.user.hasSetPassword, true);
assert.equal(passResult.user.password, newPass);
console.log("✅ Passed: New password saved successfully.");

// Test 4: Subsequent Login with New Password
console.log("\nTest 4: Subsequent Login with New Password");
const subLogin = await loginUser(testMobile, newPass);
assert.equal(subLogin.success, true);
assert.equal(subLogin.requiresPasswordSetup, false, "Should not require password setup again");
assert.equal(subLogin.user.role, "karykarta");
console.log("✅ Passed: Subsequent login with new custom password succeeds directly into portal.");

// Test 5: Login with Old Default Password Should Now Fail
console.log("\nTest 5: Login with Old Default Password (Must Fail after custom password set)");
const oldPassLogin = await loginUser(testMobile, testMobile);
assert.equal(oldPassLogin.success, false, "Old default password must no longer work");
console.log("✅ Passed: Old default password rejected after custom password is set.");

// Test 6: New Karyakarta Registration & First-Time Flow
console.log("\nTest 6: New Karyakarta Registration");
const regMobile = "9" + Math.floor(100000000 + Math.random() * 900000000);
const regRes = await registerKarykarta({
  name: "BHAVESH PATEL",
  mandalName: "અમરોલી હાઉસિંગ (Amroli Housing)",
  mobile: regMobile,
});
assert.equal(regRes.success, true);
assert.equal(regRes.user.hasSetPassword, false);
assert.equal(regRes.user.password, regMobile, "Default password must equal mobile number");

// First login of new user
const newRegLogin = await loginUser(regMobile, regMobile);
assert.equal(newRegLogin.success, true);
assert.equal(newRegLogin.requiresPasswordSetup, true);
console.log("✅ Passed: New Karyakarta registered with default password = mobile number.");

// Test 7: Order Price & Weight Calculation for Karyakarta Order
console.log("\nTest 7: Karyakarta Order (reflected at Pradesh Level)");
const order = calculateOrderTotals(3, 2); // 3x 500g + 2x 1kg = 3.5kg, 3*500 + 2*1000 = ₹3500
assert.equal(order.totalPacks, 5);
assert.equal(order.totalWeightKg, 3.5);
assert.equal(order.totalPrice, 3500);
console.log("✅ Passed: Karyakarta order totals calculated accurately.");

console.log("\n🎉 ALL AUTH & ROLE WORKFLOW TESTS PASSED SUCCESSFULLY! 🎯\n");
process.exit(0);
