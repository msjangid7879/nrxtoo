import { Router } from 'express';
import {
  platformLogin,
  getPlatformMe,
  getShops,
  createShop,
  toggleModule,
  getPlatformStats,
} from './platformAdminController.js';
import { platformAdminGuard } from '../../middleware/platformAdminGuard.js';

const router = Router();

// Public Platform Login
router.post('/login', platformLogin);

// Protected Platform Super Admin Routes
router.get('/me', platformAdminGuard, getPlatformMe);
router.get('/stats', platformAdminGuard, getPlatformStats);
router.get('/shops', platformAdminGuard, getShops);
router.post('/shops', platformAdminGuard, createShop);
router.post('/shops/:shopId/modules/toggle', platformAdminGuard, toggleModule);

export default router;
