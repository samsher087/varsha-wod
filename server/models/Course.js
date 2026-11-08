import mongoose from 'mongoose';

const lessonSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    default: '',
  },
  duration: {
    type: String,
    default: '15 mins',
  },
  order: {
    type: Number,
    default: 1,
  },
  videoUrl: {
    type: String,
    required: true,
  },
  videoTokenSecret: {
    type: String,
    default: '',
  },
  isPreview: {
    type: Boolean,
    default: false,
  },
  safetyNotice: {
    type: String,
    default: 'Supervised arena practice only. Never attempt alone.',
  },
  resources: [
    {
      title: String,
      url: String,
    },
  ],
});

const moduleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    default: '',
  },
  order: {
    type: Number,
    default: 1,
  },
  lessons: [lessonSchema],
});

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    subtitle: {
      type: String,
      default: 'Comprehensive Professional Stunt Riding Curriculum',
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    description: {
      type: String,
      required: true,
    },
    thumbnail: {
      type: String,
      default: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1200&q=80',
    },
    difficulty: {
      type: String,
      default: 'Elite / Professional',
    },
    estimatedDuration: {
      type: String,
      default: '6 Weeks (Theory + Virtual Simulation + Supervised Arena Training)',
    },
    price: {
      type: Number,
      default: 4999,
    },
    isPublished: {
      type: Boolean,
      default: true,
    },
    modules: [moduleSchema],
    learningOutcomes: [String],
    prerequisites: [String],
  },
  { timestamps: true }
);

export default mongoose.model('Course', courseSchema);
