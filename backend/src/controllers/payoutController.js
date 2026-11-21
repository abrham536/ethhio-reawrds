import { PayoutRequest } from '../models/PayoutRequest.js';
import { User } from '../models/User.js';
import { Transaction } from '../models/Transaction.js';

// @desc    Request points redemption for Telebirr / Airtime / CBE Birr
// @route   POST /api/payouts/request
// @access  Private (Customer)
export const requestPayout = async (req, res, next) => {
  try {
    const { payoutType, accountOrPhone, pointsToRedeem } = req.body;

    const points = Number(pointsToRedeem);
    if (!points || points < 50) {
      return res.status(400).json({
        success: false,
        message: 'Minimum points for payout redemption is 50 points (5 ETB).',
      });
    }

    if (!['TELEBIRR', 'ETHIO_TELECOM_AIRTIME', 'CBE_BIRR'].includes(payoutType)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid payout type. Choose Telebirr, Ethio Telecom Airtime, or CBE Birr.',
      });
    }

    if (!accountOrPhone) {
      return res.status(400).json({
        success: false,
        message: 'Please provide the destination Telebirr / Phone / CBE Account number.',
      });
    }

    const user = await User.findById(req.user._id);

    if (user.pointsBalance < points) {
      return res.status(400).json({
        success: false,
        message: `Insufficient points balance. You requested ${points} points, but currently have ${user.pointsBalance} points.`,
      });
    }

    // 10 points = 1 ETB (0.1 ETB per point)
    const amountETB = Number((points * 0.1).toFixed(2));

    // Deduct points
    user.pointsBalance -= points;
    await user.save();

    const requestNumber = `PAY-${Date.now()}-${Math.floor(Math.random() * 900 + 100)}`;

    const payoutRequest = await PayoutRequest.create({
      requestNumber,
      user: user._id,
      payoutType,
      accountOrPhone,
      pointsDeducted: points,
      amountETB,
      status: 'PENDING',
    });

    const txnNumber = `TXN-${Date.now()}-${Math.floor(Math.random() * 9000 + 1000)}`;
    await Transaction.create({
      txnNumber,
      type: payoutType === 'ETHIO_TELECOM_AIRTIME' ? 'REDEEM_AIRTIME' : 'REDEEM_TELEBIRR',
      user: user._id,
      pointsTransacted: -points,
      cashbackEquivalentETB: amountETB,
      description: `Requested ${amountETB} ETB ${payoutType.replace(/_/g, ' ')} payout to ${accountOrPhone}`,
      referenceCode: requestNumber,
      status: 'PENDING',
    });

    res.status(201).json({
      success: true,
      message: `Your ${amountETB} ETB ${payoutType.replace(/_/g, ' ')} payout request has been submitted!`,
      payoutRequest,
      remainingPoints: user.pointsBalance,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get current user's payout requests
// @route   GET /api/payouts/my-requests
// @access  Private (Customer)
export const getMyPayouts = async (req, res, next) => {
  try {
    const requests = await PayoutRequest.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json({
      success: true,
      count: requests.length,
      requests,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get all payout requests queue (Admin only)
// @route   GET /api/payouts/admin/queue
// @access  Private (Admin)
export const getAdminPayoutQueue = async (req, res, next) => {
  try {
    const { status } = req.query;
    const query = {};
    if (status && status !== 'ALL') {
      query.status = status;
    }

    const requests = await PayoutRequest.find(query)
      .populate('user', 'name phone memberCode pointsBalance')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: requests.length,
      requests,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Approve or reject a payout request (Admin only)
// @route   PUT /api/payouts/admin/:id/decide
// @access  Private (Admin)
export const decidePayout = async (req, res, next) => {
  try {
    const { decision, adminNote } = req.body; // 'APPROVE' or 'REJECT'

    if (!['APPROVE', 'REJECT'].includes(decision)) {
      return res.status(400).json({
        success: false,
        message: "Decision must be 'APPROVE' or 'REJECT'.",
      });
    }

    const request = await PayoutRequest.findById(req.params.id);
    if (!request) {
      return res.status(404).json({ success: false, message: 'Payout request not found.' });
    }

    if (request.status !== 'PENDING') {
      return res.status(400).json({
        success: false,
        message: `This payout request has already been ${request.status.toLowerCase()}.`,
      });
    }

    if (decision === 'APPROVE') {
      request.status = 'APPROVED';
      request.adminNote = adminNote || 'Approved and transferred successfully.';
      request.processedBy = req.user._id;
      request.processedAt = new Date();
      await request.save();

      // Update corresponding transaction status
      await Transaction.findOneAndUpdate(
        { referenceCode: request.requestNumber },
        { status: 'COMPLETED' }
      );

      return res.json({
        success: true,
        message: `Payout request ${request.requestNumber} approved.`,
        request,
      });
    } else {
      // REJECT: Refund points back to user
      request.status = 'REJECTED';
      request.adminNote = adminNote || 'Rejected by administrator.';
      request.processedBy = req.user._id;
      request.processedAt = new Date();
      await request.save();

      const user = await User.findById(request.user);
      if (user) {
        user.pointsBalance += request.pointsDeducted;
        await user.save();
      }

      // Mark transaction cancelled and create refund note
      await Transaction.findOneAndUpdate(
        { referenceCode: request.requestNumber },
        { status: 'CANCELLED' }
      );

      return res.json({
        success: true,
        message: `Payout request ${request.requestNumber} rejected. Points have been refunded to customer balance.`,
        request,
      });
    }
  } catch (err) {
    next(err);
  }
};
