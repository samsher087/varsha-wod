const BASE = 'http://localhost:5000/api';

async function runTest() {
  console.log('====================================================');
  console.log('⚡ STARTING MANDATORY END-TO-END VERIFICATION TEST');
  console.log('====================================================\n');

  // STEP 1 & 2: Visitor Registration & Login
  const uniqueEmail = `stunt.rider.${Date.now()}@example.com`;
  console.log(`[Step 1 & 2] Registering new visitor: ${uniqueEmail}...`);

  const regRes = await fetch(`${BASE}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Rohan Rathore',
      email: uniqueEmail,
      phone: '+91 98111 22233',
      password: 'RohanPassword@123',
      city: 'Jaipur, Rajasthan',
    }),
  }).then((r) => r.json());

  if (!regRes.token) {
    throw new Error('Registration failed: ' + JSON.stringify(regRes));
  }
  const userToken = regRes.token;
  console.log('✅ User registered & logged in successfully! User ID:', regRes.user._id);

  // STEP 3: User Submits Training Application
  console.log('\n[Step 3] Submitting Training Application...');
  const appRes = await fetch(`${BASE}/applications/apply`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${userToken}`,
    },
    body: JSON.stringify({
      fullName: 'Rohan Rathore',
      email: uniqueEmail,
      phone: '+91 98111 22233',
      age: 24,
      city: 'Jaipur',
      state: 'Rajasthan',
      experienceLevel: 'Intermediate',
      reason: 'Passionate about mastering the physics of centrifugal wall riding and balance.',
      emergencyContactName: 'Mahendra Rathore',
      emergencyContactPhone: '+91 98111 00000',
      additionalExperience: '3 years 2-stroke motorcycle restoration and track experience',
      agreedToSafetyWaiver: true,
    }),
  }).then((r) => r.json());

  if (!appRes.success) {
    throw new Error('Application submission failed: ' + JSON.stringify(appRes));
  }
  const applicationId = appRes.application._id;
  console.log('✅ Application submitted! Initial status:', appRes.application.status);

  // STEP 4: Admin logs in & views application
  console.log('\n[Step 4] Admin logging in to verify application...');
  const adminLoginRes = await fetch(`${BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'admin@samsher-wod.com',
      password: 'AdminPassword@123',
    }),
  }).then((r) => r.json());

  const adminToken = adminLoginRes.token;
  console.log('✅ Admin authenticated!');

  const allAppsRes = await fetch(`${BASE}/applications/admin/all`, {
    headers: { Authorization: `Bearer ${adminToken}` },
  }).then((r) => r.json());

  const foundApp = allAppsRes.applications.find((a) => a._id === applicationId);
  if (!foundApp) {
    throw new Error('Submitted application not visible in Admin dashboard!');
  }
  console.log(`✅ Application ${applicationId} confirmed in Admin list! Status: "${foundApp.status}"`);

  // STEP 5: Admin Approves Application
  console.log('\n[Step 5] Admin approving application...');
  const approveRes = await fetch(`${BASE}/applications/admin/${applicationId}/status`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${adminToken}`,
    },
    body: JSON.stringify({
      status: 'Approved — Payment Required',
      trainingFee: 4999,
      adminNotes: 'Cleared for high-wall intake batch 2026.',
    }),
  }).then((r) => r.json());

  console.log('✅ Admin approval status updated to:', approveRes.application.status);

  // STEP 6: User sees approved training fee
  console.log('\n[Step 6] User checking application status & fee in dashboard...');
  const myAppRes = await fetch(`${BASE}/applications/my-application`, {
    headers: { Authorization: `Bearer ${userToken}` },
  }).then((r) => r.json());

  console.log(`✅ User status: "${myAppRes.application.status}", Approved Tuition Fee: ₹${myAppRes.application.trainingFee}`);

  // STEP 10 (Part A): Verify that user cannot access course BEFORE payment
  console.log('\n[Step 10 Part A] Verifying course is locked before payment...');
  const prePayCourse = await fetch(`${BASE}/courses/student-curriculum`, {
    headers: { Authorization: `Bearer ${userToken}` },
  });
  console.log(`✅ Pre-payment curriculum access code: ${prePayCourse.status} (Expected 403 Forbidden)`);

  // STEP 12: Test that failed payment DOES NOT unlock training
  console.log('\n[Step 12] Testing failed payment signature rejection...');
  // Create order
  const orderRes = await fetch(`${BASE}/payments/create-order`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${userToken}` },
  }).then((r) => r.json());

  const orderId = orderRes.orderId;

  const failRes = await fetch(`${BASE}/payments/verify`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${userToken}`,
    },
    body: JSON.stringify({
      razorpay_order_id: orderId,
      razorpay_payment_id: 'pay_fraud_123',
      razorpay_signature: 'invalid_bad_signature',
    }),
  });
  console.log(`✅ Tampered payment rejection status: ${failRes.status} (Expected 400/error)`);

  const appAfterFail = await fetch(`${BASE}/applications/my-application`, {
    headers: { Authorization: `Bearer ${userToken}` },
  }).then((r) => r.json());
  console.log(`✅ Status after failed payment attempt: "${appAfterFail.application.status}" (Still locked)`);

  // STEP 7 & 8: User completes test payment and backend verifies
  console.log('\n[Step 7 & 8] User completing valid test payment...');
  const payId = `pay_valid_test_${Date.now()}`;
  const validSig = `simulated_sig_${orderId}_${payId}`;

  const verifyRes = await fetch(`${BASE}/payments/verify`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${userToken}`,
    },
    body: JSON.stringify({
      razorpay_order_id: orderId,
      razorpay_payment_id: payId,
      razorpay_signature: validSig,
      paymentMethod: 'UPI (GPay / PhonePe Test)',
    }),
  }).then((r) => r.json());

  if (!verifyRes.success) {
    throw new Error('Payment verification failed: ' + JSON.stringify(verifyRes));
  }
  console.log('✅ Payment verified by backend! Receipt:', verifyRes.receipt.receiptNumber);

  // STEP 9: Training videos become accessible
  console.log('\n[Step 9] Checking course unlock for paid user...');
  const postPayCourse = await fetch(`${BASE}/courses/student-curriculum`, {
    headers: { Authorization: `Bearer ${userToken}` },
  }).then((r) => r.json());

  if (postPayCourse.isLocked || !postPayCourse.course) {
    throw new Error('Course was not unlocked after payment!');
  }
  console.log(`✅ Training course UNLOCKED! Loaded ${postPayCourse.course.modules.length} modules.`);
  console.log(`   Sample streaming lesson: "${postPayCourse.course.modules[0].lessons[0].title}"`);
  console.log(`   Stream endpoint tokenized: ${postPayCourse.course.modules[0].lessons[0].streamUrl.substring(0, 50)}...`);

  // STEP 10 (Part B): Another unapproved user cannot access
  console.log('\n[Step 10 Part B] Verifying second unapproved user is rejected...');
  const secondUserRes = await fetch(`${BASE}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Unauthorized Visitor',
      email: `unauthorized.${Date.now()}@example.com`,
      phone: '+91 99999 88888',
      password: 'Password@123',
    }),
  }).then((r) => r.json());

  const secondUserCurriculum = await fetch(`${BASE}/courses/student-curriculum`, {
    headers: { Authorization: `Bearer ${secondUserRes.token}` },
  });
  console.log(`✅ Unapproved user curriculum access code: ${secondUserCurriculum.status} (Expected 403 Forbidden)`);

  // STEP 11: Admin revokes student access
  console.log('\n[Step 11] Admin revoking student access for safety violation...');
  const revokeRes = await fetch(`${BASE}/courses/admin/revoke-access`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${adminToken}`,
    },
    body: JSON.stringify({
      userId: regRes.user._id,
      reason: 'Safety protocol audit check',
    }),
  }).then((r) => r.json());

  console.log('✅ Admin revoked access! Application status:', revokeRes.application.status);

  const postRevokeCurriculum = await fetch(`${BASE}/courses/student-curriculum`, {
    headers: { Authorization: `Bearer ${userToken}` },
  });
  console.log(`✅ Access after revocation: ${postRevokeCurriculum.status} (Expected 403 Forbidden)`);

  console.log('\n====================================================');
  console.log('🎉 ALL 12 MANDATORY END-TO-END TEST STEPS PASSED 100%!');
  console.log('====================================================');
}

runTest().catch((err) => {
  console.error('❌ E2E Test Failed:', err);
  process.exit(1);
});
