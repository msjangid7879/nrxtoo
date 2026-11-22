import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config/index.js';
import { AuthenticatedRequest, AuthUserPayload } from '../types/index.js';

export const platformAdminGuard = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({
        success: false,
        message: 'Platform Super Admin access requires authentication token.',
      });
      return;
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, config.jwtSecret) as AuthUserPayload;

    if (decoded.role !== 'PLATFORM_SUPER_ADMIN' || !decoded.isPlatformAdmin) {
      res.status(403).json({
        success: false,
        message: 'Access Denied: Strictly restricted to Platform Super Admin.',
      });
      return;
    }

    req.user = decoded;
    next();
  } catch (err: any) {
    res.status(401).json({
      success: false,
      message: 'Invalid or expired Platform Super Admin token.',
      error: err.message,
    });
  }
};
