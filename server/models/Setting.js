import mongoose from 'mongoose';

const settingSchema = new mongoose.Schema(
  {
    brandName: {
      type: String,
      default: 'Varsha Rider',
    },
    tagline: {
      type: String,
      default: 'Witness the Courage. Learn the Discipline. Respect the Risk.',
    },
    heroHeadline: {
      type: String,
      default: 'Well of Death',
    },
    heroSubheadline: {
      type: String,
      default: 'Witness the Courage. Learn the Discipline. Respect the Risk.',
    },
    riderTitle: {
      type: String,
      default: 'Master Centrifugal Wall Stunt Specialist',
    },
    heroVideoUrl: {
      type: String,
      default: 'https://assets.mixkit.co/videos/preview/mixkit-motorcyclist-riding-fast-at-night-42211-large.mp4',
    },
    heroImageUrl: {
      type: String,
      default: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=1920&q=80',
    },
    aboutBio: {
      type: String,
      default:
        'With over 14 years of daredevil riding experience across India’s grandest cultural melas and stunt arenas, Varsha Rider has mastered the perilous physics of the wooden cylindrical Well of Death (Maut Ka Kuan). Performing at dizzying 88-degree vertical inclines purely powered by centrifugal force and surgical balance, he has elevated traditional Indian stunt artistry to an internationally admired discipline.',
    },
    statsYearsExperience: {
      type: Number,
      default: 14,
    },
    statsArenaShows: {
      type: Number,
      default: 650,
    },
    statsWallIncline: {
      type: String,
      default: '88°',
    },
    statsSafetyRecord: {
      type: String,
      default: '100% Zero Severe Injury',
    },
    trainingFee: {
      type: Number,
      default: 4999,
    },
    contactEmail: {
      type: String,
      default: 'contact@najurider.com',
    },
    contactPhone: {
      type: String,
      default: '+91 7488405975',
    },
    contactWhatsApp: {
      type: String,
      default: '+917488405975',
    },
    headquartersAddress: {
      type: String,
      default: 'Kusaiya, Giridih, Jharkhand',
    },
    socialLinks: {
      instagram: { type: String, default: 'https://www.instagram.com/naju_rider_18/' },
      youtube: { type: String, default: 'https://youtube.com/@najurider' },
      facebook: { type: String, default: 'https://www.facebook.com/najurider18' },
    },
    razorpayKeyId: {
      type: String,
      default: 'rzp_test_WODLiveDemoKey',
    },
    razorpayKeySecret: {
      type: String,
      default: 'WOD_TestSecret_VerifySig99',
    },
    isRazorpayLive: {
      type: Boolean,
      default: false,
    },
    testimonials: [
      {
        name: String,
        role: String,
        quote: String,
        avatar: String,
        rating: { type: Number, default: 5 },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model('Setting', settingSchema);
