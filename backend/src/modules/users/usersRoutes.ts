import { Router } from 'express';
import { getShopUsers, createShopUser } from './usersController.js';
import { authGuard } from '../../middleware/authGuard.js';
import { requireRole } from '../../middleware/roleGuard.js';

const router = Router();

router.use(authGuard);

// Staff and HR can view staff list; only Admin and Senior HR can create users
router.get('/', getShopUsers);
router.post('/', requireRole(['ADMIN', 'SENIOR_HR']), createShopUser);

export default router;
