import React, { useState } from 'react';
import { Play, Clock, Edit } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const ReelCard = ({ video, onWatch, onEdit, index = 0 }) => {
  const { isAdmin } = useAuth();
  const [imgError, setImgError] = useState(false);

  const defaultPhases = [
    'SCULPTING PHASE',
    'CUTWORK DETAILING',
    'STRUCTURAL GILDING',
    'OPTICAL ENGINEERING',
    'INSPECTION & REVEAL',
    'FINALE SHOWCASE',
  ];

  const stuntPhases = [
    'WALL ORBIT PHASE',
    'CENTRIFUGAL GLIDE',
    'TANDEM SYNCHRO',
    'EXTREME HIGH RIM',
    'ARENA POV REVEAL',
    'GRAND FINALE SHOW',
  ];

  const phaseNum = String(index + 1).padStart(2, '0');
  const phaseName =
    video?.phase ||
    video?.stage ||
    (video?.category ? video.category.toUpperCase() : stuntPhases[index % stuntPhases.length]);
  const phaseBadgeText = `${phaseNum}. ${phaseName}`;

  const defaultThumb =
    index === 0
      ? '/images/gallery/varsha_rider_rx100_arena.jpg'
      : index === 1
      ? '/images/gallery/tandem_wall_orbit.jpg'
      : index === 2
      ? '/images/gallery/varsha_rider_viral_bullet.jpg'
      : index === 3
      ? '/images/gallery/mudma_mela_varsha_rider.jpg'
      : '/images/gallery/arena_grounds_portrait.jpg';

  const imageSrc =
    !imgError && video?.thumbnailUrl ? video.thumbnailUrl : defaultThumb;

  return (
    <div
      onClick={() => onWatch && onWatch(video)}
      className="group relative rounded-2xl overflow-hidden bg-[#121620] border border-[#202738] hover:border-[#c89849]/60 transition-all duration-300 shadow-xl shadow-black/60 hover:shadow-2xl hover:shadow-[#c89849]/15 hover:-translate-y-1.5 flex flex-col justify-between cursor-pointer"
    >
      {/* Thumbnail Section */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#0c0f17]">
        <img
          src={imageSrc}
          alt={video.title}
          onError={() => setImgError(true)}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Top & Bottom Ambient Vignette Gradients */}
        <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-black/85 via-black/30 to-transparent pointer-events-none" />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#121620] via-black/70 to-transparent pointer-events-none" />

        {/* Top Gold Box Badge (e.g. 01. SCULPTING PHASE / 01. WALL ORBIT) */}
        <div className="absolute top-3 inset-x-3 flex justify-center z-10 pointer-events-none">
          <span className="px-2.5 py-0.5 rounded-[4px] border border-[#c89849]/80 bg-black/70 backdrop-blur-md text-[10px] font-mono font-bold tracking-widest text-[#dfb76c] uppercase text-center shadow-sm">
            {phaseBadgeText}
          </span>
        </div>

        {/* Admin Quick Edit Stunt Video URL Button */}
        {isAdmin && onEdit && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(video);
            }}
            className="absolute top-2.5 right-2.5 z-20 px-2 py-0.5 rounded-md bg-[#dfb76c] hover:bg-amber-300 text-black font-extrabold text-[9px] uppercase tracking-wider flex items-center gap-1 shadow-xl shadow-black/90 hover:scale-105 active:scale-95 transition-all cursor-pointer border border-[#ffe699]/60"
            title="Admin: Change Stunt Video URL"
          >
            <Edit className="w-2.5 h-2.5" />
            <span>Edit URL</span>
          </button>
        )}

        {/* Center Circular Gold / Amber Play Button */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="relative group/play">
            <div className="absolute -inset-2 rounded-full bg-[#c89849] opacity-35 blur-md group-hover:opacity-75 group-hover:scale-125 transition-all duration-300" />
            <div className="relative w-12 h-12 rounded-full bg-gradient-to-br from-[#dfb76c] via-[#c69247] to-[#996b26] p-[1.5px] shadow-2xl group-hover:scale-110 transition-transform duration-300 flex items-center justify-center border border-[#ffe699]/40">
              <div className="w-full h-full rounded-full bg-gradient-to-b from-[#dfb76c] via-[#c69247] to-[#b37f32] flex items-center justify-center shadow-inner">
                <Play className="w-5 h-5 fill-[#15120c] text-[#15120c] ml-0.5" />
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Left Subtle Telemetry Badge */}
        <div className="absolute bottom-2.5 left-2.5 z-10 flex items-center gap-1.5 pointer-events-none">
          <span className="px-2 py-0.5 rounded bg-black/70 backdrop-blur-md border border-white/10 text-[9px] font-mono text-amber-200/90 flex items-center gap-1">
            <Clock className="w-2.5 h-2.5 text-amber-400" />
            {video.duration || '0:45'}
          </span>
        </div>

        {/* Bottom Right Red 'Play Video' Pill Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onWatch && onWatch(video);
          }}
          className="absolute bottom-2.5 right-2.5 z-10 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#e50914] hover:bg-red-700 text-white font-bold text-[10px] tracking-wide shadow-lg shadow-black/80 hover:scale-105 active:scale-95 transition-all cursor-pointer focus:outline-none"
          aria-label={`Play video: ${video.title}`}
        >
          <Play className="w-2.5 h-2.5 fill-white text-white" />
          <span>Play Video</span>
        </button>
      </div>

      {/* Card Content & Action Bar */}
      <div className="p-4 flex flex-col justify-between flex-1 bg-[#121620]">
        <div>
          <h3
            className="text-sm font-semibold text-white tracking-wide line-clamp-1 group-hover:text-[#dfb76c] transition-colors"
            title={video.title}
          >
            {video.title}
          </h3>
          <p className="text-xs text-slate-400 line-clamp-2 mt-1.5 leading-relaxed">
            {video.description ||
              'High-speed arena stunt demonstration exhibiting balance, centrifugal velocity, and zero margin for error.'}
          </p>
        </div>

        {/* Bottom Action Row (Watch Clip | HD Demo) */}
        <div className="mt-3.5 pt-3 border-t border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-[#c89849] group-hover:text-[#dfb76c] transition-colors">
            <Play className="w-3 h-3 fill-[#c89849] group-hover:fill-[#dfb76c] transition-colors" />
            <span>Watch Clip</span>
          </div>
          <div className="flex items-center gap-1 text-[11px] font-bold text-[#00e599] tracking-wider">
            <span>HD Demo</span>
            <Play className="w-2.5 h-2.5 fill-[#00e599] text-[#00e599]" />
          </div>
        </div>
      </div>
    </div>
  );
};
