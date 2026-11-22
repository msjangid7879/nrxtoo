import { Response } from 'express';
import bcrypt from 'bcryptjs';
import { query } from '../../database/db.js';
import { AuthenticatedRequest } from '../../types/index.js';

export const getShopUsers = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const shopId = req.shopId;
    const usersResult = await query(
      `SELECT id, shop_id, full_name, email, role, hr_level, permissions, is_active, phone, designation, last_login, created_at
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
  } catch (err: any) {
    console.error('[getShopUsers Error]:', err);
    res.status(500).json({ success: false, message: 'Failed to retrieve staff members', error: err.message });
  }
};

export const createShopUser = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const shopId = req.shopId;
    const { full_name, email, password, role, hr_level, permissions, designation, phone } = req.body;

    if (!full_name || !email || !password || !role) {
      res.status(400).json({ success: false, message: 'Full name, email, password, and role are required' });
      return;
    }

    // Role hierarchy permission check
    const callerRole = req.user?.role;
    if (callerRole === 'SENIOR_HR' && role === 'ADMIN') {
      res.status(403).json({ success: false, message: 'Senior HR cannot create Admin users.' });
      return;
    }
    if (callerRole === 'JUNIOR_HR' || callerRole === 'STAFF') {
      res.status(403).json({ success: false, message: 'Insufficient privileges to create users.' });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    const userId = `usr-${Date.now()}`;

    // Default permissions based on role
    let assignedPermissions: string[] = permissions || [];
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
      `INSERT INTO users (id, shop_id, full_name, email, password_hash, role, hr_level, permissions, designation, phone, is_active)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, TRUE)`,
      [
        userId,
        shopId,
        full_name,
        email.toLowerCase().trim(),
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
      message: 'Staff user created successfully.',
      user: {
        id: userId,
        shop_id: shopId,
        full_name,
        email,
        role,
        hr_level,
        permissions: assignedPermissions,
        designation,
      },
    });
  } catch (err: any) {
    console.error('[createShopUser Error]:', err);
    res.status(500).json({ success: false, message: 'Failed to create user', error: err.message });
  }
};
