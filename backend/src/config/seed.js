import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { connectDB } from './db.js';
import { User } from '../models/User.js';
import { Merchant } from '../models/Merchant.js';
import { Voucher } from '../models/Voucher.js';
import { UserVoucher } from '../models/UserVoucher.js';
import { Transaction } from '../models/Transaction.js';
import { PayoutRequest } from '../models/PayoutRequest.js';

dotenv.config();

export const seedDatabase = async () => {
  try {
    await connectDB();
    console.log('[Seed] Clearing existing collections...');

    await Promise.all([
      User.deleteMany({}),
      Merchant.deleteMany({}),
      Voucher.deleteMany({}),
      UserVoucher.deleteMany({}),
      Transaction.deleteMany({}),
      PayoutRequest.deleteMany({}),
    ]);

    console.log('[Seed] Inserting Ethiopian Partner Merchants...');
    const merchants = await Merchant.insertMany([
      {
        name: "Kaldi's Coffee",
        tradeNameAmharic: "ካልዲስ ቡና",
        tinNumber: "0019283746",
        category: "Cafe & Restaurant",
        description: "Ethiopia's premier specialty coffee house and cafe chain.",
        logo: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=200",
        coverImage: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800",
        cashbackRate: 6, // 6% cashback
        pointsPerETB: 0.1,
        city: "Addis Ababa",
        address: "Bole Medhanialem, Camrose Building",
        phone: "+251911223344",
        featuredDeal: {
          title: "Double Points on Special Roast Brews",
          discountPercent: 6,
          description: "Earn 12 points for every 100 ETB spent on artisan single-origin pour-overs.",
        },
        totalSalesVolumeETB: 125000,
        totalPointsIssued: 75000,
      },
      {
        name: "Friendship Supermarket",
        tradeNameAmharic: "ፍሬንድሺፕ ሱፐርማርኬት",
        tinNumber: "0028374651",
        category: "Supermarket",
        description: "Leading hypermarket offering fresh produce, groceries, and household goods.",
        logo: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=200",
        coverImage: "https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=800",
        cashbackRate: 5,
        pointsPerETB: 0.1,
        city: "Addis Ababa",
        address: "Bole Road, Next to Friendship City Center",
        phone: "+251911334455",
        featuredDeal: {
          title: "Weekend Grocery Boost",
          discountPercent: 5,
          description: "5% cashback on family grocery carts above 2,000 ETB.",
        },
        totalSalesVolumeETB: 340000,
        totalPointsIssued: 170000,
      },
      {
        name: "TotalEnergies Meskel",
        tradeNameAmharic: "ቶታል ኤነርጂስ መስቀል አደባባይ",
        tinNumber: "0037465819",
        category: "Fuel Station",
        description: "Official fuel station, Bonjour convenience store, and auto car care.",
        logo: "https://images.unsplash.com/photo-1545454675-3531b543be5d?w=200",
        coverImage: "https://images.unsplash.com/photo-1616401784845-180882ba9ba8?w=800",
        cashbackRate: 3,
        pointsPerETB: 0.1,
        city: "Addis Ababa",
        address: "Meskel Square, Addis Ababa",
        phone: "+251911445566",
        featuredDeal: {
          title: "Fuel & Lubricant Cashback",
          discountPercent: 3,
          description: "Earn rewards on every liter of fuel and oil change.",
        },
        totalSalesVolumeETB: 280000,
        totalPointsIssued: 84000,
      },
      {
        name: "Snap Electronics & Apple Center",
        tradeNameAmharic: "ስናፕ ኤሌክትሮኒክስ",
        tinNumber: "0048192735",
        category: "Electronics",
        description: "Authorized distributor of premium laptops, mobile phones, and smart gadgets.",
        logo: "https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=200",
        coverImage: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800",
        cashbackRate: 4,
        pointsPerETB: 0.1,
        city: "Addis Ababa",
        address: "Bole Edna Mall, 2nd Floor",
        phone: "+251911556677",
        featuredDeal: {
          title: "Tech Upgrade Rewards",
          discountPercent: 4,
          description: "Get up to 2,000 ETB in loyalty points on new smartphone & laptop purchases.",
        },
        totalSalesVolumeETB: 450000,
        totalPointsIssued: 180000,
      },
      {
        name: "Lions Pharmacy & Cosmetics",
        tradeNameAmharic: "አንበሳ ፋርማሲ",
        tinNumber: "0059281743",
        category: "Health & Pharmacy",
        description: "Trusted medical pharmacy, health supplements, and organic cosmetics.",
        logo: "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=200",
        coverImage: "https://images.unsplash.com/photo-1586015555751-63c29994c9f4?w=800",
        cashbackRate: 5,
        pointsPerETB: 0.1,
        city: "Addis Ababa",
        address: "Sarbet, Near Karl Hospital",
        phone: "+251911667788",
        featuredDeal: {
          title: "Health & Wellness Points",
          discountPercent: 5,
          description: "Earn 5% points on all vitamins and skincare lines.",
        },
        totalSalesVolumeETB: 95000,
        totalPointsIssued: 47500,
      },
    ]);

    console.log('[Seed] Creating System & Demo Users...');
    const kaldis = merchants[0];
    const friendship = merchants[1];

    // Password for all demo accounts: 'password123'
    const admin = await User.create({
      name: "Ethio Rewards Administrator",
      phone: "+251911000000",
      email: "admin@ethiorewards.et",
      password: "password123",
      role: "admin",
      memberCode: "ETR-ADM001",
      referralCode: "ETHADMIN",
      city: "Addis Ababa",
      pointsBalance: 50000,
      lifetimeEarnedPoints: 50000,
      tier: "Platinum",
    });

    const kaldisCashier = await User.create({
      name: "Dawit Haile (Kaldi's Cashier)",
      phone: "+251911111111",
      email: "kaldis.cashier@ethiorewards.et",
      password: "password123",
      role: "merchant_cashier",
      merchant: kaldis._id,
      memberCode: "ETR-KLD01",
      referralCode: "KALDIS01",
      city: "Addis Ababa",
    });

    const friendshipCashier = await User.create({
      name: "Tigist Alemu (Friendship Cashier)",
      phone: "+251911222222",
      email: "friendship.cashier@ethiorewards.et",
      password: "password123",
      role: "merchant_cashier",
      merchant: friendship._id,
      memberCode: "ETR-FND01",
      referralCode: "FRIEND01",
      city: "Addis Ababa",
    });

    const customer1 = await User.create({
      name: "Abreham Tadesse",
      phone: "+251911333333",
      email: "abreham@ethiorewards.et",
      password: "password123",
      role: "customer",
      memberCode: "ETR-984210",
      referralCode: "ABRHAM99",
      city: "Addis Ababa",
      pointsBalance: 4250, // 425 ETB
      lifetimeEarnedPoints: 4650,
      tier: "Gold", // 1.25x tier bonus
    });

    const customer2 = await User.create({
      name: "Selamawit Bekele",
      phone: "+251911444444",
      email: "selamawit@ethiorewards.et",
      password: "password123",
      role: "customer",
      memberCode: "ETR-712398",
      referralCode: "SELAM88",
      referredBy: customer1._id,
      city: "Addis Ababa",
      pointsBalance: 1450, // 145 ETB
      lifetimeEarnedPoints: 1450,
      tier: "Silver", // 1.1x tier bonus
    });

    console.log('[Seed] Creating Redeemable Vouchers...');
    const vouchers = await Voucher.insertMany([
      {
        code: "VOUCH-KALDIS-50",
        title: "50 ETB Coffee & Pastry Voucher",
        titleAmharic: "የ 50 ብር የቡና እና ኬክ ቫውቸር",
        merchant: kaldis._id,
        discountAmountETB: 50,
        pointsCost: 400, // Discount: 400 points (normal 500)
        minPurchaseETB: 100,
        description: "Valid for any hot beverages, cold drinks, or pastries at any Kaldi's branch.",
        category: "Cafe & Restaurant",
        validityDays: 30,
      },
      {
        code: "VOUCH-KALDIS-100",
        title: "100 ETB Brunch & Lunch Voucher",
        titleAmharic: "የ 100 ብር የምሳ ቫውቸር",
        merchant: kaldis._id,
        discountAmountETB: 100,
        pointsCost: 750,
        minPurchaseETB: 250,
        description: "Treat yourself to a full lunch or burger at Kaldi's Coffee.",
        category: "Cafe & Restaurant",
        validityDays: 30,
      },
      {
        code: "VOUCH-FRIEND-100",
        title: "100 ETB Grocery Basket Voucher",
        titleAmharic: "የ 100 ብር የሸቀጣ ሸቀጥ ቫውቸር",
        merchant: friendship._id,
        discountAmountETB: 100,
        pointsCost: 800,
        minPurchaseETB: 500,
        description: "Apply 100 ETB instant discount on your grocery checkout at Friendship.",
        category: "Supermarket",
        validityDays: 45,
      },
      {
        code: "VOUCH-TOTAL-150",
        title: "150 ETB Fuel & Oil Service Voucher",
        titleAmharic: "የ 150 ብር የነዳጅ ቅናሽ ቫውቸር",
        merchant: merchants[2]._id,
        discountAmountETB: 150,
        pointsCost: 1200,
        minPurchaseETB: 600,
        description: "Valid on petrol/diesel refills or car care products at TotalEnergies Meskel.",
        category: "Fuel Station",
        validityDays: 60,
      },
      {
        code: "VOUCH-SNAP-250",
        title: "250 ETB Tech Gadgets & Accessories",
        titleAmharic: "የ 250 ብር የኤሌክትሮኒክስ ቫውቸር",
        merchant: merchants[3]._id,
        discountAmountETB: 250,
        pointsCost: 2000,
        minPurchaseETB: 1000,
        description: "Discount on earbuds, chargers, power banks, and smartphone accessories.",
        category: "Electronics",
        validityDays: 30,
      },
    ]);

    console.log('[Seed] Creating Claimed Customer Vouchers...');
    await UserVoucher.create({
      user: customer1._id,
      voucher: vouchers[0]._id,
      uniqueCode: "KLD-8A92B",
      pointsPaid: 400,
      discountAmountETB: 50,
      status: "ACTIVE",
      expiresAt: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
    });

    console.log('[Seed] Creating Transactions History...');
    await Transaction.insertMany([
      {
        txnNumber: "TXN-2026-1001",
        type: "EARN",
        user: customer1._id,
        merchant: kaldis._id,
        cashier: kaldisCashier._id,
        billAmountETB: 850,
        pointsTransacted: 638, // 850 * 6% * 1.25 Gold Tier
        cashbackEquivalentETB: 63.8,
        description: "Earned 638 points (6% cashback + 1.25x Gold tier) at Kaldi's Coffee",
        status: "COMPLETED",
        referenceCode: "REC-9081",
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      },
      {
        txnNumber: "TXN-2026-1002",
        type: "EARN",
        user: customer1._id,
        merchant: friendship._id,
        cashier: friendshipCashier._id,
        billAmountETB: 3200,
        pointsTransacted: 2000,
        cashbackEquivalentETB: 200,
        description: "Earned 2,000 points at Friendship Supermarket",
        status: "COMPLETED",
        referenceCode: "REC-4412",
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      },
      {
        txnNumber: "TXN-2026-1003",
        type: "REDEEM_VOUCHER",
        user: customer1._id,
        merchant: kaldis._id,
        pointsTransacted: -400,
        cashbackEquivalentETB: 50,
        description: "Redeemed 400 points for 50 ETB Kaldi's Voucher (KLD-8A92B)",
        status: "COMPLETED",
        referenceCode: "KLD-8A92B",
        createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
      },
      {
        txnNumber: "TXN-2026-1004",
        type: "WELCOME_BONUS",
        user: customer2._id,
        pointsTransacted: 100,
        cashbackEquivalentETB: 10,
        description: "Welcome bonus upon registration with Ethio Rewards",
        status: "COMPLETED",
      },
    ]);

    console.log('[Seed] Creating Sample Payout Requests...');
    await PayoutRequest.create({
      requestNumber: "PAY-2026-0001",
      user: customer2._id,
      payoutType: "TELEBIRR",
      accountOrPhone: "+251911444444",
      pointsDeducted: 500,
      amountETB: 50,
      status: "PENDING",
      adminNote: "",
    });

    console.log('\n======================================================');
    console.log('✅ Ethio Rewards Database Seed Completed Successfully!');
    console.log('======================================================');
    console.log('Demo Accounts for Testing:');
    console.log('1. System Admin:');
    console.log('   - Phone: +251911000000 | Password: password123');
    console.log("2. Merchant Cashier (Kaldi's Coffee):");
    console.log('   - Phone: +251911111111 | Password: password123');
    console.log('3. Customer (Abreham Tadesse - Gold Tier, 4,250 Pts):');
    console.log('   - Phone: +251911333333 | Password: password123 | Member: ETR-984210');
    console.log('4. Customer (Selamawit Bekele - Silver Tier, 1,450 Pts):');
    console.log('   - Phone: +251911444444 | Password: password123 | Member: ETR-712398');
    console.log('======================================================\n');

    process.exit(0);
  } catch (err) {
    console.error('[Seed] Error seeding database:', err);
    process.exit(1);
  }
};

// Execute if run directly
seedDatabase();
