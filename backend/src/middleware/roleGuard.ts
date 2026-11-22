import { Response, NextFunction } from 'express';
import { AuthenticatedRequest, UserRole } from '../types/index.js';

/**
 * Guard that verifies the user has one of the specified roles.
 * Admins are also permitted by default if role hierarchy allows.
 */
export const requireRole = (allowedRoles: UserRole[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized: User not authenticated' });
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        message: `Forbidden: Role '${req.user.role}' lacks permission for this action. Required: [${allowedRoles.join(', ')}]`,
      });
      return;
    }

    next();
  };
};

/**
 * Guard that checks if user has a specific granular permission flag
 */
export const requirePermission = (permission: string) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized: User not authenticated' });
      return;
    }

    // Admins bypass granular permission checks
    if (req.user.role === 'ADMIN' || req.user.role === 'PLATFORM_SUPER_ADMIN') {
      next();
      return;
    }

    if (!req.user.permissions || !req.user.permissions.includes(permission)) {
      res.status(403).json({
        success: false,
        message: `Forbidden: Lacks required permission '${permission}'`,
      });
      return;
    }

    next();
  };
};
