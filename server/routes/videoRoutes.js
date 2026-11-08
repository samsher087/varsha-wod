import express from 'express';
import {
  getPublicVideos,
  createPublicVideo,
  updatePublicVideo,
  deletePublicVideo,
  likePublicVideo,
} from '../controllers/videoController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getPublicVideos);
router.post('/:id/like', likePublicVideo);
router.post('/admin', protect, adminOnly, createPublicVideo);
router.put('/admin/:id', protect, adminOnly, updatePublicVideo);
router.delete('/admin/:id', protect, adminOnly, deletePublicVideo);

export default router;

