import mongoose from 'mongoose';

const publicVideoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      default: 'Stunt Highlights',
    },
    videoUrl: {
      type: String,
      required: true,
    },
    thumbnailUrl: {
      type: String,
      default: '',
    },
    duration: {
      type: String,
      default: '3:45',
    },
    description: {
      type: String,
      default: '',
    },
    views: {
      type: Number,
      default: 1420,
    },
    likes: {
      type: Number,
      default: 2450,
    },
    commentsCount: {
      type: Number,
      default: 184,
    },
    instagramUrl: {
      type: String,
      default: 'https://instagram.com/najurider',
    },
    youtubeUrl: {
      type: String,
      default: '',
    },
    audioTrack: {
      type: String,
      default: 'Original Audio - Varsha Rider',
    },
    authorHandle: {
      type: String,
      default: '@najurider',
    },
    isReel: {
      type: Boolean,
      default: true,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export default mongoose.model('PublicVideo', publicVideoSchema);
