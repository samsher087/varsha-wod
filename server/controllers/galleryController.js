import GalleryItem from '../models/GalleryItem.js';
import AdminAuditLog from '../models/AdminAuditLog.js';

// @desc    Get all gallery items with category filter & search
// @route   GET /api/gallery
export const getGalleryItems = async (req, res) => {
  try {
    const { category, search } = req.query;
    let query = {};

    if (category && category !== 'All') {
      query.category = category;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { caption: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } },
      ];
    }

    const items = await GalleryItem.find(query).sort({ order: 1, createdAt: -1 });

    res.json({
      success: true,
      count: items.length,
      items,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving gallery items' });
  }
};

// @desc    Create new gallery photo (Admin)
// @route   POST /api/gallery/admin
export const createGalleryItem = async (req, res) => {
  try {
    const { title, category, imageUrl, caption, location, dateTaken, featured } = req.body;

    if (!title || !category || !imageUrl) {
      return res.status(400).json({ message: 'Title, category, and image URL are required' });
    }

    const item = await GalleryItem.create({
      title,
      category,
      imageUrl,
      caption: caption || '',
      location: location || '',
      dateTaken: dateTaken || '',
      featured: !!featured,
    });

    await AdminAuditLog.create({
      admin: req.user._id,
      action: `Added gallery item "${title}" to category "${category}"`,
      targetType: 'GalleryItem',
      targetId: item._id.toString(),
      ipAddress: req.ip || '',
    });

    res.status(201).json({
      success: true,
      message: 'Photo added to gallery',
      item,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create gallery item' });
  }
};

// @desc    Update gallery photo (Admin)
// @route   PUT /api/gallery/admin/:id
export const updateGalleryItem = async (req, res) => {
  try {
    const item = await GalleryItem.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!item) {
      return res.status(404).json({ message: 'Gallery item not found' });
    }

    res.json({
      success: true,
      message: 'Gallery item updated',
      item,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update gallery item' });
  }
};

// @desc    Delete gallery photo (Admin)
// @route   DELETE /api/gallery/admin/:id
export const deleteGalleryItem = async (req, res) => {
  try {
    const item = await GalleryItem.findByIdAndDelete(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Gallery item not found' });
    }

    await AdminAuditLog.create({
      admin: req.user._id,
      action: `Deleted gallery item "${item.title}"`,
      targetType: 'GalleryItem',
      targetId: req.params.id,
      ipAddress: req.ip || '',
    });

    res.json({
      success: true,
      message: 'Photo removed from gallery',
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete gallery item' });
  }
};
