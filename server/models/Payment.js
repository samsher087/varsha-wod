import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    application: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'TrainingApplication',
      required: true,
      index: true,
    },
    orderId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    paymentId: {
      type: String,
      default: '',
    },
    paymentRefNo: {
      type: String,
      default: '',
      trim: true,
      index: true,
    },
    signature: {
      type: String,
      default: '',
    },
    amount: {
      type: Number,
      required: true, // In INR
    },
    currency: {
      type: String,
      default: 'INR',
    },
    status: {
      type: String,
      enum: ['created', 'pending', 'successful', 'failed', 'refunded'],
      default: 'created',
      index: true,
    },
    paymentMethod: {
      type: String,
      default: 'Online / Gateway',
    },
    receiptNumber: {
      type: String,
      required: true,
    },
    gatewayResponse: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    verifiedAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

export default mongoose.model('Payment', paymentSchema);
