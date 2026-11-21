import { Voucher } from '../models/Voucher.js';
import { UserVoucher } from '../models/UserVoucher.js';
import { User } from '../models/User.js';
import { Transaction } from '../models/Transaction.js';

// Helper to generate unique voucher code e.g. ETH-V-78491
const generateVoucherCode = (prefix = 'ETH') => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let result = '';
  for (let i = 0; i < 5; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `${prefix}-${result}`;
};

// @desc    Get all active vouchers available for redemption
// @route   GET /api/vouchers
// @access  Public
export const getVouchers = async (req, res, next) => {
  try {
    const vouchers = await Voucher.find({ isActive: true }).populate('merchant');
    res.json({
      success: true,
      count: vouchers.length,
      vouchers,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Claim/Purchase voucher with points
// @route   POST /api/vouchers/claim/:id
// @access  Private (Customer)
export const claimVoucher = async (req, res, next) => {
  try {
    const voucher = await Voucher.findById(req.params.id).populate('merchant');

    if (!voucher || !voucher.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Voucher not found or currently unavailable.',
      });
    }

    const user = await User.findById(req.user._id);

    if (user.pointsBalance < voucher.pointsCost) {
      return res.status(400).json({
        success: false,
        message: `Insufficient points balance. You need ${voucher.pointsCost} points, but you have ${user.pointsBalance} points.`,
      });
    }

    // Deduct points from user
    user.pointsBalance -= voucher.pointsCost;
    await user.save();

    // Generate unique user voucher
    const uniqueCode = generateVoucherCode(voucher.merchant?.name?.slice(0, 3)?.toUpperCase() || 'ETH');
    const validityDays = voucher.validityDays || 30;
    const expiresAt = new Date(Date.now() + validityDays * 24 * 60 * 60 * 1000);

    const userVoucher = await UserVoucher.create({
      user: user._id,
      voucher: voucher._id,
      uniqueCode,
      pointsPaid: voucher.pointsCost,
      discountAmountETB: voucher.discountAmountETB,
      status: 'ACTIVE',
      expiresAt,
    });

    // Record Transaction
    const txnNumber = `TXN-${Date.now()}-${Math.floor(Math.random() * 9000 + 1000)}`;
    await Transaction.create({
      txnNumber,
      type: 'REDEEM_VOUCHER',
      user: user._id,
      merchant: voucher.merchant?._id || null,
      pointsTransacted: -voucher.pointsCost,
      cashbackEquivalentETB: voucher.discountAmountETB,
      description: `Redeemed ${voucher.pointsCost} points for ${voucher.title} voucher (${uniqueCode})`,
      referenceCode: uniqueCode,
    });

    res.status(201).json({
      success: true,
      message: 'Voucher claimed successfully!',
      userVoucher: {
        id: userVoucher._id,
        uniqueCode: userVoucher.uniqueCode,
        voucherTitle: voucher.title,
        discountAmountETB: voucher.discountAmountETB,
        merchantName: voucher.merchant?.name || 'All Merchants',
        expiresAt: userVoucher.expiresAt,
        status: userVoucher.status,
      },
      remainingPoints: user.pointsBalance,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get logged in user's claimed vouchers
// @route   GET /api/vouchers/my-vouchers
// @access  Private (Customer)
export const getMyVouchers = async (req, res, next) => {
  try {
    const vouchers = await UserVoucher.find({ user: req.user._id })
      .populate({
        path: 'voucher',
        populate: { path: 'merchant' },
      })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: vouchers.length,
      vouchers,
    });
  } catch (err) {
    next(err);
  }
};
