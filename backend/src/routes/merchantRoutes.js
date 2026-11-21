import express from 'express';
import {
  getMerchants,
  getMerchantById,
  createMerchant,
  updateMerchant,
} from '../controllers/merchantController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getMerchants);
router.get('/:id', getMerchantById);
router.post('/', protect, authorize('admin'), createMerchant);
router.put('/:id', protect, authorize('admin', 'merchant_admin'), updateMerchant);

export default router;
