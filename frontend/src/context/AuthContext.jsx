import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiRequest } from '../services/api.js';

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('nrxtoo_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [activeShop, setActiveShop] = useState(() => {
    const saved = localStorage.getItem('nrxtoo_shop');
    return saved ? JSON.parse(saved) : null;
  });

  const [role, setRole] = useState(() => {
    return localStorage.getItem('nrxtoo_role') || null;
  });

  const [enabledModules, setEnabledModules] = useState(() => {
    const saved = localStorage.getItem('nrxtoo_modules');
    return saved ? JSON.parse(saved) : ['inventory'];
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem('nrxtoo_token') || null;
  });

  const [platformUser, setPlatformUser] = useState(() => {
    const saved = localStorage.getItem('nrxtoo_platform_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [platformToken, setPlatformToken] = useState(() => {
    return localStorage.getItem('nrxtoo_platform_token') || null;
  });

  const [isLoading, setIsLoading] = useState(true);

  // Validate session on mount
  useEffect(() => {
    const verifyAuth = async () => {
      if (token) {
        try {
          const res = await apiRequest('/auth/me');
          if (res.success) {
            setUser(res.user);
            setActiveShop(res.active_shop);
            setRole(res.role);
            setEnabledModules(res.enabled_modules || ['inventory']);
            localStorage.setItem('nrxtoo_user', JSON.stringify(res.user));
            localStorage.setItem('nrxtoo_shop', JSON.stringify(res.active_shop));
            localStorage.setItem('nrxtoo_role', res.role);
            localStorage.setItem('nrxtoo_modules', JSON.stringify(res.enabled_modules));
          }
        } catch (err) {
          console.warn('Session verification failed, logging out:', err);
          logout();
        }
      }

      if (platformToken) {
        try {
          const pRes = await apiRequest('/platform-admin/me', {}, true);
          if (pRes.success) {
            setPlatformUser(pRes.platform_user);
            localStorage.setItem('nrxtoo_platform_user', JSON.stringify(pRes.platform_user));
          }
        } catch {
          platformLogout();
        }
      }

      setIsLoading(false);
    };

    verifyAuth();
  }, []);

  /**
   * Login using unique User ID + Password for everyone
   */
  const login = async (user_id, password) => {
    setIsLoading(true);
    try {
      const res = await apiRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ user_id, password }),
      });

      if (res.success && res.token) {
        setToken(res.token);
        setUser(res.user);
        setActiveShop(res.active_shop);
        setRole(res.role);
        setEnabledModules(res.enabled_modules || ['inventory']);

        localStorage.setItem('nrxtoo_token', res.token);
        localStorage.setItem('nrxtoo_user', JSON.stringify(res.user));
        localStorage.setItem('nrxtoo_shop', JSON.stringify(res.active_shop));
        localStorage.setItem('nrxtoo_role', res.role);
        localStorage.setItem('nrxtoo_modules', JSON.stringify(res.enabled_modules));
      }
      return res;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Signup Flow (Only Shop Owner / Admin)
   */
  const signup = async (signupData) => {
    setIsLoading(true);
    try {
      const res = await apiRequest('/auth/signup', {
        method: 'POST',
        body: JSON.stringify(signupData),
      });

      if (res.success && res.token) {
        setToken(res.token);
        setUser(res.user);
        setActiveShop(res.active_shop);
        setRole(res.role);
        setEnabledModules(res.enabled_modules || ['inventory', 'hr', 'accounting', 'ecommerce']);

        localStorage.setItem('nrxtoo_token', res.token);
        localStorage.setItem('nrxtoo_user', JSON.stringify(res.user));
        localStorage.setItem('nrxtoo_shop', JSON.stringify(res.active_shop));
        localStorage.setItem('nrxtoo_role', res.role);
        localStorage.setItem('nrxtoo_modules', JSON.stringify(res.enabled_modules));
      }
      return res;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    setActiveShop(null);
    setRole(null);
    setEnabledModules([]);

    localStorage.removeItem('nrxtoo_token');
    localStorage.removeItem('nrxtoo_user');
    localStorage.removeItem('nrxtoo_shop');
    localStorage.removeItem('nrxtoo_role');
    localStorage.removeItem('nrxtoo_modules');
  };

  const platformLogin = async (user_id, password) => {
    setIsLoading(true);
    try {
      const res = await apiRequest('/platform-admin/login', {
        method: 'POST',
        body: JSON.stringify({ user_id, password }),
      });

      if (res.success && res.token) {
        setPlatformToken(res.token);
        setPlatformUser(res.platform_user);
        localStorage.setItem('nrxtoo_platform_token', res.token);
        localStorage.setItem('nrxtoo_platform_user', JSON.stringify(res.platform_user));
      }
      return res;
    } finally {
      setIsLoading(false);
    }
  };

  const platformLogout = () => {
    setPlatformToken(null);
    setPlatformUser(null);
    localStorage.removeItem('nrxtoo_platform_token');
    localStorage.removeItem('nrxtoo_platform_user');
  };

  const refreshUserProfile = async () => {
    try {
      const res = await apiRequest('/auth/me');
      if (res.success) {
        setUser(res.user);
        setActiveShop(res.active_shop);
        setRole(res.role);
        setEnabledModules(res.enabled_modules || ['inventory']);
        localStorage.setItem('nrxtoo_user', JSON.stringify(res.user));
        localStorage.setItem('nrxtoo_shop', JSON.stringify(res.active_shop));
        localStorage.setItem('nrxtoo_role', res.role);
        localStorage.setItem('nrxtoo_modules', JSON.stringify(res.enabled_modules));
      }
    } catch (err) {
      console.error('Failed to refresh user profile:', err);
    }
  };

  const updateActiveShop = (shop) => {
    setActiveShop(shop);
    localStorage.setItem('nrxtoo_shop', JSON.stringify(shop));
  };

  const hasRole = (allowedRoles) => {
    if (!role) return false;
    if (role === 'ADMIN' || role === 'PLATFORM_SUPER_ADMIN') return true;
    return allowedRoles.includes(role);
  };

  const hasPermission = (permission) => {
    if (!user) return false;
    if (role === 'ADMIN' || role === 'PLATFORM_SUPER_ADMIN') return true;
    return user.permissions?.includes(permission) || false;
  };

  const isModuleEnabled = (key) => {
    return enabledModules.includes(key);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        activeShop,
        role,
        enabledModules,
        token,
        isLoading,
        platformUser,
        platformToken,
        login,
        signup,
        logout,
        platformLogin,
        platformLogout,
        refreshUserProfile,
        updateActiveShop,
        hasRole,
        hasPermission,
        isModuleEnabled,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
