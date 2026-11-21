import { User } from '../models/User.js';
import { Merchant } from '../models/Merchant.js';
import { Transaction } from '../models/Transaction.js';
import { PayoutRequest } from '../models/PayoutRequest.js';
import { Voucher } from '../models/Voucher.js';

// @desc    Get system-wide overview analytics for Ethio Rewards Platform
// @route   GET /api/admin/dashboard
// @access  Private (Admin)
export const getAdminDashboard = async (req, res, next) => {
  try {
    const totalCustomers = await User.countDocuments({ role: 'customer' });
    const totalMerchants = await Merchant.countDocuments();
    const verifiedMerchants = await Merchant.countDocuments({ isVerified: true });
    const pendingPayouts = await PayoutRequest.countDocuments({ status: 'PENDING' });

    // Aggregate total GMV (Gross Merchandise Value) & Points Issued
    const stats = await Transaction.aggregate([
      {
        $group: {
          _id: null,
          totalGMV: { $sum: '$billAmountETB' },
          totalPointsIssued: {
            $sum: {
              $cond: [{ $gt: ['$pointsTransacted', 0] }, '$pointsTransacted', 0],
            },
          },
          totalPointsRedeemed: {
            $sum: {
              $cond: [{ $lt: ['$pointsTransacted', 0] }, { $abs: '$pointsTransacted' }, 0],
            },
          },
        },
      },
    ]);

    const aggregated = stats[0] || {
      totalGMV: 0,
      totalPointsIssued: 0,
      totalPointsRedeemed: 0,
    };

    const recentTransactions = await Transaction.find()
      .populate('user', 'name phone memberCode')
      .populate('merchant', 'name category')
      .sort({ createdAt: -1 })
      .limit(10);

    res.json({
      success: true,
      metrics: {
        totalCustomers,
        totalMerchants,
        verifiedMerchants,
        pendingPayouts,
        totalSalesVolumeETB: Number(aggregated.totalGMV.toFixed(2)),
        totalPointsIssued: aggregated.totalPointsIssued,
        totalPointsRedeemed: aggregated.totalPointsRedeemed,
        circulatingPointsValueETB: Number(((aggregated.totalPointsIssued - aggregated.totalPointsRedeemed) * 0.1).toFixed(2)),
      },
      recentTransactions,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get all users with optional role filter
// @route   GET /api/admin/users
// @access  Private (Admin)
export const getAllUsers = async (req, res, next) => {
  try {
    const { role } = req.query;
    const query = {};
    if (role && role !== 'ALL') {
      query.role = role;
    }

    const users = await User.find(query).populate('merchant', 'name').sort({ createdAt: -1 });

    res.json({
      success: true,
      count: users.length,
      users,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get all transactions ledger
// @route   GET /api/admin/transactions
// @access  Private (Admin, Merchant Admin)
export const getAllTransactions = async (req, res, next) => {
  try {
    const { type, limit = 50 } = req.query;
    const query = {};
    if (type && type !== 'ALL') {
      query.type = type;
    }

    // If merchant admin, restrict to their merchant
    if (req.user.role === 'merchant_admin' || req.user.role === 'merchant_cashier') {
      query.merchant = req.user.merchant;
    }

    const transactions = await Transaction.find(query)
      .populate('user', 'name phone memberCode tier')
      .populate('merchant', 'name category')
      .populate('cashier', 'name')
      .sort({ createdAt: -1 })
      .limit(Number(limit));

    res.json({
      success: true,
      count: transactions.length,
      transactions,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Create a new voucher in catalog
// @route   POST /api/admin/vouchers
// @access  Private (Admin, Merchant Admin)
export const createVoucher = async (req, res, next) => {
  try {
    const voucher = await Voucher.create(req.body);
    res.status(201).json({
      success: true,
      voucher,
    });
  } catch (err) {
    next(err);
  }
};
