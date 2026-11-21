import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { Transaction } from '../models/Transaction.js';

// Helper to generate JWT
const generateToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET || 'ethio_rewards_super_secure_jwt_secret_key_2026_etb',
    {
      expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    }
  );
};

// Generate random member code like ETR-849201
const generateMemberCode = () => {
  const num = Math.floor(100000 + Math.random() * 900000);
  return `ETR-${num}`;
};

// Generate referral code like ABRHAM83
const generateReferralCode = (name) => {
  const cleanName = name.replace(/[^a-zA-Z]/g, '').toUpperCase().slice(0, 5) || 'USER';
  const num = Math.floor(100 + Math.random() * 900);
  return `${cleanName}${num}`;
};

// @desc    Register a new customer or merchant staff
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res, next) => {
  try {
    const { name, phone, email, password, role, merchantId, referralCodeInput, city } = req.body;

    if (!name || !phone || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, phone number, and password are required.',
      });
    }

    // Check if phone already registered
    const existingUser = await User.findOne({ phone });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'A user with this phone number already exists.',
      });
    }

    const memberCode = generateMemberCode();
    const referralCode = generateReferralCode(name);
    const welcomeBonus = Number(process.env.WELCOME_BONUS_POINTS || 100);

    let referredByUser = null;
    if (referralCodeInput) {
      referredByUser = await User.findOne({ referralCode: referralCodeInput.toUpperCase() });
    }

    const user = await User.create({
      name,
      phone,
      email: email || '',
      password,
      role: role && ['customer', 'merchant_cashier', 'merchant_admin'].includes(role) ? role : 'customer',
      merchant: merchantId || null,
      memberCode,
      referralCode,
      referredBy: referredByUser ? referredByUser._id : null,
      pointsBalance: welcomeBonus,
      lifetimeEarnedPoints: welcomeBonus,
      city: city || 'Addis Ababa',
    });

    user.updateTier();
    await user.save();

    // Log Welcome Bonus Transaction
    await Transaction.create({
      txnNumber: `TXN-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      type: 'WELCOME_BONUS',
      user: user._id,
      pointsTransacted: welcomeBonus,
      cashbackEquivalentETB: welcomeBonus * 0.1,
      description: 'Welcome bonus upon registration with Ethio Rewards',
    });

    // Reward referrer if applicable
    if (referredByUser) {
      const referralBonus = Number(process.env.REFERRAL_BONUS_POINTS || 50);
      referredByUser.pointsBalance += referralBonus;
      referredByUser.lifetimeEarnedPoints += referralBonus;
      referredByUser.updateTier();
      await referredByUser.save();

      await Transaction.create({
        txnNumber: `TXN-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        type: 'REFERRAL_BONUS',
        user: referredByUser._id,
        pointsTransacted: referralBonus,
        cashbackEquivalentETB: referralBonus * 0.1,
        description: `Referral bonus for inviting ${user.name}`,
      });
    }

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        phone: user.phone,
        email: user.email,
        role: user.role,
        merchant: user.merchant,
        memberCode: user.memberCode,
        pointsBalance: user.pointsBalance,
        tier: user.tier,
        referralCode: user.referralCode,
        city: user.city,
      },
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res, next) => {
  try {
    const { loginId, phone, email, password } = req.body;
    const identifier = loginId || phone || email;

    if (!identifier || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide phone/email and password.',
      });
    }

    // Search by phone or email
    const user = await User.findOne({
      $or: [{ phone: identifier }, { email: String(identifier).toLowerCase() }],
    })
      .select('+password')
      .populate('merchant');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials. User not found.',
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials. Incorrect password.',
      });
    }

    if (user.status === 'suspended') {
      return res.status(403).json({
        success: false,
        message: 'Your account has been suspended. Please contact support.',
      });
    }

    const token = generateToken(user._id);

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        phone: user.phone,
        email: user.email,
        role: user.role,
        merchant: user.merchant,
        memberCode: user.memberCode,
        walletBalanceETB: user.walletBalanceETB || 0,
        pointsBalance: user.pointsBalance,
        lifetimeEarnedPoints: user.lifetimeEarnedPoints,
        tier: user.tier,
        referralCode: user.referralCode,
        city: user.city,
      },
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get current logged in user profile & balance
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).populate('merchant');
    
    // 100 points = 10 ETB (1 point = 0.1 ETB)
    const etbEquivalent = Number((user.pointsBalance * 0.1).toFixed(2));

    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        phone: user.phone,
        email: user.email,
        role: user.role,
        merchant: user.merchant,
        memberCode: user.memberCode,
        walletBalanceETB: user.walletBalanceETB || 0,
        pointsBalance: user.pointsBalance,
        lifetimeEarnedPoints: user.lifetimeEarnedPoints,
        etbEquivalent,
        totalAvailableCashETB: Number(((user.walletBalanceETB || 0) + etbEquivalent).toFixed(2)),
        tier: user.tier,
        referralCode: user.referralCode,
        city: user.city,
        createdAt: user.createdAt,
      },
    });
  } catch (err) {
    next(err);
  }
};
