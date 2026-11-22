import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserProfile, Shop, UserRole, ModuleKey, PlatformUser } from '../types';
import { apiRequest } from '../services/api';

interface AuthContextType {
  user: UserProfile | null;
  activeShop: Shop | null;
  role: UserRole | null;
  enabledModules: ModuleKey[];
  token: string | null;
  isLoading: boolean;
  platformUser: PlatformUser | null;
  platformToken: string | null;
  login: (email: string, password: string, shop_id?: string) => Promise<void>;
  logout: () => void;
  platformLogin: (email: string, password: string) => Promise<void>;
  platformLogout: () => void;
  refreshUserProfile: () => Promise<void>;
  updateActiveShop: (shop: Shop) => void;
  hasRole: (roles: UserRole[]) => boolean;
  hasPermission: (permission: string) => boolean;
  isModuleEnabled: (key: ModuleKey) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('nrxtoo_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [activeShop, setActiveShop] = useState<Shop | null>(() => {
    const saved = localStorage.getItem('nrxtoo_shop');
    return saved ? JSON.parse(saved) : null;
  });

  const [role, setRole] = useState<UserRole | null>(() => {
    return (localStorage.getItem('nrxtoo_role') as UserRole) || null;
  });

  const [enabledModules, setEnabledModules] = useState<ModuleKey[]>(() => {
    const saved = localStorage.getItem('nrxtoo_modules');
    return saved ? JSON.parse(saved) : ['inventory'];
  });

  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('nrxtoo_token') || null;
  });

  const [platformUser, setPlatformUser] = useState<PlatformUser | null>(() => {
    const saved = localStorage.getItem('nrxtoo_platform_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [platformToken, setPlatformToken] = useState<string | null>(() => {
    return localStorage.getItem('nrxtoo_platform_token') || null;
  });

  const [isLoading, setIsLoading] = useState<boolean>(true);

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

  const login = async (email: string, password: string, shop_id?: string) => {
    setIsLoading(true);
    try {
      const res = await apiRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password, shop_id }),
      });

      if (res.success && res.token) {
        setToken(res.token);
        setUser(res.user);
        setActiveShop(res.active_shop);
        setRole(res.role);
        setEnabledModules(res.enabled_modules);

        localStorage.setItem('nrxtoo_token', res.token);
        localStorage.setItem('nrxtoo_user', JSON.stringify(res.user));
        localStorage.setItem('nrxtoo_shop', JSON.stringify(res.active_shop));
        localStorage.setItem('nrxtoo_role', res.role);
        localStorage.setItem('nrxtoo_modules', JSON.stringify(res.enabled_modules));
      }
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

  const platformLogin = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const res = await apiRequest('/platform-admin/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });

      if (res.success && res.token) {
        setPlatformToken(res.token);
        setPlatformUser(res.platform_user);
        localStorage.setItem('nrxtoo_platform_token', res.token);
        localStorage.setItem('nrxtoo_platform_user', JSON.stringify(res.platform_user));
      }
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

  const updateActiveShop = (shop: Shop) => {
    setActiveShop(shop);
    localStorage.setItem('nrxtoo_shop', JSON.stringify(shop));
  };

  const hasRole = (allowedRoles: UserRole[]): boolean => {
    if (!role) return false;
    if (role === 'ADMIN' || role === 'PLATFORM_SUPER_ADMIN') return true;
    return allowedRoles.includes(role);
  };

  const hasPermission = (permission: string): boolean => {
    if (!user) return false;
    if (role === 'ADMIN' || role === 'PLATFORM_SUPER_ADMIN') return true;
    return user.permissions?.includes(permission) || false;
  };

  const isModuleEnabled = (key: ModuleKey): boolean => {
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
