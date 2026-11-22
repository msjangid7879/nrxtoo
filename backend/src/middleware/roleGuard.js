export const requireRole = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Unauthorized: User not authenticated' });
    }

    // Admin & Platform Super Admin have full hierarchy rights
    if (req.user.role === 'ADMIN' || req.user.role === 'PLATFORM_SUPER_ADMIN') {
      return next();
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Forbidden: Role '${req.user.role}' lacks permission for this action. Required: [${allowedRoles.join(', ')}]`,
      });
    }

    next();
  };
};

export const requirePermission = (permission) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Unauthorized: User not authenticated' });
    }

    if (req.user.role === 'ADMIN' || req.user.role === 'PLATFORM_SUPER_ADMIN') {
      return next();
    }

    if (!req.user.permissions || !req.user.permissions.includes(permission)) {
      return res.status(403).json({
        success: false,
        message: `Forbidden: Lacks required permission '${permission}'`,
      });
    }

    next();
  };
};
