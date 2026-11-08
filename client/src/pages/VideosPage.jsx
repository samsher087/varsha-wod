import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { apiClient } from '../api/client';
import { VideoModal } from '../components/VideoModal';
import { ReelCard } from '../components/ReelCard';
import { InstagramIcon, InstagramReelIcon } from '../components/SocialIcons';
import { useSettings } from '../context/SettingsContext';
import { useAuth } from '../context/AuthContext';
import {
  Play,
  Flame,
  Shield,
  Lock,
  ArrowRight,
  Eye,
  Clock,
  Loader2,
  GraduationCap,
  Sparkles,
  Edit,
  X,
  CheckCircle2,
} from 'lucide-react';

export const VideosPage = () => {
  const { settings } = useSettings();
  const { isAdmin } = useAuth();
  const [videos, setVideos] = useState([]);
  const [filteredVideos, setFilteredVideos] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const [activeVideo, setActiveVideo] = useState(null);

  // Admin Video URL Editing
  const [editingVideo, setEditingVideo] = useState(null);
  const [editForm, setEditForm] = useState({
    title: '',
    category: '',
    videoUrl: '',
    youtubeUrl: '',
    thumbnailUrl: '',
    duration: '',
    description: '',
  });
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateMsg, setUpdateMsg] = useState('');

  const categories = [
    'All',
    'Stunt Highlights',
    'Live Performances',
    'Tandem Stunts',
    'Extreme Stunts',
    'Behind the Scenes',
  ];

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get('/videos');
      if (res?.videos) {
        setVideos(res.videos);
        setFilteredVideos(res.videos);
      }
    } catch (err) {
      console.warn('Failed to fetch videos:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (cat) => {
    setActiveCategory(cat);
    if (cat === 'All') {
      setFilteredVideos(videos);
    } else {
      setFilteredVideos(videos.filter((v) => v.category === cat));
    }
  };

  const handleStartEdit = (vid) => {
    setEditingVideo(vid);
    setEditForm({
      title: vid.title || '',
      category: vid.category || 'Stunt Highlights',
      videoUrl: vid.videoUrl || '',
      youtubeUrl: vid.youtubeUrl || '',
      thumbnailUrl: vid.thumbnailUrl || '',
      duration: vid.duration || '0:45',
      description: vid.description || '',
    });
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!editingVideo) return;
    try {
      setIsUpdating(true);
      const res = await apiClient.put(`/videos/admin/${editingVideo._id}`, editForm);
      const updated = res.video || { ...editingVideo, ...editForm };
      setVideos((prev) => prev.map((v) => (v._id === editingVideo._id ? updated : v)));
      setFilteredVideos((prev) => prev.map((v) => (v._id === editingVideo._id ? updated : v)));
      setUpdateMsg('Stunt Video URL updated successfully!');
      setTimeout(() => setUpdateMsg(''), 4000);
      setEditingVideo(null);
    } catch (err) {
      alert(err.message || 'Failed to update Stunt Video URL');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="bg-transparent min-h-screen pt-36 pb-24 text-rose-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
          <div className="max-w-3xl">

            <h1 className="text-4xl sm:text-6xl font-black text-white uppercase tracking-tight">
              Stunt Reels & <span className="text-gradient-fire">Videos</span>
            </h1>

          </div>
          <a
            href={settings.socialLinks?.instagram || 'https://www.instagram.com/naju_rider_18/'}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-pill-outline gap-2 text-xs text-pink-100 hover:text-white"
          >
            <InstagramIcon className="w-4 h-4 text-pink-300" />
            <span> naju_rider_18
            </span>
          </a>
        </div>

        {/* Separation Notice between Public Reels & Paid Training */}
        <div className="mb-10 p-5 rounded-3xl bg-white/[0.08] backdrop-blur-2xl border border-white/20 hover:border-pink-300/40 card-top-line flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-colors shadow-xl shadow-pink-950/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-pink-500/20 text-pink-300 border border-pink-400/35 flex items-center justify-center shrink-0">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                Public Reels & Showcases
                <span className="text-[10px] px-3 py-0.5 rounded-full bg-white/20 text-white border border-white/30 font-semibold">
                  Free Access
                </span>
              </h4>
              <p className="text-xs text-pink-100/80 mt-0.5">
                Full structured curriculum videos (physics theory, mechanical carburetor tuning, supervised arena riding) require academy application and approval.
              </p>
            </div>
          </div>
          <Link
            to="/training"
            className="px-6 py-2.5 rounded-full bg-gradient-to-r from-pink-500 via-rose-500 to-fuchsia-500 hover:from-pink-400 hover:to-fuchsia-400 text-white font-bold text-xs uppercase tracking-wider whitespace-nowrap shadow-md shadow-pink-600/30 flex items-center gap-1.5 shrink-0"
          >
            <GraduationCap className="w-4 h-4" />
            <span>Apply for Academy</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all ${
                activeCategory === cat
                  ? 'bg-gradient-to-r from-[#dfb76c] via-[#c69247] to-[#b37f32] text-black shadow-lg shadow-[#c89849]/25 font-extrabold'
                  : 'bg-[#121620] text-slate-400 hover:text-white hover:bg-[#1a202e] border border-[#202738]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Video Grid */}
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-3 text-slate-500">
            <Loader2 className="w-8 h-8 animate-spin text-amber-400" />
            <p className="text-xs uppercase tracking-wider">Loading stunt reels...</p>
          </div>
        ) : filteredVideos.length === 0 ? (
          <div className="py-20 text-center rounded-2xl bg-[#121620] border border-[#202738] p-8">
            <Play className="w-10 h-10 text-slate-600 mx-auto mb-3" />
            <h3 className="text-base font-bold text-white">No Reels in this Category</h3>
            <p className="text-xs text-slate-400 mt-1">Select another filter or check back soon as new reels are published.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredVideos.map((vid, idx) => (
              <ReelCard
                key={vid._id || idx}
                video={vid}
                index={idx}
                onWatch={(v) => setActiveVideo(v)}
                onEdit={handleStartEdit}
              />
            ))}
          </div>
        )}
      </div>

      {/* Admin Success Toast */}
      {updateMsg && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-2xl bg-emerald-500 text-white font-bold text-xs shadow-2xl shadow-emerald-950/60 animate-in fade-in slide-in-from-bottom duration-300">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{updateMsg}</span>
        </div>
      )}

      {/* Admin Quick Edit Stunt Video URL Modal */}
      {editingVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg rounded-3xl bg-[#121620] border border-[#202738] p-6 sm:p-8 card-top-line shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center">
                  <Edit className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Change Stunt Video URL</h3>
                  <p className="text-xs text-slate-400">Admin quick edit for video stream and playback link</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setEditingVideo(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-amber-400 block mb-1.5 uppercase tracking-wider">
                  Stunt Video URL (Direct MP4 / WebM / Stream Source) *
                </label>
                <input
                  type="text"
                  required
                  value={editForm.videoUrl}
                  onChange={(e) => setEditForm({ ...editForm, videoUrl: e.target.value })}
                  placeholder="e.g. /videos/stunt_wod_solo_wall.mp4 or https://..."
                  className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-amber-500/50 text-white font-mono text-xs focus:outline-none focus:border-amber-400 shadow-inner"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  Local sample: <code>/videos/stunt_wod_solo_wall.mp4</code> or <code>/videos/stunt_wod_four_bikes.mp4</code>
                </p>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">
                  YouTube / External Reel Link (Optional)
                </label>
                <input
                  type="text"
                  value={editForm.youtubeUrl}
                  onChange={(e) => setEditForm({ ...editForm, youtubeUrl: e.target.value })}
                  placeholder="https://www.youtube.com/shorts/..."
                  className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-slate-700 text-white text-xs focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Video Title *</label>
                  <input
                    type="text"
                    required
                    value={editForm.title}
                    onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-slate-700 text-white text-xs focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Category</label>
                  <select
                    value={editForm.category}
                    onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-slate-700 text-white text-xs focus:outline-none focus:border-amber-500"
                  >
                    <option value="Stunt Highlights">Stunt Highlights</option>
                    <option value="Live Performances">Live Performances</option>
                    <option value="Tandem Stunts">Tandem Stunts</option>
                    <option value="Extreme Stunts">Extreme Stunts</option>
                    <option value="Arena POV">Arena POV</option>
                    <option value="Behind the Scenes">Behind the Scenes</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Duration</label>
                  <input
                    type="text"
                    value={editForm.duration}
                    onChange={(e) => setEditForm({ ...editForm, duration: e.target.value })}
                    placeholder="0:45"
                    className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-slate-700 text-white text-xs focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Thumbnail URL</label>
                  <input
                    type="text"
                    value={editForm.thumbnailUrl}
                    onChange={(e) => setEditForm({ ...editForm, thumbnailUrl: e.target.value })}
                    placeholder="/images/... or https://..."
                    className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-slate-700 text-white text-xs focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Description</label>
                <textarea
                  rows={2}
                  value={editForm.description}
                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl bg-black/40 border border-slate-700 text-white text-xs focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setEditingVideo(null)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-rose-600 hover:from-amber-400 hover:to-rose-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-orange-950/40 flex items-center gap-2 cursor-pointer"
                >
                  {isUpdating ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Saving URL...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Save Stunt Video URL</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Instagram Reels Popup Player Modal */}
      <VideoModal
        isOpen={!!activeVideo}
        video={activeVideo}
        videos={filteredVideos}
        onSelectVideo={setActiveVideo}
        onClose={() => setActiveVideo(null)}
      />
    </div>
  );
};
