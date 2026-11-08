import React from 'react';
import { Link } from 'react-router-dom';
import { useSettings } from '../context/SettingsContext';
import { InstagramIcon, FacebookIcon, InstagramColorIcon, FacebookColorIcon } from '../components/SocialIcons';
import {
  Flame,
  Award,
  ShieldCheck,
  Zap,
  Activity,
  Compass,
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
} from 'lucide-react';

export const AboutPage = () => {
  const { settings } = useSettings();




  return (
    <div className="bg-transparent min-h-screen pt-36 pb-24 text-rose-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="w-full mb-16 text-center flex justify-center">
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white uppercase tracking-tight whitespace-nowrap text-center">
            The Master of <span className="text-gradient-fire">Well Of Death</span>
          </h1>
        </div>

        {/* Hero Bio Banner */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white/[0.08] backdrop-blur-2xl border border-white/20 mb-16 shadow-2xl shadow-pink-950/30 relative overflow-hidden card-top-line max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex flex-col items-center">
                <h2 className="text-2xl sm:text-4xl font-black text-white uppercase tracking-tight text-center">
                  <span>Varsha Rider</span>{' '}
                  <span className="text-pink-300/40 font-light mx-1">|</span>{' '}
                  <span className="text-gradient-fire">Since 2016</span>
                </h2>
                <div className="flex items-center justify-center gap-2 mt-2 w-full">
                  <span className="w-8 h-0.5 bg-gradient-to-r from-transparent to-pink-400 rounded-full" />
                  <p className="text-xs sm:text-sm font-bold text-pink-300 uppercase tracking-widest text-center">
                    The Journey of Fearlessness
                  </p>
                  <span className="w-8 h-0.5 bg-gradient-to-l from-transparent to-pink-400 rounded-full" />
                </div>
              </div>

              <div className="space-y-2.5 text-xs sm:text-sm text-pink-100/90 leading-relaxed text-left [text-wrap:pretty]">
                <p>
                  Welcome to the world of Varsha Rider — where courage meets passion and every ride is a test of skill, balance, and fearless determination.
                </p>
                <p>
                  Since 2016, I have been pursuing my passion for Well of Death (Maut Ka Kuan) riding, a thrilling and traditional Indian stunt performance that demands extraordinary focus, precision, and confidence. Riding on nearly vertical wooden walls, I aim to entertain audiences and keep this incredible form of entertainment alive.
                </p>
                <p>
                  For me, riding is more than just a performance — it's a journey built on dedication, hard work, and the courage to push beyond limits.
                </p>
                <p>
                  Through this website, I invite you to explore my journey, watch exciting riding videos, discover memorable moments from live shows, and experience the thrill of the Well of Death.
                </p>
              </div>

              {/* Social Media Links & Signature Motto */}
              <div className="pt-3 pb-1 flex flex-col items-center justify-center gap-3 border-t border-slate-800/80 text-center w-full">
                <div className="flex items-center justify-center gap-2">
                  <span className="w-8 h-0.5 bg-gradient-to-r from-transparent to-cyan-400 rounded-full shrink-0" />
                  <p className="text-xs sm:text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400 tracking-wider uppercase text-center">
                    My Journey. My Passion. My Identity.
                  </p>
                  <span className="w-8 h-0.5 bg-gradient-to-l from-transparent to-cyan-400 rounded-full shrink-0" />
                </div>

                <div className="flex items-center justify-center gap-2.5 flex-wrap">
                  <a
                    href="https://www.instagram.com/naju_rider_18/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-pink-500/15 via-rose-500/15 to-purple-500/15 hover:from-pink-500/25 hover:to-purple-500/25 border border-pink-500/35 hover:border-pink-500/70 text-pink-200 hover:text-white text-xs font-bold transition-all duration-200 hover:-translate-y-0.5 shadow-md shadow-pink-950/20"
                    title="Follow Varsha Rider on Instagram"
                  >
                    <InstagramColorIcon className="w-4 h-4 shrink-0 shadow-sm" />
                    <span>Varsha Rider</span>
                  </a>
                  <a
                    href="https://www.facebook.com/najurider18"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-600/15 hover:bg-blue-600/25 border border-blue-500/35 hover:border-blue-500/70 text-blue-200 hover:text-white text-xs font-bold transition-all duration-200 hover:-translate-y-0.5 shadow-md shadow-blue-950/20"
                    title="Follow Varsha Rider on Facebook"
                  >
                    <FacebookColorIcon className="w-4 h-4 shrink-0 shadow-sm" />
                    <span>Varsha Rider</span>
                  </a>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 pt-3 border-t border-slate-800 text-center">
                <div>
                  <span className="text-xl sm:text-2xl font-black text-cyan-300 block">
                    {settings.statsYearsExperience}+
                  </span>
                  <span className="text-[11px] text-slate-400 font-semibold uppercase">Years Riding</span>
                </div>
                <div>
                  <span className="text-xl sm:text-2xl font-black text-teal-300 block">
                    {settings.statsArenaShows}+
                  </span>
                  <span className="text-[11px] text-slate-400 font-semibold uppercase">Shows Executed</span>
                </div>
                <div>
                  <span className="text-xl sm:text-2xl font-black text-emerald-400 block">
                    100%
                  </span>
                  <span className="text-[11px] text-emerald-400 font-semibold uppercase">Safety Record</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 flex justify-center items-center">
              <div className="relative rounded-2xl overflow-hidden border border-white/20 aspect-[4/5] max-h-[420px] w-full max-w-[340px] bg-slate-950/60 shadow-2xl card-top-line">
                <img
                  src="/images/gallery/varsha_rider_viral_bullet.jpg"
                  alt="Varsha Rider Portrait"
                  className="w-full h-full object-cover object-top"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#240417]/90 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-3 right-3 text-center">
                  <span className="text-xs text-pink-200 font-semibold tracking-wide">
                    Viral Girl Varsha Rider - Ranchi Ki Shaan
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>



        {/* Safety Protocols & Ethics Statement */}
        <div className="p-8 sm:p-10 rounded-3xl bg-slate-900/90 backdrop-blur-xl border border-slate-800 hover:border-cyan-500/40 card-top-line transition-colors">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="p-4 rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 shrink-0">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <div className="space-y-2 flex-1">
              <h3 className="text-xl font-bold text-white uppercase tracking-wide">
                Rigorous Safety Culture & Inspection Standard
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Before every single launch, our crew performs a 42-point arena check: tightening steel tension rings, testing plank deflection, verifying motorcycle spoke tension, and inspecting tire durometer levels. We train our students to put life and discipline first.
              </p>
            </div>
            <Link
              to="/training"
              className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-cyan-600 via-teal-600 to-emerald-500 hover:from-cyan-500 hover:to-emerald-400 text-white font-bold text-sm uppercase tracking-wider shadow-lg shadow-cyan-950/50 shrink-0 flex items-center gap-2"
            >
              <span>Join Training</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
