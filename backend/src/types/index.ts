import { Request } from 'express';

export type UserRole = 'ADMIN' | 'SENIOR_HR' | 'JUNIOR_HR' | 'STAFF' | 'PLATFORM_SUPER_ADMIN';

export type HrLevel = 'DIRECTOR' | 'SENIOR' | 'JUNIOR' | 'NONE';

export type ModuleKey = 'inventory' | 'hr' | 'accounting' | 'ecommerce';

export type InventoryCategory = 'Jewellery' | 'Stones';

export type TransactionType = 'PURCHASE' | 'SALE' | 'ADJUSTMENT';

export interface Shop {
  id: string;
  name: string;
  slug: string;
  tagline?: string;
  logo_url?: string;
  banner_url?: string;
  address?: string;
  phone?: string;
  email?: string;
  gstin?: string;
  currency: string;
  currency_symbol: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ShopModule {
  id: string;
  shop_id: string;
  module_key: ModuleKey;
  module_name: string;
  description?: string;
  icon_name?: string;
  is_enabled: boolean;
  config?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface User {
  id: string;
  shop_id: string;
  full_name: string;
  email: string;
  password_hash?: string;
  role: UserRole;
  hr_level: HrLevel;
  permissions: string[];
  is_active: boolean;
  phone?: string;
  designation?: string;
  last_login?: string;
  created_at: string;
  updated_at: string;
}

export interface PlatformUser {
  id: string;
  email: string;
  full_name: string;
  role: 'PLATFORM_SUPER_ADMIN';
  created_at: string;
  updated_at: string;
}

export interface InventoryItem {
  id: string;
  shop_id: string;
  sku: string;
  name: string;
  category: InventoryCategory;
  description?: string;
  image_url?: string;
  cost_price: number;
  selling_price: number;
  current_stock: number;
  minimum_stock: number;
  unit: string;
  status: 'IN_STOCK' | 'LOW_STOCK' | 'OUT_OF_STOCK';

  // Category: Jewellery specific
  metal_type?: string;
  purity?: string;
  gross_weight?: number;
  net_weight?: number;
  stone_weight?: number;
  making_charges?: number;
  huid_hallmark?: string;

  // Category: Stones specific
  stone_type?: string;
  shape_cut?: string;
  color?: string;
  clarity?: string;
  carat_weight?: number;
  treatment_origin?: string;
  lab_certificate_no?: string;

  created_at: string;
  updated_at: string;
}

export interface StockTransaction {
  id: string;
  shop_id: string;
  item_id: string;
  transaction_type: TransactionType;
  quantity: number;
  unit_price: number;
  total_amount: number;
  party_name?: string;
  party_contact?: string;
  invoice_no?: string;
  payment_method: string;
  notes?: string;
  performed_by?: string;
  transaction_date: string;
  created_at: string;
  item_name?: string;
  item_sku?: string;
  category?: InventoryCategory;
  performer_name?: string;
}

export interface AuthUserPayload {
  userId: string;
  email: string;
  shopId: string;
  role: UserRole;
  hrLevel: HrLevel;
  permissions: string[];
  isPlatformAdmin?: boolean;
}

export interface AuthenticatedRequest extends Request {
  user?: AuthUserPayload;
  shopId?: string;
  platformUser?: PlatformUser;
}
