import mongoose from 'mongoose';

const DEFAULT_URI =
  'mongodb+srv://info_db_user:mVZnTk06RiZIiZQe@cluster0.qvxniat.mongodb.net/varsha_db?retryWrites=true&w=majority';

let cached = global.mongoose;
if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }
  if (!cached.promise) {
    const uri = process.env.MONGODB_URI || DEFAULT_URI;
    cached.promise = mongoose
      .connect(uri, {
        serverSelectionTimeoutMS: 5000,
        bufferCommands: false,
      })
      .then((mongooseInstance) => {
        console.log('[Mongo Atlas Connected]:', mongooseInstance.connection.host);
        return mongooseInstance;
      });
  }
  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (e) {
    cached.promise = null;
    throw e;
  }
}

// User Schema
const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    phone: { type: String, required: true },
    password: { type: String, required: true, select: false },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    status: { type: String, enum: ['active', 'suspended'], default: 'active' },
    city: { type: String, default: '' },
    emergencyContact: {
      name: { type: String, default: '' },
      phone: { type: String, default: '' },
    },
  },
  { timestamps: true }
);

export const User = mongoose.models.User || mongoose.model('User', userSchema);

// TrainingApplication Schema
const trainingAppSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    fullName: { type: String, required: true },
    email: { type: String, required: true, lowercase: true },
    phone: { type: String, required: true },
    age: { type: Number, default: 22 },
    city: { type: String, default: 'India' },
    state: { type: String, default: 'India' },
    experienceLevel: { type: String, default: 'Intermediate' },
    reason: { type: String, default: 'Passionate about Well of Death stunt riding under Master Varsha.' },
    emergencyContactName: { type: String, default: 'Family Contact' },
    emergencyContactPhone: { type: String, default: '' },
    status: { type: String, default: 'Application Submitted' },
    trainingFee: { type: Number, default: 4999 },
    paymentRefNo: { type: String, default: '' },
    paymentAmount: { type: Number, default: 4999 },
    paymentMethod: { type: String, default: 'UPI / QR Transfer' },
    adminNotes: { type: String, default: '' },
    rejectionReason: { type: String, default: '' },
    agreedToSafetyWaiver: { type: Boolean, default: true },
    appliedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const TrainingApplication =
  mongoose.models.TrainingApplication || mongoose.model('TrainingApplication', trainingAppSchema);

// Payment Schema
const paymentSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    application: { type: mongoose.Schema.Types.ObjectId, ref: 'TrainingApplication' },
    amount: { type: Number, required: true },
    currency: { type: String, default: 'INR' },
    paymentMethod: { type: String, default: 'UPI / QR Transfer' },
    transactionId: { type: String, default: '' },
    paymentRefNo: { type: String, default: '' },
    status: { type: String, enum: ['successful', 'failed', 'pending'], default: 'pending' },
    verifiedByAdmin: { type: Boolean, default: false },
    verifiedAt: { type: Date },
  },
  { timestamps: true }
);

export const Payment = mongoose.models.Payment || mongoose.model('Payment', paymentSchema);

// Setting Schema
const settingSchema = new mongoose.Schema(
  {
    siteName: { type: String, default: 'Well of Death' },
    heroHeadline: { type: String, default: 'Well of Death' },
    heroSubheadline: { type: String, default: '' },
    aboutBio: { type: String, default: '' },
    trainingFee: { type: Number, default: 4999 },
    upiId: { type: String, default: 'samsher.alam@okaxis' },
    contactPhone: { type: String, default: '+91 98765 43210' },
    contactEmail: { type: String, default: 'info@najurider.com' },
  },
  { timestamps: true }
);

export const Setting = mongoose.models.Setting || mongoose.model('Setting', settingSchema);

// GalleryItem Schema
const galleryItemSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    category: { type: String, default: 'Live Shows' },
    imageUrl: { type: String, required: true },
    caption: { type: String, default: '' },
    location: { type: String, default: '' },
    dateTaken: { type: String, default: '' },
    featured: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const GalleryItem = mongoose.models.GalleryItem || mongoose.model('GalleryItem', galleryItemSchema);

// PublicVideo Schema
const publicVideoSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    category: { type: String, default: 'Stunt Highlights' },
    videoUrl: { type: String, required: true },
    thumbnailUrl: { type: String, default: '' },
    duration: { type: String, default: '3:45' },
    description: { type: String, default: '' },
    views: { type: Number, default: 1420 },
    likes: { type: Number, default: 2450 },
    commentsCount: { type: Number, default: 184 },
    instagramUrl: { type: String, default: 'https://instagram.com/najurider' },
    youtubeUrl: { type: String, default: '' },
    audioTrack: { type: String, default: 'Original Audio - Varsha Rider' },
    authorHandle: { type: String, default: '@najurider' },
    isReel: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const PublicVideo = mongoose.models.PublicVideo || mongoose.model('PublicVideo', publicVideoSchema);

// AdminAuditLog Schema
const adminAuditLogSchema = new mongoose.Schema(
  {
    admin: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    action: { type: String, required: true },
    targetType: { type: String, required: true },
    targetId: { type: String, default: '' },
    details: { type: String, default: '' },
    ipAddress: { type: String, default: '' },
  },
  { timestamps: true }
);

export const AdminAuditLog =
  mongoose.models.AdminAuditLog || mongoose.model('AdminAuditLog', adminAuditLogSchema);

// Course Schema
const lessonSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, default: '' },
  duration: { type: String, default: '15 mins' },
  order: { type: Number, default: 1 },
  videoUrl: { type: String, required: true },
  videoTokenSecret: { type: String, default: '' },
  isPreview: { type: Boolean, default: false },
  safetyNotice: { type: String, default: 'Supervised arena practice only. Never attempt alone.' },
});

const moduleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, default: '' },
  order: { type: Number, default: 1 },
  lessons: [lessonSchema],
});

const courseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    subtitle: { type: String, default: '' },
    slug: { type: String, default: 'well-of-death-mastery' },
    description: { type: String, default: '' },
    thumbnail: { type: String, default: '' },
    difficulty: { type: String, default: 'Professional' },
    modules: [moduleSchema],
  },
  { timestamps: true }
);

export const Course = mongoose.models.Course || mongoose.model('Course', courseSchema);
