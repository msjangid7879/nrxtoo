# NRXTOO — Multi-Tenant Jewellery & Stones Suite (Pure JavaScript)

A modular full-stack web application built with **React (JavaScript / JSX)** + **Node.js (Express / ESM)** + **PostgreSQL** featuring **Single Login (User ID + Password)**, a **Google-Style App Launcher (9-Dots Bento Grid)**, multi-tenant boutique isolation, hierarchical role-based permissions, and the specialized **Jewellery & Stones Shop & Inventory Module**.

Runs 100% locally on your machine without Docker.

---

## 🏛️ System Architecture & Highlights

```
d:\NRXTOO PROJECTS\shop and e-commers\
├── backend/
│   ├── src/
│   │   ├── config/              # PostgreSQL pool, JWT, and environment settings (ESM)
│   │   ├── database/
│   │   │   ├── schema.sql       # PostgreSQL DDL with unique user_id, UUIDs, indexes, & cascades
│   │   │   ├── seed.sql         # Seed data for shops, items, transactions, and user_id credentials
│   │   │   ├── db.js            # Pg pool with query helper and health checks
│   │   │   └── init-db.js       # Automated DB initializer & password hasher
│   │   ├── middleware/
│   │   │   ├── authGuard.js     # Bearer JWT validator & shop context injector
│   │   │   ├── roleGuard.js     # Hierarchical role & granular permission guards
│   │   │   ├── platformAdminGuard.js # Guard strictly isolating Platform Super Admin
│   │   │   └── errorHandler.js  # Centralized error handler
│   │   ├── modules/
│   │   │   ├── auth/            # Shop Owner Signup, User ID login, session me
│   │   │   ├── platformAdmin/   # Super admin console, shop creation, module toggles
│   │   │   ├── shops/           # Shop profile, branding (logo & banner), GSTIN
│   │   │   ├── users/           # Staff roster & hierarchical role management (User ID creation)
│   │   │   ├── inventory/       # Jewellery & Stones items with dynamic category specs
│   │   │   ├── transactions/    # Atomic Purchase & Sale flows (updates PostgreSQL stock)
│   │   │   └── placeholders/    # HR, Accounting & E-Commerce preview endpoints
│   │   └── server.js            # Express server entry point
│   ├── .env.example
│   └── package.json             # Pure ESM ("type": "module"), Node.js native --watch
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── AppLauncherModal.jsx   # Google-style 9-dots (bento) dropdown popover
│   │   │   ├── TopNavBar.jsx          # Persistent top nav bar with shop logo, 9-dots & profile
│   │   │   ├── ProtectedRoute.jsx     # Route protection & shop-enabled module check
│   │   │   └── PlatformAdminRoute.jsx # Route guard for Platform Super Admin
│   │   ├── context/
│   │   │   └── AuthContext.jsx        # Authentication (User ID login & Shop Owner signup)
│   │   ├── data/
│   │   │   └── productsData.js        # Comprehensive definitions for all 5 NRXTOO modules
│   │   ├── modules/
│   │   │   ├── public/
│   │   │   │   ├── HomePage.jsx           # Public Landing Page (/) with Hero & Products cards
│   │   │   │   ├── ProductDetailPage.jsx  # Dedicated module detail page (/products/:moduleSlug)
│   │   │   │   ├── PublicNavbar.jsx       # Public top navigation with Products dropdown
│   │   │   │   └── PublicFooter.jsx       # Public footer with compliance standards
│   │   │   ├── auth/
│   │   │   │   ├── LoginPage.jsx              # Standard login (User ID + Password, NO email input)
│   │   │   │   ├── SignupPage.jsx             # New Shop Owner registration (shop details + owner email)
│   │   │   │   └── PlatformAdminLoginPage.jsx # Platform Super Admin login (User ID: superadmin)
│   │   │   ├── launcher/              # Google-Style App Launcher Dashboard Hub
│   │   │   ├── platformAdmin/         # Platform Super Admin Console (/platform-admin)
│   │   │   ├── inventory/             # Main Module: Inventory, dynamic fields, purchases, sales
│   │   │   │   ├── InventoryDashboard.jsx
│   │   │   │   ├── ItemFormModal.jsx    # Category switcher: Jewellery vs Stones dynamic fields
│   │   │   │   ├── PurchaseModal.jsx    # Inward Purchase flow (increments stock)
│   │   │   │   ├── SaleModal.jsx        # Outward Sale flow (validates & decrements stock)
│   │   │   │   └── ShopProfileModal.jsx # Shop branding setup (Logo/Banner upload & URLs)
│   │   │   ├── hr/                    # Admin, HR & Clients (Role comparison & staff roster)
│   │   │   ├── accounting/            # Accounting & Billing placeholder
│   │   │   └── ecommerce/             # Online Shop & E-Commerce storefront placeholder
│   │   ├── services/
│   │   │   └── api.js                 # Fetch client with auto JWT injection
│   │   ├── App.jsx                    # React Router configuration
│   │   ├── main.jsx                   # React 18 root
│   │   └── index.css                  # Tailwind CSS & custom design system
│   ├── .env.example
│   ├── package.json                   # Pure JS, Vite React
│   └── vite.config.js                 # Vite configuration with /api proxy
├── .vscode/
│   ├── launch.json              # 1-click F5 debugging for Backend + Frontend
│   └── tasks.json               # VS Code tasks for DB init and servers
├── package.json                 # Monorepo root scripts
└── README.md
```

---

## 🔐 Authentication & Flow Specification

### 1. New Shop Registration (`/signup`) — Shop Owner / Admin Only
- Located at: `http://localhost:5173/signup` (also linked directly on the login screen via *"New Shop Owner? Register Boutique & Account"*).
- **Only the Shop Owner / Admin** enters email and boutique details:
  - **Shop Details**: Boutique Name, Unique Shop Code/Slug, Tagline, Address, Phone, GSTIN/Tax ID, Currency.
  - **Owner Credentials**: Owner Full Name, Owner Email Address (saved for shop business records), **Chosen Unique User ID** (e.g. `rajesh_admin` or `owner_jaipur`), and Password.
- Automatically:
  1. Creates the shop in PostgreSQL.
  2. Enables the 4 core modules (`inventory`, `hr`, `accounting`, `ecommerce`).
  3. Registers the user as `ADMIN` with full permissions.
  4. Generates JWT and immediately logs into the **Google-Style App Launcher Hub**.

### 2. Regular Login (`/login`) — User ID + Password for Everyone
- Located at: `http://localhost:5173/login`
- **Zero Email on Login Screen**: Neither Shop Owner, Admin, Senior HR, Junior HR, Staff, nor Platform Admin enter an email to log in.
- Every user signs in strictly using their **Unique User ID + Password**.
- The login form features **1-Click Quick Demo Account** buttons to instantly fill credentials for all 4 roles.

---

## 🔑 Demo Accounts & Pre-Configured Credentials

The database initializer pre-seeds standard accounts across multi-tenant shops:

### 1. Shop Tenant Users (`/login`):
* **Tenant 1**: `NRXTOO Royal Jewellers & Gemstones` (Jaipur) — *All 4 modules enabled*
* **Tenant 2**: `NRXTOO Artisan Silver Studio` (Mumbai) — *HR & Accounting disabled to test dynamic filtering*

| Role | Unique User ID | Password | Scope & Access Rights |
| :--- | :--- | :--- | :--- |
| **👑 Shop Owner / Admin** | `admin_royal` | `Admin123!` | Full control over inventory, purchases, sales, shop branding, HR, and billing. |
| **⭐ Senior HR** | `senior_hr` | `HrSenior123!` | Staff roster, create employees with User IDs, view inventory & sales; no financial config edit. |
| **🔹 Junior HR** | `junior_hr` | `HrJunior123!` | View-only staff directory and inventory access. |
| **👤 Staff** | `staff_kavita` | `Staff123!` | Counter sales, invoice billing, inventory viewing; no HR/admin edit rights. |

### 2. Platform Super Admin (`/platform-admin/login`):
* **URL**: `http://localhost:5173/platform-admin/login`
* **Unique User ID**: `superadmin`
* **Password**: `SuperAdmin123!`
* **Isolation**: Operates outside shop tenancy. Manages all shops, creates new tenant accounts, and can toggle any of the 4 modules (`inventory`, `hr`, `accounting`, `ecommerce`) ON or OFF for any shop.

---

## 💎 Features Walkthrough

### 1. Single Login & Google-Style App Launcher Hub
- **Authentication**: JWT token payload carries `userId`, `user_id`, `shopId`, `role`, `hrLevel`, and granular `permissions`.
- **Launcher Hub (`/launcher`)**: Welcomes user with shop branding and large Google Workspace-style app tiles.
- **Dynamic Module Visibility**: Displays **ONLY** modules enabled for that shop tenant.
- **Persistent 9-Dots Switcher (`TopNavBar`)**: Always visible across all modules with an interactive bento dropdown popover, allowing seamless switching without losing active shop context.

### 2. Main Module: Shop & Inventory (Jewellery & Stones)
- **Shop Profile & Branding**:
  - Name, tagline, phone, official email, GSTIN/Tax ID, base currency.
  - Interactive Logo URL / File Upload.
  - Interactive Banner URL / File Upload.
- **Dynamic Category Selector**:
  - **Jewellery Mode**:
    - `metal_type` (Yellow Gold, Rose Gold, White Gold, Silver, Platinum, Kundan Polki)
    - `purity` (24K 999, 22K 916 Hallmark, 18K 750, 14K 585, 925 Sterling, 950 Platinum)
    - `gross_weight` (grams, e.g. `68.450g`)
    - `net_weight` (grams, e.g. `54.120g`)
    - `stone_weight` (grams or carats)
    - `making_charges` (making labor fee)
    - `huid_hallmark` (Unique 6-character BIS alphanumeric code, e.g. `HA7912`)
  - **Stones Mode**:
    - `stone_type` (Diamond, Blue Sapphire, Yellow Sapphire, Emerald, Ruby, Opal, Pearl, Tanzanite)
    - `shape_cut` (Round Brilliant, Princess, Cushion Mixed, Oval Brilliant, Octagonal Emerald Cut, Pear)
    - `color` (D Colorless, Pigeon Blood Red, Royal Blue, Muzo Green, etc.)
    - `clarity` (FL, IF, VVS1, VVS2, VS1, VS2, SI1)
    - `carat_weight` (carats, e.g. `4.250 ct`)
    - `treatment_origin` (e.g. `Natural Unheated - Ceylon (Sri Lanka)`)
    - `lab_certificate_no` (e.g. `GIA-2218491023`, `IGI-592817290`)
- **Stock Movement Flows (PostgreSQL)**:
  - **Purchase Stock Entry (`/api/transactions/purchase`)**: Atomically increments stock quantity, records vendor, invoice, unit cost, and notes in `stock_transactions`.
  - **Sales Billing Entry (`/api/transactions/sale`)**: Validates sufficient stock quantity, locks row to prevent concurrency races, decrements stock, updates status (`IN_STOCK`, `LOW_STOCK`, `OUT_OF_STOCK`), and logs customer billing record.
  - **Stock Movement Drawer**: Inspect all historic purchase and sale movements.

### 3. Placeholder Testing Modules
- **Admin, HR & Clients (`/hr`)**: Test role hierarchy (Admin vs Senior HR vs Junior HR vs Staff) and view live employee roster with unique login User IDs.
- **Accounting & Billing (`/accounting`)**: General ledger overview, GST collected, and tax vouchers.
- **Online Shop & E-Commerce (`/ecommerce`)**: Public storefront link, catalog sync status, and web orders.

---

## 🛠️ Step-by-Step Setup Guide (Running Locally)

### Prerequisites:
1. **Node.js** (v18, v20, or v22)
2. **PostgreSQL** installed and running on `localhost:5432`

---

### Step 1: Configure Environment Variables

#### Backend `.env` (`backend/.env`):
A ready `.env` file is provided at `backend/.env` (and template at `backend/.env.example`):

```env
PORT=5000
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173

# JWT Secret
JWT_SECRET=nrxtoo-super-secret-jwt-key-2026-change-in-production
JWT_EXPIRES_IN=7d

# PostgreSQL Credentials (adjust if your local Postgres differs)
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=nrxtoo_jewellery_db
DB_SSL=false
DB_POOL_MAX=20

UPLOAD_DIR=./uploads
```

---

### Step 2: Initialize Database and Seed Sample Data

The database initializer (`backend/src/database/init-db.js`) creates the database `nrxtoo_jewellery_db`, applies `schema.sql`, hashes passwords using bcrypt, and seeds initial shops, users with unique `user_id`s, jewellery items with HUID hallmarks, stones with GIA certificates, and transactions.

Run from backend directory:
```bash
cd backend
npm run db:init
```
*(Or from project root: `npm run db:init`)*

---

### Step 3: Run the Application

#### Option A: Two Terminals

**Terminal 1 (Backend API Server):**
```bash
cd backend
npm run dev
```
Backend will start with native Node.js `--watch` at: **`http://localhost:5000`** (Health check: `http://localhost:5000/api/health`)

**Terminal 2 (Frontend Client):**
```bash
cd frontend
npm run dev
```
Frontend will start at: **`http://localhost:5173`**

#### Option B: Using VS Code 1-Click Debugger (F5)
1. Open this workspace in VS Code.
2. Press **`F5`** or go to **Run & Debug** (`Ctrl+Shift+D`).
3. Select **"Full Stack: Backend + Frontend"** and press Play.
4. VS Code starts both the Express API and Vite server simultaneously.

---

## 🧪 Verification & Testing Guide

### 1. Test New Shop Owner Registration Flow:
1. Open `http://localhost:5173/login`.
2. Click the link at the bottom: **"New Shop Owner? Register Boutique & Account &rarr;"** (or go to `http://localhost:5173/signup`).
3. Fill in:
   - **Shop Name**: e.g., `Kohinoor Heritage Diamonds`
   - **Shop Code/Slug**: `kohinoor-heritage`
   - **Showroom Address**: `Shop 12, Zaveri Bazaar, Mumbai`
   - **Owner Full Name**: `Aakash Mehta`
   - **Owner Email**: `aakash@kohinoor.com` (collected for records)
   - **Chosen User ID**: `aakash_admin`
   - **Password**: `Kohinoor123!`
4. Click **Create Shop & Enter App Launcher**.
5. You will immediately be logged in as `ADMIN` with the new shop created in PostgreSQL and landed on the Google-Style App Launcher Hub!

### 2. Test User ID Login (No Email Requested):
1. Sign out (via the profile dropdown at the top right).
2. On `http://localhost:5173/login`, verify that the login form asks **ONLY** for:
   - **Unique User ID**
   - **Password**
3. Enter `admin_royal` and `Admin123!` (or click the **👑 Admin** 1-click button).
4. Click **Sign In with User ID**. You will successfully log in!
5. Repeat for staff roles: `senior_hr` / `HrSenior123!`, `junior_hr` / `HrJunior123!`, `staff_kavita` / `Staff123!`.

### 3. Test Google-Style 9-Dots App Switcher:
1. In the top navigation bar, click the **9-dots icon** (`AppLauncherModal`).
2. The Google Workspace-style bento grid opens, showing active modules for that tenant shop.
3. Switch between **Shop & Inventory**, **Admin, HR & Clients**, **Accounting & Billing**, and **Online Shop & E-Commerce**.

### 4. Test Jewellery vs Stones Dynamic Inventory:
1. Go to **Shop & Inventory** (`/inventory`).
2. Click **+ New Item**.
3. Toggle category to **Jewellery**:
   - Notice dynamic fields: Metal Type (Gold, Silver, Platinum), Purity (22K, 18K), Gross Weight, Net Weight, Making Charges, and 6-digit HUID Hallmark code (`huid_hallmark`).
4. Toggle category to **Stones**:
   - Notice dynamic fields: Stone Type (Diamond, Blue Sapphire, Emerald), Shape Cut, Color, Clarity, Carat Weight, Treatment/Origin, and Lab Certificate No (`lab_certificate_no`).
5. Test recording a **Stock Purchase** or **Counter Sale** and observe atomic stock updates in PostgreSQL.

### 5. Test Platform Super Admin Isolation:
1. Visit `http://localhost:5173/platform-admin/login`.
2. Sign in with User ID: `superadmin` / Password: `SuperAdmin123!`.
3. In the Platform Super Admin Console, toggle modules ON/OFF for any tenant shop.
4. Changes reflect immediately in that shop's Google-style App Launcher!

---

## 🛡️ License & Credits

Developed for **NRXTOO Multi-Tenant Suite** — Hallmark Jewellery & Fine Stones.
Pure JavaScript (`.js` & `.jsx`) • PostgreSQL • Node.js • React • Vite.
All rights reserved.
