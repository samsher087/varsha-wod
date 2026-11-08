import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useSettings } from '../context/SettingsContext';
import {
  Flame,
  Menu,
  X,
  User,
  Shield,
  LogOut,
  ChevronRight,
  GraduationCap,
  Sparkles,
  Phone,
  Zap,
} from 'lucide-react';

export const Navbar = () => {
  const { user, isAdmin, logout } = useAuth();
  const { settings } = useSettings();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About Rider', path: '/about' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Stunt Videos', path: '/videos' },
    { name: 'Training Academy', path: '/training' },
    { name: 'Contact', path: '/contact' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path) => {
    if (path === '/' && location.pathname !== '/') return false;
    return location.pathname.startsWith(path);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300">
      {/* Main Frosted Glass Navbar */}
      <nav className="bg-white/[0.08] backdrop-blur-2xl border-b border-white/15 shadow-xl shadow-pink-950/25">
        <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20 gap-2 sm:gap-4">
            {/* Brand Logo */}
            <Link to="/" className="flex items-center gap-2.5 sm:gap-3 group shrink-0">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-tr from-pink-500 via-rose-500 to-fuchsia-500 p-[2px] transition-transform duration-300 group-hover:scale-105 shadow-lg shadow-pink-500/30 shrink-0">
                <div className="w-full h-full bg-[#240417]/80 backdrop-blur-md rounded-[14px] flex items-center justify-center overflow-hidden p-0.5">
                  <img
                    src={settings.logoUrl || '/images/logo.png'}
                    alt={settings.brandName || 'Well of Death'}
                    className="w-full h-full object-contain filter drop-shadow"
                  />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-base sm:text-lg font-black tracking-wider text-white uppercase whitespace-nowrap group-hover:text-pink-200 transition-colors drop-shadow">
                  {settings.brandName || 'Varsha Rider'}
                </span>
                <p className="text-[9px] sm:text-[10px] text-pink-200/80 uppercase tracking-widest font-semibold whitespace-nowrap hidden sm:block">
                  Well of Death Academy
                </p>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden lg:flex items-center justify-center gap-1 xl:gap-2 px-2 xl:px-4 shrink-0">
              {navLinks.map((link) => {
                const active = isActive(link.path);
                return (
                  <Link
                    key={link.name}
                    to={link.path}
                    className={`px-2.5 xl:px-3.5 py-1.5 xl:py-2 rounded-full text-[11px] xl:text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all duration-200 inline-flex items-center justify-center shrink-0 ${active
                      ? 'text-white bg-white/20 border border-white/35 shadow-sm shadow-pink-500/20'
                      : 'text-pink-100/85 hover:text-white hover:bg-white/10 border border-transparent hover:border-white/20'
                      }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </div>

            {/* Desktop Auth & Primary Action CTA */}
            <div className="hidden lg:flex items-center gap-2.5 xl:gap-3 shrink-0">
              {user ? (
                <div className="flex items-center gap-2 xl:gap-2.5 shrink-0">
                  {isAdmin && (
                    <Link
                      to="/admin"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-full bg-rose-500/15 text-rose-200 border border-rose-500/30 hover:bg-rose-500/25 transition-colors whitespace-nowrap shrink-0"
                    >
                      <Shield className="w-3.5 h-3.5 shrink-0" />
                      <span>Admin Control</span>
                    </Link>
                  )}
                  <Link
                    to="/dashboard"
                    className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-semibold text-white transition-all whitespace-nowrap shrink-0"
                  >
                    <User className="w-3.5 h-3.5 text-pink-300 shrink-0" />
                    <span>{user.name.split(' ')[0]}</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    title="Logout"
                    className="p-2 text-pink-200 hover:text-white rounded-full hover:bg-white/10 transition-colors shrink-0"
                  >
                    <LogOut className="w-4 h-4 shrink-0" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2 xl:gap-3 shrink-0">
                  <Link
                    to="/login"
                    className="px-3 xl:px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider text-pink-100 hover:text-white hover:bg-white/10 transition-colors whitespace-nowrap shrink-0 inline-flex items-center"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/training"
                    className="relative group overflow-hidden px-4 xl:px-5 py-2 xl:py-2.5 rounded-full bg-gradient-to-r from-pink-500 via-rose-500 to-fuchsia-500 hover:from-pink-400 hover:to-fuchsia-400 text-xs xl:text-sm font-bold text-white shadow-lg shadow-pink-600/30 hover:shadow-pink-500/50 border border-white/25 transition-all duration-300 inline-flex items-center gap-1.5 xl:gap-2 whitespace-nowrap shrink-0 active:scale-95"
                  >
                    <GraduationCap className="w-4 h-4 shrink-0" />
                    <span className="whitespace-nowrap">Apply for Training</span>
                    <ChevronRight className="w-4 h-4 shrink-0 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="flex lg:hidden items-center gap-2">
              {user && (
                <Link
                  to="/dashboard"
                  className="p-2 text-pink-300 bg-white/10 rounded-xl border border-white/20"
                >
                  <User className="w-5 h-5" />
                </Link>
              )}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2.5 rounded-xl text-pink-100 hover:text-white hover:bg-white/10 focus:outline-none border border-white/20 transition-colors"
                aria-label="Toggle Navigation Menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-[#240417]/95 border-b border-white/15 px-4 pt-3 pb-6 space-y-2 backdrop-blur-2xl shadow-2xl">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-4 py-2.5 rounded-2xl text-sm font-semibold uppercase tracking-wider transition-colors ${isActive(link.path)
                  ? 'text-white bg-white/20 border border-white/30 font-bold'
                  : 'text-pink-100/80 hover:bg-white/10 hover:text-white'
                  }`}
              >
                {link.name}
              </Link>
            ))}

            <div className="pt-4 border-t border-white/15 space-y-2">
              {user ? (
                <>
                  <Link
                    to="/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white/10 text-white font-medium border border-white/20"
                  >
                    <User className="w-4 h-4 text-pink-300" />
                    Dashboard ({user.name})
                  </Link>
                  {isAdmin && (
                    <Link
                      to="/admin"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-rose-500/15 text-rose-200 border border-rose-500/30 font-medium"
                    >
                      <Shield className="w-4 h-4" />
                      Admin Control Center
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-2 px-4 py-2.5 rounded-2xl text-pink-200 hover:text-white hover:bg-white/10 transition-colors font-medium text-left"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </>
              ) : (
                <div className="grid grid-cols-2 gap-2 pt-2">
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-center py-2.5 rounded-2xl bg-white/10 text-pink-100 font-bold text-xs uppercase tracking-wider hover:bg-white/15 border border-white/20"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/training"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-center py-2.5 rounded-2xl bg-gradient-to-r from-pink-500 via-rose-500 to-fuchsia-500 text-white font-bold text-xs uppercase tracking-wider shadow-md shadow-pink-600/40"
                  >
                    Apply Training
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Marquee Banner Strip (Positioned Just Below Menu) */}
      <div className="bg-white/[0.05] backdrop-blur-xl border-b border-white/15 text-[11px] font-medium text-pink-100 overflow-hidden select-none py-1.5 relative shadow-lg">
        <div className="flex items-center">
          {/* Live Badge */}
          <div className="z-10 bg-[#240417]/90 backdrop-blur-md pl-4 pr-3 flex items-center gap-2 shrink-0 border-r border-white/15">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-pink-500"></span>
            </span>
            <span className="text-[10px] font-black uppercase tracking-wider text-pink-300">Varsha Rider Flash</span>
          </div>

          {/* Marquee Content */}
          <div className="overflow-hidden whitespace-nowrap flex-1">
            <div className="animate-marquee flex items-center gap-8 text-pink-100/90">
              <span className="flex items-center gap-2">
                <span className="text-amber-300 font-bold">⚡ ARENA TOUR 2026:</span> India's Premier Centrifugal Wall of Death Arena
              </span>
              <span className="text-pink-300/40">•</span>
              <span className="flex items-center gap-2">
                <span className="text-pink-300 font-bold">JOIN Training:</span> Register Now for training.
              </span>
              <span className="text-pink-300/40">•</span>
              <span className="flex items-center gap-2">
                <span className="text-rose-300 font-bold">⚡ Varsha Rider:</span> Follow on Instagram @naju_rider_18
              </span>
              <span className="text-pink-300/40">•</span>
              <span className="flex items-center gap-2">
                <span className="text-fuchsia-300 font-bold">INSTAGRAM REELS:</span> New Viral Wall Footage Live On @naju_rider_18
              </span>
              <span className="text-pink-300/40">•</span>
              <span className="flex items-center gap-2">
                <span className="text-rose-300 font-bold">⚡ Varsha Rider:</span> Follow on Instagram @naju_rider_18
              </span>
              <span className="text-pink-300/40">•</span>
              <span className="flex items-center gap-2">
                <span className="text-pink-300 font-bold">88° WALL CLIMB:</span> Pure Gyroscopic Inertia & Physics Mastery
              </span>
              <span className="text-pink-300/40">•</span>
              <span className="flex items-center gap-2">
                <span className="text-rose-300 font-bold">JOIN Training:</span> Register Now for training.
              </span>
              <span className="text-pink-300/40">•</span>
              <span className="flex items-center gap-2">
                <span className="text-fuchsia-300 font-bold">INSTAGRAM REELS:</span> New Viral Wall Footage Live On @naju_rider_18
              </span>
            </div>
          </div>

          {/* Fast Contact Pill on Right (Desktop) */}
          <div className="hidden lg:flex items-center gap-2 px-4 z-10 bg-[#240417]/90 backdrop-blur-md shrink-0 border-l border-white/15">
            <a
              href={`tel:${settings.contactPhone || '+917488405975'}`}
              className="flex items-center gap-1.5 text-xs text-pink-100 hover:text-white transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-pink-300" />
              <span className="font-semibold">{settings.contactPhone || '+91 7488405975'}</span>
            </a>
          </div>
        </div>
      </div>
    </header>
  );
};
