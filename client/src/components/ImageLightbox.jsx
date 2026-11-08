import React, { useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, MapPin, Tag } from 'lucide-react';

export const ImageLightbox = ({
  items,
  currentIndex,
  isOpen,
  onClose,
  onNext,
  onPrev,
}) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') onNext();
      if (e.key === 'ArrowLeft') onPrev();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, onNext, onPrev]);

  if (!isOpen || !items || items.length === 0) return null;

  const currentItem = items[currentIndex] || items[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-xl animate-in fade-in duration-200">
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-5 right-5 z-50 p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all hover:scale-105"
        aria-label="Close Lightbox"
      >
        <X className="w-6 h-6" />
      </button>

      {/* Navigation Buttons */}
      {items.length > 1 && (
        <>
          <button
            onClick={onPrev}
            className="absolute left-4 sm:left-6 z-50 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all hover:scale-110"
            aria-label="Previous Image"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={onNext}
            className="absolute right-4 sm:right-6 z-50 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all hover:scale-110"
            aria-label="Next Image"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </>
      )}

      {/* Image & Details Container */}
      <div className="max-w-5xl max-h-[90vh] mx-auto p-4 flex flex-col items-center justify-center select-none">
        <div className="relative max-h-[75vh] overflow-hidden rounded-2xl border border-slate-800 shadow-2xl bg-slate-950 card-top-line">
          <img
            src={currentItem.imageUrl}
            alt={currentItem.title}
            className="max-h-[75vh] w-auto max-w-full object-contain mx-auto transition-transform duration-300"
          />
        </div>

        {/* Caption & Metadata */}
        <div className="mt-4 text-center max-w-2xl px-4">
          <div className="flex items-center justify-center gap-3 mb-1.5 flex-wrap">
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 font-semibold flex items-center gap-1">
              <Tag className="w-3 h-3 text-cyan-400" />
              {currentItem.category}
            </span>
            {currentItem.location && (
              <span className="text-xs text-slate-400 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-cyan-400" />
                {currentItem.location}
              </span>
            )}
            <span className="text-xs text-slate-500 font-medium">
              {currentIndex + 1} / {items.length}
            </span>
          </div>

          <h3 className="text-lg font-bold text-white">{currentItem.title}</h3>
          {currentItem.caption && (
            <p className="text-xs sm:text-sm text-zinc-400 mt-1">{currentItem.caption}</p>
          )}
        </div>
      </div>
    </div>
  );
};
