import bcrypt from 'bcryptjs';
import { query } from '../../database/db.js';

export const getShopUsers = async (req, res) => {
  try {
    const shopId = req.shopId;
    const usersResult = await query(
      `SELECT id, shop_id, user_id, full_name, email, role, hr_level, permissions, is_active, phone, designation, last_login, created_at
       FROM users 
       WHERE shop_id = $1
       ORDER BY 
         CASE role 
           WHEN 'ADMIN' THEN 1 
           WHEN 'SENIOR_HR' THEN 2 
           WHEN 'JUNIOR_HR' THEN 3 
           WHEN 'STAFF' THEN 4 
           ELSE 5 
         END, full_name ASC`,
      [shopId]
    );

    res.json({
      success: true,
      users: usersResult.rows,
      current_user_role: req.user?.role,
      current_user_hr_level: req.user?.hrLevel,
    });
  } catch (err) {
    console.error('[getShopUsers Error]:', err);
    res.status(500).json({ success: false, message: 'Failed to retrieve staff members', error: err.message });
  }
};

export const createShopUser = async (req, res) => {
  try {
    const shopId = req.shopId;
    const { full_name, user_id, email, password, role, hr_level, permissions, designation, phone } = req.body;

    if (!full_name || !user_id || !password || !role) {
      return res.status(400).json({
        success: false,
        message: 'Full name, unique User ID, password, and role are required.',
      });
    }

    const cleanUserId = String(user_id).trim().toLowerCase();

    // Check if user_id is already in use
    const checkUserId = await query(`SELECT id FROM users WHERE LOWER(user_id) = LOWER($1)`, [cleanUserId]);
    if (checkUserId.rowCount > 0) {
      return res.status(409).json({
        success: false,
        message: `User ID '${cleanUserId}' is already taken. Please choose another ID.`,
      });
    }

    const callerRole = req.user?.role;
    if (callerRole === 'SENIOR_HR' && role === 'ADMIN') {
      return res.status(403).json({ success: false, message: 'Senior HR cannot create Admin users.' });
    }
    if (callerRole === 'JUNIOR_HR' || callerRole === 'STAFF') {
      return res.status(403).json({ success: false, message: 'Insufficient privileges to create users.' });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    const userId = `usr-${Date.now()}`;

    let assignedPermissions = permissions || [];
    if (!permissions || permissions.length === 0) {
      if (role === 'ADMIN') {
        assignedPermissions = ['inventory:view', 'inventory:create', 'inventory:edit', 'inventory:delete', 'inventory:purchase', 'inventory:sale', 'shop:manage', 'hr:view', 'hr:manage', 'accounting:view', 'ecommerce:view'];
      } else if (role === 'SENIOR_HR') {
        assignedPermissions = ['inventory:view', 'hr:view', 'hr:manage'];
      } else if (role === 'JUNIOR_HR') {
        assignedPermissions = ['inventory:view', 'hr:view'];
      } else {
        assignedPermissions = ['inventory:view', 'inventory:sale'];
      }
    }

    await query(
      `INSERT INTO users (id, shop_id, user_id, full_name, email, password_hash, role, hr_level, permissions, designation, phone, is_active)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, TRUE)`,
      [
        userId,
        shopId,
        cleanUserId,
        full_name.trim(),
        email ? email.toLowerCase().trim() : '',
        passwordHash,
        role,
        hr_level || (role === 'ADMIN' ? 'DIRECTOR' : role === 'SENIOR_HR' ? 'SENIOR' : role === 'JUNIOR_HR' ? 'JUNIOR' : 'NONE'),
        assignedPermissions,
        designation || '',
        phone || '',
      ]
    );

    res.status(201).json({
      success: true,
      message: `Staff user created successfully with User ID: ${cleanUserId}`,
      user: {
        id: userId,
        shop_id: shopId,
        user_id: cleanUserId,
        full_name,
        email,
        role,
        hr_level,
        permissions: assignedPermissions,
        designation,
      },
    });
  } catch (err) {
    console.error('[createShopUser Error]:', err);
    res.status(500).json({ success: false, message: 'Failed to create user', error: err.message });
  }
};
