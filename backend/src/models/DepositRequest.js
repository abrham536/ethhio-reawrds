import mongoose from 'mongoose';

const depositRequestSchema = new mongoose.Schema(
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
      required: [true, 'Deposit amount in ETB is required'],
      min: [10, 'Minimum deposit amount is 10 ETB'],
    },
    paymentMethod: {
      type: String,
      required: true,
      enum: ['TELEBIRR', 'CBE', 'BOA', 'AWASH', 'OTHER'],
      default: 'TELEBIRR',
    },
    transactionRef: {
      type: String,
      required: [true, 'Bank/Telebirr transaction confirmation reference is required'],
      trim: true,
    },
    screenshotUrl: {
      type: String,
      default: '', // Base64 data URL or uploaded proof image
    },
    senderPhoneOrAccount: {
      type: String,
      default: '',
    },
    userNote: {
      type: String,
      default: '',
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

export const DepositRequest = mongoose.model('DepositRequest', depositRequestSchema);
