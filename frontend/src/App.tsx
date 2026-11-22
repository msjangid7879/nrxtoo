import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { PlatformAdminRoute } from './components/PlatformAdminRoute';

import { LoginPage } from './modules/auth/LoginPage';
import { PlatformAdminLoginPage } from './modules/auth/PlatformAdminLoginPage';
import { LauncherHubPage } from './modules/launcher/LauncherHubPage';
import { PlatformAdminDashboard } from './modules/platformAdmin/PlatformAdminDashboard';
import { InventoryDashboard } from './modules/inventory/InventoryDashboard';
import { HrModulePage } from './modules/hr/HrModulePage';
import { AccountingModulePage } from './modules/accounting/AccountingModulePage';
import { EcommerceModulePage } from './modules/ecommerce/EcommerceModulePage';

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Auth Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/platform-admin/login" element={<PlatformAdminLoginPage />} />

          {/* Platform Super Admin Console (Strictly isolated from shop operations) */}
          <Route
            path="/platform-admin"
            element={
              <PlatformAdminRoute>
                <PlatformAdminDashboard />
              </PlatformAdminRoute>
            }
          />

          {/* Google-Style App Launcher Hub */}
          <Route
            path="/launcher"
            element={
              <ProtectedRoute>
                <LauncherHubPage />
              </ProtectedRoute>
            }
          />

          {/* Main Module 1: Shop & Inventory (Jewellery & Stones) */}
          <Route
            path="/inventory"
            element={
              <ProtectedRoute requiredModule="inventory">
                <InventoryDashboard />
              </ProtectedRoute>
            }
          />

          {/* Module 2: Admin, HR & Clients */}
          <Route
            path="/hr"
            element={
              <ProtectedRoute requiredModule="hr">
                <HrModulePage />
              </ProtectedRoute>
            }
          />

          {/* Module 3: Accounting & Billing */}
          <Route
            path="/accounting"
            element={
              <ProtectedRoute requiredModule="accounting">
                <AccountingModulePage />
              </ProtectedRoute>
            }
          />

          {/* Module 4: Online Shop & E-Commerce */}
          <Route
            path="/ecommerce"
            element={
              <ProtectedRoute requiredModule="ecommerce">
                <EcommerceModulePage />
              </ProtectedRoute>
            }
          />

          {/* Root redirect */}
          <Route path="/" element={<Navigate to="/launcher" replace />} />
          <Route path="*" element={<Navigate to="/launcher" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
