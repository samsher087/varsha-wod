import React, { useState, useEffect } from 'react';
import { apiClient } from '../api/client';
import { ImageLightbox } from '../components/ImageLightbox';
import {
  Compass,
  Search,
  Filter,
  MapPin,
  Tag,
  Loader2,
  Calendar,
} from 'lucide-react';

export const GalleryPage = () => {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  // Lightbox state
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const categories = [
    'All',
    'Live Shows',
    'Riding Stunts',
    'Events',
    'Behind the Scenes',
    'Achievements',
  ];

  useEffect(() => {
    fetchGallery();
  }, [activeCategory]);

  const fetchGallery = async () => {
    try {
      setLoading(true);
      const url = activeCategory === 'All' ? '/gallery' : `/gallery?category=${encodeURIComponent(activeCategory)}`;
      const res = await apiClient.get(url);
      if (res?.items) {
        setItems(res.items);
        setFilteredItems(res.items);
      }
    } catch (err) {
      console.warn('Failed to load gallery items:', err);
    } finally {
      setLoading(false);
    }
  };

  // Client-side search filtering
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredItems(items);
    } else {
      const q = searchQuery.toLowerCase();
      setFilteredItems(
        items.filter(
          (item) =>
            item.title?.toLowerCase().includes(q) ||
            item.caption?.toLowerCase().includes(q) ||
            item.location?.toLowerCase().includes(q)
        )
      );
    }
  }, [searchQuery, items]);

  const openLightbox = (index) => {
    setCurrentIndex(index);
    setLightboxOpen(true);
  };

  return (
    <div className="bg-transparent min-h-screen pt-36 pb-24 text-rose-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-3xl mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 border border-white/30 text-pink-200 text-xs font-bold uppercase tracking-wider mb-4">
            <Compass className="w-3.5 h-3.5 text-pink-300" />
            High-Definition Stunt Visuals
          </div>
          <h1 className="text-4xl sm:text-6xl font-black text-white uppercase tracking-tight">
            Photo <span className="text-gradient-fire">Gallery</span>
          </h1>
          <p className="mt-4 text-base text-pink-100/80 leading-relaxed">
            Witness adrenaline in motion. High-resolution captures of live arena performances, 88° vertical wall climbs, and backstage technical preparations.
          </p>
        </div>

        {/* Filter Bar & Search */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-10 pb-6 border-b border-white/15">
          {/* Category Pills */}
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                  activeCategory === cat
                    ? 'bg-gradient-to-r from-pink-500 via-rose-500 to-fuchsia-500 text-white shadow-md shadow-pink-600/40 border border-white/30'
                    : 'bg-white/10 text-pink-100 hover:text-white hover:bg-white/20 border border-white/20'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-pink-200 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search stunts, cities..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-full bg-white/10 border border-white/25 text-xs text-white placeholder-pink-200/60 focus:outline-none focus:border-white focus:bg-white/15 transition-colors backdrop-blur-md"
            />
          </div>
        </div>

        {/* Photo Grid */}
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-3 text-slate-500">
            <Loader2 className="w-8 h-8 animate-spin text-cyan-400" />
            <p className="text-xs uppercase tracking-wider">Loading stunt photographs...</p>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="py-20 text-center rounded-2xl bg-slate-900 border border-slate-800 p-8 card-top-line">
            <Compass className="w-10 h-10 text-slate-600 mx-auto mb-3" />
            <h3 className="text-base font-bold text-white">No Photographs Found</h3>
            <p className="text-xs text-slate-400 mt-1">Try selecting another category or refining your search term.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item, idx) => (
              <div
                key={item._id || idx}
                onClick={() => openLightbox(idx)}
                className="group relative rounded-2xl overflow-hidden bg-slate-900/90 backdrop-blur-xl border border-slate-800 hover:border-cyan-500/50 cursor-pointer transition-all duration-300 shadow-xl hover:shadow-cyan-500/10 hover:-translate-y-1 flex flex-col justify-between card-top-line"
              >
                {/* Image */}
                <div className="relative aspect-[4/3] overflow-hidden bg-slate-950">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-70 group-hover:opacity-90 transition-opacity" />
                  <span className="absolute top-3 right-3 text-[10px] font-bold uppercase px-2.5 py-1 rounded-full bg-slate-950/80 backdrop-blur-md text-cyan-300 border border-cyan-500/30">
                    {item.category}
                  </span>
                </div>

                {/* Info Card */}
                <div className="p-4 bg-slate-900/90">
                  <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors line-clamp-1">
                    {item.title}
                  </h3>
                  {item.caption && (
                    <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                      {item.caption}
                    </p>
                  )}
                  {item.location && (
                    <div className="mt-3 pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
                      <span className="flex items-center gap-1 text-slate-300">
                        <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                        {item.location}
                      </span>
                      {item.dateTaken && <span>{item.dateTaken}</span>}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox Component */}
      <ImageLightbox
        items={filteredItems}
        currentIndex={currentIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        onNext={() => setCurrentIndex((prev) => (prev + 1) % filteredItems.length)}
        onPrev={() => setCurrentIndex((prev) => (prev - 1 + filteredItems.length) % filteredItems.length)}
      />
    </div>
  );
};
