import React, { useState, useEffect } from 'react';
import {
  X,
  Heart,
  MessageCircle,
  Share2,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Send,
  CheckCircle2,
  Play,
} from 'lucide-react';
import { YoutubeIcon, InstagramIcon } from './SocialIcons';
import { apiClient } from '../api/client';

export const extractYouTubeId = (url) => {
  if (!url) return null;
  const str = String(url).trim();
  if (/^[a-zA-Z0-9_-]{11}$/.test(str)) return str;
  const shortsMatch = str.match(/youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/i);
  if (shortsMatch) return shortsMatch[1];
  const watchMatch = str.match(/[?&]v=([a-zA-Z0-9_-]{11})/i);
  if (watchMatch) return watchMatch[1];
  const youtuBeMatch = str.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/i);
  if (youtuBeMatch) return youtuBeMatch[1];
  const embedMatch = str.match(/youtube(?:-nocookie)?\.com\/embed\/([a-zA-Z0-9_-]{11})/i);
  if (embedMatch) return embedMatch[1];
  return null;
};

export const VideoModal = ({
  isOpen,
  onClose,
  video,
  videos = [],
  onSelectVideo,
}) => {
  const [likesCount, setLikesCount] = useState(0);
  const [hasLiked, setHasLiked] = useState(false);
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [copiedToast, setCopiedToast] = useState(false);
  const [showFullCaption, setShowFullCaption] = useState(false);

  const [comments, setComments] = useState([
    {
      id: 1,
      user: 'stunt_india_official',
      avatar:
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80',
      text: 'The centrifugal velocity here is insane! Defying physics at 88° incline 🔥🏍️',
      time: '2h ago',
      likes: 124,
    },
    {
      id: 2,
      user: 'delhi_speed_junkie',
      avatar:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80',
      text: 'Bhai ka hands-free stunt dekh kar goosebumps aa gaye! Pure fearlessness 🙌',
      time: '4h ago',
      likes: 89,
    },
    {
      id: 3,
      user: 'royal_enfield_riders',
      avatar:
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80',
      text: '14+ years undefeated record speaks volumes. True legend of the wooden cylinder!',
      time: '1d ago',
      likes: 215,
    },
  ]);

  const currentIndex = videos.findIndex((v) => v._id === video?._id);
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex >= 0 && currentIndex < videos.length - 1;

  // Extract YouTube ID from videoUrl, youtubeUrl, or instagramUrl
  const youtubeId =
    extractYouTubeId(video?.videoUrl) ||
    extractYouTubeId(video?.youtubeUrl) ||
    extractYouTubeId(video?.instagramUrl) ||
    '2u_iOzAG2qo';

  const isDirectMp4 =
    !youtubeId &&
    video?.videoUrl &&
    (video.videoUrl.endsWith('.mp4') || video.videoUrl.endsWith('.webm'));

  const externalMediaUrl =
    (video?.youtubeUrl && video.youtubeUrl.includes('youtube.com'))
      ? video.youtubeUrl
      : (video?.videoUrl && (video.videoUrl.includes('youtube.com') || video.videoUrl.includes('youtu.be')))
      ? video.videoUrl
      : `https://www.youtube.com/shorts/${youtubeId}`;

  useEffect(() => {
    if (video) {
      setLikesCount(video.likes || 14300);
      setHasLiked(false);
      setCommentsOpen(false);
      setShowFullCaption(false);
    }
  }, [video]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (commentsOpen) {
          setCommentsOpen(false);
        } else {
          onClose();
        }
      } else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        handleNext();
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        handlePrev();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, commentsOpen, video, videos]);

  if (!isOpen || !video) return null;

  const handlePrev = () => {
    if (hasPrev && onSelectVideo) {
      onSelectVideo(videos[currentIndex - 1]);
    }
  };

  const handleNext = () => {
    if (hasNext && onSelectVideo) {
      onSelectVideo(videos[currentIndex + 1]);
    }
  };

  const handleLike = async () => {
    const nextLiked = !hasLiked;
    setHasLiked(nextLiked);
    setLikesCount((prev) => (nextLiked ? prev + 1 : prev - 1));

    if (nextLiked && video._id) {
      try {
        await apiClient.post(`/videos/${video._id}/like`);
      } catch (err) {
        console.warn('Like request failed:', err);
      }
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(externalMediaUrl);
    setCopiedToast(true);
    setTimeout(() => setCopiedToast(false), 2200);
  };

  const handleAddComment = (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    const item = {
      id: Date.now(),
      user: 'you',
      avatar:
        'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80',
      text: newComment.trim(),
      time: 'Just now',
      likes: 1,
    };
    setComments([item, ...comments]);
    setNewComment('');
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-2xl p-2 sm:p-4 select-none animate-in fade-in duration-200"
      onClick={onClose}
    >
      {/* Toast Notification */}
      {copiedToast && (
        <div className="absolute top-6 left-1/2 -translate-x-1/2 z-[60] bg-red-600 text-white text-xs font-bold px-4 py-2 rounded-full shadow-2xl flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4" />
          <span>YouTube link copied!</span>
        </div>
      )}

      {/* Outer Container with Prev / Next Navigation Arrows */}
      <div
        className="relative flex items-center justify-center w-full max-w-5xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Previous Reel Button (Desktop) */}
        {hasPrev && (
          <button
            onClick={handlePrev}
            className="hidden md:flex absolute -left-16 z-20 w-12 h-12 rounded-full bg-white/10 hover:bg-amber-500 hover:text-black text-white items-center justify-center backdrop-blur-md border border-white/10 transition-all hover:scale-110 shadow-xl cursor-pointer"
            title="Previous Stunt (Arrow Left)"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
        )}

        {/* Central Vertical Reel Player */}
        <div className="relative w-full max-w-[460px] sm:max-w-[480px] h-[92vh] max-h-[820px] bg-slate-950 rounded-3xl overflow-hidden border border-slate-800 shadow-[0_0_60px_rgba(229,9,20,0.3)] flex flex-col justify-between">
          {/* Universal Header with Controls */}
          <div className="relative z-30 flex items-center justify-between px-4 py-3 text-white bg-gradient-to-b from-black/95 via-black/85 to-transparent border-b border-white/10 shrink-0">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-600 text-white font-black text-xs uppercase tracking-wider shadow-md shadow-red-950/60">
                <YoutubeIcon className="w-3.5 h-3.5 fill-current" />
                <span>YouTube Stunt</span>
              </div>
              <span className="text-[11px] text-zinc-300 font-bold px-2 py-0.5 rounded-full bg-white/10 border border-white/10">
                {video.category || 'Stunt Highlights'}
              </span>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex items-center gap-2">
              <a
                href={externalMediaUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-2.5 py-1 rounded-full bg-white/10 hover:bg-red-600 text-white text-xs font-semibold flex items-center gap-1 transition-colors"
                title="Watch directly on YouTube"
              >
                <YoutubeIcon className="w-3.5 h-3.5 text-red-400 hover:text-white" />
                <span className="hidden sm:inline">YouTube</span>
                <ExternalLink className="w-3 h-3" />
              </a>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onClose();
                }}
                className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                title="Close (Esc)"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Central Body Container - Plays with YouTube URL */}
          <div className="relative flex-1 w-full bg-black flex flex-col justify-between overflow-hidden">
            {youtubeId ? (
              /* NATIVE YOUTUBE EMBED PLAYER PLAYING THE REAL YOUTUBE URL */
              <div className="relative w-full h-full flex items-center justify-center bg-black overflow-hidden select-none">
                <iframe
                  key={youtubeId}
                  src={`https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&mute=0&controls=1&rel=0&loop=1&playlist=${youtubeId}&modestbranding=1&playsinline=1`}
                  title={video.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  className="w-full h-full border-0"
                />
              </div>
            ) : isDirectMp4 ? (
              <div className="relative w-full h-full flex items-center justify-center bg-black overflow-hidden">
                <video
                  src={video.videoUrl}
                  controls
                  autoPlay
                  loop
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="relative w-full h-full flex items-center justify-center bg-black">
                <iframe
                  src="https://www.youtube-nocookie.com/embed/2u_iOzAG2qo?autoplay=1&mute=0&controls=1&rel=0"
                  title="Stunt Reel"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  className="w-full h-full border-0"
                />
              </div>
            )}

            {/* Slide-Up Comments Drawer */}
            {commentsOpen && (
              <div
                className="absolute inset-x-0 bottom-0 h-[68%] bg-slate-950/95 backdrop-blur-2xl rounded-t-3xl border-t border-slate-800 z-40 flex flex-col p-4 shadow-2xl animate-in slide-in-from-bottom duration-200"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <MessageCircle className="w-4 h-4 text-amber-400" />
                    <span className="text-xs font-bold text-white uppercase tracking-wider">
                      Comments ({comments.length})
                    </span>
                  </div>
                  <button
                    onClick={() => setCommentsOpen(false)}
                    className="p-1 rounded-full text-zinc-400 hover:text-white cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Comments List */}
                <div className="flex-1 overflow-y-auto py-3 space-y-3.5 pr-1 text-xs">
                  {comments.map((c) => (
                    <div key={c.id} className="flex gap-2.5 items-start">
                      <img
                        src={c.avatar}
                        alt={c.user}
                        className="w-7 h-7 rounded-full object-cover shrink-0 mt-0.5 border border-white/10"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white">{c.user}</span>
                          <span className="text-[10px] text-zinc-500">{c.time}</span>
                        </div>
                        <p className="text-zinc-300 mt-0.5 leading-relaxed">{c.text}</p>
                      </div>
                      <div className="flex flex-col items-center text-[10px] text-zinc-500">
                        <Heart className="w-3.5 h-3.5 text-zinc-400 hover:text-red-400 cursor-pointer" />
                        <span>{c.likes}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Add Comment Input */}
                <form
                  onSubmit={handleAddComment}
                  className="pt-2 border-t border-slate-800 flex items-center gap-2"
                >
                  <input
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Add a comment for the rider..."
                    className="flex-1 bg-slate-900 border border-slate-800 rounded-full px-4 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500"
                  />
                  <button
                    type="submit"
                    disabled={!newComment.trim()}
                    className="p-2 rounded-full bg-amber-500 text-slate-950 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-amber-400 transition-colors cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5 ml-0.5" />
                  </button>
                </form>
              </div>
            )}
          </div>

          {/* Bottom Bar: Video Title, Details, Action Buttons */}
          <div className="relative z-30 px-4 py-3 bg-gradient-to-t from-black via-black/95 to-black/80 border-t border-white/10 shrink-0">
            <div className="flex items-center justify-between gap-3">
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-bold text-white truncate" title={video.title}>
                  {video.title}
                </h3>
                {video.description && (
                  <p className="text-xs text-zinc-400 truncate mt-0.5">
                    {video.description}
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={handleLike}
                  className={`p-2 rounded-xl flex items-center gap-1.5 text-xs font-bold transition-all cursor-pointer ${
                    hasLiked
                      ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                      : 'bg-white/10 hover:bg-white/20 text-white'
                  }`}
                  title={hasLiked ? 'Unlike' : 'Like'}
                >
                  <Heart className={`w-3.5 h-3.5 ${hasLiked ? 'fill-current' : ''}`} />
                  <span>{likesCount.toLocaleString('en-IN')}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setCommentsOpen(!commentsOpen)}
                  className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                  title="Comments"
                >
                  <MessageCircle className="w-3.5 h-3.5 text-amber-400" />
                  <span>{comments.length}</span>
                </button>

                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs transition-all cursor-pointer"
                  title="Copy YouTube Link"
                >
                  <Share2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Next Reel Button (Desktop) */}
        {hasNext && (
          <button
            onClick={handleNext}
            className="hidden md:flex absolute -right-16 z-20 w-12 h-12 rounded-full bg-white/10 hover:bg-amber-500 hover:text-black text-white items-center justify-center backdrop-blur-md border border-white/10 transition-all hover:scale-110 shadow-xl cursor-pointer"
            title="Next Stunt (Arrow Right)"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        )}
      </div>
    </div>
  );
};
