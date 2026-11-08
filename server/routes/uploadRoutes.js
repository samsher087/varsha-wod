import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import os from 'os';
import { fileURLToPath } from 'url';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// In serverless environments (Vercel/AWS Lambda), only /tmp is writable
const uploadsDir = path.join(os.tmpdir(), 'wod_uploads');
try {
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }
} catch (err) {
  // Ignore in read-only environments
}

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, uploadsDir);
  },
  filename(req, file, cb) {
    const ext = path.extname(file.originalname).toLowerCase();
    const cleanBase = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9_-]/g, '_');
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${cleanBase || 'photo'}-${uniqueSuffix}${ext}`);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /\.(jpeg|jpg|png|webp|gif|svg|avif)$/i;
  const isExtensionValid = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const isMimeValid = file.mimetype.startsWith('image/');

  if (isExtensionValid || isMimeValid) {
    return cb(null, true);
  }
  return cb(new Error('Only image files (JPEG, PNG, WebP, GIF, SVG, AVIF) are supported.'));
};

const upload = multer({
  storage,
  limits: { fileSize: 25 * 1024 * 1024 }, // 25MB max
  fileFilter,
});

const router = express.Router();

// @desc   Upload image file (Admin)
// @route  POST /api/upload
router.post('/', protect, adminOnly, (req, res) => {
  upload.single('image')(req, res, (err) => {
    if (err) {
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).json({ message: 'File is too large. Maximum size is 25MB.' });
        }
        return res.status(400).json({ message: `Upload error: ${err.message}` });
      }
      return res.status(400).json({ message: err.message || 'File upload failed' });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'No image file was uploaded' });
    }

    const fileUrl = `/uploads/${req.file.filename}`;

    return res.status(201).json({
      success: true,
      message: 'Image uploaded successfully',
      url: fileUrl,
      filename: req.file.filename,
      size: req.file.size,
    });
  });
});

export default router;
