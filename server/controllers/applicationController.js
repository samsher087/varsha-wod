import TrainingApplication from '../models/TrainingApplication.js';
import Setting from '../models/Setting.js';
import Payment from '../models/Payment.js';
import AdminAuditLog from '../models/AdminAuditLog.js';

// @desc    Submit training application (Step 1)
// @route   POST /api/applications/apply
export const submitApplication = async (req, res) => {
  try {
    const {
      fullName,
      email,
      phone,
      age,
      dob,
      city,
      state,
      experienceLevel,
      reason,
      emergencyContactName,
      emergencyContactPhone,
      additionalExperience,
      agreedToSafetyWaiver,
    } = req.body;

    if (!agreedToSafetyWaiver) {
      return res.status(400).json({
        message: 'You must read and agree to the Safety & Risk Waiver to apply.',
      });
    }

    if (!age || age < 18) {
      return res.status(400).json({
        message: 'Applicant must be at least 18 years old to undergo Well of Death training.',
      });
    }

    // Check existing application
    let application = await TrainingApplication.findOne({ user: req.user._id });

    // Fetch configured training fee
    const setting = await Setting.findOne();
    const trainingFee = setting?.trainingFee || 4999;

    if (application) {
      if (['Training Unlocked'].includes(application.status)) {
        return res.status(400).json({
          message: 'Your training is already unlocked! Check your academy tab.',
          application,
        });
      }

      // If previous was rejected or updating, allow updating
      application.fullName = fullName;
      application.email = email;
      application.phone = phone;
      application.age = age;
      application.dob = dob || '';
      application.city = city;
      application.state = state;
      application.experienceLevel = experienceLevel;
      application.reason = reason;
      application.emergencyContactName = emergencyContactName;
      application.emergencyContactPhone = emergencyContactPhone;
      application.additionalExperience = additionalExperience || '';
      application.agreedToSafetyWaiver = true;
      application.status = 'Application Submitted';
      application.trainingFee = trainingFee;
      application.rejectionReason = '';

      await application.save();

      return res.status(200).json({
        success: true,
        message: 'Training application saved! Please proceed to Step 2: Payment Process.',
        application,
      });
    }

    application = await TrainingApplication.create({
      user: req.user._id,
      fullName,
      email,
      phone,
      age,
      dob: dob || '',
      city,
      state,
      experienceLevel,
      reason,
      emergencyContactName,
      emergencyContactPhone,
      additionalExperience: additionalExperience || '',
      agreedToSafetyWaiver: true,
      trainingFee,
      status: 'Application Submitted',
    });

    res.status(201).json({
      success: true,
      message: 'Training application submitted! Please complete Step 2: Payment Process & attach your reference number.',
      application,
    });
  } catch (error) {
    console.error('Submit application error:', error);
    res.status(500).json({ message: error.message || 'Error submitting application' });
  }
};

// @desc    Get current user's application
// @route   GET /api/applications/my-application
export const getMyApplication = async (req, res) => {
  try {
    const application = await TrainingApplication.findOne({ user: req.user._id });
    res.json({
      success: true,
      application,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving your application' });
  }
};

// @desc    Get all applications (Admin)
// @route   GET /api/applications/admin/all
export const getAllApplications = async (req, res) => {
  try {
    const { status, search } = req.query;
    let query = {};

    if (status && status !== 'All') {
      query.status = status;
    }

    if (search) {
      query.$or = [
        { fullName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
        { city: { $regex: search, $options: 'i' } },
      ];
    }

    const applications = await TrainingApplication.find(query)
      .populate('user', 'name email phone')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: applications.length,
      applications,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching applications list' });
  }
};

// @desc    Submit payment reference number for admin approval (Step 2 -> Step 3)
// @route   POST /api/applications/submit-payment-ref
export const submitPaymentRef = async (req, res) => {
  try {
    const { paymentRefNo, paymentMethod, amount, paymentNotes } = req.body;

    if (!paymentRefNo || !paymentRefNo.trim()) {
      return res.status(400).json({ message: 'Payment reference number / UTR is required.' });
    }

    const application = await TrainingApplication.findOne({ user: req.user._id });
    if (!application) {
      return res.status(404).json({
        message: 'No training application found for your account. Please submit an application first.',
      });
    }

    if (application.status === 'Training Unlocked') {
      return res.status(400).json({ message: 'Training is already unlocked for your account!' });
    }

    const paidAmount = Number(amount) || application.trainingFee || 4999;
    const cleanRefNo = paymentRefNo.trim();
    const method = paymentMethod || 'UPI / QR';

    application.paymentRefNo = cleanRefNo;
    application.paymentMethod = method;
    application.paymentAmount = paidAmount;
    application.paymentSubmittedAt = new Date();
    application.status = 'Payment Submitted — Pending Admin Approval';
    await application.save();

    // Create or update linked Payment record
    const receipt = `RCP_${Date.now().toString().slice(-8)}`;
    let payment = await Payment.findOne({ application: application._id });
    if (!payment) {
      payment = await Payment.create({
        user: req.user._id,
        application: application._id,
        orderId: `order_ref_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        paymentId: cleanRefNo,
        paymentRefNo: cleanRefNo,
        amount: paidAmount,
        currency: 'INR',
        status: 'pending',
        paymentMethod: method,
        receiptNumber: receipt,
        gatewayResponse: { paymentNotes: paymentNotes || '' },
      });
    } else {
      payment.paymentRefNo = cleanRefNo;
      payment.paymentId = cleanRefNo;
      payment.paymentMethod = method;
      payment.amount = paidAmount;
      payment.status = 'pending';
      payment.gatewayResponse = { paymentNotes: paymentNotes || '' };
      await payment.save();
    }

    // Log admin audit
    await AdminAuditLog.create({
      admin: req.user._id,
      action: `Payment reference attached: ${cleanRefNo} (${method} - ₹${paidAmount})`,
      targetType: 'TrainingApplication',
      targetId: application._id.toString(),
      details: `Applicant attached payment ref. Status moved to Pending Admin Approval.`,
      ipAddress: req.ip || '',
    });

    res.json({
      success: true,
      message: 'Payment reference attached successfully! Awaiting Admin Approval.',
      application,
    });
  } catch (error) {
    console.error('submitPaymentRef error:', error);
    res.status(500).json({ message: error.message || 'Error attaching payment reference' });
  }
};

// @desc    Update application status (Admin - Step 3 Approval)
// @route   PUT /api/applications/admin/:id/status
export const updateApplicationStatus = async (req, res) => {
  try {
    const { status, adminNotes, rejectionReason, trainingFee } = req.body;
    const application = await TrainingApplication.findById(req.params.id);

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    const previousStatus = application.status;
    application.status = status || application.status;

    if (adminNotes !== undefined) application.adminNotes = adminNotes;
    if (rejectionReason !== undefined) application.rejectionReason = rejectionReason;
    if (trainingFee !== undefined && Number(trainingFee) > 0) {
      application.trainingFee = Number(trainingFee);
    }

    if (status === 'Training Unlocked') {
      application.approvedAt = new Date();
      application.approvedBy = req.user._id;
      application.paymentVerifiedAt = new Date();
      application.unlockedAt = new Date();

      // Update linked payment to successful
      await Payment.findOneAndUpdate(
        { application: application._id },
        { status: 'successful', verifiedAt: new Date() }
      );
    } else if (status === 'Approved — Payment Required') {
      application.approvedAt = new Date();
      application.approvedBy = req.user._id;
    }

    await application.save();

    // Log admin audit
    await AdminAuditLog.create({
      admin: req.user._id,
      action: `Application status changed from "${previousStatus}" to "${application.status}"`,
      targetType: 'TrainingApplication',
      targetId: application._id.toString(),
      details: `Notes: ${adminNotes || 'None'} | Rejection: ${rejectionReason || 'None'} | Fee: ₹${application.trainingFee} | Payment Ref: ${application.paymentRefNo || 'None'}`,
      ipAddress: req.ip || '',
    });

    res.json({
      success: true,
      message: `Application status successfully updated to "${application.status}"`,
      application,
    });
  } catch (error) {
    console.error('Update status error:', error);
    res.status(500).json({ message: 'Failed to update application status' });
  }
};

// @desc    Toggle trainee subscription for current logged-in user (Test / Demo)
// @route   POST /api/applications/toggle-test-subscription
export const toggleTestSubscription = async (req, res) => {
  try {
    let application = await TrainingApplication.findOne({ user: req.user._id });
    if (!application) {
      application = await TrainingApplication.create({
        user: req.user._id,
        fullName: req.user.name || 'Trainee Rider',
        email: req.user.email,
        phone: req.user.phone || '+91 91234 56789',
        age: 24,
        city: 'New Delhi',
        state: 'Delhi',
        experienceLevel: 'Intermediate',
        reason: 'Professional Stunt Academy Training',
        emergencyContactName: 'Emergency Contact',
        emergencyContactPhone: '+91 98765 43210',
        agreedToSafetyWaiver: true,
        status: 'Training Unlocked',
        trainingFee: 4999,
        unlockedAt: new Date(),
      });
    } else {
      application.status = application.status === 'Training Unlocked' ? 'Approved — Payment Required' : 'Training Unlocked';
      if (application.status === 'Training Unlocked') {
        application.unlockedAt = new Date();
      }
      await application.save();
    }

    res.json({
      success: true,
      status: application.status,
      isUnlocked: application.status === 'Training Unlocked',
      message: application.status === 'Training Unlocked' ? 'Trainee Subscription Unlocked!' : 'Subscription Locked.',
    });
  } catch (error) {
    console.error('toggleTestSubscription error:', error);
    res.status(500).json({ message: 'Error toggling test subscription' });
  }
};
