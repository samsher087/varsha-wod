import mongoose from 'mongoose';

const trainingApplicationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      required: [true, 'Mobile number is required'],
      trim: true,
    },
    age: {
      type: Number,
      required: [true, 'Age is required'],
      min: [18, 'Applicant must be at least 18 years old'],
    },
    dob: {
      type: String,
      default: '',
    },
    city: {
      type: String,
      required: [true, 'City is required'],
    },
    state: {
      type: String,
      required: [true, 'State is required'],
    },
    experienceLevel: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Experienced'],
      required: [true, 'Riding experience level is required'],
    },
    reason: {
      type: String,
      required: [true, 'Reason for learning Well of Death is required'],
      trim: true,
    },
    emergencyContactName: {
      type: String,
      required: [true, 'Emergency contact name is required'],
      trim: true,
    },
    emergencyContactPhone: {
      type: String,
      required: [true, 'Emergency contact phone is required'],
      trim: true,
    },
    additionalExperience: {
      type: String,
      default: '',
    },
    agreedToSafetyWaiver: {
      type: Boolean,
      required: true,
      default: false,
    },
    status: {
      type: String,
      enum: [
        'Application Submitted',
        'Payment Pending',
        'Payment Submitted — Pending Admin Approval',
        'Pending Admin Approval',
        'Pending Approval',
        'Approved — Payment Required',
        'Payment Successful',
        'Training Unlocked',
        'Rejected',
        'Completed',
      ],
      default: 'Application Submitted',
      index: true,
    },
    trainingFee: {
      type: Number,
      default: 4999,
    },
    paymentRefNo: {
      type: String,
      default: '',
      trim: true,
      index: true,
    },
    paymentMethod: {
      type: String,
      default: 'UPI / QR',
    },
    paymentAmount: {
      type: Number,
      default: 4999,
    },
    paymentSubmittedAt: {
      type: Date,
    },
    adminNotes: {
      type: String,
      default: '',
    },
    rejectionReason: {
      type: String,
      default: '',
    },
    approvedAt: {
      type: Date,
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    paymentVerifiedAt: {
      type: Date,
    },
    unlockedAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

export default mongoose.model('TrainingApplication', trainingApplicationSchema);
