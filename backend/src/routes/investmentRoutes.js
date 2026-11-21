import express from 'express';
import {
  getProducts,
  buyInvestment,
  getMyOrders,
  getAccountStats,
} from '../controllers/investmentController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Public product list
router.get('/products', getProducts);

// Protected routes
router.use(protect);

router.post('/buy', authorize('customer', 'admin'), buyInvestment);
router.get('/my-orders', authorize('customer', 'admin'), getMyOrders);
router.get('/account-stats', authorize('customer', 'admin'), getAccountStats);

export default router;
