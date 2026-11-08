const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../server/.env') });

async function updateDb() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to DB');

  const galleryColl = mongoose.connection.db.collection('galleryitems');
  const res1 = await galleryColl.updateMany(
    { imageUrl: { $regex: 'jagannathpur_mela_wod' } },
    { $set: { 
      imageUrl: '/images/gallery/varsha_rider_rx100_arena.jpg',
      title: 'मौत का कुआँ - Varsha Rider Wall Stunt',
      caption: 'High-octane centrifugal wall riding stunt inside the historic Maut Ka Kuan arena in Ranchi.'
    } }
  );
  console.log('Updated galleryitems jagannathpur:', res1.modifiedCount);

  const res2 = await galleryColl.updateMany(
    { imageUrl: { $regex: 'arena_grounds_portrait' } },
    { $set: { 
      imageUrl: '/images/gallery/varsha_rider_viral_bullet.jpg',
      title: 'Viral Girl Varsha Rider - Ranchi Ki Shaan',
      caption: 'Official poster of Ranchi Ki Shaan Varsha Rider on Royal Enfield Bullet 350 inside the Well of Death arena.'
    } }
  );
  console.log('Updated galleryitems arena_grounds:', res2.modifiedCount);

  const videoColl = mongoose.connection.db.collection('publicvideos');
  const res3 = await videoColl.updateMany(
    { thumbnailUrl: { $regex: 'jagannathpur_mela_wod' } },
    { $set: { thumbnailUrl: '/images/gallery/varsha_rider_rx100_arena.jpg' } }
  );
  console.log('Updated publicvideos jagannathpur:', res3.modifiedCount);

  const res4 = await videoColl.updateMany(
    { thumbnailUrl: { $regex: 'arena_grounds_portrait' } },
    { $set: { thumbnailUrl: '/images/gallery/varsha_rider_stunt_pose.jpg' } }
  );
  console.log('Updated publicvideos arena_grounds:', res4.modifiedCount);

  const allGallery = await galleryColl.find({}).toArray();
  console.log('\n--- Current Gallery in MongoDB ---');
  allGallery.forEach(g => console.log(`[${g.order || '-'}] ${g.title} => ${g.imageUrl}`));

  await mongoose.disconnect();
  console.log('Done!');
}

updateDb().catch(console.error);
