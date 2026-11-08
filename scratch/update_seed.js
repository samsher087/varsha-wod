import fs from 'fs';

let content = fs.readFileSync('server/utils/seedData.js', 'utf8');

const target = `    // 2. Seed or Update Sample Trainee User
    const traineeEmail = 'rider.trainee@example.com';
    let trainee = await User.findOne({ email: traineeEmail });
    if (!trainee) {
      trainee = await User.create({
        name: 'Kabir Verma',
        email: traineeEmail,
        phone: '+91 91234 56789',
        password: 'Password@123',
        role: 'user',
        city: 'Jaipur, Rajasthan',
        status: 'active',
      });
      console.log('[Seeder] Sample trainee created: rider.trainee@example.com / Password@123');
    }`;

const replacement = `    // 2. Seed Trainee Users
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
        let paymentAmount = 9999;
        let trainingFee = 9999;
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
    }`;

const normalized = content.replace(/\r\n/g, '\n');
const normalizedTarget = target.replace(/\r\n/g, '\n');

if (normalized.includes(normalizedTarget)) {
  let updated = normalized.replace(normalizedTarget, replacement);
  // Also clean heroSubheadline
  updated = updated.replace(
    "setting.heroSubheadline = 'Witness the Courage. Learn the Discipline. Respect the Risk.';",
    "setting.heroSubheadline = '';"
  );
  fs.writeFileSync('server/utils/seedData.js', updated, 'utf8');
  console.log('SUCCESS: Seed data updated!');
} else {
  console.log('ERROR: Target string not found in normalized content');
}

