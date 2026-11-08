import PublicVideo from '../models/PublicVideo.js';
import AdminAuditLog from '../models/AdminAuditLog.js';

// @desc    Get all public videos
// @route   GET /api/videos
export const getPublicVideos = async (req, res) => {
  try {
    const { category } = req.query;
    let query = {};
    if (category && category !== 'All') {
      query.category = category;
    }

    const videos = await PublicVideo.find(query).sort({ order: 1, createdAt: -1 });

    res.json({
      success: true,
      count: videos.length,
      videos,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving public videos' });
  }
};

// @desc    Add public video (Admin)
// @route   POST /api/videos/admin
export const createPublicVideo = async (req, res) => {
  try {
    const {
      title,
      category,
      videoUrl,
      thumbnailUrl,
      duration,
      description,
      featured,
      instagramUrl,
      audioTrack,
      authorHandle,
      isReel,
    } = req.body;

    if (!title || !videoUrl) {
      return res.status(400).json({ message: 'Title and video URL are required' });
    }

    const video = await PublicVideo.create({
      title,
      category: category || 'Stunt Highlights',
      videoUrl,
      thumbnailUrl: thumbnailUrl || 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=800&q=80',
      duration: duration || '0:45',
      description: description || '',
      instagramUrl: instagramUrl || 'https://instagram.com/najurider',
      audioTrack: audioTrack || 'Original Audio - Varsha Rider',
      authorHandle: authorHandle || '@najurider',
      isReel: isReel !== undefined ? !!isReel : true,
      featured: !!featured,
    });

    await AdminAuditLog.create({
      admin: req.user._id,
      action: `Published reel "${title}"`,
      targetType: 'PublicVideo',
      targetId: video._id.toString(),
      ipAddress: req.ip || '',
    });

    res.status(201).json({
      success: true,
      message: 'Video published successfully',
      video,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create video record' });
  }
};

// @desc    Like a public video / reel
// @route   POST /api/videos/:id/like
export const likePublicVideo = async (req, res) => {
  try {
    const video = await PublicVideo.findByIdAndUpdate(
      req.params.id,
      { $inc: { likes: 1 } },
      { new: true }
    );
    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }

    res.json({
      success: true,
      likes: video.likes,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to like video' });
  }
};

// @desc    Delete public video (Admin)
// @route   DELETE /api/videos/admin/:id
export const deletePublicVideo = async (req, res) => {
  try {
    const video = await PublicVideo.findByIdAndDelete(req.params.id);
    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }

    res.json({
      success: true,
      message: 'Video deleted',
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete video' });
  }
};
