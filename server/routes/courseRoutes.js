import express from 'express';
import {
  getPublicCourseOverview,
  getStudentCurriculum,
  streamLessonVideo,
  updateLessonProgress,
  getAdminCourseDetails,
  updateCourseDetails,
  revokeStudentAccess,
} from '../controllers/courseController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/public-overview', getPublicCourseOverview);
router.get('/student-curriculum', protect, getStudentCurriculum);
router.get('/stream/:lessonId', streamLessonVideo);
router.post('/progress', protect, updateLessonProgress);

// Admin course management
router.get('/admin/details', protect, adminOnly, getAdminCourseDetails);
router.put('/admin/update', protect, adminOnly, updateCourseDetails);
router.post('/admin/revoke-access', protect, adminOnly, revokeStudentAccess);

export default router;
