import React from 'react';
import {
  Play,
  Eye,
  Heart,
  Music,
  Clock,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { InstagramIcon, InstagramReelIcon, YoutubeIcon } from './SocialIcons';

export const ReelCard = ({ video, onWatch }) => {
  const isYouTube = Boolean(
    video?.youtubeUrl ||
    (video?.instagramUrl && (video.instagramUrl.includes('youtube.com') || video.instagramUrl.includes('youtu.be'))) ||
    (video?.videoUrl && (video.videoUrl.includes('youtube.com') || video.videoUrl.includes('youtu.be')))
  );

  const externalUrl =
    video?.youtubeUrl ||
    video?.instagramUrl ||
    video?.videoUrl ||
    'https://www.youtube.com/shorts/dNe-WS6A9js';

  return (
    <div
      onClick={() => onWatch(video)}
      className="group relative rounded-3xl overflow-hidden bg-white/[0.08] backdrop-blur-2xl border border-white/20 hover:border-pink-300/60 cursor-pointer transition-all duration-300 shadow-xl hover:shadow-pink-500/20 hover:-translate-y-1.5 flex flex-col justify-between card-top-line"
    >
      {/* Thumbnail Container */}
      <div className="relative aspect-[16/10] sm:aspect-video bg-[#240417]/80 overflow-hidden">
        <img
          src={
            video.thumbnailUrl ||
            '/images/gallery/varsha_rider_rx100_arena.jpg'
          }
          alt={video.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Ambient Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-slate-950/40 group-hover:via-slate-950/20 transition-colors" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-950/80 backdrop-blur-md border border-slate-700/80 text-white shadow-md">
            {isYouTube ? (
              <>
                <YoutubeIcon className="w-3.5 h-3.5 text-red-500" />
                <span className="text-[10px] font-black uppercase tracking-wider text-red-400">
                  Shorts
                </span>
              </>
            ) : (
              <>
                <InstagramReelIcon className="w-3.5 h-3.5 text-cyan-400" />
                <span className="text-[10px] font-black uppercase tracking-wider bg-gradient-to-r from-cyan-400 via-teal-400 to-emerald-400 bg-clip-text text-transparent">
                  Reel
                </span>
              </>
            )}
          </div>

          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-950/80 backdrop-blur-md text-slate-300 font-mono border border-slate-800 flex items-center gap-1">
            <Clock className="w-3 h-3 text-cyan-400" />
            {video.duration || '0:45'}
          </span>
        </div>

        {/* Center Play Button with SoftDeals Glow */}
        <div className="absolute inset-0 flex items-center justify-center">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onWatch(video);
            }}
            className="relative group/play cursor-pointer focus:outline-none"
            aria-label={`Play ${video.title} on this screen`}
            title="Play Reel on Screen"
          >
            <div className="absolute -inset-2 rounded-full bg-gradient-to-tr from-cyan-500 via-teal-500 to-emerald-400 opacity-70 blur-md group-hover/play:opacity-100 group-hover/play:scale-125 transition-all duration-300" />
            <div className="relative w-14 h-14 rounded-full bg-gradient-to-tr from-cyan-600 via-teal-600 to-emerald-500 text-white flex items-center justify-center shadow-2xl group-hover/play:scale-110 transition-transform">
              <Play className="w-6 h-6 fill-white ml-0.5" />
            </div>
          </button>
        </div>

        {/* Audio Track Tag inside Thumbnail */}
        <div className="absolute bottom-2.5 left-3 right-3 z-10">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-950/80 backdrop-blur-md text-[10px] text-slate-200 border border-slate-800/80 max-w-[95%]">
            <Music className="w-3 h-3 text-cyan-400 shrink-0 animate-pulse" />
            <span className="truncate">
              {video.audioTrack || 'Original Audio - @naju_rider_18'}
            </span>
          </div>
        </div>
      </div>

      {/* Card Details */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Creator Info & Category */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-pink-500 via-rose-500 to-fuchsia-500 p-[1.5px]">
                <img
                  src="https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=100&q=80"
                  alt="Varsha Rider"
                  className="w-full h-full rounded-full object-cover"
                />
              </div>
              <span className="text-xs font-bold text-pink-100">
                {video.authorHandle || '@naju_rider_18'}
              </span>
              <span className="w-3.5 h-3.5 rounded-full bg-pink-500 text-white flex items-center justify-center text-[8px] font-bold">
                ✓
              </span>
            </div>

            <span className="text-[10px] font-bold text-pink-200 uppercase tracking-wider px-3 py-0.5 rounded-full bg-white/15 border border-white/25">
              {video.category || 'Stunt Reel'}
            </span>
          </div>

          {/* Title */}
          <h3 className="text-base font-bold text-white mt-1 group-hover:text-pink-200 transition-colors line-clamp-2 leading-snug">
            {video.title}
          </h3>

          {/* Description */}
          {video.description && (
            <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">
              {video.description}
            </p>
          )}
        </div>

        {/* Footer Metrics & Popup Trigger */}
        <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
          <div className="flex items-center gap-3 text-slate-400">
            <span className="flex items-center gap-1">
              <Eye className="w-3.5 h-3.5 text-slate-500" />
              {(video.views || 34200).toLocaleString('en-IN')}
            </span>
            <span className="flex items-center gap-1 text-rose-400/90">
              <Heart className="w-3.5 h-3.5 fill-rose-500/20 text-rose-400" />
              {(video.likes || 14300).toLocaleString('en-IN')}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={externalUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className={`p-1.5 rounded-full transition-colors ${
                isYouTube
                  ? 'bg-red-500/10 hover:bg-red-600 text-red-400 hover:text-white border border-red-500/20'
                  : 'bg-slate-800 hover:bg-rose-600 text-slate-300 hover:text-white'
              }`}
              title={isYouTube ? 'Open on YouTube' : 'Open on Instagram'}
            >
              {isYouTube ? (
                <YoutubeIcon className="w-3.5 h-3.5" />
              ) : (
                <InstagramIcon className="w-3.5 h-3.5" />
              )}
            </a>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onWatch(video);
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-amber-500 via-rose-500 to-purple-600 hover:from-amber-400 hover:to-rose-400 text-white font-bold text-xs shadow-md shadow-rose-950/40 hover:scale-105 transition-all cursor-pointer focus:outline-none"
              title="Watch Reel on this screen"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Watch Reel</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
