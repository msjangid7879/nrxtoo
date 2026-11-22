import { Router } from 'express';
import {
  getInventoryItems,
  getInventoryStats,
  getInventoryItemById,
  createInventoryItem,
  updateInventoryItem,
  deleteInventoryItem,
} from './inventoryController.js';
import { authGuard } from '../../middleware/authGuard.js';
import { requireRole } from '../../middleware/roleGuard.js';

const router = Router();

router.use(authGuard);

router.get('/', getInventoryItems);
router.get('/stats', getInventoryStats);
router.get('/:id', getInventoryItemById);

// Creation & editing allowed for Admin & Senior Staff
router.post('/', requireRole(['ADMIN', 'SENIOR_HR', 'STAFF']), createInventoryItem);
router.put('/:id', requireRole(['ADMIN', 'SENIOR_HR', 'STAFF']), updateInventoryItem);

// Deletion restricted to Admin
router.delete('/:id', requireRole(['ADMIN']), deleteInventoryItem);

export default router;
