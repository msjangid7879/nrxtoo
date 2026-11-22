-- NRXTOO Multi-Tenant Jewellery & Stones Suite
-- Seed Data SQL Script

-- Password hashes for all seed users will be initialized via init-db.js using bcrypt
-- For reference:
-- superadmin: SuperAdmin123!
-- admin_royal: Admin123!
-- senior_hr: HrSenior123!
-- junior_hr: HrJunior123!
-- staff_kavita: Staff123!

-- 1. Insert Platform Super Admin
INSERT INTO platform_users (id, user_id, email, password_hash, full_name, role)
VALUES (
    'plat-user-superadmin-01',
    'superadmin',
    'superadmin@nrxtoo.com',
    '$2a$10$w9fR53Q2x5eJpD/K4nJ.eOzXzYh3W2g.4jG0N6l6Y4qZ0u1uJqJ6G',
    'NRXTOO Platform Super Admin',
    'PLATFORM_SUPER_ADMIN'
)
ON CONFLICT (user_id) DO UPDATE 
SET full_name = EXCLUDED.full_name;

-- 2. Insert Sample Primary Shop
INSERT INTO shops (
    id, name, slug, tagline, logo_url, banner_url, address, phone, email, gstin, currency, currency_symbol, is_active
) VALUES (
    'shop-nrxtoo-royal-01',
    'NRXTOO Royal Jewellers & Gemstones',
    'nrxtoo-royal',
    'Finest Certified Hallmark Jewellery & Rare Unheated Gemstones',
    'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=160&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=1200&auto=format&fit=crop&q=80',
    'Suite 401, Gold Souk Heritage Plaza, MG Road, Jaipur, Rajasthan 302001',
    '+91 98290 12345',
    'contact@royaljewellers.nrxtoo.com',
    '08AABCN1234F1Z5',
    'INR',
    '₹',
    TRUE
)
ON CONFLICT (slug) DO UPDATE 
SET name = EXCLUDED.name, tagline = EXCLUDED.tagline, logo_url = EXCLUDED.logo_url, banner_url = EXCLUDED.banner_url;

-- Secondary Shop to showcase multi-tenancy
INSERT INTO shops (
    id, name, slug, tagline, logo_url, banner_url, address, phone, email, gstin, currency, currency_symbol, is_active
) VALUES (
    'shop-nrxtoo-artisan-02',
    'NRXTOO Artisan Silver & Diamond Studio',
    'nrxtoo-artisan',
    'Contemporary Handcrafted Sterling Silver & Everyday Diamonds',
    'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=160&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=1200&auto=format&fit=crop&q=80',
    'Ground Floor, Linking Road, Bandra West, Mumbai 400050',
    '+91 98200 98765',
    'studio@artisan.nrxtoo.com',
    '27AABCS5678K1Z2',
    'INR',
    '₹',
    TRUE
)
ON CONFLICT (slug) DO NOTHING;

-- 3. Enabled Modules for Shop 1 (All 4 modules enabled)
INSERT INTO shop_modules (id, shop_id, module_key, module_name, description, icon_name, is_enabled)
VALUES
    ('mod-royal-inv-01', 'shop-nrxtoo-royal-01', 'inventory', 'Shop & Inventory', 'Jewellery, Gems, Hallmark HUID, Purchases & Sales Billing', 'Gem', TRUE),
    ('mod-royal-hr-02', 'shop-nrxtoo-royal-01', 'hr', 'Admin, HR & Clients', 'Staff Roster, Hierarchical Roles & Client CRM', 'Users', TRUE),
    ('mod-royal-acc-03', 'shop-nrxtoo-royal-01', 'accounting', 'Accounting & Billing', 'General Ledger, GST Tax Invoices & Cashbooks', 'Receipt', TRUE),
    ('mod-royal-eco-04', 'shop-nrxtoo-royal-01', 'ecommerce', 'Online Shop & E-Commerce', 'Online Storefront, Catalog Sync & Web Orders', 'ShoppingBag', TRUE)
ON CONFLICT (shop_id, module_key) DO UPDATE
SET is_enabled = EXCLUDED.is_enabled;

-- Enabled Modules for Shop 2 (HR & Accounting disabled to test dynamic filtering!)
INSERT INTO shop_modules (id, shop_id, module_key, module_name, description, icon_name, is_enabled)
VALUES
    ('mod-art-inv-01', 'shop-nrxtoo-artisan-02', 'inventory', 'Shop & Inventory', 'Jewellery, Gems, Purchases & Sales Billing', 'Gem', TRUE),
    ('mod-art-hr-02', 'shop-nrxtoo-artisan-02', 'hr', 'Admin, HR & Clients', 'Staff Roster & Permissions', 'Users', FALSE),
    ('mod-art-acc-03', 'shop-nrxtoo-artisan-02', 'accounting', 'Accounting & Billing', 'Invoices & Ledger', 'Receipt', FALSE),
    ('mod-art-eco-04', 'shop-nrxtoo-artisan-02', 'ecommerce', 'Online Shop & E-Commerce', 'Online Storefront', 'ShoppingBag', TRUE)
ON CONFLICT (shop_id, module_key) DO UPDATE
SET is_enabled = EXCLUDED.is_enabled;

-- 4. Sample Shop Users with Hierarchical Roles & Unique User IDs
-- Password for all is initialized by init-db.js:
-- admin_royal: Admin123!
-- senior_hr: HrSenior123!
-- junior_hr: HrJunior123!
-- staff_kavita: Staff123!

INSERT INTO users (id, shop_id, user_id, full_name, email, password_hash, role, hr_level, permissions, is_active, designation)
VALUES
(
    'usr-admin-01',
    'shop-nrxtoo-royal-01',
    'admin_royal',
    'Rajesh Verma',
    'rajesh.admin@nrxtoo.com',
    '$2a$10$7q5QeS2M5GjQ/0oQ/a8G4.5WbI57pP5k7A7oE5.QWqHqW5hM8rN8O',
    'ADMIN',
    'DIRECTOR',
    ARRAY['inventory:view', 'inventory:create', 'inventory:edit', 'inventory:delete', 'inventory:purchase', 'inventory:sale', 'shop:manage', 'hr:view', 'hr:manage', 'accounting:view', 'ecommerce:view'],
    TRUE,
    'Shop Owner & Managing Director'
),
(
    'usr-seniorhr-02',
    'shop-nrxtoo-royal-01',
    'senior_hr',
    'Sunita Mehra',
    'sunita.hr@nrxtoo.com',
    '$2a$10$7q5QeS2M5GjQ/0oQ/a8G4.5WbI57pP5k7A7oE5.QWqHqW5hM8rN8O',
    'SENIOR_HR',
    'SENIOR',
    ARRAY['inventory:view', 'hr:view', 'hr:manage'],
    TRUE,
    'Head of People & HR Operations'
),
(
    'usr-juniorhr-03',
    'shop-nrxtoo-royal-01',
    'junior_hr',
    'Amitabh Saxena',
    'amitabh.hr@nrxtoo.com',
    '$2a$10$7q5QeS2M5GjQ/0oQ/a8G4.5WbI57pP5k7A7oE5.QWqHqW5hM8rN8O',
    'JUNIOR_HR',
    'JUNIOR',
    ARRAY['inventory:view', 'hr:view'],
    TRUE,
    'HR Assistant & Onboarding Associate'
),
(
    'usr-staff-04',
    'shop-nrxtoo-royal-01',
    'staff_kavita',
    'Kavita Singhania',
    'kavita.singhania@nrxtoo.com',
    '$2a$10$7q5QeS2M5GjQ/0oQ/a8G4.5WbI57pP5k7A7oE5.QWqHqW5hM8rN8O',
    'STAFF',
    'NONE',
    ARRAY['inventory:view', 'inventory:sale'],
    TRUE,
    'Senior Jewellery Consultant & Billing Executive'
)
ON CONFLICT (user_id) DO UPDATE
SET full_name = EXCLUDED.full_name, role = EXCLUDED.role, hr_level = EXCLUDED.hr_level, permissions = EXCLUDED.permissions;

-- 5. Sample Inventory Items (Jewellery & Stones)
INSERT INTO inventory_items (
    id, shop_id, sku, name, category, description, image_url, cost_price, selling_price, current_stock, minimum_stock, unit, status,
    metal_type, purity, gross_weight, net_weight, stone_weight, making_charges, huid_hallmark,
    stone_type, shape_cut, color, clarity, carat_weight, treatment_origin, lab_certificate_no
) VALUES
-- Jewellery Item 1: Kundan Bridal Choker
(
    'item-jwl-001',
    'shop-nrxtoo-royal-01',
    'JWL-GLD-001',
    '22K Royal Bridal Kundan Choker Necklace',
    'Jewellery',
    'Exquisite handcrafted 22 Karat yellow gold kundan choker with uncut polki and meenakari back-work.',
    'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&auto=format&fit=crop&q=80',
    345000.00,
    425000.00,
    3.000,
    1.000,
    'pcs',
    'IN_STOCK',
    'Gold',
    '22K (916)',
    68.450,
    54.120,
    14.330,
    28500.00,
    'HA7912',
    NULL, NULL, NULL, NULL, NULL, NULL, NULL
),
-- Jewellery Item 2: Diamond Solitaire Ring
(
    'item-jwl-002',
    'shop-nrxtoo-royal-01',
    'JWL-DIA-002',
    '18K Rose Gold Solitaire Diamond Ring with Micro-Pave Halo',
    'Jewellery',
    'Contemporary engagement ring in 18 Karat rose gold featuring brilliant central stone and halo micro-pave diamonds.',
    'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600&auto=format&fit=crop&q=80',
    78000.00,
    105000.00,
    5.000,
    2.000,
    'pcs',
    'IN_STOCK',
    'Rose Gold',
    '18K (750)',
    4.820,
    4.510,
    0.310,
    7500.00,
    'RB9021',
    NULL, NULL, NULL, NULL, NULL, NULL, NULL
),
-- Jewellery Item 3: Sterling Silver Kada
(
    'item-jwl-003',
    'shop-nrxtoo-royal-01',
    'JWL-SLV-003',
    '925 Sterling Silver Antique Carved Temple Kada',
    'Jewellery',
    'Heavy oxidised 925 sterling silver kada with intricate nakshi floral carving and double screw clasp.',
    'https://images.unsplash.com/photo-1611591475874-5c916d1f9ec6?w=600&auto=format&fit=crop&q=80',
    6200.00,
    9500.00,
    1.000,
    2.000,
    'pcs',
    'LOW_STOCK',
    'Silver',
    '925 Sterling',
    42.100,
    42.100,
    0.000,
    1800.00,
    'SL4419',
    NULL, NULL, NULL, NULL, NULL, NULL, NULL
),
-- Jewellery Item 4: Platinum Couple Bands
(
    'item-jwl-004',
    'shop-nrxtoo-royal-01',
    'JWL-PLT-004',
    '950 Pure Platinum Forever Love Couple Bands',
    'Jewellery',
    'Matte brushed comfort-fit platinum wedding bands stamped with PT950 purity guarantee.',
    'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600&auto=format&fit=crop&q=80',
    82000.00,
    115000.00,
    0.000,
    1.000,
    'pcs',
    'OUT_OF_STOCK',
    'Platinum',
    '950 Platinum',
    11.200,
    11.200,
    0.000,
    9000.00,
    'PT8831',
    NULL, NULL, NULL, NULL, NULL, NULL, NULL
),
-- Stones Item 1: Royal Blue Sapphire (Neelam)
(
    'item-stn-001',
    'shop-nrxtoo-royal-01',
    'STN-SAP-001',
    'Natural Ceylon Royal Blue Sapphire (Certified Neelam)',
    'Stones',
    'Rare unheated transparent natural blue sapphire from Ratnapura Ceylon. Superb velvety royal blue saturation with high luster.',
    'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=600&auto=format&fit=crop&q=80',
    160000.00,
    230000.00,
    4.000,
    1.000,
    'pcs',
    'IN_STOCK',
    NULL, NULL, NULL, NULL, NULL, NULL, NULL,
    'Blue Sapphire',
    'Oval Brilliant / Step Cut',
    'Royal Blue (Vivid)',
    'VVS1 (Eye Clean)',
    4.250,
    'Natural Unheated - Ceylon (Sri Lanka)',
    'GIA-2218491023'
),
-- Stones Item 2: Round Brilliant Diamond
(
    'item-stn-002',
    'shop-nrxtoo-royal-01',
    'STN-DIA-002',
    'GIA Certified Triple Excellent Round Brilliant Loose Diamond',
    'Stones',
    'Top gem collection natural diamond with Triple Excellent grade (Cut, Polish, Symmetry) and zero fluorescence.',
    'https://images.unsplash.com/photo-1600003014755-ba31aa59c4b6?w=600&auto=format&fit=crop&q=80',
    490000.00,
    620000.00,
    2.000,
    1.000,
    'pcs',
    'IN_STOCK',
    NULL, NULL, NULL, NULL, NULL, NULL, NULL,
    'Diamond',
    'Round Brilliant (3EX)',
    'D (Colorless)',
    'VVS2',
    1.520,
    'Natural Untreated - South Africa',
    'GIA-6451928371'
),
-- Stones Item 3: Zambian Emerald (Panna)
(
    'item-stn-003',
    'shop-nrxtoo-royal-01',
    'STN-EMR-003',
    'Zambian Muzo Green Octagonal Emerald (Panna)',
    'Stones',
    'Lush deep verdant green emerald with exceptional crystalline glow and minimal traditional cedarwood oil treatment.',
    'https://images.unsplash.com/photo-1551727974-880518030770?w=600&auto=format&fit=crop&q=80',
    125000.00,
    180000.00,
    3.000,
    1.000,
    'pcs',
    'IN_STOCK',
    NULL, NULL, NULL, NULL, NULL, NULL, NULL,
    'Emerald',
    'Octagonal Emerald Cut',
    'Deep Muzo Green',
    'VS1 (Minor Jardin)',
    3.100,
    'Natural Minor Oil - Kagem Mine, Zambia',
    'IGI-592817290'
),
-- Stones Item 4: Burmese Pigeon Blood Ruby
(
    'item-stn-004',
    'shop-nrxtoo-royal-01',
    'STN-RUB-004',
    'Natural Burmese Pigeon Blood Red Ruby (Manik)',
    'Stones',
    'Collector grade Mogok pigeon blood natural ruby displaying strong red fluorescence under daylight.',
    'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=600&auto=format&fit=crop&q=80',
    210000.00,
    310000.00,
    1.000,
    1.000,
    'pcs',
    'LOW_STOCK',
    NULL, NULL, NULL, NULL, NULL, NULL, NULL,
    'Ruby',
    'Cushion Mixed Cut',
    'Pigeon Blood Red',
    'VVS2',
    2.750,
    'Natural Unheated - Mogok, Burma',
    'GRS-2024-0981'
)
ON CONFLICT (shop_id, sku) DO NOTHING;

-- 6. Sample Initial Transactions
INSERT INTO stock_transactions (
    id, shop_id, item_id, transaction_type, quantity, unit_price, total_amount, party_name, party_contact, invoice_no, payment_method, notes, performed_by
) VALUES
(
    'txn-pur-001',
    'shop-nrxtoo-royal-01',
    'item-jwl-001',
    'PURCHASE',
    4.000,
    345000.00,
    1380000.00,
    'Jaipur Heritage Gold Bullion & Crafts',
    '+91 94140 11223',
    'PUR-2026-081',
    'Bank Transfer',
    'Procured hallmarked 22K kundan choker stock',
    'usr-admin-01'
),
(
    'txn-sale-002',
    'shop-nrxtoo-royal-01',
    'item-jwl-001',
    'SALE',
    1.000,
    425000.00,
    425000.00,
    'Mrs. Ananya Rathore',
    '+91 99887 76655',
    'INV-2026-1042',
    'UPI',
    'Wedding bridal collection purchase with BIS hallmark certificate',
    'usr-staff-04'
),
(
    'txn-pur-003',
    'shop-nrxtoo-royal-01',
    'item-stn-001',
    'PURCHASE',
    5.000,
    160000.00,
    800000.00,
    'Ceylon Gem Exporters Ltd, Colombo',
    '+94 77 123 4567',
    'IMP-CEY-994',
    'Bank Transfer',
    'Imported natural unheated Ceylon sapphires with GIA certificates',
    'usr-admin-01'
),
(
    'txn-sale-004',
    'shop-nrxtoo-royal-01',
    'item-stn-001',
    'SALE',
    1.000,
    230000.00,
    230000.00,
    'Vikramaditya Roy',
    '+91 98111 22334',
    'INV-2026-1049',
    'Card',
    'Astrological grade natural blue sapphire set in ring mount',
    'usr-staff-04'
)
ON CONFLICT (id) DO NOTHING;
