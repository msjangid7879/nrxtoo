import { Router } from 'express';
import { login, signup, getMe } from './authController.js';
import { authGuard } from '../../middleware/authGuard.js';

const router = Router();

// 1. Signup Flow: Only Shop Owner / Admin
router.post('/signup', signup);

// 2. Login Flow: User ID + Password for everyone
router.post('/login', login);

// Session check
router.get('/me', authGuard, getMe);

export default router;
