/**
 * Validation and Sanitization utilities for Surat Mandal Ghari Distribution App
 * 
 * Rules:
 * 1. Karykarta Name: CAPITAL LETTERS only, NO special characters, NO digits.
 * 2. Contact Number: Strictly 10 digits, numeric only, starts with 6-9.
 * 3. Roll No: Strictly numeric only, positive integer > 0.
 * 4. Mandal Name: Required, min 2 characters.
 * 5. Ghari Order: Must select at least 1 packet (either 500g or 1kg).
 */

/**
 * Sanitizes Karykarta Name to UPPERCASE and eliminates any characters other than A-Z and space.
 * Prevents leading whitespace.
 * @param {string} value 
 * @returns {string} Sanitized uppercase string
 */
export function sanitizeKarykartaName(value) {
  if (!value) return "";
  return value
    .toUpperCase()
    .replace(/[^A-Z\s]/g, "") // Disallow digits, symbols, special chars
    .replace(/^\s+/, "");     // Disallow leading whitespace
}

/**
 * Validates Karykarta Name
 * @param {string} name 
 * @returns {{ isValid: boolean, error: string }}
 */
export function validateKarykartaName(name) {
  if (!name || name.trim().length === 0) {
    return { isValid: false, error: "Karykarta Name is required" };
  }

  const trimmed = name.trim();

  if (trimmed.length < 3) {
    return { isValid: false, error: "Name must be at least 3 characters long" };
  }

  if (trimmed.length > 50) {
    return { isValid: false, error: "Name cannot exceed 50 characters" };
  }

  // Must only contain uppercase letters and spaces (no special characters, no numbers, no lowercase)
  const capitalLettersOnlyRegex = /^[A-Z\s]+$/;
  if (!capitalLettersOnlyRegex.test(trimmed)) {
    return {
      isValid: false,
      error: "Name must be in CAPITAL LETTERS only with NO special characters or numbers",
    };
  }

  return { isValid: true, error: "" };
}

/**
 * Sanitizes Contact Number:
 * Keeps only numeric digits and caps length strictly at 10 digits.
 * @param {string} value 
 * @returns {string} Clean numeric string of max 10 digits
 */
export function sanitizeContactNumber(value) {
  if (!value) return "";
  return value.replace(/\D/g, "").slice(0, 10);
}

/**
 * Validates Contact Number
 * Must be exactly 10 digits and start with valid Indian mobile prefix (6, 7, 8, 9).
 * @param {string} contact 
 * @returns {{ isValid: boolean, error: string }}
 */
export function validateContactNumber(contact) {
  if (!contact || contact.trim().length === 0) {
    return { isValid: false, error: "Contact Number is required" };
  }

  const cleanDigits = contact.replace(/\D/g, "");

  if (cleanDigits.length !== 10) {
    return {
      isValid: false,
      error: `Contact number must be exactly 10 digits (currently ${cleanDigits.length} digits)`,
    };
  }

  if (!/^[6-9]\d{9}$/.test(cleanDigits)) {
    return {
      isValid: false,
      error: "Enter a valid 10-digit mobile number starting with 6, 7, 8, or 9",
    };
  }

  return { isValid: true, error: "" };
}

/**
 * Sanitizes Roll Number:
 * Only allows numeric digits (0-9) and caps length at 8 digits.
 * @param {string|number} value 
 * @returns {string} Clean numeric string
 */
export function sanitizeRollNo(value) {
  if (value === null || value === undefined) return "";
  return value.toString().replace(/\D/g, "").slice(0, 8);
}

/**
 * Validates Roll Number:
 * Must be non-empty, strictly numeric, and positive integer (> 0).
 * @param {string|number} rollNo 
 * @returns {{ isValid: boolean, error: string }}
 */
export function validateRollNo(rollNo) {
  if (rollNo === null || rollNo === undefined || rollNo.toString().trim().length === 0) {
    return { isValid: false, error: "Roll Number is required" };
  }

  const cleanRoll = rollNo.toString().trim();

  if (!/^\d+$/.test(cleanRoll)) {
    return {
      isValid: false,
      error: "Roll number must be numeric only (no letters or symbols)",
    };
  }

  const parsed = parseInt(cleanRoll, 10);
  if (isNaN(parsed) || parsed <= 0) {
    return {
      isValid: false,
      error: "Roll number must be a positive number greater than 0",
    };
  }

  return { isValid: true, error: "" };
}

/**
 * Validates Surat Mandal Name
 * @param {string} mandal 
 * @returns {{ isValid: boolean, error: string }}
 */
export function validateMandalName(mandal) {
  if (!mandal || mandal.trim().length === 0) {
    return { isValid: false, error: "Mandal Name is required" };
  }

  const trimmed = mandal.trim();
  if (trimmed.length < 2) {
    return { isValid: false, error: "Mandal Name must be at least 2 characters long" };
  }

  return { isValid: true, error: "" };
}

/**
 * Validates Ghari Order quantities
 * At least one pack must be ordered.
 * @param {number} qty500g 
 * @param {number} qty1kg 
 * @returns {{ isValid: boolean, error: string }}
 */
export function validateGhariOrder(qty500g, qty1kg) {
  const num500 = parseInt(qty500g, 10) || 0;
  const num1kg = parseInt(qty1kg, 10) || 0;

  if (num500 < 0 || num1kg < 0) {
    return { isValid: false, error: "Quantities cannot be negative" };
  }

  if (num500 === 0 && num1kg === 0) {
    return { isValid: false, error: "Please add at least 1 Ghari pack (500 Gm or 1 Kg)" };
  }

  return { isValid: true, error: "" };
}

/**
 * Validates entire form before submission
 * @param {Object} formData 
 * @returns {{ isValid: boolean, errors: Object }}
 */
export function validateDistributionForm(formData) {
  const errors = {};

  const nameCheck = validateKarykartaName(formData.karykartaName);
  if (!nameCheck.isValid) errors.karykartaName = nameCheck.error;

  const rollCheck = validateRollNo(formData.rollNo);
  if (!rollCheck.isValid) errors.rollNo = rollCheck.error;

  const mandalCheck = validateMandalName(formData.mandalName);
  if (!mandalCheck.isValid) errors.mandalName = mandalCheck.error;

  const contactCheck = validateContactNumber(formData.contactNumber);
  if (!contactCheck.isValid) errors.contactNumber = contactCheck.error;

  const orderCheck = validateGhariOrder(formData.qty500g, formData.qty1kg);
  if (!orderCheck.isValid) errors.ghariOrder = orderCheck.error;

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}
