import { Merchant } from '../models/Merchant.js';
import { Transaction } from '../models/Transaction.js';

// @desc    Get all verified merchants with optional category & city filters
// @route   GET /api/merchants
// @access  Public
export const getMerchants = async (req, res, next) => {
  try {
    const { category, city, search } = req.query;
    const query = { isVerified: true, isActive: true };

    if (category && category !== 'All') {
      query.category = category;
    }

    if (city && city !== 'All') {
      query.city = city;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { tradeNameAmharic: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const merchants = await Merchant.find(query).sort({ totalSalesVolumeETB: -1 });

    res.json({
      success: true,
      count: merchants.length,
      merchants,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single merchant details
// @route   GET /api/merchants/:id
// @access  Public
export const getMerchantById = async (req, res, next) => {
  try {
    const merchant = await Merchant.findById(req.params.id);

    if (!merchant) {
      return res.status(404).json({
        success: false,
        message: 'Merchant not found.',
      });
    }

    res.json({
      success: true,
      merchant,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Create a new merchant (Admin only)
// @route   POST /api/merchants
// @access  Private (Admin)
export const createMerchant = async (req, res, next) => {
  try {
    const merchant = await Merchant.create(req.body);
    res.status(201).json({
      success: true,
      merchant,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update merchant info & deals
// @route   PUT /api/merchants/:id
// @access  Private (Admin or Merchant Admin)
export const updateMerchant = async (req, res, next) => {
  try {
    let merchant = await Merchant.findById(req.params.id);
    if (!merchant) {
      return res.status(404).json({ success: false, message: 'Merchant not found.' });
    }

    // Check ownership if merchant_admin
    if (
      req.user.role === 'merchant_admin' &&
      req.user.merchant?.toString() !== req.params.id
    ) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: You can only update your own merchant profile.',
      });
    }

    merchant = await Merchant.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.json({
      success: true,
      merchant,
    });
  } catch (err) {
    next(err);
  }
};
