import Course from '../models/Course.js';
import TrainingApplication from '../models/TrainingApplication.js';
import LessonProgress from '../models/LessonProgress.js';
import AdminAuditLog from '../models/AdminAuditLog.js';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';

// @desc    Get course overview (preview video unlocked for all; locked lessons unlocked only for subscribed students)
// @route   GET /api/courses/public-overview
export const getPublicCourseOverview = async (req, res) => {
  try {
    const course = await Course.findOne({ isPublished: true });
    if (!course) {
      return res.status(404).json({ message: 'No active course published currently' });
    }

    // Check optional authentication token to see if user is a paid/unlocked subscriber or admin
    let isSubscribedUser = false;
    let currentUser = null;
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      try {
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'well_of_death_secret_key_2026');
        if (decoded?.id) {
          currentUser = await User.findById(decoded.id).select('role status name email');
          if (currentUser?.role === 'admin') {
            isSubscribedUser = true;
          } else {
            const app = await TrainingApplication.findOne({
              user: decoded.id,
              status: 'Training Unlocked',
            });
            if (app) {
              isSubscribedUser = true;
            }
          }
        }
      } catch (authErr) {
        // Token expired/invalid, treat as non-subscriber visitor
      }
    }

    const sanitizedModules = course.modules.map((mod) => ({
      _id: mod._id,
      title: mod.title,
      description: mod.description,
      order: mod.order,
      lessonCount: mod.lessons.length,
      lessons: mod.lessons.map((les) => {
        const isUnlocked = les.isPreview || isSubscribedUser;
        return {
          _id: les._id,
          title: les.title,
          duration: les.duration,
          description: les.description,
          safetyNotice: les.safetyNotice,
          isPreview: les.isPreview,
          isLocked: !isUnlocked,
          // Only provide videoUrl if it's a preview or user is subscribed
          videoUrl: isUnlocked ? les.videoUrl : null,
        };
      }),
    }));

    res.json({
      success: true,
      isSubscribedUser,
      course: {
        _id: course._id,
        title: course.title,
        subtitle: course.subtitle,
        description: course.description,
        thumbnail: course.thumbnail,
        difficulty: course.difficulty,
        estimatedDuration: course.estimatedDuration,
        price: course.price,
        learningOutcomes: course.learningOutcomes,
        prerequisites: course.prerequisites,
        modules: sanitizedModules,
      },
    });
  } catch (error) {
    console.error('getPublicCourseOverview error:', error);
    res.status(500).json({ message: 'Error retrieving course information' });
  }
};

// @desc    Get full unlocked training curriculum for enrolled student
// @route   GET /api/courses/student-curriculum
export const getStudentCurriculum = async (req, res) => {
  try {
    // 1. Verify that user has an approved and paid application
    const application = await TrainingApplication.findOne({ user: req.user._id });

    if (!application || application.status !== 'Training Unlocked') {
      return res.status(403).json({
        success: false,
        isLocked: true,
        status: application?.status || 'No Application',
        message:
          'Access Denied: Well of Death training portal is protected. You must have an Admin-Approved application and a Verified Payment to unlock lessons.',
      });
    }

    const course = await Course.findOne({ isPublished: true });
    if (!course) {
      return res.status(404).json({ message: 'Course curriculum not found' });
    }

    // Fetch user's completed lessons
    const userProgress = await LessonProgress.find({
      user: req.user._id,
      courseId: course._id,
    });

    const progressMap = {};
    userProgress.forEach((p) => {
      progressMap[p.lessonId] = {
        isCompleted: p.isCompleted,
        lastPositionSeconds: p.lastPositionSeconds,
        completedAt: p.completedAt,
      };
    });

    let totalLessonsCount = 0;
    let completedLessonsCount = 0;

    // Attach signed stream token endpoints for each lesson
    const enrichedModules = course.modules.map((mod) => {
      const lessons = mod.lessons.map((les) => {
        totalLessonsCount++;
        const prog = progressMap[les._id.toString()] || {
          isCompleted: false,
          lastPositionSeconds: 0,
        };
        if (prog.isCompleted) completedLessonsCount++;

        // Generate short-lived playback token (valid 2 hours)
        const playbackToken = jwt.sign(
          {
            userId: req.user._id.toString(),
            lessonId: les._id.toString(),
            courseId: course._id.toString(),
          },
          process.env.JWT_SECRET || 'well_of_death_secret_key_2026',
          { expiresIn: '2h' }
        );

        return {
          _id: les._id,
          title: les.title,
          description: les.description,
          duration: les.duration,
          order: les.order,
          safetyNotice: les.safetyNotice,
          resources: les.resources,
          isCompleted: prog.isCompleted,
          lastPositionSeconds: prog.lastPositionSeconds,
          streamUrl: `/api/courses/stream/${les._id}?token=${playbackToken}`,
          isUnlocked: true,
        };
      });

      return {
        _id: mod._id,
        title: mod.title,
        description: mod.description,
        order: mod.order,
        lessons,
      };
    });

    const completionPercentage =
      totalLessonsCount > 0
        ? Math.round((completedLessonsCount / totalLessonsCount) * 100)
        : 0;

    res.json({
      success: true,
      isLocked: false,
      course: {
        _id: course._id,
        title: course.title,
        subtitle: course.subtitle,
        description: course.description,
        thumbnail: course.thumbnail,
        difficulty: course.difficulty,
        modules: enrichedModules,
        stats: {
          totalLessons: totalLessonsCount,
          completedLessons: completedLessonsCount,
          completionPercentage,
        },
      },
    });
  } catch (error) {
    console.error('Curriculum access error:', error);
    res.status(500).json({ message: 'Error retrieving curriculum access' });
  }
};

// @desc    Secure access-controlled video streaming endpoint
// @route   GET /api/courses/stream/:lessonId
export const streamLessonVideo = async (req, res) => {
  try {
    const { lessonId } = req.params;
    const { token } = req.query;

    if (!token) {
      return res.status(401).json({ message: 'Valid playback token required' });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET || 'well_of_death_secret_key_2026');
    } catch (err) {
      return res.status(403).json({ message: 'Playback ticket expired or invalid. Please refresh the portal.' });
    }

    if (decoded.lessonId !== lessonId) {
      return res.status(403).json({ message: 'Token does not match requested lesson ID' });
    }

    // Verify student payment & approval status in DB
    const application = await TrainingApplication.findOne({
      user: decoded.userId,
      status: 'Training Unlocked',
    });

    if (!application) {
      return res.status(403).json({ message: 'Active training subscription required to view lesson' });
    }

    // Retrieve course lesson
    const course = await Course.findOne({ 'modules.lessons._id': lessonId });
    if (!course) {
      return res.status(404).json({ message: 'Lesson not found' });
    }

    let targetLesson = null;
    for (const mod of course.modules) {
      const found = mod.lessons.id(lessonId);
      if (found) {
        targetLesson = found;
        break;
      }
    }

    if (!targetLesson || !targetLesson.videoUrl) {
      return res.status(404).json({ message: 'Video source not configured for this lesson' });
    }

    // Secure redirection or streaming
    return res.redirect(targetLesson.videoUrl);
  } catch (error) {
    console.error('Stream error:', error);
    res.status(500).json({ message: 'Error streaming video content' });
  }
};

// @desc    Update student lesson completion & position
// @route   POST /api/courses/progress
export const updateLessonProgress = async (req, res) => {
  try {
    const { lessonId, moduleId, courseId, isCompleted, lastPositionSeconds } = req.body;

    let progress = await LessonProgress.findOne({
      user: req.user._id,
      lessonId,
    });

    if (!progress) {
      progress = new LessonProgress({
        user: req.user._id,
        lessonId,
        moduleId,
        courseId,
      });
    }

    if (isCompleted !== undefined) {
      progress.isCompleted = isCompleted;
      if (isCompleted) progress.completedAt = new Date();
    }

    if (lastPositionSeconds !== undefined) {
      progress.lastPositionSeconds = lastPositionSeconds;
    }

    await progress.save();

    res.json({
      success: true,
      message: 'Lesson progress updated successfully',
      progress,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error saving progress' });
  }
};

// @desc    Get Course for Admin editing
// @route   GET /api/courses/admin/details
export const getAdminCourseDetails = async (req, res) => {
  try {
    const course = await Course.findOne();
    res.json({ success: true, course });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching course' });
  }
};

// @desc    Update Course / Modules / Lessons (Admin)
// @route   PUT /api/courses/admin/update
export const updateCourseDetails = async (req, res) => {
  try {
    const { title, subtitle, description, difficulty, price, modules, isPublished } = req.body;
    let course = await Course.findOne();

    if (!course) {
      course = new Course({
        title: title || 'Professional Well of Death Mastery',
        slug: 'well-of-death-mastery',
        description: description || 'Complete stunt riding curriculum',
      });
    }

    if (title) course.title = title;
    if (subtitle) course.subtitle = subtitle;
    if (description) course.description = description;
    if (difficulty) course.difficulty = difficulty;
    if (price !== undefined) course.price = Number(price);
    if (isPublished !== undefined) course.isPublished = isPublished;
    if (modules && Array.isArray(modules)) course.modules = modules;

    await course.save();

    // Log admin audit
    await AdminAuditLog.create({
      admin: req.user._id,
      action: `Updated course curriculum "${course.title}"`,
      targetType: 'Course',
      targetId: course._id.toString(),
      details: `Published: ${course.isPublished} | Modules: ${course.modules.length}`,
      ipAddress: req.ip || '',
    });

    res.json({
      success: true,
      message: 'Course curriculum saved successfully',
      course,
    });
  } catch (error) {
    console.error('Update course error:', error);
    res.status(500).json({ message: 'Error updating course' });
  }
};

// @desc    Revoke student access (Admin)
// @route   POST /api/courses/admin/revoke-access
export const revokeStudentAccess = async (req, res) => {
  try {
    const { userId, reason } = req.body;
    const application = await TrainingApplication.findOne({ user: userId });

    if (!application) {
      return res.status(404).json({ message: 'No application found for this user' });
    }

    application.status = 'Approved — Payment Required'; // or Suspended
    application.adminNotes = `Access revoked on ${new Date().toLocaleDateString()}: ${reason || 'Admin safety action'}`;
    await application.save();

    await AdminAuditLog.create({
      admin: req.user._id,
      action: `Revoked training access for applicant ${application.fullName}`,
      targetType: 'TrainingApplication',
      targetId: application._id.toString(),
      details: `Reason: ${reason || 'Unspecified'}`,
      ipAddress: req.ip || '',
    });

    res.json({
      success: true,
      message: `Training access successfully revoked for ${application.fullName}`,
      application,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to revoke student access' });
  }
};
