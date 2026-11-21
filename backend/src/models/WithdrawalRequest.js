import mongoose from 'mongoose';

const withdrawalRequestSchema = new mongoose.Schema(
  {
    requestNumber: {
      type: String,
      unique: true,
      required: true,
      index: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    amountETB: {
      type: Number,
      required: [true, 'Withdrawal amount in ETB is required'],
      min: [50, 'Minimum withdrawal amount is 50 ETB'],
    },
    method: {
      type: String,
      required: true,
      enum: ['TELEBIRR', 'CBE_BIRR', 'CBE_BANK', 'BOA_BANK', 'AWASH_BANK', 'OTHER'],
      default: 'TELEBIRR',
    },
    accountNumber: {
      type: String,
      required: [true, 'Destination phone/account number is required'],
      trim: true,
    },
    accountHolderName: {
      type: String,
      required: [true, 'Account holder name is required'],
      trim: true,
    },
    status: {
      type: String,
      enum: ['PENDING', 'APPROVED', 'REJECTED'],
      default: 'PENDING',
      index: true,
    },
    adminNote: {
      type: String,
      default: '',
    },
    payoutReceiptRef: {
      type: String,
      default: '', // Admin transaction reference after transferring to user
    },
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    reviewedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

export const WithdrawalRequest = mongoose.model('WithdrawalRequest', withdrawalRequestSchema);
