import mongoose from 'mongoose';

const voucherSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      unique: true,
      required: true,
      uppercase: true,
      trim: true,
    },
    title: {
      type: String,
      required: true,
    },
    titleAmharic: {
      type: String,
      default: '',
    },
    merchant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Merchant',
      default: null, // Null means platform-wide / multi-merchant
    },
    discountAmountETB: {
      type: Number,
      required: true,
      min: 1,
    },
    pointsCost: {
      type: Number,
      required: true,
      min: 10,
    },
    minPurchaseETB: {
      type: Number,
      default: 0,
    },
    description: {
      type: String,
      default: '',
    },
    category: {
      type: String,
      default: 'General',
    },
    validityDays: {
      type: Number,
      default: 30,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export const Voucher = mongoose.model('Voucher', voucherSchema);
