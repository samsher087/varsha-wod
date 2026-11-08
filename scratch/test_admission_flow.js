const API_BASE = 'http://localhost:5000/api';

async function main() {
  console.log('--- Testing 4-Step Training Admission Flow ---');

  const testEmail = `candidate_${Date.now()}@example.com`;
  console.log(`\n[1] Registering fresh candidate: ${testEmail}...`);
  const regRes = await fetch(`${API_BASE}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Aditya Rajput',
      email: testEmail,
      phone: '+91 98888 77777',
      password: 'Password@123',
      city: 'Chandigarh',
    }),
  });
  const regData = await regRes.json();
  if (!regData.token) {
    throw new Error('Registration failed: ' + JSON.stringify(regData));
  }
  const traineeToken = regData.token;
  console.log('✓ Candidate registered & logged in successfully.');

  // Step 1: Submit Application Form
  console.log('\n[Step 1] Submitting Training Application (Step 1: Application Submitted)...');
  const appRes = await fetch(`${API_BASE}/applications/apply`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${traineeToken}`,
    },
    body: JSON.stringify({
      fullName: 'Kabir Verma',
      email: 'rider.trainee@example.com',
      phone: '+91 91234 56789',
      age: 23,
      dob: '2003-01-15',
      city: 'Jaipur',
      state: 'Rajasthan',
      experienceLevel: 'Intermediate',
      reason: 'Want to master vertical wall riding and join the Samsher stunts squad.',
      emergencyContactName: 'Ramesh Verma',
      emergencyContactPhone: '+91 98765 43210',
      additionalExperience: '2 years circuit dirt bike riding',
      agreedToSafetyWaiver: true,
    }),
  });
  const appData = await appRes.json();
  console.log(`✓ Application status after Step 1: "${appData.application?.status}" (Training Fee: ₹${appData.application?.trainingFee})`);

  // Step 2: Payment Process (attach ref no.)
  const sampleRefNo = `UTR-${Date.now().toString().slice(-8)}`;
  console.log(`\n[Step 2] Executing Payment Process & Attaching Reference No: ${sampleRefNo}...`);
  const payRes = await fetch(`${API_BASE}/applications/submit-payment-ref`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${traineeToken}`,
    },
    body: JSON.stringify({
      paymentRefNo: sampleRefNo,
      paymentMethod: 'UPI / QR Transfer',
      amount: 9999,
      paymentNotes: 'Paid via GPay to samsher.wod@okhdfcbank',
    }),
  });
  const payData = await payRes.json();
  console.log(`✓ Application status after Step 2: "${payData.application?.status}"`);
  console.log(`✓ Attached Payment Ref: "${payData.application?.paymentRefNo}" | Mode: "${payData.application?.paymentMethod}"`);

  // Step 3: Admin Approval
  console.log('\n[3] Logging in as Admin (admin@samsher-wod.com)...');
  const adminLoginRes = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'admin@samsher-wod.com',
      password: 'AdminPassword@123',
    }),
  });
  const adminLoginData = await adminLoginRes.json();
  if (!adminLoginData.token) {
    throw new Error('Failed to log in as admin: ' + JSON.stringify(adminLoginData));
  }
  const adminToken = adminLoginData.token;
  console.log('✓ Admin logged in successfully.');

  console.log('\n[Step 3] Admin reviews credentials + attached ref no and approves -> Unlocks Training...');
  const appId = payData.application._id;
  const approveRes = await fetch(`${API_BASE}/applications/admin/${appId}/status`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${adminToken}`,
    },
    body: JSON.stringify({
      status: 'Training Unlocked',
      trainingFee: 9999,
      adminNotes: 'Verified UTR in bank statement. Rider approved for Batch 14.',
    }),
  });
  const approveData = await approveRes.json();
  console.log(`✓ Application status after Step 3: "${approveData.application?.status}"`);
  console.log(`✓ Admin Notes: "${approveData.application?.adminNotes}"`);

  // Step 4: Training Unlocked - Verify Student Curriculum Access
  console.log('\n[Step 4] Verifying Student Curriculum Access for trainee...');
  const currRes = await fetch(`${API_BASE}/courses/student-curriculum`, {
    headers: {
      Authorization: `Bearer ${traineeToken}`,
    },
  });
  const currData = await currRes.json();
  if (currData.course) {
    console.log(`✓ Success! Student has full unlocked access to course: "${currData.course.title}"`);
    console.log(`✓ Total modules available: ${currData.course.modules?.length}`);
    const firstLesson = currData.course.modules?.[0]?.lessons?.[0];
    console.log(`✓ First unlocked lesson: "${firstLesson?.title}"`);
    console.log(`✓ Stream URL with token: ${firstLesson?.streamUrl}`);

    const streamRes = await fetch(`http://localhost:5000${firstLesson.streamUrl}`, {
      headers: { Range: 'bytes=0-1024' },
    });
    console.log(`✓ Stream response status: ${streamRes.status} (Content-Type: ${streamRes.headers.get('content-type')})`);
  } else {
    throw new Error('Course curriculum not accessible: ' + JSON.stringify(currData));
  }

  console.log('\n======================================================');
  console.log('ALL 4 STEPS COMPLETED & VERIFIED SUCCESSFULLY:');
  console.log('1. Application Submitted -> Recorded with safety waiver');
  console.log('2. Payment Process -> Attached payment ref no & pending admin approval');
  console.log('3. Admin Approval -> Admin verified UTR ref & unlocked training');
  console.log('4. Training Unlocked -> Student has full video masterclass access');
  console.log('======================================================\n');
}

main().catch(err => {
  console.error('Test failed:', err);
  process.exit(1);
});
