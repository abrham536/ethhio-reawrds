import { DepositRequest } from '../models/DepositRequest.js';
import { WithdrawalRequest } from '../models/WithdrawalRequest.js';
import { User } from '../models/User.js';
import { Transaction } from '../models/Transaction.js';

// Official Platform Bank & Telebirr Accounts for User Deposits
export const PLATFORM_DEPOSIT_ACCOUNTS = [
  {
    id: 'TELEBIRR',
    provider: 'Telebirr',
    providerAmharic: 'ቴሌብር',
    accountNumber: '0911000000',
    accountName: 'Ethio Rewards Official (ኢትዮ ሪዋርድስ)',
    badge: 'ፈጣን / Instant',
    instruction: 'Send via Telebirr "Send Money" and copy the Transaction ID.',
    instructionAmharic: 'በቴሌብር «ገንዘብ ላክ» በኩል ልከው የደረሰኝ ቁጥሩን (Transaction ID) ያስገቡ።',
    logo: '📱',
  },
  {
    id: 'CBE',
    provider: 'Commercial Bank of Ethiopia (CBE)',
    providerAmharic: 'የኢትዮጵያ ንግድ ባንክ (CBE)',
    accountNumber: '1000123456789',
    accountName: 'Ethio Rewards Technology PLC',
    badge: 'CBE Birr / CBE Mobile',
    instruction: 'Transfer via CBE Mobile Banking or CBE Birr and upload screenshot.',
    instructionAmharic: 'በንግድ ባንክ ሞባይል ባንኪንግ ወይም ሲቢኢ ብር አስተላልፈው ደረሰኝ ያያይዙ።',
    logo: '🏦',
  },
  {
    id: 'BOA',
    provider: 'Bank of Abyssinia (BOA)',
    providerAmharic: 'አቢሲኒያ ባንክ (BOA)',
    accountNumber: '8821902134',
    accountName: 'Ethio Rewards Platform',
    badge: 'BOA Mobile',
    instruction: 'Transfer via Bank of Abyssinia app and save screenshot receipt.',
    instructionAmharic: 'በአቢሲኒያ ባንክ መተግበሪያ አስተላልፈው ደረሰኝ ያያይዙ።',
    logo: '💳',
  },
];

// @desc    Get official platform deposit accounts
// @route   GET /api/finance/deposit-accounts
// @access  Public
export const getDepositAccounts = (req, res) => {
  res.json({
    success: true,
    accounts: PLATFORM_DEPOSIT_ACCOUNTS,
  });
};

// @desc    Customer submits a deposit request with payment screenshot
// @route   POST /api/finance/deposit
// @access  Private (Customer)
export const submitDeposit = async (req, res, next) => {
  try {
    const {
      amountETB,
      paymentMethod,
      transactionRef,
      screenshotUrl,
      senderPhoneOrAccount,
      userNote,
    } = req.body;

    const amount = Number(amountETB);
    if (!amount || amount < 10) {
      return res.status(400).json({
        success: false,
        message: 'Minimum deposit amount is 10 ETB.',
      });
    }

    if (!transactionRef || !transactionRef.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Transaction Reference ID (e.g. Telebirr Txn ID) is required.',
      });
    }

    // Anti-Fraud check: Ensure this transactionRef was not already submitted!
    const existing = await DepositRequest.findOne({
      transactionRef: transactionRef.trim(),
    });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'This transaction reference ID has already been submitted. Duplicate receipts are not allowed.',
      });
    }

    const requestNumber = `DEP-${Date.now()}-${Math.floor(Math.random() * 900 + 100)}`;

    const deposit = await DepositRequest.create({
      requestNumber,
      user: req.user._id,
      amountETB: amount,
      paymentMethod: paymentMethod || 'TELEBIRR',
      transactionRef: transactionRef.trim(),
      screenshotUrl: screenshotUrl || '',
      senderPhoneOrAccount: senderPhoneOrAccount || req.user.phone,
      userNote: userNote || '',
      status: 'PENDING',
    });

    // Record pending transaction in audit ledger
    const txnNumber = `TXN-${Date.now()}-${Math.floor(Math.random() * 9000 + 1000)}`;
    await Transaction.create({
      txnNumber,
      type: 'DEPOSIT',
      user: req.user._id,
      billAmountETB: amount,
      pointsTransacted: 0,
      cashbackEquivalentETB: amount,
      description: `Deposit request of ${amount} ETB via ${paymentMethod} (${transactionRef})`,
      referenceCode: requestNumber,
      status: 'PENDING',
    });

    res.status(201).json({
      success: true,
      message: 'Deposit request submitted successfully! Admin will verify and credit your wallet shortly.',
      deposit,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Customer views their deposit requests
// @route   GET /api/finance/my-deposits
// @access  Private (Customer)
export const getMyDeposits = async (req, res, next) => {
  try {
    const deposits = await DepositRequest.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json({
      success: true,
      count: deposits.length,
      deposits,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Customer submits a withdrawal request for their wallet profit/balance
// @route   POST /api/finance/withdraw
// @access  Private (Customer)
export const submitWithdrawal = async (req, res, next) => {
  try {
    const { amountETB, method, accountNumber, accountHolderName } = req.body;

    const amount = Number(amountETB);
    if (!amount || amount < 50) {
      return res.status(400).json({
        success: false,
        message: 'Minimum withdrawal amount is 50 ETB.',
      });
    }

    if (!accountNumber || !accountHolderName) {
      return res.status(400).json({
        success: false,
        message: 'Account/Phone number and account holder name are required.',
      });
    }

    const user = await User.findById(req.user._id);

    // Calculate total available cash: walletBalanceETB + (pointsBalance * 0.1)
    const walletBalance = user.walletBalanceETB || 0;
    const pointsCashValue = (user.pointsBalance || 0) * 0.1;
    const totalAvailableCash = walletBalance + pointsCashValue;

    if (totalAvailableCash < amount) {
      return res.status(400).json({
        success: false,
        message: `Insufficient balance. You requested ${amount} ETB, but your available balance is ${totalAvailableCash.toFixed(2)} ETB.`,
      });
    }

    // Deduct first from walletBalanceETB, and remainder from pointsBalance
    if (walletBalance >= amount) {
      user.walletBalanceETB -= amount;
    } else {
      const remainderETB = amount - walletBalance;
      const pointsToDeduct = Math.ceil(remainderETB * 10);
      user.walletBalanceETB = 0;
      user.pointsBalance = Math.max(0, user.pointsBalance - pointsToDeduct);
    }
    await user.save();

    const requestNumber = `WTH-${Date.now()}-${Math.floor(Math.random() * 900 + 100)}`;

    const withdrawal = await WithdrawalRequest.create({
      requestNumber,
      user: user._id,
      amountETB: amount,
      method: method || 'TELEBIRR',
      accountNumber: accountNumber.trim(),
      accountHolderName: accountHolderName.trim(),
      status: 'PENDING',
    });

    const txnNumber = `TXN-${Date.now()}-${Math.floor(Math.random() * 9000 + 1000)}`;
    await Transaction.create({
      txnNumber,
      type: 'WITHDRAWAL',
      user: user._id,
      billAmountETB: amount,
      pointsTransacted: 0,
      cashbackEquivalentETB: amount,
      description: `Withdrawal request of ${amount} ETB via ${method} to ${accountNumber}`,
      referenceCode: requestNumber,
      status: 'PENDING',
    });

    res.status(201).json({
      success: true,
      message: `Withdrawal request for ${amount} ETB submitted! Admin will approve and send the money to your account.`,
      withdrawal,
      remainingWalletBalance: user.walletBalanceETB,
      remainingPoints: user.pointsBalance,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Customer views their withdrawal history
// @route   GET /api/finance/my-withdrawals
// @access  Private (Customer)
export const getMyWithdrawals = async (req, res, next) => {
  try {
    const withdrawals = await WithdrawalRequest.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json({
      success: true,
      count: withdrawals.length,
      withdrawals,
    });
  } catch (err) {
    next(err);
  }
};

// ================= ADMIN CONTROLLERS =================

// @desc    Admin lists deposit requests (with status filter)
// @route   GET /api/finance/admin/deposits
// @access  Private (Admin)
export const getAdminDeposits = async (req, res, next) => {
  try {
    const { status } = req.query;
    const query = {};
    if (status && status !== 'ALL') {
      query.status = status;
    }

    const deposits = await DepositRequest.find(query)
      .populate('user', 'name phone memberCode tier walletBalanceETB')
      .populate('reviewedBy', 'name')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: deposits.length,
      deposits,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Admin approves or rejects a user deposit
// @route   PUT /api/finance/admin/deposits/:id/decide
// @access  Private (Admin)
export const decideDeposit = async (req, res, next) => {
  try {
    const { decision, adminNote } = req.body; // 'APPROVE' or 'REJECT'

    if (!['APPROVE', 'REJECT'].includes(decision)) {
      return res.status(400).json({
        success: false,
        message: "Decision must be 'APPROVE' or 'REJECT'.",
      });
    }

    const deposit = await DepositRequest.findById(req.params.id);
    if (!deposit) {
      return res.status(404).json({ success: false, message: 'Deposit request not found.' });
    }

    if (deposit.status !== 'PENDING') {
      return res.status(400).json({
        success: false,
        message: `This deposit has already been ${deposit.status.toLowerCase()}.`,
      });
    }

    if (decision === 'APPROVE') {
      deposit.status = 'APPROVED';
      deposit.adminNote = adminNote || 'Verified and credited.';
      deposit.reviewedBy = req.user._id;
      deposit.reviewedAt = new Date();
      await deposit.save();

      // Credit User's Cash Wallet
      const user = await User.findById(deposit.user);
      if (user) {
        user.walletBalanceETB = (user.walletBalanceETB || 0) + deposit.amountETB;
        
        // Also reward bonus points for deposit (e.g. 1 point per 20 ETB)
        const bonusPoints = Math.round(deposit.amountETB * 0.05 * 10);
        user.pointsBalance += bonusPoints;
        user.lifetimeEarnedPoints += bonusPoints;
        user.updateTier();
        await user.save();
      }

      // Mark transaction completed
      await Transaction.findOneAndUpdate(
        { referenceCode: deposit.requestNumber },
        { status: 'COMPLETED' }
      );

      return res.json({
        success: true,
        message: `Deposit of ${deposit.amountETB} ETB approved and credited to ${user?.name}'s wallet!`,
        deposit,
      });
    } else {
      // REJECT
      deposit.status = 'REJECTED';
      deposit.adminNote = adminNote || 'Declined: payment receipt could not be verified.';
      deposit.reviewedBy = req.user._id;
      deposit.reviewedAt = new Date();
      await deposit.save();

      await Transaction.findOneAndUpdate(
        { referenceCode: deposit.requestNumber },
        { status: 'CANCELLED' }
      );

      return res.json({
        success: true,
        message: `Deposit request ${deposit.requestNumber} rejected.`,
        deposit,
      });
    }
  } catch (err) {
    next(err);
  }
};

// @desc    Admin lists withdrawal requests
// @route   GET /api/finance/admin/withdrawals
// @access  Private (Admin)
export const getAdminWithdrawals = async (req, res, next) => {
  try {
    const { status } = req.query;
    const query = {};
    if (status && status !== 'ALL') {
      query.status = status;
    }

    const withdrawals = await WithdrawalRequest.find(query)
      .populate('user', 'name phone memberCode tier walletBalanceETB')
      .populate('reviewedBy', 'name')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: withdrawals.length,
      withdrawals,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Admin approves or rejects a user withdrawal
// @route   PUT /api/finance/admin/withdrawals/:id/decide
// @access  Private (Admin)
export const decideWithdrawal = async (req, res, next) => {
  try {
    const { decision, adminNote, payoutReceiptRef } = req.body;

    if (!['APPROVE', 'REJECT'].includes(decision)) {
      return res.status(400).json({
        success: false,
        message: "Decision must be 'APPROVE' or 'REJECT'.",
      });
    }

    const withdrawal = await WithdrawalRequest.findById(req.params.id);
    if (!withdrawal) {
      return res.status(404).json({ success: false, message: 'Withdrawal request not found.' });
    }

    if (withdrawal.status !== 'PENDING') {
      return res.status(400).json({
        success: false,
        message: `This withdrawal request has already been ${withdrawal.status.toLowerCase()}.`,
      });
    }

    if (decision === 'APPROVE') {
      withdrawal.status = 'APPROVED';
      withdrawal.adminNote = adminNote || 'Transferred successfully.';
      withdrawal.payoutReceiptRef = payoutReceiptRef || '';
      withdrawal.reviewedBy = req.user._id;
      withdrawal.reviewedAt = new Date();
      await withdrawal.save();

      await Transaction.findOneAndUpdate(
        { referenceCode: withdrawal.requestNumber },
        { status: 'COMPLETED' }
      );

      return res.json({
        success: true,
        message: `Withdrawal request ${withdrawal.requestNumber} marked as approved & paid.`,
        withdrawal,
      });
    } else {
      // REJECT: Refund the money back to the user's wallet!
      withdrawal.status = 'REJECTED';
      withdrawal.adminNote = adminNote || 'Declined by administrator.';
      withdrawal.reviewedBy = req.user._id;
      withdrawal.reviewedAt = new Date();
      await withdrawal.save();

      const user = await User.findById(withdrawal.user);
      if (user) {
        user.walletBalanceETB = (user.walletBalanceETB || 0) + withdrawal.amountETB;
        await user.save();
      }

      await Transaction.findOneAndUpdate(
        { referenceCode: withdrawal.requestNumber },
        { status: 'CANCELLED' }
      );

      return res.json({
        success: true,
        message: `Withdrawal rejected. ${withdrawal.amountETB} ETB has been refunded to customer wallet.`,
        withdrawal,
      });
    }
  } catch (err) {
    next(err);
  }
};
