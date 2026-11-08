import User from '../models/User.js';
import TrainingApplication from '../models/TrainingApplication.js';
import Payment from '../models/Payment.js';
import GalleryItem from '../models/GalleryItem.js';
import PublicVideo from '../models/PublicVideo.js';
import AdminAuditLog from '../models/AdminAuditLog.js';

// @desc    Get Admin Overview Analytics
// @route   GET /api/admin/overview
export const getAdminOverview = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'user' });
    const totalApplications = await TrainingApplication.countDocuments();
    const pendingApplications = await TrainingApplication.countDocuments({ status: 'Pending Approval' });
    const approvedAwaitingPayment = await TrainingApplication.countDocuments({
      status: 'Approved — Payment Required',
    });
    const paidAndUnlockedStudents = await TrainingApplication.countDocuments({
      status: 'Training Unlocked',
    });

    const successfulPayments = await Payment.find({ status: 'successful' });
    const totalRevenue = successfulPayments.reduce((sum, p) => sum + p.amount, 0);

    const galleryCount = await GalleryItem.countDocuments();
    const publicVideosCount = await PublicVideo.countDocuments();

    // Recent 5 applications
    const recentApplications = await TrainingApplication.find()
      .populate('user', 'name email phone')
      .sort({ createdAt: -1 })
      .limit(6);

    // Recent 5 payments
    const recentPayments = await Payment.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .limit(6);

    res.json({
      success: true,
      metrics: {
        totalUsers,
        totalApplications,
        pendingApplications,
        approvedAwaitingPayment,
        paidAndUnlockedStudents,
        successfulPaymentsCount: successfulPayments.length,
        totalRevenue,
        galleryCount,
        publicVideosCount,
      },
      recentApplications,
      recentPayments,
    });
  } catch (error) {
    console.error('Admin overview error:', error);
    res.status(500).json({ message: 'Error retrieving dashboard overview' });
  }
};

// @desc    Get all users with filter & search
// @route   GET /api/admin/users
export const getAllUsers = async (req, res) => {
  try {
    const { search, role, status } = req.query;
    let query = {};

    if (role && role !== 'All') query.role = role;
    if (status && status !== 'All') query.status = status;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
      ];
    }

    const users = await User.find(query).select('-password').sort({ createdAt: -1 });

    res.json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users' });
  }
};

// @desc    Toggle user status (Active / Suspended)
// @route   PUT /api/admin/users/:id/status
export const toggleUserStatus = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.role === 'admin' && user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: 'You cannot suspend your own admin account.' });
    }

    user.status = user.status === 'active' ? 'suspended' : 'active';
    await user.save();

    await AdminAuditLog.create({
      admin: req.user._id,
      action: `Changed user ${user.name} status to "${user.status}"`,
      targetType: 'User',
      targetId: user._id.toString(),
      ipAddress: req.ip || '',
    });

    res.json({
      success: true,
      message: `User account is now ${user.status}`,
      user,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating user status' });
  }
};

// @desc    Get admin audit logs
// @route   GET /api/admin/audit-logs
export const getAuditLogs = async (req, res) => {
  try {
    const logs = await AdminAuditLog.find()
      .populate('admin', 'name email')
      .sort({ createdAt: -1 })
      .limit(100);

    res.json({
      success: true,
      count: logs.length,
      logs,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving audit logs' });
  }
};
