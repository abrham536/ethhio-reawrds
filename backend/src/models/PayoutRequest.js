import mongoose from 'mongoose';

const payoutRequestSchema = new mongoose.Schema(
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
    payoutType: {
      type: String,
      required: true,
      enum: ['TELEBIRR', 'ETHIO_TELECOM_AIRTIME', 'CBE_BIRR'],
    },
    accountOrPhone: {
      type: String,
      required: true,
      trim: true,
    },
    pointsDeducted: {
      type: Number,
      required: true,
      min: 50,
    },
    amountETB: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ['PENDING', 'APPROVED', 'REJECTED'],
      default: 'PENDING',
    },
    adminNote: {
      type: String,
      default: '',
    },
    processedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    processedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

export const PayoutRequest = mongoose.model('PayoutRequest', payoutRequestSchema);
