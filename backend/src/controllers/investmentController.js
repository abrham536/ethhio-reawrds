import { InvestmentOrder } from '../models/InvestmentOrder.js';
import { User } from '../models/User.js';
import { Transaction } from '../models/Transaction.js';

export const INVESTMENT_PRODUCTS = [
  {
    id: 'vip1',
    name: 'Pampers Diaper Technology',
    tagline: 'Decoding the "Core" Future',
    category: 'bestseller',
    vipTarget: 1,
    badge: 'VIP0',
    days: 49,
    price: 500.0,
    dailyEarnings: 417.4,
    totalIncome: 20452.6,
    imageUrl: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?w=800&auto=format&fit=crop&q=80',
    brand: 'Pampers',
  },
  {
    id: 'vip2',
    name: 'Ariel 30 Years Clean Care',
    tagline: 'Deep Fiber Formula - 30 Years Trusted',
    category: 'bestseller',
    vipTarget: 2,
    badge: 'VIP0',
    days: 49,
    price: 3060.0,
    dailyEarnings: 2640.0,
    totalIncome: 129360.0,
    imageUrl: 'https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=800&auto=format&fit=crop&q=80',
    brand: 'Ariel',
  },
  {
    id: 'vip3',
    name: 'Always Liquid Sanity Pads PRO',
    tagline: 'PRO 240mm 100% Better Protection',
    category: 'bestseller',
    vipTarget: 3,
    badge: 'VIP0',
    days: 49,
    price: 17000.0,
    dailyEarnings: 14700.0,
    totalIncome: 720300.0,
    imageUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&auto=format&fit=crop&q=80',
    brand: 'Always',
  },
  {
    id: 'vip4',
    name: 'Braun Soft Light Thermometer',
    tagline: 'Soft Light Silent Measurement Temperature Easily',
    category: 'bestseller',
    vipTarget: 4,
    badge: 'VIP0',
    days: 49,
    price: 36188.0,
    dailyEarnings: 31450.0,
    totalIncome: 1541050.0,
    imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&auto=format&fit=crop&q=80',
    brand: 'Braun',
  },
  {
    id: 'vip5',
    name: 'HEGII Sanitary Luxury Suite',
    tagline: 'The Journey of Yearning Here',
    category: 'bestseller',
    vipTarget: 5,
    badge: 'VIP0',
    days: 49,
    price: 69000.0,
    dailyEarnings: 60000.0,
    totalIncome: 2940000.0,
    imageUrl: 'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?w=800&auto=format&fit=crop&q=80',
    brand: 'HEGII',
  },
  {
    id: 'vip6',
    name: 'Braun Personal Care Deluxe',
    tagline: 'German Engineering Precision Care',
    category: 'bestseller',
    vipTarget: 6,
    badge: 'VIP0',
    days: 49,
    price: 104000.0,
    dailyEarnings: 92000.0,
    totalIncome: 4500000.0,
    imageUrl: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&auto=format&fit=crop&q=80',
    brand: 'Braun',
  },
  {
    id: 'vip7',
    name: 'Crest Oral Care Pro-Pila 20',
    tagline: 'Oral Care Products 20 Fort Nlutoe',
    category: 'bestseller',
    vipTarget: 7,
    badge: 'VIP0',
    days: 49,
    price: 138700.0,
    dailyEarnings: 124800.0,
    totalIncome: 6115200.0,
    imageUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=800&auto=format&fit=crop&q=80',
    brand: 'Crest',
  },
  // Discount category items
  {
    id: 'disc1',
    name: 'Oral-B Sonic Vitality Toothbrush',
    tagline: 'Flash Sale 25% Off Daily Rewards',
    category: 'discount',
    vipTarget: 1,
    badge: 'DISCOUNT',
    days: 30,
    price: 1188.0,
    dailyEarnings: 990.0,
    totalIncome: 29700.0,
    imageUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=800&auto=format&fit=crop&q=80',
    brand: 'Oral-B',
  },
  {
    id: 'disc2',
    name: 'Safeguard Antibacterial Care Pack',
    tagline: 'Essential Health Bundle Discount',
    category: 'discount',
    vipTarget: 2,
    badge: 'DISCOUNT',
    days: 35,
    price: 2888.0,
    dailyEarnings: 2450.0,
    totalIncome: 85750.0,
    imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&auto=format&fit=crop&q=80',
    brand: 'Safeguard',
  },
  // Promotion category items
  {
    id: 'promo1',
    name: 'P&G Global Innovation Fund',
    tagline: 'High Yield Promotional Return Plan',
    category: 'promotion',
    vipTarget: 3,
    badge: 'HOT',
    days: 60,
    price: 6860.0,
    dailyEarnings: 5980.0,
    totalIncome: 358800.0,
    imageUrl: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=800&auto=format&fit=crop&q=80',
    brand: 'P&G Global',
  },
];

// @desc    Get all investment products
// @route   GET /api/invest/products
// @access  Public
export const getProducts = (req, res) => {
  const category = req.query.category;
  let products = INVESTMENT_PRODUCTS;
  if (category && category !== 'all') {
    products = products.filter((p) => p.category === category);
  }
  res.json({
    success: true,
    count: products.length,
    products,
  });
};

// @desc    Invest in a product
// @route   POST /api/invest/buy
// @access  Private (Customer)
export const buyInvestment = async (req, res, next) => {
  try {
    const { productId } = req.body;
    const product = INVESTMENT_PRODUCTS.find((p) => p.id === productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found.',
      });
    }

    const user = await User.findById(req.user._id);

    // Check balance: user.walletBalanceETB
    const userBalance = (user.walletBalanceETB || 0) + (user.rechargeBalance || 0);

    if (userBalance < product.price) {
      return res.status(400).json({
        success: false,
        insufficientBalance: true,
        shortage: product.price - userBalance,
        message: `Insufficient balance. Price is Br${product.price.toLocaleString()}, your balance is Br${userBalance.toLocaleString()}. Please recharge first.`,
      });
    }

    // Deduct price from user balance
    if (user.rechargeBalance >= product.price) {
      user.rechargeBalance -= product.price;
    } else {
      const remainder = product.price - (user.rechargeBalance || 0);
      user.rechargeBalance = 0;
      user.walletBalanceETB = Math.max(0, (user.walletBalanceETB || 0) - remainder);
    }

    // Upgrade VIP level if this product's target is higher
    if (product.vipTarget > (user.vipLevel || 0)) {
      user.vipLevel = product.vipTarget;
    }

    await user.save();

    // Create Investment Order
    const orderNumber = `ORD-${Date.now()}-${Math.floor(Math.random() * 900 + 100)}`;
    const expiryDate = new Date(Date.now() + product.days * 24 * 60 * 60 * 1000);

    const order = await InvestmentOrder.create({
      orderNumber,
      user: user._id,
      productId: product.id,
      productName: product.name,
      category: product.category,
      vipTarget: product.vipTarget,
      price: product.price,
      dailyEarnings: product.dailyEarnings,
      days: product.days,
      daysElapsed: 1,
      totalIncome: product.totalIncome,
      earnedSoFar: product.dailyEarnings, // initial day reward credit
      status: 'IN_GAINS',
      expiryDate,
    });

    // Credit first day's earnings to productIncome & withdrawBalance
    user.productIncome = (user.productIncome || 0) + product.dailyEarnings;
    user.withdrawBalance = (user.withdrawBalance || 0) + product.dailyEarnings;
    await user.save();

    // Record transaction
    const txnNumber = `TXN-${Date.now()}-${Math.floor(Math.random() * 9000 + 1000)}`;
    await Transaction.create({
      txnNumber,
      type: 'REDEEM_VOUCHER',
      user: user._id,
      billAmountETB: product.price,
      pointsTransacted: 0,
      cashbackEquivalentETB: product.price,
      description: `Invested in ${product.name} (VIP ${product.vipTarget})`,
      referenceCode: orderNumber,
      status: 'COMPLETED',
    });

    res.status(201).json({
      success: true,
      message: `🎉 Successfully invested in ${product.name}! Upgraded to VIP ${user.vipLevel}. First daily gain of Br${product.dailyEarnings.toLocaleString()} credited!`,
      order,
      user: {
        vipLevel: user.vipLevel,
        walletBalanceETB: user.walletBalanceETB,
        rechargeBalance: user.rechargeBalance,
        withdrawBalance: user.withdrawBalance,
        productIncome: user.productIncome,
      },
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get user's investment orders
// @route   GET /api/invest/my-orders
// @access  Private (Customer)
export const getMyOrders = async (req, res, next) => {
  try {
    const { status } = req.query; // 'all', 'IN_GAINS', 'FINISHED'
    const query = { user: req.user._id };
    if (status && status !== 'all') {
      query.status = status;
    }

    const orders = await InvestmentOrder.find(query).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get account overview & stats
// @route   GET /api/invest/account-stats
// @access  Private (Customer)
export const getAccountStats = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    const activeOrdersCount = await InvestmentOrder.countDocuments({
      user: req.user._id,
      status: 'IN_GAINS',
    });

    res.json({
      success: true,
      stats: {
        productIncome: user.productIncome || 0,
        rechargeBalance: (user.rechargeBalance || 0) + (user.walletBalanceETB || 0),
        withdrawBalance: (user.withdrawBalance || 0) + ((user.pointsBalance || 0) * 0.1),
        vipLevel: user.vipLevel || 0,
        activeOrdersCount,
        bankCard: user.bankCard || { isBound: false },
        phone: user.phone,
        name: user.name,
        referralCode: user.referralCode,
      },
    });
  } catch (err) {
    next(err);
  }
};
