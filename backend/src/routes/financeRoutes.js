import express from 'express';
import {
  getDepositAccounts,
  submitDeposit,
  getMyDeposits,
  submitWithdrawal,
  getMyWithdrawals,
  bindBankCard,
  getBankCard,
  getAdminDeposits,
  decideDeposit,
  getAdminWithdrawals,
  decideWithdrawal,
} from '../controllers/financeController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Public platform bank accounts
router.get('/deposit-accounts', getDepositAccounts);

// Protected user routes
router.use(protect);

router.post('/deposit', authorize('customer', 'admin'), submitDeposit);
router.get('/my-deposits', authorize('customer', 'admin'), getMyDeposits);
router.post('/withdraw', authorize('customer', 'admin'), submitWithdrawal);
router.get('/my-withdrawals', authorize('customer', 'admin'), getMyWithdrawals);
router.post('/bind-card', authorize('customer', 'admin'), bindBankCard);
router.get('/bank-card', authorize('customer', 'admin'), getBankCard);

// Admin-only approval routes
router.get('/admin/deposits', authorize('admin'), getAdminDeposits);
router.put('/admin/deposits/:id/decide', authorize('admin'), decideDeposit);
router.get('/admin/withdrawals', authorize('admin'), getAdminWithdrawals);
router.put('/admin/withdrawals/:id/decide', authorize('admin'), decideWithdrawal);

export default router;
