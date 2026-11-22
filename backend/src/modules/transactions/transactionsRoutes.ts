import { Router } from 'express';
import { getTransactions, recordPurchase, recordSale } from './transactionsController.js';
import { authGuard } from '../../middleware/authGuard.js';
import { requireRole } from '../../middleware/roleGuard.js';

const router = Router();

router.use(authGuard);

router.get('/', getTransactions);
router.post('/purchase', requireRole(['ADMIN', 'SENIOR_HR', 'STAFF']), recordPurchase);
router.post('/sale', requireRole(['ADMIN', 'SENIOR_HR', 'STAFF']), recordSale);

export default router;
