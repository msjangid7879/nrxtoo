import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { PlatformAdminRoute } from './components/PlatformAdminRoute';

// Public Landing & Product Detail Pages
import { HomePage } from './modules/public/HomePage';
import { ProductDetailPage } from './modules/public/ProductDetailPage';

// Auth Pages
import { LoginPage } from './modules/auth/LoginPage';
import { SignupPage } from './modules/auth/SignupPage';
import { PlatformAdminLoginPage } from './modules/auth/PlatformAdminLoginPage';

// Multi-Tenant Suite & App Launcher
import { LauncherHubPage } from './modules/launcher/LauncherHubPage';
import { PlatformAdminDashboard } from './modules/platformAdmin/PlatformAdminDashboard';
import { InventoryDashboard } from './modules/inventory/InventoryDashboard';
import { HrModulePage } from './modules/hr/HrModulePage';
import { AccountingModulePage } from './modules/accounting/AccountingModulePage';
import { EcommerceModulePage } from './modules/ecommerce/EcommerceModulePage';

export const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Home / Landing Page */}
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<HomePage scrollTo="products" />} />
          <Route path="/products/:moduleSlug" element={<ProductDetailPage />} />

          {/* Public Auth Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
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

          {/* Catch-all redirect to Home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
