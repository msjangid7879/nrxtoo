import jwt from 'jsonwebtoken';
import { config } from '../config/index.js';

export const platformAdminGuard = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Platform Super Admin access requires authentication token.',
      });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, config.jwtSecret);

    if (decoded.role !== 'PLATFORM_SUPER_ADMIN' || !decoded.isPlatformAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Access Denied: Strictly restricted to Platform Super Admin.',
      });
    }

    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired Platform Super Admin token.',
      error: err.message,
    });
  }
};
