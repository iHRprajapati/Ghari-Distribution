# સૂરત મંડળ વાઈઝ ઘારી વિતરણ સેવા પોર્ટલ
## Surat Mandal-wise Karyakarta Ghari Distribution & Order Management App

A modern, responsive React JS web application crafted for managing **Surat Mandal-wise Karyakarta Ghari (ઘારી) Distribution**, powered by **Firebase Cloud Firestore**.

---

## 🌟 Key Features

### 1. 🛡️ Strict Field Validations
- **કાર્યકર્તા નામ (Karykarta Name)**:
  - Must be in **CAPITAL LETTERS ONLY** (`A-Z` and spaces).
  - **Does NOT accept special characters or digits** (`@`, `#`, `$`, `%`, `0-9`, etc. are strictly disallowed and automatically filtered out).
  - Automatically capitalizes input as the user types.
  - Minimum 3 and maximum 50 characters.
- **રોલ નંબર (Roll No)**:
  - Must be **strictly numeric** (`0-9`).
  - Positive integer greater than 0.
  - Non-numeric inputs are instantly blocked.
- **સંપર્ક નંબર (Contact Number)**:
  - Must be **strictly 10 digits**.
  - Non-numeric characters (dashes, spaces, letters) are stripped automatically.
  - Validates standard Indian mobile format starting with 6, 7, 8, or 9.
- **સૂરત મંડળ (Mandal Name)**:
  - Pre-populated selection of all prominent Surat Mandals (Varachha, Katargam, Adajan, Rander, Majura, Udhna, Limbayat, Athwa, Sarthana, etc.) with zone information and Gujarati labels.
  - Option to enter custom Surat mandal name.

### 2. 🥮 Ghari Order Form & Dynamic Pricing
- **500 Gm Pack**: **₹500** per box (0.5 Kg)
- **1 Kg Pack**: **₹1000** per box (1.0 Kg)
- **Interactive Steppers**: `[-]` and `[+]` buttons with quick direct quantity inputs.
- **Live Calculation**:
  - Automatically calculates total boxes: $\text{Qty}_{500\text{g}} + \text{Qty}_{1\text{kg}}$
  - Automatically calculates total weight in Kg: $(\text{Qty}_{500\text{g}} \times 0.5) + (\text{Qty}_{1\text{kg}} \times 1.0)$
  - Automatically calculates grand total in ₹: $(\text{Qty}_{500\text{g}} \times 500) + (\text{Qty}_{1\text{kg}} \times 1000)$

### 3. 🔥 Firebase Cloud Firestore Integration
- **Real-Time Data Sync**: Uses `onSnapshot` to sync new orders, edits, and deletions instantly across all connected screens.
- **Offline / Local Fallback**: When offline or if Firebase network is restricted, seamlessly stores and updates records in `localStorage` so work is never interrupted.
- **Pre-configured**: Out-of-the-box support with custom `.env` support.

### 4. 🎨 Creative Light Color Festive Design
- Designed with an elegant, warm festive light theme featuring saffron, amber, golden-honey, and soft cream tones matching the rich heritage of Surat Ghari.
- Clean typography supporting English and Gujarati script (*Noto Sans Gujarati* & *Plus Jakarta Sans*).

### 5. 📊 Analytics & Mandal-wise Filtering
- **KPI Metrics Cards**:
  - Total Karyakarta Orders
  - Total Ghari Distributed (in Kg)
  - 500 Gm vs 1 Kg Packets count
  - Total Revenue / Amount (in ₹)
  - Total Covered Surat Mandals
- **Mandal Filter Pills**: One-click filtering by Varachha, Katargam, Adajan, etc.
- **Search**: Instant search across Karyakarta Name, Roll No, Phone Number, Mandal, and Token ID.

### 6. 🖨️ Printable Token / Receipt Slip
- Generates official **Surat Ghari Distribution Token / Receipt** with unique Token Number (e.g. `SUR-GH-1001`).
- Formatted for clean printing with signature and mandal stamp sections (`window.print()`).

### 7. 📥 CSV Export
- Single-click CSV export of all distribution records for coordinators and accounting.

---

## 📁 Project Structure

```
surat-ghari-distribution-app/
├── index.html                     # HTML5 root with Gujarati fonts
├── package.json                   # Dependencies & scripts
├── vite.config.js                 # Vite + Tailwind v4 setup
├── .env                           # Active Firebase credentials
├── .env.example                   # Template Firebase credentials
├── test_validators.mjs            # Automated unit tests for validation rules
├── src/
│   ├── main.jsx                   # React root entry
│   ├── App.jsx                    # Central layout & state coordinator
│   ├── App.css                    # Utility style overrides
│   ├── index.css                  # Light-theme & print styles
│   ├── components/
│   │   ├── Navbar.jsx             # Festive header & status
│   │   ├── FirebaseStatusBanner.jsx# Live sync indicator
│   │   ├── StatsOverview.jsx      # Metrics / KPI cards
│   │   ├── GhariOrderForm.jsx     # Order form with live validation & pricing
│   │   ├── MandalFilter.jsx       # Surat Mandal filter pills
│   │   ├── DistributionTable.jsx  # Records table with Edit/Delete/Receipt
│   │   ├── ReceiptModal.jsx       # Printable distribution token slip
│   │   └── Toast.jsx              # Status toast notifications
│   ├── services/
│   │   ├── firebase.js            # Firebase App & Firestore initialization
│   │   └── ghariService.js        # CRUD operations, realtime listeners & CSV export
│   └── utils/
│       ├── validators.js          # Capital name, 10-digit phone, numeric roll validators
│       ├── suratMandals.js        # Surat Mandals master data
│       └── formatters.js          # Currency (₹), weight & date helpers
```

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Run the Development Server
```bash
npm run dev
```
Open your browser at `http://localhost:5173`.

### 3. Run Automated Validation Tests
```bash
npm test
```
Verifies all validation rules, uppercase conversion, numeric roll constraints, 10-digit phone limits, and pricing arithmetic.

### 4. Build for Production
```bash
npm run build
```

---

## 🔒 Validation Summary Matrix

| Field | Rule | Error Message |
|---|---|---|
| **Karyakarta Name** | Uppercase `[A-Z\s]`, min 3 chars, no digits/special chars | *"Name must be in CAPITAL LETTERS only with NO special characters or numbers"* |
| **Roll No** | Strictly numeric digits `[0-9]`, integer `> 0` | *"Roll number must be numeric only (no letters or symbols)"* |
| **Contact Number** | Strictly 10 digits starting with 6, 7, 8, or 9 | *"Enter a valid 10-digit mobile number starting with 6, 7, 8, or 9"* |
| **Mandal Name** | Non-empty, min 2 chars | *"Mandal Name is required"* |
| **Ghari Order** | At least one pack (500g or 1kg) | *"Please add at least 1 Ghari pack (500 Gm or 1 Kg)"* |

---

## 🥮 Pricing Calculation Formula

$$\text{Total Price (₹)} = (\text{Quantity}_{500\text{g}} \times 500) + (\text{Quantity}_{1\text{kg}} \times 1000)$$
$$\text{Total Weight (Kg)} = (\text{Quantity}_{500\text{g}} \times 0.5) + (\text{Quantity}_{1\text{kg}} \times 1.0)$$
