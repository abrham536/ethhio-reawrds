import express from 'express';
import {
  lookupCustomer,
  awardPoints,
  redeemVoucherAtCheckout,
  getDailySummary,
} from '../controllers/posController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Cashier POS endpoints
router.use(protect);
router.use(authorize('merchant_cashier', 'merchant_admin', 'admin'));

router.get('/customer-lookup/:identifier', lookupCustomer);
router.post('/award-points', awardPoints);
router.post('/redeem-voucher', redeemVoucherAtCheckout);
router.get('/daily-summary', getDailySummary);

export default router;
