import React from 'react';
import { Link } from 'react-router-dom';
import { useSettings } from '../context/SettingsContext';
import {
  Flame,
  AlertTriangle,
  Mail,
  Phone,
  MapPin,
  ShieldAlert,
} from 'lucide-react';
import { InstagramIcon, YoutubeIcon, FacebookIcon } from './SocialIcons';

export const Footer = () => {
  const { settings } = useSettings();

  return (
    <footer className="bg-transparent border-t border-white/10 text-pink-100/80 pt-16 pb-12 relative overflow-hidden">
      {/* Decorative Rose / Pink Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-24 bg-gradient-to-b from-pink-500/15 via-rose-500/5 to-transparent blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Critical Safety Notice Banner */}
        <div className="mb-12 p-5 sm:p-6 rounded-3xl bg-white/[0.08] backdrop-blur-2xl border border-white/20 hover:border-pink-300/40 card-top-line flex flex-col sm:flex-row items-start sm:items-center gap-4 transition-colors shadow-xl shadow-pink-950/20">
          <div className="p-3 rounded-2xl bg-amber-400/20 text-amber-300 shrink-0 border border-amber-400/30">
            <AlertTriangle className="w-6 h-6 animate-pulse" />
          </div>
          <div className="flex-1">
            <h4 className="text-sm font-bold text-white tracking-wide uppercase flex items-center gap-2">
              Mandatory Safety & Non-Attempt Warning
            </h4>
            <p className="text-xs text-pink-100/80 mt-1 leading-relaxed">
              Well of Death (Maut Ka Kuan) riding requires extreme centrifugal acceleration, custom reinforced motorcycles, and years of physical training.
              Online instructional videos are strictly for theoretical understanding and certified arena student review. Never attempt wall riding independently.
            </p>
          </div>
          <Link
            to="/safety-disclaimer"
            className="shrink-0 text-xs font-semibold px-4 py-2 rounded-full bg-white/15 text-white border border-white/30 hover:bg-white/25 hover:border-white transition-colors whitespace-nowrap"
          >
            Read Protocol
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-pink-500 via-rose-500 to-fuchsia-500 p-[2px] shrink-0 shadow-lg shadow-pink-500/30">
                <div className="w-full h-full bg-[#240417]/80 backdrop-blur-md rounded-[14px] flex items-center justify-center overflow-hidden p-0.5">
                  <img
                    src={settings.logoUrl || '/images/logo.png'}
                    alt={settings.brandName || 'Well of Death'}
                    className="w-full h-full object-contain filter drop-shadow"
                  />
                </div>
              </div>
              <span className="text-base font-black text-white uppercase tracking-wider">
                {settings.brandName || 'Varsha Rider'}
              </span>
            </div>

            <p className="text-xs text-pink-100/70 leading-relaxed">
              India’s pioneer in centrifugal arena wall riding, high-incline motorcycle acrobatics, and professional stunt training.
            </p>

            <div className="flex items-center gap-3 pt-2">
              {settings.socialLinks?.instagram && (
                <a
                  href={settings.socialLinks.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-pink-200 hover:text-white border border-white/20 transition-colors"
                  aria-label="Instagram"
                >
                  <InstagramIcon className="w-4 h-4 text-pink-300" />
                </a>
              )}
              {settings.socialLinks?.youtube && (
                <a
                  href={settings.socialLinks.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-pink-200 hover:text-white border border-white/20 transition-colors"
                  aria-label="YouTube"
                >
                  <YoutubeIcon className="w-4 h-4 text-rose-300" />
                </a>
              )}
              {settings.socialLinks?.facebook && (
                <a
                  href={settings.socialLinks.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-pink-200 hover:text-white border border-white/20 transition-colors"
                  aria-label="Facebook"
                >
                  <FacebookIcon className="w-4 h-4 text-pink-300" />
                </a>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-l-2 border-cyan-400 pl-2.5">
              Explore Portal
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/" className="hover:text-cyan-400 transition-colors">
                  Home Overview
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-cyan-400 transition-colors">
                  Rider Bio & Physics of Well
                </Link>
              </li>
              <li>
                <Link to="/gallery" className="hover:text-cyan-400 transition-colors">
                  High-Octane Photo Gallery
                </Link>
              </li>
              <li>
                <Link to="/videos" className="hover:text-cyan-400 transition-colors">
                  Public Stunt Performance Reels
                </Link>
              </li>
              <li>
                <Link to="/training" className="hover:text-cyan-400 transition-colors text-cyan-400 font-semibold">
                  Training Academy Curriculum
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-cyan-400 transition-colors">
                  Event Bookings & Inquiries
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal & Compliance */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-l-2 border-teal-400 pl-2.5">
              Safety & Policies
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/safety-disclaimer" className="text-slate-300 hover:text-cyan-300 transition-colors flex items-center gap-1.5 font-medium">
                  <ShieldAlert className="w-3.5 h-3.5 text-cyan-400" />
                  Safety & Risk Waiver
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-cyan-400 transition-colors">
                  Terms of Service & Rules
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-cyan-400 transition-colors">
                  Privacy & Data Security
                </Link>
              </li>
              <li>
                <Link to="/refund-policy" className="hover:text-cyan-400 transition-colors">
                  Fee & Refund Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Headquarters & Booking */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-l-2 border-amber-400 pl-2.5">
              Address
            </h4>
            <ul className="space-y-3 text-xs">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <span className="leading-relaxed">
                  {settings.headquartersAddress || 'Kanijari, Mandar Ranchi, Jharkhand'}
                </span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                <a href={`tel:${settings.contactPhone || '+917488405975'}`} className="hover:text-white transition-colors">
                  {settings.contactPhone || '+91 7488405975'}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-teal-400 shrink-0" />
                <a href={`mailto:${settings.contactEmail}`} className="hover:text-white transition-colors">
                  {settings.contactEmail || 'contact@samsher-wod.com'}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>
            © {new Date().getFullYear()} {settings.brandName || 'Varsha Rider'}. All rights reserved. Professional Well of Death Stunts.
          </p>
          <p className="flex items-center gap-1.5 text-slate-400">
            Varsha Rider | Fearless Since 2016.
          </p>
        </div>
      </div>
    </footer>
  );
};
