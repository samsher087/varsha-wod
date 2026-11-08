import { connectDB, Setting, Course, TrainingApplication, Payment } from '../api/_db.js';

async function updateFee() {
  await connectDB();
  const setRes = await Setting.updateMany({}, { $set: { trainingFee: 4999 } });
  console.log('Settings updated:', setRes.modifiedCount);
  const courseRes = await Course.updateMany({}, { $set: { price: 4999 } });
  console.log('Courses updated:', courseRes.modifiedCount);
  const appRes = await TrainingApplication.updateMany({ trainingFee: 9999 }, { $set: { trainingFee: 4999 } });
  console.log('Applications trainingFee updated:', appRes.modifiedCount);
  const appPayRes = await TrainingApplication.updateMany({ paymentAmount: 9999 }, { $set: { paymentAmount: 4999 } });
  console.log('Applications paymentAmount updated:', appPayRes.modifiedCount);
  const payRes = await Payment.updateMany({ amount: 9999 }, { $set: { amount: 4999 } });
  console.log('Payments updated:', payRes.modifiedCount);

  const setting = await Setting.findOne();
  console.log('Verified live DB Setting trainingFee:', setting?.trainingFee);
  process.exit(0);
}

updateFee().catch(err => {
  console.error(err);
  process.exit(1);
});

