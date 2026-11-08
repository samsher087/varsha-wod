import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import TrainingApplication from '../models/TrainingApplication.js';
import Setting from '../models/Setting.js';

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET || 'well_of_death_secret_key_2026',
    { expiresIn: '30d' }
  );
};

// Helper: Ensure training application exists for a trainee in MongoDB Atlas
const ensureUserApplication = async (user) => {
  try {
    if (user.role === 'admin') return null;

    let app = await TrainingApplication.findOne({
      $or: [{ user: user._id }, { email: user.email.toLowerCase() }],
    });

    if (!app) {
      const setting = await Setting.findOne().catch(() => null);
      const trainingFee = setting?.trainingFee || 4999;

      let status = 'Application Submitted';
      let paymentRefNo = '';
      let paymentAmount = 4999;

      if (user.email === 'sushil@gmail.com') {
        status = 'Payment Submitted — Pending Admin Approval';
        paymentRefNo = '987123654120';
      } else if (user.email === 'arman@gmail.com') {
        status = 'Payment Submitted — Pending Admin Approval';
        paymentRefNo = '321654987321';
      }

      app = await TrainingApplication.create({
        user: user._id,
        fullName: user.name,
        email: user.email.toLowerCase(),
        phone: user.phone || '',
        age: 22,
        city: user.city || 'India',
        state: 'India',
        experienceLevel: 'Intermediate',
        reason: 'Passionate about Well of Death stunt riding under Master Varsha.',
        emergencyContactName: 'Family Contact',
        emergencyContactPhone: user.phone || '',
        status,
        trainingFee,
        paymentRefNo,
        paymentAmount,
        agreedToSafetyWaiver: true,
        appliedAt: new Date(),
      });
      console.log('[Atlas Sync] TrainingApplication auto-created for:', user.email);
    }
    return app;
  } catch (err) {
    console.warn('[Ensure App Warn]:', err.message);
    return null;
  }
};

// @desc    Register a new user
// @route   POST /api/auth/register
export const register = async (req, res) => {
  try {
    const { name, email, phone, password, city } = req.body;

    if (!name || !email || !phone || !password) {
      return res.status(400).json({ message: 'All required fields must be provided' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    const cleanEmail = email.toLowerCase().trim();
    let user = await User.findOne({ email: cleanEmail }).select('+password');

    if (user) {
      // If user already exists in Atlas, update profile and password so they can log in seamlessly
      user.name = name.trim();
      user.phone = phone.trim();
      user.password = password;
      if (city) user.city = city.trim();
      await user.save();
    } else {
      user = await User.create({
        name: name.trim(),
        email: cleanEmail,
        phone: phone.trim(),
        password,
        city: (city || '').trim(),
      });
      console.log('[Atlas Sync] New trainee registered in MongoDB Atlas:', cleanEmail);
    }

    // Auto-create/sync candidate application in MongoDB Atlas
    await ensureUserApplication(user);

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      token: generateToken(user._id),
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        city: user.city,
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: error.message || 'Server error during registration' });
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    const cleanEmail = email.toLowerCase().trim();

    // Map admin alias
    const lookupEmail = (cleanEmail === 'admin@najurider.com' || cleanEmail === 'admin@varsharider.com') ? 'admin@samsher-wod.com' : cleanEmail;

    let user = await User.findOne({ email: lookupEmail }).select('+password');

    // Auto-provision trainee if not yet found in MongoDB Atlas
    if (!user && cleanEmail.includes('@') && !cleanEmail.includes('admin')) {
      const namePart = cleanEmail.split('@')[0];
      const displayName = namePart.charAt(0).toUpperCase() + namePart.slice(1);
      user = await User.create({
        name: displayName,
        email: cleanEmail,
        phone: '+91 98765 43210',
        password: password || 'Password@123',
        city: 'India',
        role: 'user',
        status: 'active',
      });
      console.log('[Atlas Sync] Trainee auto-provisioned in MongoDB Atlas:', cleanEmail);
      await ensureUserApplication(user);
    }

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password credentials' });
    }

    if (user.status === 'suspended') {
      return res.status(403).json({ message: 'Your account has been suspended by administration' });
    }

    // Ensure application exists
    await ensureUserApplication(user);

    res.json({
      success: true,
      message: 'Login successful',
      token: generateToken(user._id),
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        city: user.city,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during authentication' });
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching profile' });
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
export const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.name = req.body.name || user.name;
    user.phone = req.body.phone || user.phone;
    user.city = req.body.city || user.city;
    if (req.body.emergencyContact) {
      user.emergencyContact = req.body.emergencyContact;
    }

    if (req.body.password && req.body.password.trim() !== '') {
      if (req.body.password.length < 6) {
        return res.status(400).json({ message: 'Password must be at least 6 characters' });
      }
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        role: updatedUser.role,
        city: updatedUser.city,
        emergencyContact: updatedUser.emergencyContact,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Error updating profile' });
  }
};

// @desc    Forgot password mock / reset token
// @route   POST /api/auth/forgot-password
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email: email?.toLowerCase() });

    if (!user) {
      return res.status(404).json({ message: 'No registered user with this email address' });
    }

    // Generate reset token
    const resetToken = Math.random().toString(36).substring(2, 10).toUpperCase();
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes
    await user.save();

    res.json({
      success: true,
      message: `Password reset verification token generated: ${resetToken}. (In production this is emailed securely)`,
      resetToken,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error processing password reset request' });
  }
};

// @desc    Reset password
// @route   POST /api/auth/reset-password
export const resetPassword = async (req, res) => {
  try {
    const { email, resetToken, newPassword } = req.body;

    const user = await User.findOne({
      email: email?.toLowerCase(),
      resetPasswordToken: resetToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired reset token' });
    }

    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res.json({
      success: true,
      message: 'Password reset successful! You can now log in with your new password.',
    });
  } catch (error) {
    res.status(500).json({ message: 'Error resetting password' });
  }
};
