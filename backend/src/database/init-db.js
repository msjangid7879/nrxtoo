import fs from 'fs';
import path from 'path';
import pg from 'pg';
import bcrypt from 'bcryptjs';
import { fileURLToPath } from 'url';
import { config } from '../config/index.js';

const { Client } = pg;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function ensureDatabaseExists() {
  const { database, ...adminConfig } = config.database;
  const adminClient = new Client({
    ...adminConfig,
    database: 'postgres',
  });

  try {
    await adminClient.connect();
    const checkDb = await adminClient.query(
      `SELECT 1 FROM pg_database WHERE datname = $1`,
      [database]
    );

    if (checkDb.rowCount === 0) {
      console.log(`[Init DB] Database "${database}" does not exist. Creating...`);
      await adminClient.query(`CREATE DATABASE "${database}"`);
      console.log(`[Init DB] Database "${database}" created successfully!`);
    } else {
      console.log(`[Init DB] Database "${database}" already exists.`);
    }
  } catch (err) {
    console.warn(`[Init DB] Note on database creation: ${err.message}`);
  } finally {
    try {
      await adminClient.end();
    } catch {}
  }
}

async function runInit() {
  console.log('====================================================');
  console.log('   NRXTOO Jewellery Suite - Database Initializer   ');
  console.log('====================================================');

  await ensureDatabaseExists();

  const client = new Client(config.database);

  try {
    console.log(`[Init DB] Connecting to PostgreSQL at ${config.database.host}:${config.database.port}/${config.database.database}...`);
    await client.connect();
    console.log('[Init DB] Connection established.');

    // 1. Run Schema
    const schemaPath = path.join(__dirname, 'schema.sql');
    if (fs.existsSync(schemaPath)) {
      console.log('[Init DB] Applying schema.sql...');
      const schemaSql = fs.readFileSync(schemaPath, 'utf-8');
      await client.query(schemaSql);
      console.log('[Init DB] ✓ Schema created successfully.');
    } else {
      console.error('[Init DB] schema.sql not found at:', schemaPath);
    }

    // 2. Hash passwords & seed data
    console.log('[Init DB] Generating secure password hashes and seeding data...');

    const salt = await bcrypt.genSalt(10);
    const superAdminHash = await bcrypt.hash('SuperAdmin123!', salt);
    const adminHash = await bcrypt.hash('Admin123!', salt);
    const seniorHrHash = await bcrypt.hash('HrSenior123!', salt);
    const juniorHrHash = await bcrypt.hash('HrJunior123!', salt);
    const staffHash = await bcrypt.hash('Staff123!', salt);

    // Seed Platform Super Admin
    await client.query(
      `INSERT INTO platform_users (id, user_id, email, password_hash, full_name, role)
       VALUES ($1, $2, $3, $4, $5, $6)
       ON CONFLICT (user_id) DO UPDATE 
       SET password_hash = EXCLUDED.password_hash, full_name = EXCLUDED.full_name`,
      ['plat-user-superadmin-01', 'superadmin', 'superadmin@nrxtoo.com', superAdminHash, 'NRXTOO Platform Super Admin', 'PLATFORM_SUPER_ADMIN']
    );

    // Seed Primary Shop
    await client.query(
      `INSERT INTO shops (id, name, slug, tagline, logo_url, banner_url, address, phone, email, gstin, currency, currency_symbol, is_active)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
       ON CONFLICT (slug) DO UPDATE 
       SET name = EXCLUDED.name, tagline = EXCLUDED.tagline, logo_url = EXCLUDED.logo_url, banner_url = EXCLUDED.banner_url`,
      [
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
        true
      ]
    );

    // Seed Secondary Shop (demonstrating multi-tenancy & disabled modules)
    await client.query(
      `INSERT INTO shops (id, name, slug, tagline, logo_url, banner_url, address, phone, email, gstin, currency, currency_symbol, is_active)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
       ON CONFLICT (slug) DO NOTHING`,
      [
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
        true
      ]
    );

    // Seed Modules for Shop 1 (All 4 enabled)
    const modulesShop1 = [
      ['mod-royal-inv-01', 'shop-nrxtoo-royal-01', 'inventory', 'Shop & Inventory', 'Jewellery, Gems, Hallmark HUID, Purchases & Sales Billing', 'Gem', true],
      ['mod-royal-hr-02', 'shop-nrxtoo-royal-01', 'hr', 'Admin, HR & Clients', 'Staff Roster, Hierarchical Roles & Client CRM', 'Users', true],
      ['mod-royal-acc-03', 'shop-nrxtoo-royal-01', 'accounting', 'Accounting & Billing', 'General Ledger, GST Tax Invoices & Cashbooks', 'Receipt', true],
      ['mod-royal-eco-04', 'shop-nrxtoo-royal-01', 'ecommerce', 'Online Shop & E-Commerce', 'Online Storefront, Catalog Sync & Web Orders', 'ShoppingBag', true],
    ];

    for (const m of modulesShop1) {
      await client.query(
        `INSERT INTO shop_modules (id, shop_id, module_key, module_name, description, icon_name, is_enabled)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         ON CONFLICT (shop_id, module_key) DO UPDATE SET is_enabled = EXCLUDED.is_enabled`,
        m
      );
    }

    // Seed Modules for Shop 2 (HR & Accounting disabled)
    const modulesShop2 = [
      ['mod-art-inv-01', 'shop-nrxtoo-artisan-02', 'inventory', 'Shop & Inventory', 'Jewellery, Gems, Purchases & Sales Billing', 'Gem', true],
      ['mod-art-hr-02', 'shop-nrxtoo-artisan-02', 'hr', 'Admin, HR & Clients', 'Staff Roster & Permissions', 'Users', false],
      ['mod-art-acc-03', 'shop-nrxtoo-artisan-02', 'accounting', 'Accounting & Billing', 'Invoices & Ledger', 'Receipt', false],
      ['mod-art-eco-04', 'shop-nrxtoo-artisan-02', 'ecommerce', 'Online Shop & E-Commerce', 'Online Storefront', 'ShoppingBag', true],
    ];

    for (const m of modulesShop2) {
      await client.query(
        `INSERT INTO shop_modules (id, shop_id, module_key, module_name, description, icon_name, is_enabled)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         ON CONFLICT (shop_id, module_key) DO UPDATE SET is_enabled = EXCLUDED.is_enabled`,
        m
      );
    }

    // Seed Hierarchical Users with User IDs
    const users = [
      [
        'usr-admin-01',
        'shop-nrxtoo-royal-01',
        'admin_royal',
        'Rajesh Verma',
        'rajesh.admin@nrxtoo.com',
        adminHash,
        'ADMIN',
        'DIRECTOR',
        ['inventory:view', 'inventory:create', 'inventory:edit', 'inventory:delete', 'inventory:purchase', 'inventory:sale', 'shop:manage', 'hr:view', 'hr:manage', 'accounting:view', 'ecommerce:view'],
        'Shop Owner & Managing Director',
      ],
      [
        'usr-seniorhr-02',
        'shop-nrxtoo-royal-01',
        'senior_hr',
        'Sunita Mehra',
        'sunita.hr@nrxtoo.com',
        seniorHrHash,
        'SENIOR_HR',
        'SENIOR',
        ['inventory:view', 'hr:view', 'hr:manage'],
        'Head of People & HR Operations',
      ],
      [
        'usr-juniorhr-03',
        'shop-nrxtoo-royal-01',
        'junior_hr',
        'Amitabh Saxena',
        'amitabh.hr@nrxtoo.com',
        juniorHrHash,
        'JUNIOR_HR',
        'JUNIOR',
        ['inventory:view', 'hr:view'],
        'HR Assistant & Onboarding Associate',
      ],
      [
        'usr-staff-04',
        'shop-nrxtoo-royal-01',
        'staff_kavita',
        'Kavita Singhania',
        'kavita.singhania@nrxtoo.com',
        staffHash,
        'STAFF',
        'NONE',
        ['inventory:view', 'inventory:sale'],
        'Senior Jewellery Consultant & Billing Executive',
      ],
    ];

    for (const u of users) {
      await client.query(
        `INSERT INTO users (id, shop_id, user_id, full_name, email, password_hash, role, hr_level, permissions, is_active, designation)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, TRUE, $10)
         ON CONFLICT (user_id) DO UPDATE
         SET password_hash = EXCLUDED.password_hash, full_name = EXCLUDED.full_name, role = EXCLUDED.role, hr_level = EXCLUDED.hr_level, permissions = EXCLUDED.permissions`,
        u
      );
    }

    // Execute rest of sample inventory & transactions from seed.sql
    const seedPath = path.join(__dirname, 'seed.sql');
    if (fs.existsSync(seedPath)) {
      const seedSql = fs.readFileSync(seedPath, 'utf-8');
      await client.query(seedSql);
    }

    console.log('[Init DB] ✓ Sample data seeded successfully:');
    console.log('   - Platform Super Admin : User ID: superadmin   | Password: SuperAdmin123!');
    console.log('   - Shop Owner / Admin   : User ID: admin_royal  | Password: Admin123!');
    console.log('   - Senior HR            : User ID: senior_hr    | Password: HrSenior123!');
    console.log('   - Junior HR            : User ID: junior_hr    | Password: HrJunior123!');
    console.log('   - Staff                : User ID: staff_kavita | Password: Staff123!');
    console.log('   - Dynamic Jewellery (HUID hallmarks) & Stones (GIA certs) items seeded.');
    console.log('   - Purchases and Sales sample transactions recorded.');
    console.log('====================================================');
    console.log('   Database Setup Completed Successfully!          ');
    console.log('====================================================');
  } catch (err) {
    console.error('[Init DB Error]:', err.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

runInit();
