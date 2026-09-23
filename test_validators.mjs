import assert from "node:assert/strict";
import {
  sanitizeKarykartaName,
  validateKarykartaName,
  sanitizeContactNumber,
  validateContactNumber,
  validateMandalName,
  validateGhariOrder,
  validateDistributionForm,
} from "./src/utils/validators.js";
import { calculateOrderTotals } from "./src/utils/formatters.js";
import { SURAT_MANDALS } from "./src/utils/suratMandals.js";

console.log("🚀 Starting Surat Ghari Distribution App Validation Tests...\n");

// Test 1: Karykarta Name Sanitizer
console.log("Test 1: Karykarta Name Sanitization");
assert.equal(sanitizeKarykartaName("harish"), "HARISH", "Should convert to uppercase");
assert.equal(sanitizeKarykartaName("Harish@123!"), "HARISH", "Should strip special characters and digits");
assert.equal(sanitizeKarykartaName("   RAMESH   PATEL  "), "RAMESH   PATEL  ", "Should strip leading space and uppercase");
assert.equal(sanitizeKarykartaName("JIGNESH#$%-BHAI"), "JIGNESHBHAI", "Should remove #$%- and keep uppercase letters");
console.log("✅ Passed: Karykarta Name sanitization converts to uppercase and removes special chars/numbers.");

// Test 2: Karykarta Name Validation
console.log("\nTest 2: Karykarta Name Validation");
assert.equal(validateKarykartaName("").isValid, false, "Empty name should be invalid");
assert.equal(validateKarykartaName("HA").isValid, false, "Name < 3 chars should be invalid");
assert.equal(validateKarykartaName("harish").isValid, false, "Lowercase letters should fail validation");
assert.equal(validateKarykartaName("HARISH123").isValid, false, "Numbers should fail validation");
assert.equal(validateKarykartaName("HARISH@BHAI").isValid, false, "Special characters should fail validation");
assert.equal(validateKarykartaName("HARISHBHAI PRAJAPATI").isValid, true, "Proper capital name should be valid");
console.log("✅ Passed: Name strictly requires CAPITAL letters and NO special characters or numbers.");

// Test 3: Contact Number Sanitization & Validation
console.log("\nTest 3: Contact Number Validation (Strictly 10 digits)");
assert.equal(sanitizeContactNumber("987-654-3210"), "9876543210", "Should strip dashes and keep 10 digits");
assert.equal(sanitizeContactNumber("98765432109999"), "9876543210", "Should cap at 10 digits");
assert.equal(validateContactNumber("").isValid, false, "Empty contact should fail");
assert.equal(validateContactNumber("98765").isValid, false, "Less than 10 digits should fail");
assert.equal(validateContactNumber("98765432101").isValid, false, "More than 10 digits should fail");
assert.equal(validateContactNumber("1234567890").isValid, false, "Non Indian mobile prefix (starts with 1) should fail");
assert.equal(validateContactNumber("9876543210").isValid, true, "Valid 10-digit number should pass");
assert.equal(validateContactNumber("6351234567").isValid, true, "Valid 10-digit number starting with 6 should pass");
console.log("✅ Passed: Contact number strictly requires 10 digits.");

// Test 4: Surat 13 Mandals Verification
console.log("\nTest 4: Surat 13 Mandals Verification");
assert.equal(SURAT_MANDALS.length, 13, "Must have exactly 13 mandals");
const expectedGujaratiMandals = [
  "અડાજણ",
  "ઉધના",
  "ભુલાપાર્ક",
  "વેડ",
  "અમરોલી હાઉસિંગ",
  "કતારગામ",
  "અમરોલી ઉત્રાણ",
  "મહિધરપુરા",
  "સણિયા",
  "અમરોલી મધ્ય",
  "નવરત્ન",
  "વરાછા",
  "બાપા મંડળ",
];
expectedGujaratiMandals.forEach((m) => {
  const found = SURAT_MANDALS.some((sm) => sm.gujarati === m);
  assert.ok(found, `Mandal ${m} must be present`);
});
console.log("✅ Passed: All 13 Surat mandals are correctly registered.");

// Test 5: Ghari Pricing & Weight Calculations
console.log("\nTest 5: Ghari Order Pricing (500 Gm = ₹500, 1 Kg = ₹1000)");
const order1 = calculateOrderTotals(1, 0); // 1 x 500g
assert.equal(order1.totalPacks, 1);
assert.equal(order1.totalWeightKg, 0.5);
assert.equal(order1.totalPrice, 500, "1x 500g should be 500 Rs");

const order2 = calculateOrderTotals(0, 1); // 1 x 1kg
assert.equal(order2.totalPacks, 1);
assert.equal(order2.totalWeightKg, 1.0);
assert.equal(order2.totalPrice, 1000, "1x 1kg should be 1000 Rs");

const order3 = calculateOrderTotals(2, 3); // 2x 500g + 3x 1kg = 1kg + 3kg = 4kg, 2*500 + 3*1000 = 4000 Rs
assert.equal(order3.totalPacks, 5);
assert.equal(order3.totalWeightKg, 4.0);
assert.equal(order3.totalPrice, 4000, "2x 500g + 3x 1kg should equal ₹4000");
console.log("✅ Passed: Ghari pricing calculations verified (500g = ₹500, 1kg = ₹1000).");

// Test 6: Full Form Validation
console.log("\nTest 6: Full Form Validation Integration");
const invalidForm = {
  karykartaName: "harish@prajapati",
  mandalName: "",
  contactNumber: "98765",
  qty500g: 0,
  qty1kg: 0,
};
const resInvalid = validateDistributionForm(invalidForm);
assert.equal(resInvalid.isValid, false);
assert.ok(resInvalid.errors.karykartaName);
assert.ok(resInvalid.errors.mandalName);
assert.ok(resInvalid.errors.contactNumber);
assert.ok(resInvalid.errors.ghariOrder);

const validForm = {
  karykartaName: "HARISHBHAI PRAJAPATI",
  mandalName: "અડાજણ (Adajan)",
  contactNumber: "9876543210",
  qty500g: 2,
  qty1kg: 1,
};
const resValid = validateDistributionForm(validForm);
assert.equal(resValid.isValid, true);
assert.equal(Object.keys(resValid.errors).length, 0);
console.log("✅ Passed: Full form validation operates accurately without roll number.");

console.log("\n🎉 ALL TESTS PASSED SUCCESSFULLY! 🎯\n");
