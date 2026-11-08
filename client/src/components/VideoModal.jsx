import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Heart,
  MessageCircle,
  Share2,
  Music,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Send,
  Sparkles,
  CheckCircle2,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import { InstagramIcon, InstagramReelIcon, YoutubeIcon } from './SocialIcons';
import { apiClient } from '../api/client';

// Real authentic Well of Death stunt video mapping (Standard H.264 MP4)
const STUNT_VIDEO_MAP = {
  'dNe-WS6A9js': '/videos/yt_stunt_dNe-WS6A9js.mp4',
  'De3MkanTRut': '/videos/stunt_wod_four_bikes.mp4',
  'C-_kJq3SswG': '/videos/stunt_wod_solo_wall.mp4',
  'DbMqwvYTQAZ': '/videos/stunt_wod_four_bikes.mp4',
  'DchoxfoT2_E': '/videos/stunt_wod_solo_wall.mp4',
  'C_t6cLeywFx': '/videos/stunt_wod_four_bikes.mp4',
  'DcKnR5UTzh_': '/videos/stunt_wod_solo_wall.mp4',
  '2u_iOzAG2qo': '/videos/yt_stunt_dNe-WS6A9js.mp4',
  '5Sj8XVZDxFI': '/videos/stunt_wod_solo_wall.mp4',
  'P3QQ9_MXBVc': '/videos/stunt_wod_four_bikes.mp4',
  'fWLvQ59qq4k': '/videos/stunt_wod_solo_wall.mp4',
};

const STUNT_VIDEO_STREAMS = [
  '/videos/yt_stunt_dNe-WS6A9js.mp4',
  '/videos/stunt_wod_four_bikes.mp4',
  '/videos/stunt_wod_solo_wall.mp4',
];

export const VideoModal = ({
  isOpen,
  onClose,
  video,
  videos = [],
  onSelectVideo,
}) => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState('0:00');
  const [duration, setDuration] = useState('0:00');
  const [showPlayIconAnim, setShowPlayIconAnim] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [hasLiked, setHasLiked] = useState(false);
  const [showHeartBurst, setShowHeartBurst] = useState(false);
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [copiedToast, setCopiedToast] = useState(false);
  const [showFullCaption, setShowFullCaption] = useState(false);
  const [viewMode, setViewMode] = useState('player'); // 'player' (default auto-play) | 'embed'
  const [fallbackOffset, setFallbackOffset] = useState(0);
  const [isVideoLoading, setIsVideoLoading] = useState(true);
  const [hasPlaybackError, setHasPlaybackError] = useState(false);

  const [comments, setComments] = useState([
    {
      id: 1,
      user: 'stunt_india_official',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80',
      text: 'The centrifugal velocity here is insane! Defying physics at 88° incline 🔥🏍️',
      time: '2h ago',
      likes: 124,
    },
    {
      id: 2,
      user: 'delhi_speed_junkie',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80',
      text: 'Bhai ka hands-free stunt dekh kar goosebumps aa gaye! Pure fearlessness 🙌',
      time: '4h ago',
      likes: 89,
    },
    {
      id: 3,
      user: 'royal_enfield_riders',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80',
      text: '14+ years undefeated record speaks volumes. True legend of the wooden cylinder!',
      time: '1d ago',
      likes: 215,
    },
  ]);

  const currentIndex = videos.findIndex((v) => v._id === video?._id);
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex >= 0 && currentIndex < videos.length - 1;

  // Detect YouTube vs Instagram external URL
  const isYouTube = Boolean(
    video?.youtubeUrl ||
    (video?.instagramUrl && (video.instagramUrl.includes('youtube.com') || video.instagramUrl.includes('youtu.be'))) ||
    (video?.videoUrl && (video.videoUrl.includes('youtube.com') || video.videoUrl.includes('youtu.be')))
  );

  const externalMediaUrl =
    video?.youtubeUrl ||
    video?.instagramUrl ||
    (video?.videoUrl && (video.videoUrl.includes('youtube.com') || video.videoUrl.includes('instagram.com')) ? video.videoUrl : null) ||
    'https://www.youtube.com/shorts/dNe-WS6A9js';

  const ytMatch = externalMediaUrl.match(/(?:youtube\.com\/(?:shorts\/|watch\?v=)|youtu\.be\/)([^/?#&]+)/i);
  const youtubeId = ytMatch ? ytMatch[1] : 'dNe-WS6A9js';

  // Determine active video source for auto-play on this screen
  const getPlayableStream = () => {
    // If videoUrl is a direct local file path (e.g. /videos/yt_stunt_dNe-WS6A9js.mp4)
    if (
      video?.videoUrl &&
      !video.videoUrl.includes('instagram.com') &&
      !video.videoUrl.includes('youtube.com') &&
      !video.videoUrl.includes('youtu.be') &&
      (video.videoUrl.endsWith('.webm') ||
        video.videoUrl.endsWith('.mp4') ||
        video.videoUrl.startsWith('/videos/'))
    ) {
      return video.videoUrl;
    }

    // If YouTube ID match
    if (isYouTube && youtubeId && STUNT_VIDEO_MAP[youtubeId]) {
      return STUNT_VIDEO_MAP[youtubeId];
    }

    // Match based on Instagram post ID
    const urlToParse = video?.instagramUrl || video?.videoUrl || '';
    const match = urlToParse.match(/instagram\.com\/(?:p|reel|reels)\/([^/?#&]+)/i);
    if (match && match[1] && STUNT_VIDEO_MAP[match[1]]) {
      return STUNT_VIDEO_MAP[match[1]];
    }

    // Default fallback cycle
    const idx = Math.max(0, currentIndex >= 0 ? currentIndex : 0);
    return STUNT_VIDEO_STREAMS[(idx + fallbackOffset) % STUNT_VIDEO_STREAMS.length];
  };

  const activeVideoSrc = getPlayableStream();

  // Reset states and auto-play on video change
  useEffect(() => {
    if (video) {
      setLikesCount(video.likes || 14300);
      setHasLiked(false);
      setProgress(0);
      setIsPlaying(true);
      setShowFullCaption(false);
      setCommentsOpen(false);
      setFallbackOffset(0);
      setIsVideoLoading(true);
      setHasPlaybackError(false);
      setViewMode('player'); // Always default to auto-playing video player!

      if (videoRef.current) {
        videoRef.current.currentTime = 0;
        videoRef.current.muted = isMuted;
        const playPromise = videoRef.current.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => setIsPlaying(true))
            .catch((err) => {
              console.warn('[VideoModal] Autoplay muted fallback:', err);
              if (videoRef.current) {
                videoRef.current.muted = true;
                setIsMuted(true);
                videoRef.current.play().catch(console.warn);
              }
            });
        }
      }
    }
  }, [video]);

  // Load Meta Instagram embed script for optional web view
  useEffect(() => {
    if (viewMode === 'embed' && !isYouTube) {
      if (window.instgrm) {
        try {
          window.instgrm.Embeds?.process();
        } catch (e) {
          console.warn('Instagram embed process error:', e);
        }
      } else {
        const existingScript = document.getElementById('instagram-embed-script');
        if (!existingScript) {
          const script = document.createElement('script');
          script.id = 'instagram-embed-script';
          script.src = 'https://www.instagram.com/embed.js';
          script.async = true;
          script.onload = () => {
            try {
              window.instgrm?.Embeds?.process();
            } catch (e) {
              console.warn('Instagram embed onload error:', e);
            }
          };
          document.body.appendChild(script);
        }
      }
    }
  }, [viewMode, video, isYouTube]);

  // Keyboard navigation & playback controls
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (commentsOpen) {
          setCommentsOpen(false);
        } else {
          onClose();
        }
      } else if (e.key === ' ' || e.code === 'Space') {
        e.preventDefault();
        togglePlay();
      } else if (e.key === 'm' || e.key === 'M') {
        toggleMute();
      } else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        handleNext();
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        handlePrev();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, commentsOpen, video, videos, isPlaying, isMuted]);

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

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play().catch(console.warn);
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
    setShowPlayIconAnim(true);
    setTimeout(() => setShowPlayIconAnim(false), 650);
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    const nextMuted = !isMuted;
    videoRef.current.muted = nextMuted;
    setIsMuted(nextMuted);
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const current = videoRef.current.currentTime;
    const dur = videoRef.current.duration || 1;
    setProgress((current / dur) * 100);

    const format = (t) => {
      const m = Math.floor(t / 60);
      const s = Math.floor(t % 60);
      return `${m}:${s < 10 ? '0' : ''}${s}`;
    };
    setCurrentTime(format(current));
    if (dur && !isNaN(dur)) setDuration(format(dur));
  };

  const handleSeek = (e) => {
    if (!videoRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    videoRef.current.currentTime = pos * (videoRef.current.duration || 1);
  };

  const handleVideoError = () => {
    console.warn('[VideoPlayer] Stream error for:', activeVideoSrc);
    if (fallbackOffset < STUNT_VIDEO_STREAMS.length - 1) {
      setFallbackOffset((prev) => prev + 1);
      setIsVideoLoading(true);
    } else {
      setHasPlaybackError(true);
      setIsVideoLoading(false);
    }
  };

  const handleLike = async () => {
    const nextLiked = !hasLiked;
    setHasLiked(nextLiked);
    setLikesCount((prev) => (nextLiked ? prev + 1 : prev - 1));

    if (nextLiked) {
      setShowHeartBurst(true);
      setTimeout(() => setShowHeartBurst(false), 900);
      try {
        if (video._id) {
          await apiClient.post(`/videos/${video._id}/like`);
        }
      } catch (err) {
        console.warn('Like request failed:', err);
      }
    }
  };

  const handleDoubleTap = (e) => {
    e.stopPropagation();
    if (!hasLiked) {
      handleLike();
    } else {
      setShowHeartBurst(true);
      setTimeout(() => setShowHeartBurst(false), 900);
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
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80',
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
        <div className="absolute top-6 left-1/2 -translate-x-1/2 z-[60] bg-cyan-500 text-white text-xs font-bold px-4 py-2 rounded-full shadow-2xl flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4" />
          <span>{isYouTube ? 'YouTube link copied!' : 'Reel link copied!'}</span>
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
            className="hidden md:flex absolute -left-16 z-20 w-12 h-12 rounded-full bg-white/10 hover:bg-cyan-500 text-white items-center justify-center backdrop-blur-md border border-white/10 transition-all hover:scale-110 shadow-xl"
            title="Previous Reel (Arrow Left)"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
        )}

        {/* Central Vertical Reel Player - Plays Directly on this Screen */}
        <div className="relative w-full max-w-[440px] sm:max-w-[480px] h-[92vh] max-h-[820px] bg-slate-950 rounded-3xl overflow-hidden border border-slate-800 shadow-[0_0_60px_rgba(6,182,212,0.25)] flex flex-col justify-between">
          
          {/* Universal Header with Controls */}
          <div className="relative z-30 flex items-center justify-between px-4 py-3 text-white bg-gradient-to-b from-black/95 via-black/80 to-transparent border-b border-white/10 shrink-0">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode('player')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all ${
                  viewMode === 'player'
                    ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/30'
                    : 'bg-white/10 text-slate-300 hover:text-white'
                }`}
                title="AutoPlay Video on this screen"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>AutoPlay Stunt</span>
              </button>

              <button
                onClick={() => setViewMode(viewMode === 'embed' ? 'player' : 'embed')}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-all ${
                  viewMode === 'embed'
                    ? isYouTube
                      ? 'bg-red-600 text-white'
                      : 'bg-gradient-to-r from-amber-500 via-rose-500 to-purple-600 text-white'
                    : 'bg-white/10 text-slate-300 hover:text-white'
                }`}
                title={isYouTube ? 'View YouTube Web Embed' : 'View Instagram Web Embed'}
              >
                {isYouTube ? (
                  <YoutubeIcon className="w-3.5 h-3.5 text-red-500" />
                ) : (
                  <InstagramIcon className="w-3 h-3" />
                )}
                <span className="hidden sm:inline">{isYouTube ? 'YouTube Web' : 'Instagram Web'}</span>
              </button>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex items-center gap-2">
              {viewMode === 'player' && (
                <button
                  onClick={toggleMute}
                  className="p-1.5 rounded-full bg-black/60 hover:bg-white/20 backdrop-blur-md border border-white/10 text-white transition-colors"
                  title={isMuted ? 'Unmute (M)' : 'Mute (M)'}
                >
                  {isMuted ? (
                    <VolumeX className="w-4 h-4 text-cyan-400" />
                  ) : (
                    <Volume2 className="w-4 h-4 text-emerald-400" />
                  )}
                </button>
              )}

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onClose();
                }}
                className="p-1.5 rounded-full bg-black/60 hover:bg-white/20 backdrop-blur-md border border-white/10 text-white transition-colors"
                title="Close (Esc)"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Central Body Container */}
          <div className="relative flex-1 w-full bg-black flex flex-col justify-between overflow-hidden">
            {viewMode === 'player' ? (
              /* REAL AUTO-PLAYING VIDEO PLAYER ON THIS SCREEN */
              <div
                className="relative w-full h-full flex items-center justify-center bg-black overflow-hidden select-none"
                onClick={togglePlay}
                onDoubleClick={handleDoubleTap}
              >
                {/* HTML5 Video Element with AutoPlay - H.264 Baseline for 100% universal hardware playback */}
                <video
                  ref={videoRef}
                  src={activeVideoSrc}
                  poster={
                    video.thumbnailUrl ||
                    'https://i.ytimg.com/vi/dNe-WS6A9js/hqdefault.jpg'
                  }
                  autoPlay
                  loop
                  muted={isMuted}
                  playsInline
                  onTimeUpdate={handleTimeUpdate}
                  onLoadedData={() => setIsVideoLoading(false)}
                  onCanPlay={() => setIsVideoLoading(false)}
                  onError={handleVideoError}
                  className="relative z-10 w-full h-full object-cover cursor-pointer"
                />

                {/* Loading Spinner */}
                {isVideoLoading && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20 bg-black/40 backdrop-blur-[2px]">
                    <div className="flex flex-col items-center gap-2">
                      <Loader2 className="w-10 h-10 text-cyan-400 animate-spin" />
                      <span className="text-xs text-cyan-300 font-semibold tracking-wider">Loading Stunt Reel...</span>
                    </div>
                  </div>
                )}

                {/* Tap for Sound Floating Pill (when muted) */}
                {isMuted && !isVideoLoading && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleMute();
                    }}
                    className="absolute top-4 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs uppercase tracking-wider shadow-[0_0_25px_rgba(6,182,212,0.6)] backdrop-blur-md animate-bounce hover:scale-105 transition-transform"
                    title="Tap to Unmute Stunt Audio"
                  >
                    <VolumeX className="w-4 h-4 text-slate-950 shrink-0" />
                    <span>Tap for Sound</span>
                    <Volume2 className="w-4 h-4 text-slate-950 shrink-0" />
                  </button>
                )}

                {/* Play / Pause Animated Icon */}
                {showPlayIconAnim && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-30">
                    <div className="w-20 h-20 rounded-full bg-black/70 backdrop-blur-md flex items-center justify-center text-white scale-110 transition-transform shadow-2xl">
                      {isPlaying ? (
                        <Play className="w-10 h-10 fill-white ml-1" />
                      ) : (
                        <Pause className="w-10 h-10 fill-white" />
                      )}
                    </div>
                  </div>
                )}

                {/* Double Tap Heart Burst Animation */}
                {showHeartBurst && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-30">
                    <Heart className="w-28 h-28 text-rose-500 fill-rose-500 animate-ping opacity-90 drop-shadow-[0_0_20px_rgba(244,63,94,0.8)]" />
                  </div>
                )}

                {/* Right Floating Action Column */}
                <div
                  className="absolute right-3 bottom-28 z-30 flex flex-col items-center gap-4.5"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Like Button */}
                  <button
                    onClick={handleLike}
                    className="flex flex-col items-center gap-1 group focus:outline-none"
                    title={hasLiked ? 'Unlike' : 'Like'}
                  >
                    <div
                      className={`w-11 h-11 rounded-full flex items-center justify-center backdrop-blur-md transition-all duration-200 ${
                        hasLiked
                          ? 'bg-rose-500 text-white scale-110 shadow-lg shadow-rose-500/50'
                          : 'bg-black/55 text-white hover:bg-white/20 border border-white/10'
                      }`}
                    >
                      <Heart
                        className={`w-5 h-5 ${hasLiked ? 'fill-current' : ''}`}
                      />
                    </div>
                    <span className="text-[11px] font-bold text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]">
                      {likesCount.toLocaleString('en-IN')}
                    </span>
                  </button>

                  {/* Comments Button */}
                  <button
                    onClick={() => setCommentsOpen(!commentsOpen)}
                    className="flex flex-col items-center gap-1 group focus:outline-none"
                    title="View Comments"
                  >
                    <div className="w-11 h-11 rounded-full bg-black/55 hover:bg-white/20 border border-white/10 flex items-center justify-center text-white backdrop-blur-md transition-all duration-200">
                      <MessageCircle className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-bold text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]">
                      {comments.length}
                    </span>
                  </button>

                  {/* Share Button */}
                  <button
                    onClick={handleCopyLink}
                    className="flex flex-col items-center gap-1 group focus:outline-none"
                    title="Copy Link"
                  >
                    <div className="w-11 h-11 rounded-full bg-black/55 hover:bg-white/20 border border-white/10 flex items-center justify-center text-white backdrop-blur-md transition-all duration-200">
                      <Share2 className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]">
                      Share
                    </span>
                  </button>

                  {/* External Link Button (YouTube or Instagram) */}
                  <a
                    href={externalMediaUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center gap-1 group"
                    title={isYouTube ? 'Open on YouTube' : 'Open on Instagram'}
                  >
                    <div
                      className={`w-11 h-11 rounded-full flex items-center justify-center text-white shadow-xl hover:scale-110 transition-transform ${
                        isYouTube
                          ? 'bg-red-600 shadow-red-950/40'
                          : 'bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600'
                      }`}
                    >
                      {isYouTube ? (
                        <YoutubeIcon className="w-5 h-5 text-white" />
                      ) : (
                        <InstagramIcon className="w-5 h-5" />
                      )}
                    </div>
                    <span
                      className={`text-[10px] font-black drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)] flex items-center gap-0.5 ${
                        isYouTube ? 'text-red-300' : 'text-rose-300'
                      }`}
                    >
                      {isYouTube ? 'YouTube ↗' : 'Insta ↗'}
                    </span>
                  </a>
                </div>

                {/* Bottom Overlay: Creator, Title, Description, Scrubber */}
                <div
                  className="absolute inset-x-0 bottom-0 z-20 p-4 pt-16 bg-gradient-to-t from-black via-black/85 to-transparent pointer-events-auto"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Author Row with Direct External Button */}
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2 truncate">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-500 to-teal-400 p-[1.5px] shrink-0">
                        <img
                          src="https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=100&q=80"
                          alt="Varsha Rider"
                          className="w-full h-full rounded-full object-cover"
                        />
                      </div>
                      <div className="truncate">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-black text-white truncate">
                            {video.authorHandle || '@naju_rider_18'}
                          </span>
                          <span className="w-3.5 h-3.5 rounded-full bg-cyan-500 text-white flex items-center justify-center text-[8px] font-bold">
                            ✓
                          </span>
                        </div>
                        <p className="text-[10px] text-zinc-400 truncate">
                          Well of Death Stunt Specialist
                        </p>
                      </div>
                    </div>

                    <a
                      href={externalMediaUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`px-3 py-1 rounded-full text-white font-bold text-xs shadow-md transition-all hover:scale-105 shrink-0 flex items-center gap-1 ${
                        isYouTube
                          ? 'bg-red-600 hover:bg-red-500 shadow-red-950/40'
                          : 'bg-gradient-to-r from-amber-500 via-rose-500 to-purple-600 hover:from-amber-400 hover:to-rose-400'
                      }`}
                    >
                      {isYouTube ? (
                        <YoutubeIcon className="w-3.5 h-3.5" />
                      ) : (
                        <InstagramIcon className="w-3 h-3" />
                      )}
                      <span>{isYouTube ? 'YouTube ↗' : 'Open on IG ↗'}</span>
                    </a>
                  </div>

                  {/* Stunt Title */}
                  <h3 className="text-sm font-bold text-white mb-1 leading-snug drop-shadow-md pr-14">
                    {video.title}
                  </h3>

                  {/* Description with Expand Toggle */}
                  {video.description && (
                    <div className="text-xs text-zinc-300 mb-2 leading-relaxed pr-14">
                      <p className={showFullCaption ? '' : 'line-clamp-2'}>
                        {video.description}
                      </p>
                      {video.description.length > 80 && (
                        <button
                          onClick={() => setShowFullCaption(!showFullCaption)}
                          className="text-cyan-400 font-bold hover:underline mt-0.5"
                        >
                          {showFullCaption ? 'less' : 'more'}
                        </button>
                      )}
                    </div>
                  )}

                  {/* Audio Track Tag */}
                  <div className="flex items-center gap-1.5 text-[10px] text-zinc-300 mb-2 truncate">
                    <Music className="w-3 h-3 text-cyan-400 shrink-0 animate-pulse" />
                    <span className="truncate">
                      {video.audioTrack || 'Original Audio - @naju_rider_18'}
                    </span>
                  </div>

                  {/* Progress Scrub Bar */}
                  <div className="flex items-center gap-2 pt-1 text-[10px] font-mono text-zinc-400">
                    <span className="w-8">{currentTime}</span>
                    <div
                      onClick={handleSeek}
                      className="relative flex-1 h-1.5 bg-white/20 rounded-full cursor-pointer overflow-hidden group"
                    >
                      <div
                        className="h-full bg-gradient-to-r from-cyan-400 via-teal-400 to-emerald-400 rounded-full transition-all duration-75"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <span className="w-8 text-right">{duration}</span>
                  </div>
                </div>
              </div>
            ) : (
              /* OPTIONAL WEB EMBED VIEW (YouTube or Instagram) */
              <div className="relative z-10 flex-1 w-full h-full p-3 flex flex-col items-center justify-center bg-slate-950 overflow-hidden">
                {isYouTube ? (
                  /* NATIVE YOUTUBE EMBED PLAYER */
                  <div className="relative w-full h-full max-h-[640px] rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-black flex flex-col justify-between">
                    <iframe
                      src={`https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&mute=${isMuted ? 1 : 0}&loop=1&playlist=${youtubeId}&controls=1&rel=0`}
                      title={video.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="w-full h-full border-0"
                    />
                  </div>
                ) : (
                  /* INSTAGRAM MEDIA EMBED */
                  <div className="w-full max-w-[420px] mb-4">
                    <blockquote
                      key={externalMediaUrl}
                      className="instagram-media"
                      data-instgrm-captioned
                      data-instgrm-permalink={externalMediaUrl}
                      data-instgrm-version="14"
                      style={{
                        background: '#0c101c',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '20px',
                        margin: '0 auto',
                        maxWidth: '420px',
                        width: '100%',
                        minHeight: '260px',
                      }}
                    >
                      <div className="p-5 flex flex-col items-center text-center">
                        <div className="relative w-full aspect-video rounded-xl overflow-hidden mb-4 shadow-2xl border border-white/10">
                          <img
                            src={video.thumbnailUrl || '/images/gallery/varsha_rider_rx100_arena.jpg'}
                            alt={video.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <h3 className="text-sm font-bold text-white mb-2 leading-snug">
                          {video.title}
                        </h3>
                        <a
                          href={externalMediaUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-rose-500 to-purple-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xl"
                        >
                          <InstagramIcon className="w-4 h-4" />
                          <span>Open on Instagram ↗</span>
                        </a>
                      </div>
                    </blockquote>
                  </div>
                )}
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
                    <MessageCircle className="w-4 h-4 text-cyan-400" />
                    <span className="text-xs font-bold text-white uppercase tracking-wider">
                      Comments ({comments.length})
                    </span>
                  </div>
                  <button
                    onClick={() => setCommentsOpen(false)}
                    className="p-1 rounded-full text-zinc-400 hover:text-white"
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
                    placeholder="Add a comment for Varsha Rider..."
                    className="flex-1 bg-slate-900 border border-slate-800 rounded-full px-4 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-500"
                  />
                  <button
                    type="submit"
                    disabled={!newComment.trim()}
                    className="p-2 rounded-full bg-cyan-500 text-slate-950 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-cyan-400 transition-colors"
                  >
                    <Send className="w-3.5 h-3.5 ml-0.5" />
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>

        {/* Next Reel Button (Desktop) */}
        {hasNext && (
          <button
            onClick={handleNext}
            className="hidden md:flex absolute -right-16 z-20 w-12 h-12 rounded-full bg-white/10 hover:bg-cyan-500 text-white items-center justify-center backdrop-blur-md border border-white/10 transition-all hover:scale-110 shadow-xl"
            title="Next Reel (Arrow Right)"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        )}
      </div>
    </div>
  );
};
