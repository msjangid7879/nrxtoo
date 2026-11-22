import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { query } from '../../database/db.js';
import { config } from '../../config/index.js';

export const platformLogin = async (req, res) => {
  try {
    const { user_id, password } = req.body;

    if (!user_id || !password) {
      return res.status(400).json({ success: false, message: 'Platform Super Admin User ID and password are required.' });
    }

    const cleanUserId = String(user_id).trim().toLowerCase();

    const result = await query(
      `SELECT * FROM platform_users WHERE LOWER(user_id) = LOWER($1) OR LOWER(email) = LOWER($1)`,
      [cleanUserId]
    );

    if (result.rowCount === 0) {
      return res.status(401).json({
        success: false,
        message: `Invalid credentials. No Platform Super Admin account with User ID '${cleanUserId}'.`,
      });
    }

    const admin = result.rows[0];
    const passwordMatch = await bcrypt.compare(password, admin.password_hash);

    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid platform super admin password.',
      });
    }

    const payload = {
      userId: admin.id,
      user_id: admin.user_id,
      email: admin.email,
      shopId: 'PLATFORM_GLOBAL',
      role: 'PLATFORM_SUPER_ADMIN',
      hrLevel: 'DIRECTOR',
      permissions: ['*'],
      isPlatformAdmin: true,
    };

    const token = jwt.sign(payload, config.jwtSecret, {
      expiresIn: config.jwtExpiresIn,
    });

    res.json({
      success: true,
      message: 'Platform Super Admin authenticated.',
      token,
      platform_user: {
        id: admin.id,
        user_id: admin.user_id,
        email: admin.email,
        full_name: admin.full_name,
        role: admin.role,
      },
    });
  } catch (err) {
    console.error('[Platform Login Error]:', err);
    res.status(500).json({ success: false, message: 'Internal server error', error: err.message });
  }
};

export const getPlatformMe = async (req, res) => {
  try {
    if (!req.user || !req.user.isPlatformAdmin) {
      return res.status(403).json({ success: false, message: 'Access denied.' });
    }

    const result = await query(
      `SELECT id, user_id, email, full_name, role FROM platform_users WHERE id = $1`,
      [req.user.userId]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ success: false, message: 'Platform user not found.' });
    }

    res.json({ success: true, platform_user: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

export const getShops = async (_req, res) => {
  try {
    const shopsResult = await query(
      `SELECT s.*, 
        COUNT(DISTINCT u.id) as user_count,
        COUNT(DISTINCT i.id) as item_count,
        COALESCE(
          json_agg(DISTINCT jsonb_build_object(
            'module_key', sm.module_key,
            'module_name', sm.module_name,
            'is_enabled', sm.is_enabled
          )) FILTER (WHERE sm.module_key IS NOT NULL),
          '[]'
        ) as modules
       FROM shops s
       LEFT JOIN users u ON u.shop_id = s.id
       LEFT JOIN inventory_items i ON i.shop_id = s.id
       LEFT JOIN shop_modules sm ON sm.shop_id = s.id
       GROUP BY s.id
       ORDER BY s.created_at DESC`
    );

    res.json({ success: true, shops: shopsResult.rows });
  } catch (err) {
    console.error('[Platform getShops Error]:', err);
    res.status(500).json({ success: false, message: 'Failed to retrieve shops', error: err.message });
  }
};

export const createShop = async (req, res) => {
  try {
    const { name, slug, tagline, logo_url, banner_url, address, phone, email, gstin, currency, currency_symbol, initial_admin } = req.body;

    if (!name || !slug) {
      return res.status(400).json({ success: false, message: 'Shop name and slug are required.' });
    }

    const shopId = `shop-${Date.now()}`;

    await query(
      `INSERT INTO shops (id, name, slug, tagline, logo_url, banner_url, address, phone, email, gstin, currency, currency_symbol, is_active)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, TRUE)`,
      [shopId, name, slug.toLowerCase().trim(), tagline || '', logo_url || '', banner_url || '', address || '', phone || '', email || '', gstin || '', currency || 'INR', currency_symbol || '₹']
    );

    const defaultModules = [
      ['inventory', 'Shop & Inventory', 'Jewellery, Gems, Purchases & Sales Billing', 'Gem', true],
      ['hr', 'Admin, HR & Clients', 'Staff Roster & Permissions', 'Users', true],
      ['accounting', 'Accounting & Billing', 'Invoices & General Ledger', 'Receipt', true],
      ['ecommerce', 'Online Shop & E-Commerce', 'Online Storefront & Orders', 'ShoppingBag', true],
    ];

    for (const [key, modName, desc, icon, enabled] of defaultModules) {
      await query(
        `INSERT INTO shop_modules (id, shop_id, module_key, module_name, description, icon_name, is_enabled)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [`mod-${shopId}-${key}`, shopId, key, modName, desc, icon, enabled]
      );
    }

    if (initial_admin && initial_admin.user_id && initial_admin.password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(initial_admin.password, salt);
      const userId = `usr-admin-${Date.now()}`;

      await query(
        `INSERT INTO users (id, shop_id, user_id, full_name, email, password_hash, role, hr_level, permissions, is_active, designation)
         VALUES ($1, $2, $3, $4, $5, $6, 'ADMIN', 'DIRECTOR', $7, TRUE, 'Managing Director')`,
        [
          userId,
          shopId,
          String(initial_admin.user_id).trim().toLowerCase(),
          initial_admin.full_name || `${name} Admin`,
          initial_admin.email || '',
          hashedPassword,
          ['inventory:view', 'inventory:create', 'inventory:edit', 'inventory:delete', 'inventory:purchase', 'inventory:sale', 'shop:manage', 'hr:view', 'hr:manage', 'accounting:view', 'ecommerce:view'],
        ]
      );
    }

    const createdShop = await query(`SELECT * FROM shops WHERE id = $1`, [shopId]);

    res.status(201).json({
      success: true,
      message: 'New shop created successfully.',
      shop: createdShop.rows[0],
    });
  } catch (err) {
    console.error('[createShop Error]:', err);
    res.status(500).json({ success: false, message: 'Failed to create shop.', error: err.message });
  }
};

export const toggleModule = async (req, res) => {
  try {
    const { shopId } = req.params;
    const { module_key, is_enabled } = req.body;

    if (!module_key || typeof is_enabled !== 'boolean') {
      return res.status(400).json({ success: false, message: 'module_key and boolean is_enabled are required.' });
    }

    const checkMod = await query(
      `SELECT * FROM shop_modules WHERE shop_id = $1 AND module_key = $2`,
      [shopId, module_key]
    );

    if (checkMod.rowCount === 0) {
      const modNames = {
        inventory: 'Shop & Inventory',
        hr: 'Admin, HR & Clients',
        accounting: 'Accounting & Billing',
        ecommerce: 'Online Shop & E-Commerce',
      };
      await query(
        `INSERT INTO shop_modules (id, shop_id, module_key, module_name, is_enabled)
         VALUES ($1, $2, $3, $4, $5)`,
        [`mod-${shopId}-${module_key}`, shopId, module_key, modNames[module_key] || module_key, is_enabled]
      );
    } else {
      await query(
        `UPDATE shop_modules SET is_enabled = $1, updated_at = NOW() WHERE shop_id = $2 AND module_key = $3`,
        [is_enabled, shopId, module_key]
      );
    }

    res.json({
      success: true,
      message: `Module '${module_key}' for shop '${shopId}' set to ${is_enabled ? 'ENABLED' : 'DISABLED'}.`,
    });
  } catch (err) {
    console.error('[toggleModule Error]:', err);
    res.status(500).json({ success: false, message: 'Failed to update module status.', error: err.message });
  }
};

export const getPlatformStats = async (_req, res) => {
  try {
    const shopCount = await query(`SELECT COUNT(*) as count FROM shops WHERE is_active = TRUE`);
    const userCount = await query(`SELECT COUNT(*) as count FROM users WHERE is_active = TRUE`);
    const itemCount = await query(`SELECT COUNT(*) as count, COALESCE(SUM(current_stock * selling_price), 0) as total_val FROM inventory_items`);
    const txnCount = await query(`SELECT COUNT(*) as count, COALESCE(SUM(total_amount), 0) as total_vol FROM stock_transactions`);

    res.json({
      success: true,
      stats: {
        total_shops: parseInt(shopCount.rows[0].count, 10),
        total_users: parseInt(userCount.rows[0].count, 10),
        total_items: parseInt(itemCount.rows[0].count, 10),
        total_inventory_value: parseFloat(itemCount.rows[0].total_val),
        total_transactions: parseInt(txnCount.rows[0].count, 10),
        total_transaction_volume: parseFloat(txnCount.rows[0].total_vol),
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch platform stats', error: err.message });
  }
};
