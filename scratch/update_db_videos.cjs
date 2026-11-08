const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../server/.env') });

const newVideos = [
  {
    order: 1,
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
  },
  {
    order: 2,
    title: 'Hands-Free 360° Wall Glide: Peak Centrifugal Balance ⚡',
    category: 'Live Performances',
    videoUrl: '/videos/stunt_wod_solo_wall.mp4',
    thumbnailUrl: 'https://i.ytimg.com/vi/5Sj8XVZDxFI/hqdefault.jpg',
    duration: '0:45',
    description: '',
    views: '',
    likes: '',
    commentsCount: '',
    audioTrack: 'Original Audio - @varsha_rider_18',
    authorHandle: '@varsha_rider_18',
    instagramUrl: 'https://www.youtube.com/shorts/5Sj8XVZDxFI',
    youtubeUrl: 'https://www.youtube.com/shorts/5Sj8XVZDxFI',
    isReel: true,
    featured: true,
  },
  {
    order: 3,
    title: 'Twin Motorcycle Orbit: High-Speed Wall Cross-Over 🏍️🏍️',
    category: 'Tandem Stunts',
    videoUrl: '/videos/stunt_wod_four_bikes.mp4',
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
  },
  {
    order: 4,
    title: 'Independence Day Special: Tiranga Stunt on the Wall 🇮🇳',
    category: 'Extreme Stunts',
    videoUrl: '/videos/stunt_wod_solo_wall.mp4',
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
  },
];

async function updateVideos() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to DB');

  const coll = mongoose.connection.db.collection('publicvideos');

  for (const v of newVideos) {
    const res = await coll.updateOne(
      { order: v.order },
      { $set: v },
      { upsert: true }
    );
    console.log(`Updated video order ${v.order}: modified=${res.modifiedCount}, upserted=${res.upsertedCount}`);
  }

  const all = await coll.find({}).sort({ order: 1 }).toArray();
  console.log('\n--- Current Videos in MongoDB ---');
  all.forEach(v => console.log(`[${v.order}] ${v.title} -> ${v.youtubeUrl || v.videoUrl}`));

  await mongoose.disconnect();
  console.log('Done!');
}

updateVideos().catch(console.error);

