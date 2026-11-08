import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSettings } from '../context/SettingsContext';
import { apiClient } from '../api/client';
import {
  Play,
  ChevronLeft,
  ChevronRight,
  Compass,
  GraduationCap,
  ArrowUpRight,
} from 'lucide-react';

const defaultSlides = [
  {
    imageUrl: '/images/gallery/varsha_rider_viral_bullet.jpg',
    title: 'Viral Girl Varsha Rider',
    category: 'Ranchi Ki Shaan',
    location: 'Royal Enfield Bullet 350',
  },
  {
    imageUrl: '/images/gallery/varsha_rider_rx100_arena.jpg',
    title: '88° Vertical Wall Orbit',
    category: 'Live Shows',
    location: 'Ranchi Maut Ka Kuan Arena',
  },
  {
    imageUrl: '/images/gallery/tandem_wall_orbit.jpg',
    title: 'Twin Bike Tandem Stunt',
    category: 'Live Shows',
    location: 'Carnival Arena',
  },
  {
    imageUrl: '/images/gallery/varsha_rider_stunt_pose.jpg',
    title: 'Varsha Rider Arena Stunt',
    category: 'Signatures',
    location: 'Timber Plank Barrel',
  },
  {
    imageUrl: '/images/gallery/mudma_mela_varsha_rider.jpg',
    title: 'Mudma Mela Stunt Team',
    category: 'Events',
    location: 'Mudma, Ranchi',
  },
];

export const Hero = () => {
  const { settings } = useSettings();
  const [slides, setSlides] = useState(defaultSlides);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    apiClient.get('/gallery').then((res) => {
      if (res?.items && res.items.length > 0) {
        setSlides(res.items.slice(0, 6));
      }
    }).catch(console.warn);
  }, []);

  useEffect(() => {
    if (!isAutoPlaying || slides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [isAutoPlaying, slides.length]);

  const handlePrevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const handleNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const activeSlide = slides[currentSlide] || slides[0] || defaultSlides[0];

  return (
    <section className="relative min-h-[92vh] flex flex-col justify-between overflow-hidden pt-32 pb-12 sm:pb-16 select-none">
      {/* Background Slideshow Layer - Translucent Overlays */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {slides.map((slide, idx) => (
          <div
            key={slide._id || slide.imageUrl || idx}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              idx === currentSlide ? 'opacity-25' : 'opacity-0 pointer-events-none'
            }`}
          >
            <img
              src={slide.imageUrl}
              alt={slide.title || 'Well of Death Stunt'}
              className={`w-full h-full object-cover filter brightness-105 contrast-110 transition-transform duration-7000 ease-out ${
                idx === currentSlide ? 'scale-105' : 'scale-100'
              }`}
            />
          </div>
        ))}

        {/* Soft Satin Vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#240417]/90 via-transparent to-[#240417]/50" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#240417]/60 via-transparent to-[#240417]/60" />
      </div>

      {/* Floating Frosted Glass Card (inspired directly by the reference image) */}
      <div className="hidden lg:block absolute top-28 right-10 z-20 max-w-xs p-5 rounded-3xl bg-white/[0.12] backdrop-blur-2xl border border-white/25 shadow-2xl shadow-pink-950/40 text-left text-white animate-in fade-in slide-in-from-top-4 duration-700">
        <div className="flex items-start justify-between gap-3 mb-4">
          <p className="text-sm font-bold text-white leading-snug">
            Master every stage of stunt riding with our academy!
          </p>
          <div className="w-8 h-8 rounded-full bg-white/20 border border-white/40 flex items-center justify-center shrink-0 hover:bg-white/30 transition-colors">
            <ArrowUpRight className="w-4 h-4 text-white" />
          </div>
        </div>
        <div className="flex items-center gap-3 pt-3 border-t border-white/15">
          <div className="flex -space-x-2">
            <img className="w-7 h-7 rounded-full border-2 border-white/70 object-cover shadow" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80" alt="avatar" />
            <img className="w-7 h-7 rounded-full border-2 border-white/70 object-cover shadow" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80" alt="avatar" />
            <img className="w-7 h-7 rounded-full border-2 border-white/70 object-cover shadow" src="https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=100&q=80" alt="avatar" />
          </div>
          <span className="text-[11px] text-pink-100/90 font-medium leading-tight">
            <strong className="text-white font-bold">3k+</strong> students & riders inspired
          </span>
        </div>
      </div>

      {/* Slideshow Arrow Left */}
      <button
        type="button"
        onClick={handlePrevSlide}
        aria-label="Previous Slide"
        className="absolute left-3 sm:left-8 top-1/2 -translate-y-1/2 z-20 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white/15 backdrop-blur-xl border border-white/30 text-white hover:bg-white/25 hover:border-white transition-all flex items-center justify-center shadow-xl hover:scale-105 group cursor-pointer"
      >
        <ChevronLeft className="w-6 h-6 transition-transform group-hover:-translate-x-0.5 text-white" />
      </button>

      {/* Slideshow Arrow Right */}
      <button
        type="button"
        onClick={handleNextSlide}
        aria-label="Next Slide"
        className="absolute right-3 sm:right-8 top-1/2 -translate-y-1/2 z-20 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white/15 backdrop-blur-xl border border-white/30 text-white hover:bg-white/25 hover:border-white transition-all flex items-center justify-center shadow-xl hover:scale-105 group cursor-pointer"
      >
        <ChevronRight className="w-6 h-6 transition-transform group-hover:translate-x-0.5 text-white" />
      </button>

      {/* Hero Core Title & Headline */}
      <div className="relative z-10 my-auto max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-6">
        {/* Our Mission Pill Badge (directly matching the reference image) */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/30 text-xs font-semibold text-white uppercase tracking-wider mb-6 shadow-sm">
          <span className="text-pink-200">Our Mission</span>
          <span className="text-white/40">•</span>
          <span className="text-white">Step by step to fearless mastery: ride with us</span>
        </div>

        {/* Headline */}
        <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black uppercase tracking-tight max-w-5xl mx-auto leading-[1.05] text-white drop-shadow-2xl">
          <span className="text-gradient-fire">
            {settings.heroHeadline && settings.heroHeadline !== 'Experience the Thrill of Well of Death'
              ? settings.heroHeadline
              : 'Well of Death'}
          </span>
        </h1>

        {/* Subheadline (Optional CMS Text) */}
        {settings.heroSubheadline &&
          settings.heroSubheadline !== 'Witness the Courage. Learn the Discipline. Respect the Risk.' && (
            <p className="mt-6 text-base sm:text-xl md:text-2xl text-pink-100/90 font-light max-w-3xl mx-auto leading-relaxed drop-shadow-lg">
              {settings.heroSubheadline}
            </p>
          )}
      </div>

      {/* Hero CTA Buttons Anchored Down at the Bottom */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-4">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto sm:max-w-none">
          <Link
            to="/training"
            className="w-full sm:w-auto px-8 py-4 rounded-full bg-gradient-to-r from-pink-500 via-rose-500 to-fuchsia-500 hover:from-pink-400 hover:to-fuchsia-400 text-white font-extrabold text-sm sm:text-base tracking-wider uppercase shadow-xl shadow-pink-600/40 hover:shadow-pink-500/60 border border-white/25 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 group cursor-pointer"
          >
            <GraduationCap className="w-5 h-5" />
            <span>Apply for Training</span>
            <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
          </Link>

          <Link
            to="/gallery"
            className="w-full sm:w-auto px-8 py-4 rounded-full bg-white/10 backdrop-blur-xl border border-white/30 text-white font-bold text-sm sm:text-base tracking-wider uppercase hover:bg-white/20 hover:border-white transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer"
          >
            <Compass className="w-5 h-5 text-pink-300" />
            <span>Explore Gallery</span>
          </Link>

          <Link
            to="/videos"
            className="w-full sm:w-auto px-8 py-4 rounded-full bg-white/5 backdrop-blur-md border border-white/25 text-pink-100 font-bold text-sm sm:text-base tracking-wider uppercase hover:text-white hover:bg-white/15 hover:border-white/40 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Play className="w-4 h-4 text-pink-300 fill-current" />
            <span>Watch Stunts</span>
          </Link>
        </div>
      </div>
    </section>
  );
};
