import express from 'express';
import {
  getVouchers,
  claimVoucher,
  getMyVouchers,
} from '../controllers/voucherController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getVouchers);
router.post('/claim/:id', protect, authorize('customer'), claimVoucher);
router.get('/my-vouchers', protect, authorize('customer'), getMyVouchers);

export default router;
