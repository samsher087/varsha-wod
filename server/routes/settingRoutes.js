import express from 'express';
import {
  getSettings,
  getAdminSettings,
  updateSettings,
} from '../controllers/settingController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getSettings);
router.get('/admin', protect, adminOnly, getAdminSettings);
router.put('/admin', protect, adminOnly, updateSettings);

export default router;
