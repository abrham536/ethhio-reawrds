import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema(
  {
    txnNumber: {
      type: String,
      unique: true,
      required: true,
      index: true,
    },
    type: {
      type: String,
      required: true,
      enum: [
        'EARN',
        'DEPOSIT',
        'WITHDRAWAL',
        'REDEEM_VOUCHER',
        'REDEEM_AIRTIME',
        'REDEEM_TELEBIRR',
        'REFERRAL_BONUS',
        'WELCOME_BONUS',
        'MANUAL_ADJUSTMENT',
      ],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    merchant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Merchant',
      default: null,
    },
    cashier: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    billAmountETB: {
      type: Number,
      default: 0,
    },
    pointsTransacted: {
      type: Number,
      required: true, // Positive for earned, negative for spent
    },
    cashbackEquivalentETB: {
      type: Number,
      default: 0,
    },
    description: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['COMPLETED', 'PENDING', 'CANCELLED'],
      default: 'COMPLETED',
    },
    referenceCode: {
      type: String,
      default: '',
    },
    metadata: {
      type: Map,
      of: String,
      default: {},
    },
  },
  { timestamps: true }
);

export const Transaction = mongoose.model('Transaction', transactionSchema);
