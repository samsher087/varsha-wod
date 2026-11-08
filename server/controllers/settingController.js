import Setting from '../models/Setting.js';
import AdminAuditLog from '../models/AdminAuditLog.js';

// @desc    Get website public settings
// @route   GET /api/settings
export const getSettings = async (req, res) => {
  try {
    let setting = await Setting.findOne();
    if (!setting) {
      setting = await Setting.create({});
    }

    // Exclude secret keys from public response
    const publicSettings = {
      brandName: setting.brandName,
      tagline: setting.tagline,
      heroHeadline: setting.heroHeadline,
      heroSubheadline: setting.heroSubheadline,
      riderTitle: setting.riderTitle,
      heroVideoUrl: setting.heroVideoUrl,
      heroImageUrl: setting.heroImageUrl,
      aboutBio: setting.aboutBio,
      statsYearsExperience: setting.statsYearsExperience,
      statsArenaShows: setting.statsArenaShows,
      statsWallIncline: setting.statsWallIncline,
      statsSafetyRecord: setting.statsSafetyRecord,
      trainingFee: setting.trainingFee,
      contactEmail: setting.contactEmail,
      contactPhone: setting.contactPhone,
      contactWhatsApp: setting.contactWhatsApp,
      headquartersAddress: setting.headquartersAddress,
      socialLinks: setting.socialLinks,
      razorpayKeyId: setting.razorpayKeyId, // Public key is safe for frontend checkout
      isRazorpayLive: setting.isRazorpayLive,
      testimonials: setting.testimonials,
    };

    res.json({
      success: true,
      settings: publicSettings,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving site settings' });
  }
};

// @desc    Get complete settings including credentials (Admin)
// @route   GET /api/settings/admin
export const getAdminSettings = async (req, res) => {
  try {
    let setting = await Setting.findOne();
    if (!setting) {
      setting = await Setting.create({});
    }
    res.json({ success: true, settings: setting });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching settings' });
  }
};

// @desc    Update website settings (Admin)
// @route   PUT /api/settings/admin
export const updateSettings = async (req, res) => {
  try {
    let setting = await Setting.findOne();
    if (!setting) {
      setting = new Setting();
    }

    const updatableFields = [
      'brandName',
      'tagline',
      'heroHeadline',
      'heroSubheadline',
      'riderTitle',
      'heroVideoUrl',
      'heroImageUrl',
      'aboutBio',
      'statsYearsExperience',
      'statsArenaShows',
      'statsWallIncline',
      'statsSafetyRecord',
      'trainingFee',
      'contactEmail',
      'contactPhone',
      'contactWhatsApp',
      'headquartersAddress',
      'socialLinks',
      'razorpayKeyId',
      'razorpayKeySecret',
      'isRazorpayLive',
      'testimonials',
    ];

    updatableFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        setting[field] = req.body[field];
      }
    });

    await setting.save();

    await AdminAuditLog.create({
      admin: req.user._id,
      action: 'Updated website settings and branding configuration',
      targetType: 'Setting',
      targetId: setting._id.toString(),
      ipAddress: req.ip || '',
    });

    res.json({
      success: true,
      message: 'Website configuration and branding updated successfully',
      settings: setting,
    });
  } catch (error) {
    console.error('Update settings error:', error);
    res.status(500).json({ message: 'Failed to update website configuration' });
  }
};
