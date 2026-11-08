import mongoose from 'mongoose';

async function updateAddress() {
  await mongoose.connect('mongodb://127.0.0.1:27017/well_of_death');
  const res = await mongoose.connection.collection('settings').updateMany(
    {},
    { $set: { headquartersAddress: 'Kusaiya, Giridih, Jharkhand' } }
  );
  console.log('Updated settings in MongoDB:', res.modifiedCount);
  await mongoose.disconnect();
}

updateAddress().catch(err => {
  console.error(err);
  process.exit(1);
});
