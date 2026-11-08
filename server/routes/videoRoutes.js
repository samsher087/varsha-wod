import express from 'express';
import {
  getPublicVideos,
  createPublicVideo,
  deletePublicVideo,
  likePublicVideo,
} from '../controllers/videoController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getPublicVideos);
router.post('/:id/like', likePublicVideo);
router.post('/admin', protect, adminOnly, createPublicVideo);
router.delete('/admin/:id', protect, adminOnly, deletePublicVideo);

export default router;

