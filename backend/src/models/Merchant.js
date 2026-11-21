import mongoose from 'mongoose';

const merchantSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Merchant name is required'],
      trim: true,
    },
    tradeNameAmharic: {
      type: String,
      default: '',
    },
    tinNumber: {
      type: String,
      default: '',
    },
    category: {
      type: String,
      required: true,
      enum: [
        'Supermarket',
        'Cafe & Restaurant',
        'Fuel Station',
        'Electronics',
        'Fashion & Apparel',
        'Health & Pharmacy',
        'Entertainment & Cinema',
        'General Retail',
      ],
      default: 'General Retail',
    },
    description: {
      type: String,
      default: '',
    },
    logo: {
      type: String,
      default: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=150',
    },
    coverImage: {
      type: String,
      default: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800',
    },
    cashbackRate: {
      type: Number,
      default: 5, // 5%
    },
    pointsPerETB: {
      type: Number,
      default: 0.1, // 1 point per 10 ETB
    },
    city: {
      type: String,
      default: 'Addis Ababa',
    },
    address: {
      type: String,
      default: 'Bole, Addis Ababa',
    },
    phone: {
      type: String,
      default: '+251911000000',
    },
    email: {
      type: String,
      default: '',
    },
    isVerified: {
      type: Boolean,
      default: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    featuredDeal: {
      title: { type: String, default: '5% Instant Cashback' },
      discountPercent: { type: Number, default: 5 },
      description: { type: String, default: 'Earn points on all in-store purchases' },
      validUntil: { type: Date, default: () => new Date(Date.now() + 60 * 24 * 60 * 60 * 1000) },
    },
    totalSalesVolumeETB: {
      type: Number,
      default: 0,
    },
    totalPointsIssued: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export const Merchant = mongoose.model('Merchant', merchantSchema);
