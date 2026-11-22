export type UserRole = 'ADMIN' | 'SENIOR_HR' | 'JUNIOR_HR' | 'STAFF' | 'PLATFORM_SUPER_ADMIN';

export type HrLevel = 'DIRECTOR' | 'SENIOR' | 'JUNIOR' | 'NONE';

export type ModuleKey = 'inventory' | 'hr' | 'accounting' | 'ecommerce';

export type InventoryCategory = 'Jewellery' | 'Stones';

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
  created_at?: string;
}

export interface ShopModule {
  id: string;
  shop_id: string;
  module_key: ModuleKey;
  module_name: string;
  description?: string;
  icon_name?: string;
  is_enabled: boolean;
}

export interface UserProfile {
  id: string;
  shop_id: string;
  full_name: string;
  email: string;
  role: UserRole;
  hr_level: HrLevel;
  permissions: string[];
  designation?: string;
  phone?: string;
}

export interface PlatformUser {
  id: string;
  email: string;
  full_name: string;
  role: 'PLATFORM_SUPER_ADMIN';
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

  // Jewellery Dynamic Fields
  metal_type?: string;
  purity?: string;
  gross_weight?: number;
  net_weight?: number;
  stone_weight?: number;
  making_charges?: number;
  huid_hallmark?: string;

  // Stones Dynamic Fields
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
  transaction_type: 'PURCHASE' | 'SALE' | 'ADJUSTMENT';
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
  item_name?: string;
  item_sku?: string;
  item_category?: InventoryCategory;
  performer_name?: string;
}

export interface AppLauncherModuleDef {
  key: ModuleKey;
  title: string;
  description: string;
  path: string;
  iconName: string;
  badge?: string;
  colorBg: string;
  colorText: string;
  isCore?: boolean;
}
