-- NRXTOO Multi-Tenant Jewellery & Stones Suite
-- Database Schema for PostgreSQL

-- Enable UUID extension if available
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. Platform Super Admins (Strictly isolated from shop users)
CREATE TABLE IF NOT EXISTS platform_users (
    id VARCHAR(36) PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'PLATFORM_SUPER_ADMIN',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Shops / Multi-Tenant Entities
CREATE TABLE IF NOT EXISTS shops (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    tagline VARCHAR(255),
    logo_url TEXT,
    banner_url TEXT,
    address TEXT,
    phone VARCHAR(50),
    email VARCHAR(255),
    gstin VARCHAR(50),
    currency VARCHAR(10) DEFAULT 'INR',
    currency_symbol VARCHAR(10) DEFAULT '₹',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Enabled Modules per Shop
-- Modules: 'inventory', 'hr', 'accounting', 'ecommerce'
CREATE TABLE IF NOT EXISTS shop_modules (
    id VARCHAR(36) PRIMARY KEY,
    shop_id VARCHAR(36) NOT NULL REFERENCES shops(id) ON DELETE CASCADE,
    module_key VARCHAR(50) NOT NULL,
    module_name VARCHAR(100) NOT NULL,
    description TEXT,
    icon_name VARCHAR(50),
    is_enabled BOOLEAN DEFAULT TRUE,
    config JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_shop_module UNIQUE(shop_id, module_key)
);

-- 4. Shop Users with Hierarchical Roles:
-- Roles: 'ADMIN', 'SENIOR_HR', 'JUNIOR_HR', 'STAFF'
-- hr_level: 'DIRECTOR', 'SENIOR', 'JUNIOR', 'NONE'
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(36) PRIMARY KEY,
    shop_id VARCHAR(36) NOT NULL REFERENCES shops(id) ON DELETE CASCADE,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL,
    hr_level VARCHAR(50) DEFAULT 'STANDARD',
    permissions TEXT[] DEFAULT '{}',
    is_active BOOLEAN DEFAULT TRUE,
    phone VARCHAR(50),
    designation VARCHAR(100),
    last_login TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_shop_user_email UNIQUE(shop_id, email)
);

-- 5. Inventory Items (Jewellery & Stones)
CREATE TABLE IF NOT EXISTS inventory_items (
    id VARCHAR(36) PRIMARY KEY,
    shop_id VARCHAR(36) NOT NULL REFERENCES shops(id) ON DELETE CASCADE,
    sku VARCHAR(100) NOT NULL,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(50) NOT NULL, -- 'Jewellery' OR 'Stones'
    description TEXT,
    image_url TEXT,
    cost_price NUMERIC(14, 2) DEFAULT 0.00,
    selling_price NUMERIC(14, 2) NOT NULL DEFAULT 0.00,
    current_stock NUMERIC(10, 3) NOT NULL DEFAULT 0.000,
    minimum_stock NUMERIC(10, 3) DEFAULT 1.000,
    unit VARCHAR(20) DEFAULT 'pcs',
    status VARCHAR(50) DEFAULT 'IN_STOCK', -- 'IN_STOCK', 'LOW_STOCK', 'OUT_OF_STOCK'
    
    -- Dynamic Fields: Jewellery
    metal_type VARCHAR(100),       -- Gold, Silver, Platinum, Rose Gold
    purity VARCHAR(50),           -- 24K, 22K, 18K, 14K, 925, 950
    gross_weight NUMERIC(10, 3),   -- Grams
    net_weight NUMERIC(10, 3),     -- Grams
    stone_weight NUMERIC(10, 3),   -- Grams or Carats
    making_charges NUMERIC(12, 2), -- Flat fee or per gram
    huid_hallmark VARCHAR(100),    -- 6-character unique HUID alphanumeric code
    
    -- Dynamic Fields: Stones
    stone_type VARCHAR(100),       -- Diamond, Ruby, Blue Sapphire, Emerald, etc.
    shape_cut VARCHAR(100),        -- Round Brilliant, Princess, Cushion, Oval, etc.
    color VARCHAR(50),            -- D, E, F, G, H, or Fancy colors
    clarity VARCHAR(50),          -- FL, IF, VVS1, VVS2, VS1, VS2, SI1
    carat_weight NUMERIC(8, 3),    -- Weight in carats
    treatment_origin VARCHAR(255), -- Natural Unheated (Ceylon/Burma) or Lab Grown
    lab_certificate_no VARCHAR(100), -- GIA, IGI, SGL certificate number
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_shop_sku UNIQUE(shop_id, sku)
);

-- 6. Stock Purchases, Sales & Movements
CREATE TABLE IF NOT EXISTS stock_transactions (
    id VARCHAR(36) PRIMARY KEY,
    shop_id VARCHAR(36) NOT NULL REFERENCES shops(id) ON DELETE CASCADE,
    item_id VARCHAR(36) NOT NULL REFERENCES inventory_items(id) ON DELETE CASCADE,
    transaction_type VARCHAR(20) NOT NULL, -- 'PURCHASE', 'SALE', 'ADJUSTMENT'
    quantity NUMERIC(10, 3) NOT NULL,
    unit_price NUMERIC(14, 2) NOT NULL,
    total_amount NUMERIC(14, 2) NOT NULL,
    party_name VARCHAR(255),               -- Supplier name or Customer name
    party_contact VARCHAR(100),            -- Phone number or email
    invoice_no VARCHAR(100),               -- Invoice/Voucher reference
    payment_method VARCHAR(50) DEFAULT 'CASH', -- Cash, Card, Bank Transfer, UPI
    notes TEXT,
    performed_by VARCHAR(36) REFERENCES users(id),
    transaction_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for optimal performance
CREATE INDEX IF NOT EXISTS idx_users_shop_id ON users(shop_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_inventory_shop_id ON inventory_items(shop_id);
CREATE INDEX IF NOT EXISTS idx_inventory_category ON inventory_items(category);
CREATE INDEX IF NOT EXISTS idx_inventory_status ON inventory_items(status);
CREATE INDEX IF NOT EXISTS idx_transactions_shop_id ON stock_transactions(shop_id);
CREATE INDEX IF NOT EXISTS idx_transactions_item_id ON stock_transactions(item_id);
CREATE INDEX IF NOT EXISTS idx_transactions_type ON stock_transactions(transaction_type);
