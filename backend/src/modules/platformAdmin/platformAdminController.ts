import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { query } from '../../database/db.js';
import { config } from '../../config/index.js';
import { AuthenticatedRequest, AuthUserPayload } from '../../types/index.js';

export const platformLogin = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ success: false, message: 'Email and password are required.' });
      return;
    }

    const result = await query(
      `SELECT * FROM platform_users WHERE LOWER(email) = LOWER($1)`,
      [email]
    );

    if (result.rowCount === 0) {
      res.status(401).json({
        success: false,
        message: 'Invalid platform super admin credentials.',
      });
      return;
    }

    const admin = result.rows[0];
    const passwordMatch = await bcrypt.compare(password, admin.password_hash);

    if (!passwordMatch) {
      res.status(401).json({
        success: false,
        message: 'Invalid platform super admin credentials.',
      });
      return;
    }

    const payload: AuthUserPayload = {
      userId: admin.id,
      email: admin.email,
      shopId: 'PLATFORM_GLOBAL',
      role: 'PLATFORM_SUPER_ADMIN',
      hrLevel: 'DIRECTOR',
      permissions: ['*'],
      isPlatformAdmin: true,
    };

    const token = jwt.sign(payload, config.jwtSecret, {
      expiresIn: config.jwtExpiresIn as any,
    });

    res.json({
      success: true,
      message: 'Platform Super Admin authenticated.',
      token,
      platform_user: {
        id: admin.id,
        email: admin.email,
        full_name: admin.full_name,
        role: admin.role,
      },
    });
  } catch (err: any) {
    console.error('[Platform Login Error]:', err);
    res.status(500).json({ success: false, message: 'Internal server error', error: err.message });
  }
};

export const getPlatformMe = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user || !req.user.isPlatformAdmin) {
      res.status(403).json({ success: false, message: 'Access denied.' });
      return;
    }

    const result = await query(`SELECT id, email, full_name, role FROM platform_users WHERE id = $1`, [req.user.userId]);
    if (result.rowCount === 0) {
      res.status(404).json({ success: false, message: 'Platform user not found.' });
      return;
    }

    res.json({ success: true, platform_user: result.rows[0] });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

export const getShops = async (_req: AuthenticatedRequest, res: Response): Promise<void> => {
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
  } catch (err: any) {
    console.error('[Platform getShops Error]:', err);
    res.status(500).json({ success: false, message: 'Failed to retrieve shops', error: err.message });
  }
};

export const createShop = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { name, slug, tagline, logo_url, banner_url, address, phone, email, gstin, currency, currency_symbol, initial_admin } = req.body;

    if (!name || !slug) {
      res.status(400).json({ success: false, message: 'Shop name and slug are required.' });
      return;
    }

    const shopId = `shop-${Date.now()}`;

    // Insert shop
    await query(
      `INSERT INTO shops (id, name, slug, tagline, logo_url, banner_url, address, phone, email, gstin, currency, currency_symbol, is_active)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, TRUE)`,
      [shopId, name, slug.toLowerCase().trim(), tagline || '', logo_url || '', banner_url || '', address || '', phone || '', email || '', gstin || '', currency || 'INR', currency_symbol || '₹']
    );

    // Initialize 4 core modules for the new shop
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

    // Optionally create initial admin user for this shop
    if (initial_admin && initial_admin.email && initial_admin.password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(initial_admin.password, salt);
      const userId = `usr-admin-${Date.now()}`;

      await query(
        `INSERT INTO users (id, shop_id, full_name, email, password_hash, role, hr_level, permissions, is_active, designation)
         VALUES ($1, $2, $3, $4, $5, 'ADMIN', 'DIRECTOR', $6, TRUE, 'Managing Director')`,
        [userId, shopId, initial_admin.full_name || `${name} Admin`, initial_admin.email, hashedPassword, ['inventory:view', 'inventory:create', 'inventory:edit', 'inventory:delete', 'inventory:purchase', 'inventory:sale', 'shop:manage', 'hr:view', 'hr:manage', 'accounting:view', 'ecommerce:view']]
      );
    }

    const createdShop = await query(`SELECT * FROM shops WHERE id = $1`, [shopId]);

    res.status(201).json({
      success: true,
      message: 'New shop created successfully.',
      shop: createdShop.rows[0],
    });
  } catch (err: any) {
    console.error('[createShop Error]:', err);
    res.status(500).json({ success: false, message: 'Failed to create shop.', error: err.message });
  }
};

export const toggleModule = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { shopId } = req.params;
    const { module_key, is_enabled } = req.body;

    if (!module_key || typeof is_enabled !== 'boolean') {
      res.status(400).json({ success: false, message: 'module_key and boolean is_enabled are required.' });
      return;
    }

    const checkMod = await query(
      `SELECT * FROM shop_modules WHERE shop_id = $1 AND module_key = $2`,
      [shopId, module_key]
    );

    if (checkMod.rowCount === 0) {
      // Insert module entry
      const modNames: Record<string, string> = {
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
  } catch (err: any) {
    console.error('[toggleModule Error]:', err);
    res.status(500).json({ success: false, message: 'Failed to update module status.', error: err.message });
  }
};

export const getPlatformStats = async (_req: AuthenticatedRequest, res: Response): Promise<void> => {
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
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Failed to fetch platform stats', error: err.message });
  }
};
