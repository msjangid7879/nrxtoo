import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { query } from '../../database/db.js';
import { config } from '../../config/index.js';

/**
 * 1. SIGNUP FLOW (Only Shop Owner / Admin)
 * Creates new shop tenant, enables all 4 core modules, and registers Owner Admin with unique user_id.
 */
export const signup = async (req, res) => {
  try {
    const {
      shop_name,
      slug,
      tagline,
      address,
      phone,
      gstin,
      currency = 'INR',
      currency_symbol = '₹',
      full_name,
      email,
      user_id,
      password,
    } = req.body;

    // Validation
    if (!shop_name || !slug || !full_name || !email || !user_id || !password) {
      return res.status(400).json({
        success: false,
        message: 'Shop Name, Shop Code/Slug, Owner Name, Email, User ID, and Password are required.',
      });
    }

    const cleanUserId = String(user_id).trim().toLowerCase();
    const cleanSlug = String(slug).trim().toLowerCase().replace(/[^a-z0-9_-]/g, '-');

    // Check if user_id is already taken
    const existingUser = await query(
      `SELECT id FROM users WHERE LOWER(user_id) = LOWER($1)`,
      [cleanUserId]
    );
    if (existingUser.rowCount > 0) {
      return res.status(409).json({
        success: false,
        message: `User ID '${cleanUserId}' is already taken. Please choose a different unique User ID.`,
      });
    }

    // Check if shop slug is already taken
    const existingShop = await query(
      `SELECT id FROM shops WHERE LOWER(slug) = LOWER($1)`,
      [cleanSlug]
    );
    if (existingShop.rowCount > 0) {
      return res.status(409).json({
        success: false,
        message: `Shop Code/Slug '${cleanSlug}' is already registered. Please choose a different code.`,
      });
    }

    // 1. Create Shop Record
    const shopId = `shop-${Date.now()}`;
    await query(
      `INSERT INTO shops (
        id, name, slug, tagline, address, phone, email, gstin, currency, currency_symbol, is_active
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, TRUE)`,
      [
        shopId,
        shop_name.trim(),
        cleanSlug,
        tagline || 'Finest Hallmark Jewellery & Certified Stones',
        address || '',
        phone || '',
        email.trim().toLowerCase(),
        gstin ? gstin.toUpperCase().trim() : '',
        currency,
        currency_symbol,
      ]
    );

    // 2. Initialize the 4 default modules for this shop
    const defaultModules = [
      ['inventory', 'Shop & Inventory', 'Jewellery, Gems, Hallmark HUID, Purchases & Sales Billing', 'Gem', true],
      ['hr', 'Admin, HR & Clients', 'Staff Roster, Hierarchical Roles & Client CRM', 'Users', true],
      ['accounting', 'Accounting & Billing', 'General Ledger, GST Tax Invoices & Cashbooks', 'Receipt', true],
      ['ecommerce', 'Online Shop & E-Commerce', 'Online Storefront, Catalog Sync & Web Orders', 'ShoppingBag', true],
    ];

    for (const [key, modName, desc, icon, enabled] of defaultModules) {
      await query(
        `INSERT INTO shop_modules (id, shop_id, module_key, module_name, description, icon_name, is_enabled)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [`mod-${shopId}-${key}`, shopId, key, modName, desc, icon, enabled]
      );
    }

    // 3. Create Owner / Admin User
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    const userId = `usr-admin-${Date.now()}`;
    const allPermissions = [
      'inventory:view', 'inventory:create', 'inventory:edit', 'inventory:delete',
      'inventory:purchase', 'inventory:sale', 'shop:manage', 'hr:view', 'hr:manage',
      'accounting:view', 'ecommerce:view',
    ];

    await query(
      `INSERT INTO users (
        id, shop_id, user_id, full_name, email, password_hash, role, hr_level, permissions, is_active, designation
      ) VALUES ($1, $2, $3, $4, $5, $6, 'ADMIN', 'DIRECTOR', $7, TRUE, 'Shop Owner & Managing Director')`,
      [
        userId,
        shopId,
        cleanUserId,
        full_name.trim(),
        email.trim().toLowerCase(),
        passwordHash,
        allPermissions,
      ]
    );

    // 4. Generate JWT
    const tokenPayload = {
      userId,
      user_id: cleanUserId,
      shopId,
      role: 'ADMIN',
      hrLevel: 'DIRECTOR',
      permissions: allPermissions,
    };

    const token = jwt.sign(tokenPayload, config.jwtSecret, {
      expiresIn: config.jwtExpiresIn,
    });

    const shopResult = await query(`SELECT * FROM shops WHERE id = $1`, [shopId]);

    res.status(201).json({
      success: true,
      message: `Shop '${shop_name}' created successfully. Registered as Shop Owner with User ID: ${cleanUserId}`,
      token,
      user: {
        id: userId,
        shop_id: shopId,
        user_id: cleanUserId,
        full_name,
        email,
        role: 'ADMIN',
        hr_level: 'DIRECTOR',
        permissions: allPermissions,
        designation: 'Shop Owner & Managing Director',
      },
      user_id: cleanUserId,
      active_shop_id: shopId,
      active_shop: shopResult.rows[0],
      role: 'ADMIN',
      enabled_modules: ['inventory', 'hr', 'accounting', 'ecommerce'],
    });
  } catch (err) {
    console.error('[Signup Error]:', err);
    res.status(500).json({ success: false, message: 'Server error during signup.', error: err.message });
  }
};

/**
 * 2. LOGIN FLOW (User ID + Password for Everyone)
 * No email requested on the standard login form!
 */
export const login = async (req, res) => {
  try {
    const { user_id, password } = req.body;

    if (!user_id || !password) {
      return res.status(400).json({
        success: false,
        message: 'User ID and Password are required.',
      });
    }

    const cleanUserId = String(user_id).trim().toLowerCase();

    // Look up user by unique user_id
    const userResult = await query(
      `SELECT * FROM users WHERE LOWER(user_id) = LOWER($1) AND is_active = TRUE`,
      [cleanUserId]
    );

    if (userResult.rowCount === 0) {
      return res.status(401).json({
        success: false,
        message: `Invalid credentials. No active account found for User ID '${cleanUserId}'.`,
      });
    }

    const userRecord = userResult.rows[0];

    // Validate password
    const passwordMatch = await bcrypt.compare(password, userRecord.password_hash);
    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials. Incorrect password.',
      });
    }

    // Fetch active shop
    const shopResult = await query(
      `SELECT * FROM shops WHERE id = $1 AND is_active = TRUE`,
      [userRecord.shop_id]
    );

    if (shopResult.rowCount === 0) {
      return res.status(403).json({
        success: false,
        message: 'The associated shop is currently suspended or inactive.',
      });
    }
    const shop = shopResult.rows[0];

    // Fetch enabled modules for this shop
    const modulesResult = await query(
      `SELECT module_key, module_name, description, icon_name, is_enabled 
       FROM shop_modules 
       WHERE shop_id = $1 AND is_enabled = TRUE
       ORDER BY 
         CASE module_key 
           WHEN 'inventory' THEN 1 
           WHEN 'hr' THEN 2 
           WHEN 'accounting' THEN 3 
           WHEN 'ecommerce' THEN 4 
           ELSE 5 
         END`,
      [shop.id]
    );

    const enabledModules = modulesResult.rows.map((m) => m.module_key);

    // Update last_login
    await query(`UPDATE users SET last_login = NOW() WHERE id = $1`, [userRecord.id]);

    // Issue JWT
    const payload = {
      userId: userRecord.id,
      user_id: userRecord.user_id,
      email: userRecord.email,
      shopId: shop.id,
      role: userRecord.role,
      hrLevel: userRecord.hr_level,
      permissions: userRecord.permissions || [],
    };

    const token = jwt.sign(payload, config.jwtSecret, {
      expiresIn: config.jwtExpiresIn,
    });

    res.json({
      success: true,
      message: 'Login successful.',
      token,
      user: {
        id: userRecord.id,
        shop_id: userRecord.shop_id,
        user_id: userRecord.user_id,
        full_name: userRecord.full_name,
        email: userRecord.email,
        role: userRecord.role,
        hr_level: userRecord.hr_level,
        permissions: userRecord.permissions || [],
        designation: userRecord.designation,
        phone: userRecord.phone,
      },
      user_id: userRecord.user_id,
      active_shop_id: shop.id,
      active_shop: shop,
      role: userRecord.role,
      enabled_modules: enabledModules,
      modules_details: modulesResult.rows,
    });
  } catch (err) {
    console.error('[Login Error]:', err);
    res.status(500).json({ success: false, message: 'Server error during login.', error: err.message });
  }
};

export const getMe = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Not authenticated' });
    }

    const userResult = await query(
      `SELECT * FROM users WHERE id = $1 AND is_active = TRUE`,
      [req.user.userId]
    );
    if (userResult.rowCount === 0) {
      return res.status(404).json({ success: false, message: 'User not found or inactive.' });
    }
    const userRecord = userResult.rows[0];

    const shopResult = await query(`SELECT * FROM shops WHERE id = $1`, [userRecord.shop_id]);
    const shop = shopResult.rows[0] || null;

    const modulesResult = await query(
      `SELECT module_key, module_name, description, icon_name, is_enabled 
       FROM shop_modules 
       WHERE shop_id = $1 AND is_enabled = TRUE
       ORDER BY 
         CASE module_key 
           WHEN 'inventory' THEN 1 
           WHEN 'hr' THEN 2 
           WHEN 'accounting' THEN 3 
           WHEN 'ecommerce' THEN 4 
           ELSE 5 
         END`,
      [shop.id]
    );

    res.json({
      success: true,
      user: {
        id: userRecord.id,
        shop_id: userRecord.shop_id,
        user_id: userRecord.user_id,
        full_name: userRecord.full_name,
        email: userRecord.email,
        role: userRecord.role,
        hr_level: userRecord.hr_level,
        permissions: userRecord.permissions || [],
        designation: userRecord.designation,
        phone: userRecord.phone,
      },
      user_id: userRecord.user_id,
      active_shop_id: shop.id,
      active_shop: shop,
      role: userRecord.role,
      enabled_modules: modulesResult.rows.map((m) => m.module_key),
      modules_details: modulesResult.rows,
    });
  } catch (err) {
    console.error('[getMe Error]:', err);
    res.status(500).json({ success: false, message: 'Failed to retrieve user profile.', error: err.message });
  }
};
