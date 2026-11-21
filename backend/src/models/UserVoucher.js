import mongoose from 'mongoose';

const userVoucherSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    voucher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Voucher',
      required: true,
    },
    uniqueCode: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      index: true,
    },
    pointsPaid: {
      type: Number,
      required: true,
    },
    discountAmountETB: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ['ACTIVE', 'REDEEMED', 'EXPIRED'],
      default: 'ACTIVE',
    },
    expiresAt: {
      type: Date,
      required: true,
    },
    redeemedAt: {
      type: Date,
      default: null,
    },
    redeemedMerchant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Merchant',
      default: null,
    },
    redeemedCashier: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
  },
  { timestamps: true }
);

export const UserVoucher = mongoose.model('UserVoucher', userVoucherSchema);
