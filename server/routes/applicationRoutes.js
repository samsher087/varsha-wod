import express from 'express';
import {
  submitApplication,
  getMyApplication,
  getAllApplications,
  updateApplicationStatus,
  submitPaymentRef,
  toggleTestSubscription,
} from '../controllers/applicationController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/apply', protect, submitApplication);
router.get('/my-application', protect, getMyApplication);
router.post('/submit-payment-ref', protect, submitPaymentRef);
router.post('/toggle-test-subscription', protect, toggleTestSubscription);
router.get('/admin/all', protect, adminOnly, getAllApplications);
router.put('/admin/:id/status', protect, adminOnly, updateApplicationStatus);

export default router;
