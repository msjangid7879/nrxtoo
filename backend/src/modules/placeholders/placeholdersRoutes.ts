import { Router, Response } from 'express';
import { authGuard } from '../../middleware/authGuard.js';
import { AuthenticatedRequest } from '../../types/index.js';

const router = Router();

router.use(authGuard);

// 1. HR & Clients placeholder data
router.get('/hr-overview', (req: AuthenticatedRequest, res: Response) => {
  res.json({
    success: true,
    module: 'Admin, HR & Clients',
    user_role: req.user?.role,
    user_hr_level: req.user?.hrLevel,
    can_manage_salaries: req.user?.role === 'ADMIN',
    can_hire_staff: req.user?.role === 'ADMIN' || req.user?.role === 'SENIOR_HR',
    can_view_records: ['ADMIN', 'SENIOR_HR', 'JUNIOR_HR'].includes(req.user?.role || ''),
    summary: {
      total_employees: 14,
      on_leave: 2,
      active_shifts: 8,
      new_applicants: 3,
      verified_client_accounts: 320,
    },
  });
});

// 2. Accounting & Billing placeholder data
router.get('/accounting-overview', (req: AuthenticatedRequest, res: Response) => {
  res.json({
    success: true,
    module: 'Accounting & Billing',
    user_role: req.user?.role,
    summary: {
      fiscal_year: '2026-2027',
      gross_revenue: 14500000,
      total_purchases: 8900000,
      gst_collected: 435000,
      pending_receivables: 125000,
      pending_payables: 310000,
      currency: 'INR',
      status: 'Active & In Compliance',
    },
  });
});

// 3. Online Shop & E-Commerce placeholder data
router.get('/ecommerce-overview', (req: AuthenticatedRequest, res: Response) => {
  res.json({
    success: true,
    module: 'Online Shop & E-Commerce',
    user_role: req.user?.role,
    summary: {
      storefront_status: 'Online',
      published_products: 48,
      pending_online_orders: 5,
      cart_conversion_rate: '3.4%',
      synced_with_inventory: true,
      store_domain: 'https://shop.nrxtoo.com/royal-jewellers',
    },
  });
});

export default router;
