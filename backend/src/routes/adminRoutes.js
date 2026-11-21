import express from 'express';
import {
  getAdminDashboard,
  getAllUsers,
  getAllTransactions,
  createVoucher,
} from '../controllers/adminController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);
router.use(authorize('admin', 'merchant_admin'));

router.get('/dashboard', authorize('admin'), getAdminDashboard);
router.get('/users', authorize('admin'), getAllUsers);
router.get('/transactions', getAllTransactions);
router.post('/vouchers', createVoucher);

export default router;
