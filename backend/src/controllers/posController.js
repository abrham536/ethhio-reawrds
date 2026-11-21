import { User } from '../models/User.js';
import { Merchant } from '../models/Merchant.js';
import { Transaction } from '../models/Transaction.js';
import { UserVoucher } from '../models/UserVoucher.js';

// Helper to calculate tier bonus multiplier
// Bronze: 1.0x, Silver: 1.1x, Gold: 1.25x, Platinum: 1.5x
const getTierMultiplier = (tier) => {
  switch (tier) {
    case 'Platinum':
      return 1.5;
    case 'Gold':
      return 1.25;
    case 'Silver':
      return 1.1;
    default:
      return 1.0;
  }
};

// @desc    Customer lookup by phone or member code (For POS cashier preview)
// @route   GET /api/pos/customer-lookup/:identifier
// @access  Private (Merchant Cashier, Merchant Admin, Admin)
export const lookupCustomer = async (req, res, next) => {
  try {
    const { identifier } = req.params;

    const customer = await User.findOne({
      $or: [
        { phone: identifier },
        { memberCode: identifier.toUpperCase() },
        { referralCode: identifier.toUpperCase() },
      ],
      role: 'customer',
    });

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: `Customer with identifier '${identifier}' not found.`,
      });
    }

    // Also fetch customer's active vouchers for this merchant
    const merchantId = req.user.merchant;
    const activeVouchers = await UserVoucher.find({
      user: customer._id,
      status: 'ACTIVE',
      expiresAt: { $gte: new Date() },
    }).populate('voucher');

    res.json({
      success: true,
      customer: {
        id: customer._id,
        name: customer.name,
        phone: customer.phone,
        memberCode: customer.memberCode,
        tier: customer.tier,
        pointsBalance: customer.pointsBalance,
        etbEquivalent: (customer.pointsBalance * 0.1).toFixed(2),
        tierMultiplier: getTierMultiplier(customer.tier),
      },
      availableVouchers: activeVouchers,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Award points & cashback to customer for retail purchase
// @route   POST /api/pos/award-points
// @access  Private (Merchant Cashier, Merchant Admin, Admin)
export const awardPoints = async (req, res, next) => {
  try {
    const { customerIdentifier, billAmountETB, receiptNumber, note } = req.body;

    const bill = Number(billAmountETB);
    if (!bill || bill <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Valid purchase bill amount in ETB is required.',
      });
    }

    if (!customerIdentifier) {
      return res.status(400).json({
        success: false,
        message: 'Customer phone number or Member Code is required.',
      });
    }

    // Find customer
    const customer = await User.findOne({
      $or: [
        { phone: customerIdentifier.trim() },
        { memberCode: customerIdentifier.trim().toUpperCase() },
      ],
      role: 'customer',
    });

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found. Please verify member code or phone number.',
      });
    }

    // Find merchant
    const merchantId = req.user.merchant || req.body.merchantId;
    let merchant = null;
    if (merchantId) {
      merchant = await Merchant.findById(merchantId);
    }

    // Default rate: 5% cashback or 1 point per 10 ETB (0.1 points per ETB)
    const cashbackPercent = merchant?.cashbackRate || 5;
    const baseCashbackETB = (bill * cashbackPercent) / 100;
    
    // Tier multiplier bonus: e.g. Gold gets 1.25x points!
    const multiplier = getTierMultiplier(customer.tier);
    const effectiveCashbackETB = baseCashbackETB * multiplier;

    // 1 ETB cashback = 10 Points
    const pointsEarned = Math.round(effectiveCashbackETB * 10);

    // Update customer balance & tier
    customer.pointsBalance += pointsEarned;
    customer.lifetimeEarnedPoints += pointsEarned;
    customer.updateTier();
    await customer.save();

    // Update merchant analytics
    if (merchant) {
      merchant.totalSalesVolumeETB += bill;
      merchant.totalPointsIssued += pointsEarned;
      await merchant.save();
    }

    const txnNumber = `TXN-${Date.now()}-${Math.floor(Math.random() * 9000 + 1000)}`;

    const transaction = await Transaction.create({
      txnNumber,
      type: 'EARN',
      user: customer._id,
      merchant: merchant ? merchant._id : null,
      cashier: req.user._id,
      billAmountETB: bill,
      pointsTransacted: pointsEarned,
      cashbackEquivalentETB: Number(effectiveCashbackETB.toFixed(2)),
      description: `Earned ${pointsEarned} points (${cashbackPercent}% cashback + ${multiplier}x ${customer.tier} tier bonus) at ${merchant?.name || 'Partner Merchant'}`,
      referenceCode: receiptNumber || '',
      metadata: {
        receiptNumber: receiptNumber || '',
        note: note || '',
        merchantName: merchant?.name || '',
      },
    });

    res.status(201).json({
      success: true,
      message: `Successfully awarded ${pointsEarned} points to ${customer.name}!`,
      receipt: {
        txnNumber,
        customerName: customer.name,
        customerPhone: customer.phone,
        memberCode: customer.memberCode,
        customerTier: customer.tier,
        billAmountETB: bill,
        cashbackPercent,
        tierMultiplier: multiplier,
        cashbackEarnedETB: Number(effectiveCashbackETB.toFixed(2)),
        pointsAwarded: pointsEarned,
        newPointsBalance: customer.pointsBalance,
        newETBEquivalent: (customer.pointsBalance * 0.1).toFixed(2),
        merchantName: merchant?.name || 'Ethio Rewards Partner',
        timestamp: transaction.createdAt,
      },
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Redeem customer voucher at checkout (apply discount)
// @route   POST /api/pos/redeem-voucher
// @access  Private (Merchant Cashier, Merchant Admin, Admin)
export const redeemVoucherAtCheckout = async (req, res, next) => {
  try {
    const { voucherCode, billAmountETB } = req.body;

    if (!voucherCode) {
      return res.status(400).json({
        success: false,
        message: 'Voucher code is required.',
      });
    }

    const userVoucher = await UserVoucher.findOne({
      uniqueCode: voucherCode.trim().toUpperCase(),
    })
      .populate('user')
      .populate('voucher');

    if (!userVoucher) {
      return res.status(404).json({
        success: false,
        message: 'Invalid voucher code. Voucher not found.',
      });
    }

    if (userVoucher.status === 'REDEEMED') {
      return res.status(400).json({
        success: false,
        message: `This voucher was already redeemed on ${userVoucher.redeemedAt?.toLocaleDateString()}.`,
      });
    }

    if (userVoucher.status === 'EXPIRED' || new Date(userVoucher.expiresAt) < new Date()) {
      userVoucher.status = 'EXPIRED';
      await userVoucher.save();
      return res.status(400).json({
        success: false,
        message: 'This voucher has expired.',
      });
    }

    // Check minimum purchase amount if applicable
    const bill = Number(billAmountETB || 0);
    if (userVoucher.voucher?.minPurchaseETB > 0 && bill < userVoucher.voucher.minPurchaseETB) {
      return res.status(400).json({
        success: false,
        message: `Minimum purchase of ${userVoucher.voucher.minPurchaseETB} ETB is required to use this voucher.`,
      });
    }

    // Mark as redeemed
    userVoucher.status = 'REDEEMED';
    userVoucher.redeemedAt = new Date();
    userVoucher.redeemedMerchant = req.user.merchant || null;
    userVoucher.redeemedCashier = req.user._id;
    await userVoucher.save();

    // Log transaction
    const txnNumber = `TXN-${Date.now()}-${Math.floor(Math.random() * 9000 + 1000)}`;
    await Transaction.create({
      txnNumber,
      type: 'REDEEM_VOUCHER',
      user: userVoucher.user._id,
      merchant: req.user.merchant || null,
      cashier: req.user._id,
      billAmountETB: bill,
      pointsTransacted: 0, // Points were already paid when voucher was claimed
      cashbackEquivalentETB: userVoucher.discountAmountETB,
      description: `Redeemed ${userVoucher.discountAmountETB} ETB voucher (${userVoucher.uniqueCode}) at checkout`,
      referenceCode: userVoucher.uniqueCode,
    });

    res.json({
      success: true,
      message: `Voucher redeemed successfully! Discount of ${userVoucher.discountAmountETB} ETB applied.`,
      redemption: {
        uniqueCode: userVoucher.uniqueCode,
        discountAmountETB: userVoucher.discountAmountETB,
        customerName: userVoucher.user.name,
        voucherTitle: userVoucher.voucher?.title,
        redeemedAt: userVoucher.redeemedAt,
      },
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get cashier daily terminal statistics
// @route   GET /api/pos/daily-summary
// @access  Private (Merchant Cashier, Merchant Admin, Admin)
export const getDailySummary = async (req, res, next) => {
  try {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const query = {
      createdAt: { $gte: startOfDay },
    };

    if (req.user.merchant) {
      query.merchant = req.user.merchant;
    }

    const transactions = await Transaction.find(query).populate('user', 'name phone memberCode');

    const totalBills = transactions.filter((t) => t.type === 'EARN').reduce((acc, t) => acc + (t.billAmountETB || 0), 0);
    const totalPointsAwarded = transactions.filter((t) => t.type === 'EARN').reduce((acc, t) => acc + t.pointsTransacted, 0);
    const totalVouchersRedeemed = transactions.filter((t) => t.type === 'REDEEM_VOUCHER').length;

    res.json({
      success: true,
      date: new Date().toISOString().split('T')[0],
      summary: {
        transactionCount: transactions.length,
        totalSalesVolumeETB: Number(totalBills.toFixed(2)),
        totalPointsAwarded,
        totalVouchersRedeemed,
      },
      recentTransactions: transactions.slice(0, 10),
    });
  } catch (err) {
    next(err);
  }
};
