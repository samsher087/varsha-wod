import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import Course from '../models/Course.js';
import GalleryItem from '../models/GalleryItem.js';
import PublicVideo from '../models/PublicVideo.js';
import Setting from '../models/Setting.js';
import TrainingApplication from '../models/TrainingApplication.js';
import Payment from '../models/Payment.js';
import AdminAuditLog from '../models/AdminAuditLog.js';

import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config();

const DEFAULT_URI = 'mongodb+srv://info_db_user:mVZnTk06RiZIiZQe@cluster0.qvxniat.mongodb.net/varsha_db?retryWrites=true&w=majority';

export const seedDatabase = async () => {
  try {
    const uri = process.env.MONGODB_URI || DEFAULT_URI;
    if (mongoose.connection.readyState < 1) {
      await mongoose.connect(uri);
    }
    console.log('[Seeder] Connected to MongoDB');

    // 1. Seed or Update Admin User
    const adminEmail = 'admin@samsher-wod.com';
    let admin = await User.findOne({ email: adminEmail });
    if (!admin) {
      admin = await User.create({
        name: 'Samsher Alam (Master Rider & Owner)',
        email: adminEmail,
        phone: '+91 7488405975',
        password: 'AdminPassword@123',
        role: 'admin',
        city: 'New Delhi / Lucknow',
        status: 'active',
      });
      console.log('[Seeder] Admin user created: admin@samsher-wod.com / AdminPassword@123');
    } else {
      admin.role = 'admin';
      await admin.save();
      console.log('[Seeder] Admin user verified');
    }

    // 2. Seed Trainee Users
    const seedUsersData = [
      { name: 'Kabir Verma', email: 'rider.trainee@example.com', phone: '+91 91234 56789', password: 'Password@123', city: 'Jaipur, Rajasthan' },
      { name: 'Sushil', email: 'sushil@gmail.com', phone: '+91 98123 45678', password: 'Password@123', city: 'Giridih, Jharkhand' },
      { name: 'Arman', email: 'arman@gmail.com', phone: '+91 98185 72655', password: 'Password@123', city: 'Giridih, Jharkhand' },
      { name: 'Aditya Rajput', email: 'aditya@gmail.com', phone: '+91 98888 77777', password: 'Password@123', city: 'Chandigarh' },
      { name: 'Vikram Singh', email: 'vikram.stunts@example.com', phone: '+91 98765 43210', password: 'Password@123', city: 'Lucknow, Uttar Pradesh' },
      { name: 'Sameer Khan', email: 'sameer.k@example.com', phone: '+91 97654 32109', password: 'Password@123', city: 'Ranchi, Jharkhand' },
      { name: 'Rohan Joshi', email: 'rohan.joshi@example.com', phone: '+91 96543 21098', password: 'Password@123', city: 'Patna, Bihar' },
    ];

    for (const u of seedUsersData) {
      let existing = await User.findOne({ email: u.email });
      if (!existing) {
        await User.create({ ...u, role: 'user', status: 'active' });
        console.log('[Seeder] Trainee created: ' + u.email);
      }
    }

    // Seed Candidate Applications
    for (const u of seedUsersData) {
      const userDoc = await User.findOne({ email: u.email });
      const existingApp = await TrainingApplication.findOne({ email: u.email });
      if (userDoc && !existingApp) {
        let status = 'Application Submitted';
        let paymentRefNo = '';
        let paymentAmount = 4999;
        let trainingFee = 4999;
        if (u.email === 'rider.trainee@example.com') {
          status = 'Training Unlocked';
          paymentRefNo = '529104829104';
        } else if (u.email === 'sushil@gmail.com') {
          status = 'Payment Submitted — Pending Admin Approval';
          paymentRefNo = '987123654120';
          paymentAmount = 4999;
          trainingFee = 4999;
        } else if (u.email === 'arman@gmail.com') {
          status = 'Payment Submitted — Pending Admin Approval';
          paymentRefNo = '321654987321';
          paymentAmount = 4999;
          trainingFee = 4999;
        } else if (u.email === 'vikram.stunts@example.com') {
          status = 'Payment Submitted — Pending Admin Approval';
          paymentRefNo = '981247562103';
        }
        await TrainingApplication.create({
          user: userDoc._id,
          fullName: u.name,
          email: u.email,
          phone: u.phone,
          age: 23,
          city: u.city || 'India',
          state: 'India',
          experienceLevel: 'Intermediate',
          reason: 'Passionate about Well of Death stunt riding under Master Varsha.',
          emergencyContactName: 'Family Contact',
          emergencyContactPhone: u.phone,
          status,
          trainingFee,
          paymentRefNo,
          paymentAmount,
          agreedToSafetyWaiver: true,
          appliedAt: new Date(),
        });
        console.log('[Seeder] Application created for ' + u.email);
      }
    }

    // 3. Seed Course Curriculum
    await Course.deleteMany({});
    await Course.create({
      title: 'Mastery of the Centrifugal Wall: Professional Well of Death Training',
      subtitle: 'The World’s Most Comprehensive & Disciplined Arena Stunt Riding Academy',
      slug: 'well-of-death-mastery',
      description:
        'A rigorous, step-by-step masterclass by veteran rider Samsher Alam. Covers the exact Newtonian physics, gyroscopic stability, custom motorcycle mechanics, mental conditioning, and progressive supervised arena techniques required to safely ride the vertical wooden barrel.',
      thumbnail: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1200&q=80',
      difficulty: 'Elite Professional / Supervised',
      estimatedDuration: '8 Weeks Intensive',
      price: 4999,
      isPublished: true,
      learningOutcomes: [
        'Master centrifugal force calculations and critical speed thresholds on vertical walls (85°-88°)',
        'Complete motorcycle mechanical setup: suspension stiffening, tire pressure tuning, and carburetor calibration',
        'Gyroscopic balance conditioning and G-force disorientation prevention techniques',
        'Entry slope launch protocols, steady-state orbital laps, and safe engine-cut recovery procedures',
        'Emergency egress, wall bail safety protocols, and arena coordination',
      ],
      prerequisites: [
        'Minimum 18 years of age with valid government photo ID',
        'At least 2 years of manual motorcycle street/dirt riding experience',
        'Signed medical fitness clearance and comprehensive safety risk waiver',
        'Admin approval of applicant background & motivation',
      ],
      modules: [
        {
          title: 'Module 1: Physics & Anatomy of the Wooden Well (Maut Ka Kuan)',
          description: 'Understanding barrel engineering, friction coefficients, and centripetal acceleration.',
          order: 1,
          lessons: [
            {
              title: 'Lesson 1.1: The Physics of Wall Riding: Gravity vs Centrifugal Force',
              description: 'Detailed breakdown of normal force, tire adhesion on vertical wooden planks, and minimum orbit velocity calculation.',
              duration: '18 mins',
              order: 1,
              videoUrl: '/videos/stunt_wod_solo_wall.mp4',
              isPreview: true,
              safetyNotice: 'Foundational theory. Free preview available for all prospective students.',
            },
            {
              title: 'Lesson 1.2: Well of Death Anatomy: Planks, Tension Bands & Arena Inspection',
              description: 'Inspecting timber joints, steel cable tension rings, ramp inclines, and safety netting.',
              duration: '22 mins',
              order: 2,
              videoUrl: '/videos/stunt_wod_four_bikes.mp4',
              isPreview: false,
              safetyNotice: 'Always inspect the ring structure personally before starting the engine.',
            },
          ],
        },
        {
          title: 'Module 2: Stunt Bike Mechanical Preparation & Customization',
          description: 'Modifying Yamaha RX100 / Royal Enfield for continuous vertical tilt & vibration.',
          order: 2,
          lessons: [
            {
              title: 'Lesson 2.1: Fuel Flow & Carburetor Jets for High Tilt Angles',
              description: 'Float chamber modifications to prevent fuel starvation when operating at 88 degrees tilt.',
              duration: '25 mins',
              order: 1,
              videoUrl: '/videos/yt_stunt_dNe-WS6A9js.mp4',
              isPreview: false,
              safetyNotice: 'Fuel leaks inside the wooden barrel are an extreme fire hazard. Double-check all seals.',
            },
            {
              title: 'Lesson 2.2: Stunt Tires, Contact Patches & Rim Reinforcements',
              description: 'Tire compound selection, micro-grooving for wood grain grip, and spoke tension maintenance.',
              duration: '19 mins',
              order: 2,
              videoUrl: '/videos/stunt_wod_solo_wall.mp4',
              isPreview: false,
              safetyNotice: 'Never use worn tires or incorrect PSI on the wooden cylinder.',
            },
          ],
        },
        {
          title: 'Module 3: Entry Ramp Launch & Finding the Gyroscopic Groove',
          description: 'The critical transition from horizontal track to vertical wall orbit.',
          order: 3,
          lessons: [
            {
              title: 'Lesson 3.1: The 45° Ramp Build-Up: Accelerating into Orbit',
              description: 'Throttle discipline and gear selection to transition onto the lower ring smoothly.',
              duration: '31 mins',
              order: 1,
              videoUrl: '/videos/stunt_wod_four_bikes.mp4',
              isPreview: false,
              safetyNotice: 'Under-speed leads to immediate slide-down. Maintain calculated RPM.',
            },
            {
              title: 'Lesson 3.2: G-Force Adaptation & Preventing Spatial Disorientation',
              description: 'Eye gaze tracking, head position, and vestibular endurance during continuous clockwise rotation.',
              duration: '24 mins',
              order: 2,
              videoUrl: '/videos/stunt_wod_solo_wall.mp4',
              isPreview: false,
              safetyNotice: 'Never look directly at the center floor; focus 15 meters ahead along the wall horizon.',
            },
          ],
        },
        {
          title: 'Module 4: High-Wall Orbiting, Stunt Maneuvers & Emergency Bail Drills',
          description: 'Hands-free balance, multi-rider choreography, and instant fail-safe maneuvers.',
          order: 4,
          lessons: [
            {
              title: 'Lesson 4.1: Hands-Free & Peg-Standing Techniques on the High Rail',
              description: 'Shifting body weight to control bike trajectory without handlebar pressure.',
              duration: '35 mins',
              order: 1,
              videoUrl: '/videos/yt_stunt_dNe-WS6A9js.mp4',
              isPreview: false,
              safetyNotice: 'Attempt only after 100+ supervised hours of standard wall riding.',
            },
            {
              title: 'Lesson 4.2: Emergency Engine Cut & Controlled Slide Down Protocols',
              description: 'What to do when mechanical failure strikes: friction braking and ramp glide path.',
              duration: '28 mins',
              order: 2,
              videoUrl: '/videos/stunt_wod_four_bikes.mp4',
              isPreview: false,
              safetyNotice: 'Stay attached to the bike until momentum drops below 15 km/h.',
            },
          ],
        },
      ],
    });
    console.log('[Seeder] Course and modules seeded');

    // 4. Seed Gallery Photos
    const existingGalleryCount = await GalleryItem.countDocuments();
    if (existingGalleryCount === 0) {
      await GalleryItem.insertMany([
        {
          title: 'Varsha Rider - Maut Ka Kuan Grand Carnival Team',
          category: 'Achievements',
          imageUrl: '/images/naju_rider_banner.jpg',
          caption: 'Official Varsha Rider stunt showcase featuring the Yamaha RX100, Royal Enfield Bullet, and the legendary Maut Ka Kuan fairground arena.',
          location: 'Ranchi, Jharkhand',
          dateTaken: '2026',
          featured: true,
          order: 1,
        },
        {
          title: 'मौत का कुआँ - Varsha Rider Wall Stunt',
          category: 'Live Shows',
          imageUrl: '/images/gallery/varsha_rider_rx100_arena.jpg',
          caption: 'High-octane centrifugal wall riding stunt inside the historic Maut Ka Kuan arena in Ranchi.',
          location: 'Maut Ka Kuan Arena, Ranchi, Jharkhand',
          dateTaken: '2025',
          featured: true,
          order: 2,
        },
        {
          title: 'राँची की बेटी - Mudma Mela Stunt Team',
          category: 'Events',
          imageUrl: '/images/gallery/mudma_mela_varsha_rider.jpg',
          caption: 'Fearless passion and traditional stunt culture with Royal Enfield at Mudma Mela Maut Ka Kuan arena.',
          location: 'Mudma Mela, Kanejadi, Ranchi',
          dateTaken: '2025',
          featured: true,
          order: 3,
        },
        {
          title: 'Viral Girl Varsha Rider - Ranchi Ki Shaan',
          category: 'Behind the Scenes',
          imageUrl: '/images/gallery/varsha_rider_viral_bullet.jpg',
          caption: 'Official poster of Ranchi Ki Shaan Varsha Rider on Royal Enfield Bullet 350 inside the Well of Death arena.',
          location: 'Ranchi Stunt Grounds, Jharkhand',
          dateTaken: '2025',
          featured: true,
          order: 4,
        },
        {
          title: 'Twin Bike Tandem Stunt',
          category: 'Live Shows',
          imageUrl: '/images/gallery/tandem_wall_orbit.jpg',
          caption: 'Dual daredevil riders orbiting inches apart at high speed inside the wooden cylinder with cheering spectators.',
          location: 'Carnival Fairgrounds Maut Ka Kuan',
          dateTaken: 'October 2025',
          featured: true,
          order: 5,
        },
      ]);
      console.log('[Seeder] Gallery items seeded');
    }

    // 5. Seed Public Stunt Videos / Instagram Reels
    await PublicVideo.deleteMany({});
    await PublicVideo.insertMany([
      {
        title: 'Vertical Wall Mastery: High-Speed Centrifugal Orbit',
        category: 'Stunt Highlights',
        videoUrl: 'https://www.youtube.com/shorts/2u_iOzAG2qo',
        thumbnailUrl: 'https://i.ytimg.com/vi/2u_iOzAG2qo/hqdefault.jpg',
        duration: '0:30',
        description: 'Varsha Rider climbing the vertical wooden timber at peak RPM. Pure physics, balance, and zero margin for error. #VarshaRider #WellOfDeath #MautKaKuan',
        views: 154200,
        likes: 28400,
        commentsCount: 1420,
        audioTrack: 'Original Audio - @varsha_rider_18',
        authorHandle: '@varsha_rider_18',
        instagramUrl: 'https://www.youtube.com/shorts/2u_iOzAG2qo',
        youtubeUrl: 'https://www.youtube.com/shorts/2u_iOzAG2qo',
        isReel: true,
        featured: true,
        order: 1,
      },
      {
        title: 'Hands-Free 360° Wall Glide: Peak Centrifugal Balance ⚡',
        category: 'Live Performances',
        videoUrl: 'https://www.youtube.com/shorts/5Sj8XVZDxFI',
        thumbnailUrl: 'https://i.ytimg.com/vi/5Sj8XVZDxFI/hqdefault.jpg',
        duration: '0:45',
        description: 'Hands-free balance gliding along the upper wooden rim at 88 degrees vertical incline with extreme poise.',
        views: 198500,
        likes: 36200,
        commentsCount: 2150,
        audioTrack: 'Original Audio - @varsha_rider_18',
        authorHandle: '@varsha_rider_18',
        instagramUrl: 'https://www.youtube.com/shorts/5Sj8XVZDxFI',
        youtubeUrl: 'https://www.youtube.com/shorts/5Sj8XVZDxFI',
        isReel: true,
        featured: true,
        order: 2,
      },
      {
        title: 'Twin Motorcycle Orbit: High-Speed Wall Cross-Over 🏍️🏍️',
        category: 'Tandem Stunts',
        videoUrl: 'https://www.youtube.com/shorts/P3QQ9_MXBVc',
        thumbnailUrl: 'https://i.ytimg.com/vi/P3QQ9_MXBVc/hqdefault.jpg',
        duration: '0:50',
        description: 'Two bikes orbiting inches apart at 88 degrees vertical tilt. Flawless timing and razor-sharp synchrony. #TandemRide #CentrifugalOrbit #VarshaRider',
        views: 172000,
        likes: 31800,
        commentsCount: 1840,
        audioTrack: 'Original Audio - @varsha_rider_18',
        authorHandle: '@varsha_rider_18',
        instagramUrl: 'https://www.youtube.com/shorts/P3QQ9_MXBVc',
        youtubeUrl: 'https://www.youtube.com/shorts/P3QQ9_MXBVc',
        isReel: true,
        featured: true,
        order: 3,
      },
      {
        title: 'Independence Day Special: Tiranga Stunt on the Wall 🇮🇳',
        category: 'Extreme Stunts',
        videoUrl: 'https://www.youtube.com/shorts/fWLvQ59qq4k',
        thumbnailUrl: 'https://i.ytimg.com/vi/fWLvQ59qq4k/hqdefault.jpg',
        duration: '1:00',
        description: 'Accelerating onto the high timber rim under extreme G-force. Precision throttle control in full action. #Daredevil #MautKaKuan #HighSpeed',
        views: 245000,
        likes: 48900,
        commentsCount: 3200,
        audioTrack: 'Original Audio - @varsha_rider_18',
        authorHandle: '@varsha_rider_18',
        instagramUrl: 'https://www.youtube.com/shorts/fWLvQ59qq4k',
        youtubeUrl: 'https://www.youtube.com/shorts/fWLvQ59qq4k',
        isReel: true,
        featured: true,
        order: 4,
      },
      {
        title: 'Spectator Point-of-View: Looking Down into the Maut Ka Kuan 🌀',
        category: 'Arena POV',
        videoUrl: 'https://www.youtube.com/shorts/dNe-WS6A9js',
        thumbnailUrl: 'https://i.ytimg.com/vi/dNe-WS6A9js/hqdefault.jpg',
        duration: '0:08',
        description: 'The dizzying perspective from the gallery railing as bikes reach terminal centrifugal velocity. #POV #Vertigo #AdrenalineJunkie #NajuRider',
        views: 76800,
        likes: 14900,
        commentsCount: 710,
        audioTrack: 'Original Audio - @naju_rider_18',
        authorHandle: '@naju_rider_18',
        instagramUrl: 'https://www.youtube.com/shorts/dNe-WS6A9js',
        youtubeUrl: 'https://www.youtube.com/shorts/dNe-WS6A9js',
        isReel: true,
        featured: true,
        order: 5,
      },
      {
        title: 'Carnival Night Showtime: Roaring Engines & Grand Arena Orbit 🎪',
        category: 'Live Shows',
        videoUrl: 'https://www.youtube.com/shorts/2u_iOzAG2qo',
        thumbnailUrl: 'https://i.ytimg.com/vi/2u_iOzAG2qo/hqdefault.jpg',
        duration: '1:10',
        description: 'Under the fairground lights, thrilling thousands of spectators with fearless rhythm and balance. #FairgroundStunts #VarshaRiderSince2016',
        views: 103400,
        likes: 21800,
        commentsCount: 1290,
        audioTrack: 'Original Audio - @naju_rider_18',
        authorHandle: '@naju_rider_18',
        instagramUrl: 'https://www.youtube.com/shorts/dNe-WS6A9js',
        youtubeUrl: 'https://www.youtube.com/shorts/dNe-WS6A9js',
        isReel: true,
        featured: true,
        order: 6,
      },
    ]);
    console.log('[Seeder] Instagram Reels seeded');

    // 6. Seed Site Settings
    let setting = await Setting.findOne();
    if (!setting) {
      setting = new Setting();
    }
    setting.brandName = 'Varsha Rider';
    setting.tagline = 'Witness the Courage. Learn the Discipline. Respect the Risk.';
    setting.heroHeadline = 'Well of Death';
    setting.heroSubheadline = '';
    setting.riderTitle = 'Master Centrifugal Wall Stunt Specialist';
    setting.heroVideoUrl = '/videos/trailer.mp4';
    setting.heroImageUrl = 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1920&q=80';
    setting.aboutBio =
      "Welcome to the world of Varsha Rider — where courage meets passion and every ride is a test of skill, balance, and fearless determination.\n\nSince 2016, I have been pursuing my passion for Well of Death (Maut Ka Kuan) riding, a thrilling and traditional Indian stunt performance that demands extraordinary focus, precision, and confidence.";
    setting.statsYearsExperience = 10;
    setting.statsArenaShows = 650;
    setting.statsWallIncline = '88°';
    setting.statsSafetyRecord = '100% Zero Severe Injury';
    setting.trainingFee = 4999;
    setting.contactEmail = 'contact@najurider.com';
    setting.contactPhone = '+91 7488405975';
    setting.contactWhatsApp = '+917488405975';
    setting.headquartersAddress = 'Kanijari, Mandar Ranchi, Jharkhand';
    setting.socialLinks = {
      instagram: 'https://www.instagram.com/varsha_rider_18/',
      youtube: 'https://www.youtube.com/@VarshaKispotta-ce9pj',
      facebook: 'https://www.facebook.com/profile.php?id=61556212378205',
    };
    await setting.save();
    console.log('[Seeder] Site settings updated with Varsha Rider');

    console.log('[Seeder] Database successfully populated!');
  } catch (error) {
    console.error('[Seeder Error]:', error);
  }
};

// Run directly if invoked from CLI
if (process.argv[1] && process.argv[1].endsWith('seedData.js')) {
  seedDatabase().then(() => {
    mongoose.connection.close();
    process.exit(0);
  });
}
