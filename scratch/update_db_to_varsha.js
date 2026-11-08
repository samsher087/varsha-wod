import { connectDB } from '../server/config/db.js';

const run = async () => {
  const conn = await connectDB();
  if (!conn) {
    console.error('Failed to connect');
    process.exit(1);
  }

  const db = conn.connection.db;

  const resSetting = await db.collection('settings').updateMany(
    {},
    {
      $set: {
        brandName: 'Varsha Rider',
        aboutBio:
          'Welcome to the world of Varsha Rider — where courage meets passion and every ride is a test of skill, balance, and fearless determination.\n\nSince 2016, I have been pursuing my passion for Well of Death (Maut Ka Kuan) riding, a thrilling and traditional Indian stunt performance that demands extraordinary focus, precision, and confidence.',
      },
    }
  );
  console.log('Settings updated:', resSetting.modifiedCount);

  const resGallery = await db.collection('galleryitems').updateMany(
    { title: { $regex: 'Naju Rider', $options: 'i' } },
    {
      $set: {
        title: 'Varsha Rider - Maut Ka Kuan Grand Carnival Team',
        caption:
          'Official Varsha Rider stunt showcase featuring the Yamaha RX100, Royal Enfield Bullet, and the legendary Maut Ka Kuan fairground arena.',
      },
    }
  );
  console.log('Gallery updated:', resGallery.modifiedCount);

  const resApps = await db.collection('trainingapplications').updateMany(
    { reason: { $regex: 'Master Naju', $options: 'i' } },
    {
      $set: {
        reason: 'Passionate about Well of Death stunt riding under Master Varsha.',
      },
    }
  );
  console.log('Applications updated:', resApps.modifiedCount);

  const videos = await db.collection('publicvideos').find({}).toArray();
  let updatedVideos = 0;
  for (const v of videos) {
    let changed = false;
    let newDesc = v.description;
    let newAudio = v.audioTrack;
    if (newDesc && newDesc.includes('Naju Rider')) {
      newDesc = newDesc.replaceAll('Naju Rider', 'Varsha Rider');
      changed = true;
    }
    if (newAudio && newAudio.includes('Naju Rider')) {
      newAudio = newAudio.replaceAll('Naju Rider', 'Varsha Rider');
      changed = true;
    }
    if (changed) {
      await db.collection('publicvideos').updateOne({ _id: v._id }, { $set: { description: newDesc, audioTrack: newAudio } });
      updatedVideos++;
    }
  }
  console.log('Public videos updated:', updatedVideos);

  console.log('Database migration completed successfully!');
  process.exit(0);
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});

