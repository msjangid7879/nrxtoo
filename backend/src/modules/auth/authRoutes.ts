import { Router } from 'express';
import { login, getMe, getAccessibleShops } from './authController.js';
import { authGuard } from '../../middleware/authGuard.js';

const router = Router();

router.post('/login', login);
router.get('/me', authGuard, getMe);
router.get('/accessible-shops', getAccessibleShops);

export default router;
