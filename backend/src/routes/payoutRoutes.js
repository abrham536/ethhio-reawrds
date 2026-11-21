import express from 'express';
import {
  requestPayout,
  getMyPayouts,
  getAdminPayoutQueue,
  decidePayout,
} from '../controllers/payoutController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

// Customer endpoints
router.post('/request', authorize('customer'), requestPayout);
router.get('/my-requests', authorize('customer'), getMyPayouts);

// Admin endpoints
router.get('/admin/queue', authorize('admin'), getAdminPayoutQueue);
router.put('/admin/:id/decide', authorize('admin'), decidePayout);

export default router;
