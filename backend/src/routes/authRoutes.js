import express from 'express';
import { register, login, getMe, dailyCheckIn } from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.post('/daily-checkin', protect, dailyCheckIn);

export default router;
