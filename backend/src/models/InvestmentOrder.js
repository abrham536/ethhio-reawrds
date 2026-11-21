import mongoose from 'mongoose';

const investmentOrderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    productId: {
      type: String,
      required: true,
    },
    productName: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: ['bestseller', 'discount', 'promotion'],
      default: 'bestseller',
    },
    vipTarget: {
      type: Number,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    dailyEarnings: {
      type: Number,
      required: true,
      min: 0,
    },
    days: {
      type: Number,
      default: 49,
    },
    daysElapsed: {
      type: Number,
      default: 1,
    },
    totalIncome: {
      type: Number,
      required: true,
    },
    earnedSoFar: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ['IN_GAINS', 'FINISHED'],
      default: 'IN_GAINS',
      index: true,
    },
    lastRewardDate: {
      type: Date,
      default: Date.now,
    },
    expiryDate: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

export const InvestmentOrder = mongoose.model('InvestmentOrder', investmentOrderSchema);
