# NRXTOO — Multi-Tenant Jewellery & Stones Suite

A modular full-stack web application built with **React (TypeScript)** + **Node.js (Express)** + **PostgreSQL** featuring **Single Login**, a **Google-Style App Launcher (9-Dots Bento Grid)**, multi-tenant isolation, hierarchical role-based permissions, and the specialized **Jewellery & Stones Shop & Inventory Module**.

---

## 🏛️ System Architecture & Highlights

```
d:\NRXTOO PROJECTS\shop and e-commers\
├── backend/
│   ├── src/
│   │   ├── config/              # PostgreSQL pool, JWT, and environment settings
│   │   ├── database/
│   │   │   ├── schema.sql       # Complete DDL schema with UUIDs, indexes, and cascades
│   │   │   ├── seed.sql         # Comprehensive seed data for shops, items, and roles
│   │   │   ├── db.ts            # Pg Client pool with transactions & query log
│   │   │   └── init-db.ts       # Automated DB initializer & password hasher
│   │   ├── middleware/
│   │   │   ├── authGuard.ts     # Bearer JWT validator & shop context injector
│   │   │   ├── roleGuard.ts     # Hierarchical role & granular permission guards
│   │   │   ├── platformAdminGuard.ts # Guard isolating platform super admin
│   │   │   └── errorHandler.ts  # Centralized error handler
│   │   ├── modules/
│   │   │   ├── auth/            # Single login, me, accessible shops
│   │   │   ├── platformAdmin/   # Super admin console, shop creation, module toggles
│   │   │   ├── shops/           # Shop profile, branding (logo & banner), GSTIN
│   │   │   ├── users/           # Staff roster & hierarchical role management
│   │   │   ├── inventory/       # Jewellery & Stones items with dynamic category specs
│   │   │   ├── transactions/    # Atomic Purchase & Sale flows (updates PostgreSQL stock)
│   │   │   └── placeholders/    # HR, Accounting & E-Commerce preview endpoints
│   │   ├── types/               # Strict TypeScript definitions
│   │   └── server.ts            # Express server entry point
│   ├── .env.example
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── AppLauncherModal.tsx   # Google-style 9-dots (bento) dropdown popover
│   │   │   ├── TopNavBar.tsx          # Persistent navigation bar with shop logo, 9-dots & profile
│   │   │   ├── ProtectedRoute.tsx     # Route protection & shop-enabled module check
│   │   │   └── PlatformAdminRoute.tsx # Route guard for Platform Super Admin
│   │   ├── context/
│   │   │   └── AuthContext.tsx        # Authentication, active shop, role, enabled modules
│   │   ├── modules/
│   │   │   ├── auth/                  # LoginPage & PlatformAdminLoginPage
│   │   │   ├── launcher/              # Google-Style App Launcher Dashboard Hub
│   │   │   ├── platformAdmin/         # Platform Super Admin Console (/platform-admin)
│   │   │   ├── inventory/             # Main Module: Inventory, dynamic fields, purchases, sales
│   │   │   │   ├── InventoryDashboard.tsx
│   │   │   │   ├── ItemFormModal.tsx    # Category switcher: Jewellery vs Stones dynamic fields
│   │   │   │   ├── PurchaseModal.tsx    # Inward Purchase flow (increments stock)
│   │   │   │   ├── SaleModal.tsx        # Outward Sale flow (validates & decrements stock)
│   │   │   │   └── ShopProfileModal.tsx # Shop branding setup (Logo/Banner upload & URLs)
│   │   │   ├── hr/                    # Admin, HR & Clients (Role comparison & staff roster)
│   │   │   ├── accounting/            # Accounting & Billing placeholder
│   │   │   └── ecommerce/             # Online Shop & E-Commerce storefront placeholder
│   │   ├── services/
│   │   │   └── api.ts                 # Fetch client with auto JWT injection
│   │   ├── types/                     # Shared frontend TypeScript interfaces
│   │   ├── App.tsx                    # React Router configuration
│   │   ├── main.tsx
│   │   └── index.css                  # Tailwind CSS & custom design system
│   ├── .env.example
│   ├── package.json
│   └── vite.config.ts
├── .vscode/
│   ├── launch.json              # 1-click F5 debugging for Backend + Frontend
│   └── tasks.json               # VS Code tasks for DB init and servers
├── package.json                 # Monorepo root scripts
└── README.md
```

---

## 🔑 Demo Accounts & Pre-Configured Credentials

The system seeds multiple pre-configured roles across two sample tenant shops:

### 1. Shop Tenant Users (`/login`):
* **Tenant 1**: `NRXTOO Royal Jewellers & Gemstones` (Jaipur) — *All 4 modules enabled*
* **Tenant 2**: `NRXTOO Artisan Silver Studio` (Mumbai) — *HR & Accounting disabled to test dynamic filtering*

| Role | Email | Password | Scope & Access Rights |
| :--- | :--- | :--- | :--- |
| **👑 Admin** | `admin@nrxtoo.com` | `Admin123!` | Full control over inventory, purchases, sales, shop branding, HR and billing. |
| **⭐ Senior HR** | `senior.hr@nrxtoo.com` | `HrSenior123!` | Staff roster, employee creation, view inventory & sales; no financial config edit. |
| **🔹 Junior HR** | `junior.hr@nrxtoo.com` | `HrJunior123!` | View-only staff directory and inventory access. |
| **👤 Staff** | `staff@nrxtoo.com` | `Staff123!` | Counter sales, invoice billing, inventory viewing; no HR/admin edit rights. |

> **Tip**: The login page (`/login`) includes **1-click Quick Demo Fill buttons** for each role!

### 2. Platform Super Admin (`/platform-admin/login`):
* **URL**: `http://localhost:5173/platform-admin/login`
* **Email**: `superadmin@nrxtoo.com`
* **Password**: `SuperAdmin123!`
* **Isolation**: Operates outside shop tenancy. Manages all shops, creates new tenant accounts, and can toggle any of the 4 modules (`inventory`, `hr`, `accounting`, `ecommerce`) ON or OFF for any shop.

---

## 💎 Features Walkthrough

### 1. Single Login & Google-Style App Launcher Hub
- **Authentication**: JWT token payload carries `userId`, `email`, `shopId`, `role`, `hrLevel`, and granular `permissions`.
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
- **Admin, HR & Clients (`/hr`)**: Test role hierarchy (Admin vs Senior HR vs Junior HR vs Staff) and view live employee roster.
- **Accounting & Billing (`/accounting`)**: General ledger overview, GST collected, and tax vouchers.
- **Online Shop & E-Commerce (`/ecommerce`)**: Public storefront link, catalog sync status, and web orders.

---

## 🛠️ Step-by-Step Setup Guide (Running on Local Machine)

### Prerequisites:
1. **Node.js** (v18, v20, or v22 recommended)
2. **PostgreSQL** installed and running on `localhost:5432`

---

### Step 1: Configure Environment Variables

#### Backend `.env` (`backend/.env`):
Create or verify `backend/.env` (a ready template is provided at `backend/.env.example`):

```env
PORT=5000
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173

# JWT Secret
JWT_SECRET=nrxtoo-super-secret-jwt-key-2026-change-in-production
JWT_EXPIRES_IN=7d

# PostgreSQL Credentials (adjust user/password if your local Postgres differs)
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=nrxtoo_jewellery_db
DB_SSL=false
DB_POOL_MAX=20

UPLOAD_DIR=./uploads
```

#### Frontend `.env` (`frontend/.env`):
Create or verify `frontend/.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

---

### Step 2: Initialize Database and Seed Sample Data

The project includes an automated database initializer (`backend/src/database/init-db.ts`) that:
1. Connects to local PostgreSQL.
2. Creates database `nrxtoo_jewellery_db` if it doesn't already exist.
3. Applies table schemas, constraints, and indexes from `schema.sql`.
4. Hashes passwords using bcrypt and seeds sample shops, users, jewellery items with HUIDs, stone items with GIA certificates, and initial transactions.

Run from backend directory:
```bash
cd backend
npm run db:init
```
*(Or from project root: `npm run db:init`)*

You will see:
```
====================================================
   NRXTOO Jewellery Suite - Database Initializer   
====================================================
[Init DB] Connecting to PostgreSQL at localhost:5432/nrxtoo_jewellery_db...
[Init DB] ✓ Schema created successfully.
[Init DB] Generating secure password hashes and seeding data...
[Init DB] ✓ Sample data seeded successfully:
   - Platform Super Admin: superadmin@nrxtoo.com / SuperAdmin123!
   - Shop Admin:           admin@nrxtoo.com / Admin123!
   - Senior HR:            senior.hr@nrxtoo.com / HrSenior123!
   - Junior HR:            junior.hr@nrxtoo.com / HrJunior123!
   - Staff:                staff@nrxtoo.com / Staff123!
====================================================
```

---

### Step 3: Run the Application in VS Code

You can run both servers simultaneously using either method:

#### Option A: Using Two Terminals in VS Code

**Terminal 1 (Backend API Server):**
```bash
cd backend
npm run dev
```
Backend will start at: **`http://localhost:5000`** (Health check: `http://localhost:5000/api/health`)

**Terminal 2 (Frontend Client):**
```bash
cd frontend
npm run dev
```
Frontend will start at: **`http://localhost:5173`**

#### Option B: Using VS Code 1-Click Debugger (F5)
1. Open this repository folder in VS Code.
2. Press **`F5`** or go to the **Run & Debug** panel (`Ctrl+Shift+D`).
3. Select **"Full Stack: Backend + Frontend"** and press Play.
4. VS Code starts both the Express API and Vite server automatically!

---

## 🌐 Navigating the Application

1. Open your browser and visit: **`http://localhost:5173`**
2. You will be greeted by the **NRXTOO Sign In** page.
3. Click any of the **Demo Role Sign In** buttons (e.g. `👑 Admin`).
4. Click **Sign In to App Launcher**:
   - You land on the **Google-Style App Launcher Hub** (`/launcher`).
   - Notice the persistent **9-dots icon** in the top navigation bar. Clicking it opens the interactive **Bento Grid popover**.
5. Click **Shop & Inventory**:
   - Explore the item catalogue with dynamic tabs: **Jewellery** vs **Stones**.
   - Click **+ New Item** to test dynamic category-specific fields:
     - Selecting **Jewellery** activates metal type, purity (22K Hallmark), gross/net weight, and 6-digit HUID code.
     - Selecting **Stones** activates stone type (Sapphire, Diamond, Emerald), cut, color, clarity, carat weight, origin, and lab cert #.
   - Click **Record Sale** or **Purchase Stock** to test real-time PostgreSQL stock transactions.
6. Click the 9-dots button and navigate to **Platform Super Admin** (`/platform-admin`):
   - Sign in with `superadmin@nrxtoo.com` / `SuperAdmin123!`.
   - Toggle any module (e.g. turn off *Admin, HR & Clients* or *Accounting & Billing* for a shop).
   - Switch back to that shop's launcher: that module will instantly disappear or lock from access!

---

## 🛡️ License & Credits

Developed for **NRXTOO Multi-Tenant Suite** — Hallmark Jewellery & Fine Stones.
All rights reserved.
