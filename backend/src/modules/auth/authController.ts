import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { query } from '../../database/db.js';
import { config } from '../../config/index.js';
import { AuthenticatedRequest, AuthUserPayload } from '../../types/index.js';

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, shop_id } = req.body;

    if (!email || !password) {
      res.status(400).json({ success: false, message: 'Email and password are required.' });
      return;
    }

    // 1. Look for user in database
    let userQuery = `SELECT * FROM users WHERE LOWER(email) = LOWER($1) AND is_active = TRUE`;
    let queryParams: any[] = [email];

    if (shop_id) {
      userQuery += ` AND shop_id = $2`;
      queryParams.push(shop_id);
    }

    const userResult = await query(userQuery, queryParams);

    if (userResult.rowCount === 0) {
      res.status(401).json({
        success: false,
        message: 'Invalid credentials or user account is inactive.',
      });
      return;
    }

    const userRecord = userResult.rows[0];

    // 2. Validate password
    const passwordMatch = await bcrypt.compare(password, userRecord.password_hash);
    if (!passwordMatch) {
      res.status(401).json({
        success: false,
        message: 'Invalid credentials. Please verify your password.',
      });
      return;
    }

    // 3. Fetch active shop
    const shopResult = await query(`SELECT * FROM shops WHERE id = $1 AND is_active = TRUE`, [userRecord.shop_id]);
    if (shopResult.rowCount === 0) {
      res.status(403).json({
        success: false,
        message: 'The associated shop is currently suspended or inactive.',
      });
      return;
    }
    const shop = shopResult.rows[0];

    // 4. Fetch enabled modules for this shop
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
    const enabledModulesFull = modulesResult.rows;

    // 5. Update last_login
    await query(`UPDATE users SET last_login = NOW() WHERE id = $1`, [userRecord.id]);

    // 6. Generate JWT
    const payload: AuthUserPayload = {
      userId: userRecord.id,
      email: userRecord.email,
      shopId: shop.id,
      role: userRecord.role,
      hrLevel: userRecord.hr_level,
      permissions: userRecord.permissions || [],
    };

    const token = jwt.sign(payload, config.jwtSecret, {
      expiresIn: config.jwtExpiresIn as any,
    });

    const userSafe = {
      id: userRecord.id,
      shop_id: userRecord.shop_id,
      full_name: userRecord.full_name,
      email: userRecord.email,
      role: userRecord.role,
      hr_level: userRecord.hr_level,
      permissions: userRecord.permissions || [],
      designation: userRecord.designation,
      phone: userRecord.phone,
    };

    res.json({
      success: true,
      message: 'Login successful.',
      token,
      user: userSafe,
      active_shop_id: shop.id,
      active_shop: shop,
      role: userRecord.role,
      enabled_modules: enabledModules,
      modules_details: enabledModulesFull,
    });
  } catch (err: any) {
    console.error('[Login Error]:', err);
    res.status(500).json({ success: false, message: 'Server error during login.', error: err.message });
  }
};

export const getMe = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Not authenticated' });
      return;
    }

    const userResult = await query(`SELECT * FROM users WHERE id = $1 AND is_active = TRUE`, [req.user.userId]);
    if (userResult.rowCount === 0) {
      res.status(404).json({ success: false, message: 'User not found or inactive.' });
      return;
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

    const userSafe = {
      id: userRecord.id,
      shop_id: userRecord.shop_id,
      full_name: userRecord.full_name,
      email: userRecord.email,
      role: userRecord.role,
      hr_level: userRecord.hr_level,
      permissions: userRecord.permissions || [],
      designation: userRecord.designation,
      phone: userRecord.phone,
    };

    res.json({
      success: true,
      user: userSafe,
      active_shop_id: shop.id,
      active_shop: shop,
      role: userRecord.role,
      enabled_modules: modulesResult.rows.map((m) => m.module_key),
      modules_details: modulesResult.rows,
    });
  } catch (err: any) {
    console.error('[getMe Error]:', err);
    res.status(500).json({ success: false, message: 'Failed to retrieve user profile.', error: err.message });
  }
};

export const getAccessibleShops = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.query;
    if (!email) {
      // Return list of all active shops for quick switcher
      const shopsResult = await query(`SELECT id, name, slug, logo_url, address, phone FROM shops WHERE is_active = TRUE ORDER BY name ASC`);
      res.json({ success: true, shops: shopsResult.rows });
      return;
    }

    const shopsResult = await query(
      `SELECT s.id, s.name, s.slug, s.logo_url, s.address, s.phone, u.role, u.designation
       FROM shops s
       JOIN users u ON u.shop_id = s.id
       WHERE LOWER(u.email) = LOWER($1) AND s.is_active = TRUE AND u.is_active = TRUE
       ORDER BY s.name ASC`,
      [String(email)]
    );

    res.json({ success: true, shops: shopsResult.rows });
  } catch (err: any) {
    console.error('[getAccessibleShops Error]:', err);
    res.status(500).json({ success: false, message: 'Failed to retrieve shops.', error: err.message });
  }
};
