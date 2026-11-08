import express from 'express';
import {
  getAdminOverview,
  getAllUsers,
  toggleUserStatus,
  getAuditLogs,
} from '../controllers/adminController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/overview', protect, adminOnly, getAdminOverview);
router.get('/users', protect, adminOnly, getAllUsers);
router.put('/users/:id/status', protect, adminOnly, toggleUserStatus);
router.get('/audit-logs', protect, adminOnly, getAuditLogs);

export default router;
