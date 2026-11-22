import { Router } from 'express';
import { getCurrentShop, updateCurrentShop } from './shopsController.js';
import { authGuard } from '../../middleware/authGuard.js';
import { requireRole } from '../../middleware/roleGuard.js';

const router = Router();

router.use(authGuard);

router.get('/current', getCurrentShop);
router.put('/current', requireRole(['ADMIN']), updateCurrentShop);

export default router;
