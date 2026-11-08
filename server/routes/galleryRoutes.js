import express from 'express';
import {
  getGalleryItems,
  createGalleryItem,
  updateGalleryItem,
  deleteGalleryItem,
} from '../controllers/galleryController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getGalleryItems);
router.post('/admin', protect, adminOnly, createGalleryItem);
router.put('/admin/:id', protect, adminOnly, updateGalleryItem);
router.delete('/admin/:id', protect, adminOnly, deleteGalleryItem);

export default router;
