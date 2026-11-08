import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useSettings } from '../context/SettingsContext';
import { apiClient } from '../api/client';
import {
  GraduationCap,
  ShieldAlert,
  CheckCircle2,
  Lock,
  Unlock,
  Play,
  Pause,
  Volume2,
  VolumeX,
  ArrowRight,
  Clock,
  Sparkles,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  Zap,
  RotateCcw,
  X,
  AlertTriangle,
  Award,
  Video,
} from 'lucide-react';

export const TrainingPage = () => {
  const { user, isAdmin } = useAuth();
  const { settings } = useSettings();
  const navigate = useNavigate();

  const [courseInfo, setCourseInfo] = useState(null);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [activeLesson, setActiveLesson] = useState(null);
  const [openModuleIndex, setOpenModuleIndex] = useState(0);

  // Video Player state
  const videoRef = useRef(null);
  const playerSectionRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [progress, setProgress] = useState(0);
  const [currentTimeStr, setCurrentTimeStr] = useState('0:00');
  const [durationStr, setDurationStr] = useState('0:00');

  // Locked Lesson Modal state
  const [lockedModalLesson, setLockedModalLesson] = useState(null);
  const [togglingSub, setTogglingSub] = useState(false);
  const [subToast, setSubToast] = useState('');

  const fetchOverview = async () => {
    try {
      const res = await apiClient.get('/courses/public-overview');
      if (res?.course) {
        setCourseInfo(res.course);
        const userSubscribed = Boolean(res.isSubscribedUser || isAdmin);
        setIsSubscribed(userSubscribed);

        // Flatten all lessons to find current or default
        const allLessons = [];
        res.course.modules?.forEach((m) => {
          m.lessons?.forEach((l) => {
            const isLocked = !userSubscribed && !l.isPreview;
            allLessons.push({ ...l, isLocked, moduleTitle: m.title });
          });
        });

        // Set default active lesson to first preview lesson or keep current
        setActiveLesson((prev) => {
          if (prev) {
            const found = allLessons.find((l) => l._id === prev._id);
            if (found) return found;
          }
          const firstPreview = allLessons.find((l) => l.isPreview) || allLessons[0];
          return firstPreview || null;
        });
      }
    } catch (err) {
      console.warn('Failed to load course overview:', err);
    }
  };

  useEffect(() => {
    fetchOverview();
  }, [user, isAdmin]);

  // Video playback timeupdate handlers
  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const current = videoRef.current.currentTime;
    const dur = videoRef.current.duration || 0;
    if (dur > 0) {
      setProgress((current / dur) * 100);
      setCurrentTimeStr(formatTime(current));
      setDurationStr(formatTime(dur));
    }
  };

  const formatTime = (secs) => {
    if (isNaN(secs) || secs === Infinity) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !videoRef.current.muted;
    setIsMuted(videoRef.current.muted);
  };

  const handleSeek = (e) => {
    if (!videoRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    const target = pos * (videoRef.current.duration || 0);
    videoRef.current.currentTime = target;
  };

  const handleSelectLesson = (lesson, moduleTitle = '') => {
    const isLocked = !isSubscribed && !lesson.isPreview;
    const fullLesson = { ...lesson, isLocked, moduleTitle: moduleTitle || lesson.moduleTitle };
    setActiveLesson(fullLesson);

    // Scroll to player smoothly
    if (playerSectionRef.current) {
      playerSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    if (fullLesson.isLocked) {
      setLockedModalLesson(fullLesson);
    } else {
      setIsPlaying(true);
    }
  };

  const handleApplyClick = () => {
    if (user) {
      navigate('/dashboard?tab=apply');
    } else {
      navigate('/register?redirect=/dashboard?tab=apply');
    }
  };

  // Demo toggle for testing subscription state
  const handleToggleTestSubscription = async () => {
    if (!user) {
      navigate('/login?redirect=/academy');
      return;
    }
    try {
      setTogglingSub(true);
      const res = await apiClient.post('/applications/toggle-test-subscription');
      if (res?.success) {
        setSubToast(
          res.isUnlocked
            ? '🎉 Trainee Subscription Activated! All Masterclass videos are now UNLOCKED.'
            : '🔒 Subscription status reset. Training videos are now locked.'
        );
        await fetchOverview();
        setTimeout(() => setSubToast(''), 4500);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setTogglingSub(false);
    }
  };

  // Find active module for active lesson
  const activeModule = courseInfo?.modules?.find((m) =>
    m.lessons?.some((l) => l._id === activeLesson?._id)
  );

  return (
    <div className="bg-transparent min-h-screen pt-32 pb-24 text-rose-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-5xl mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 border border-white/30 text-pink-200 text-xs font-bold uppercase tracking-wider mb-4">
            <GraduationCap className="w-4 h-4 text-pink-300" />
            Official Stunt Certification Portal
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white uppercase tracking-tight sm:whitespace-nowrap">
            Well of Death <span className="text-gradient-fire">Training Academy</span>
          </h1>
          <p className="mt-4 text-base text-pink-100/80 leading-relaxed max-w-3xl">
            The world's first structured academic curriculum on centrifugal wall riding, custom stunt motorcycle engineering, and supervised arena launch mechanics.
          </p>
        </div>

        {/* Pricing & Enrollment Card */}
        <div className="p-8 sm:p-10 rounded-3xl bg-white/[0.08] backdrop-blur-2xl border border-white/20 hover:border-pink-300/40 mb-14 shadow-2xl shadow-pink-950/30 flex flex-col lg:flex-row items-center justify-between gap-8 card-top-line transition-colors">
          <div className="space-y-3">
            <span className="text-xs font-bold text-pink-300 uppercase tracking-widest block">
              Official Program Tuition
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white">
              <span className="text-cyan-300">₹{(settings.trainingFee || 4999).toLocaleString('en-IN')}</span>{' '}
              <span className="text-sm font-normal text-slate-400">/ Complete Curriculum</span>
            </h2>
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400">
              <span className="flex items-center gap-1.5 text-slate-300">
                <Clock className="w-4 h-4 text-cyan-400" />
                8-Week Course Duration
              </span>
              <span className="flex items-center gap-1.5 text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Admin Background Vetting
              </span>
              <span className="flex items-center gap-1.5 text-slate-300">
                <Sparkles className="w-4 h-4 text-amber-400" />
                Certificate of Theory Completion
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
            {/* Demo Mode Toggle Button */}
            {user && (
              <button
                type="button"
                onClick={handleToggleTestSubscription}
                disabled={togglingSub}
                className="w-full sm:w-auto px-5 py-4 rounded-full bg-white/10 hover:bg-white/15 border border-white/20 text-xs font-bold text-amber-300 uppercase tracking-wider transition-all flex items-center justify-center gap-2"
                title="Test unlocking video lessons without payment"
              >
                <Zap className="w-4 h-4 text-amber-400" />
                <span>
                  {togglingSub
                    ? 'Updating...'
                    : isSubscribed
                      ? 'Trainee Active (Demo)'
                      : 'Simulate Subscription'}
                </span>
              </button>
            )}

            <button
              onClick={handleApplyClick}
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-gradient-to-r from-pink-500 via-rose-500 to-fuchsia-500 hover:from-pink-400 hover:to-fuchsia-400 text-white font-extrabold text-sm uppercase tracking-wider shadow-xl shadow-pink-600/40 hover:shadow-pink-500/60 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 border border-white/25"
            >
              <span>{user ? 'Open Training Application' : 'Register & Apply for Training'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Subscription Toast Notification */}
        {subToast && (
          <div className="mb-8 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-sm font-semibold flex items-center justify-between animate-in fade-in slide-in-from-top-2">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <span>{subToast}</span>
            </div>
            <button onClick={() => setSubToast('')} className="p-1 text-emerald-400 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* ========================================================================= */}
        {/* MASTERCLASS VIDEO PLAYER THEATER (Interactive Video Demonstration)        */}
        {/* ========================================================================= */}
        <div ref={playerSectionRef} className="mb-16 scroll-mt-28">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-bold text-cyan-400 uppercase tracking-widest mb-1.5">
                <Video className="w-4 h-4 text-cyan-400" />
                Academy Video Masterclass Portal
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
                Training Masterclass <span className="text-gradient-fire">Video Theater</span>
              </h2>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20 text-xs shadow-sm">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-pink-100/90 font-medium">
                  {isSubscribed ? (
                    <strong className="text-emerald-400">Subscription Active (All Videos Unlocked)</strong>
                  ) : (
                    <span>Free Preview Available • Advanced Lessons Locked</span>
                  )}
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-white/[0.08] backdrop-blur-2xl border border-white/20 rounded-3xl p-4 sm:p-6 shadow-2xl card-top-line">
            {/* Left 8 Cols: Video Screen / Lock Screen */}
            <div className="lg:col-span-8 flex flex-col justify-between">
              <div className="relative aspect-video rounded-2xl overflow-hidden bg-black border border-slate-800 shadow-inner group">
                {activeLesson?.isLocked ? (
                  /* ================= LOCKED VIDEO PAYWALL SCREEN ================= */
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-gradient-to-br from-slate-950 via-slate-900 to-rose-950/40 z-20 overflow-y-auto">
                    {/* Glowing Lock Badge */}
                    <div className="relative mb-4">
                      <div className="absolute -inset-3 rounded-full bg-rose-500/20 blur-xl animate-pulse" />
                      <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500/20 to-rose-500/20 border border-rose-500/40 text-rose-400 flex items-center justify-center shadow-2xl">
                        <Lock className="w-8 h-8" />
                      </div>
                    </div>

                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-300 text-[11px] font-black uppercase tracking-widest mb-2">
                      <Lock className="w-3 h-3 text-rose-400" />
                      Subscription Required • Trainee Only
                    </div>

                    <h3 className="text-lg sm:text-xl font-black text-white uppercase tracking-tight max-w-md">
                      {activeLesson?.title || 'Advanced Stunt Training Video'}
                    </h3>

                    <p className="text-xs text-slate-400 max-w-md mt-2 leading-relaxed">
                      This video contains proprietary high-wall mechanics, carburetor jetting formulas, and emergency recovery drills.
                      <strong className="text-slate-200"> Only enrolled Academy trainees with an active subscription</strong> can watch this training video.
                    </p>

                    {/* Subscription Benefit Pills */}
                    <div className="flex flex-wrap items-center justify-center gap-2 mt-4 text-[11px] text-slate-300">
                      <span className="px-2.5 py-1 rounded-md bg-slate-800/80 border border-slate-700/80 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" /> 8-Week Curriculum (12+ Hours)
                      </span>
                      <span className="px-2.5 py-1 rounded-md bg-slate-800/80 border border-slate-700/80 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Supervised Arena Practice
                      </span>
                      <span className="px-2.5 py-1 rounded-md bg-slate-800/80 border border-slate-700/80 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Theory Certification
                      </span>
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-5 flex flex-wrap items-center justify-center gap-3 w-full">
                      <button
                        type="button"
                        onClick={handleApplyClick}
                        className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 via-teal-600 to-emerald-500 hover:from-cyan-500 hover:to-emerald-400 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-cyan-950/60 hover:scale-105 transition-all flex items-center gap-1.5 cursor-pointer"
                      >
                        <Unlock className="w-3.5 h-3.5" />
                        <span>Subscribe & Unlock All Videos (₹{(settings.trainingFee || 4999).toLocaleString('en-IN')})</span>
                      </button>

                      {/* Switch to Free Preview */}
                      <button
                        type="button"
                        onClick={() => {
                          const previewLesson = courseInfo?.modules?.[0]?.lessons?.[0];
                          if (previewLesson) {
                            handleSelectLesson(previewLesson, courseInfo.modules[0].title);
                          }
                        }}
                        className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-bold text-xs uppercase tracking-wider transition-colors flex items-center gap-1.5 cursor-pointer"
                      >
                        <Play className="w-3.5 h-3.5 text-cyan-400 fill-current" />
                        <span>Watch Free Preview (Lesson 1.1)</span>
                      </button>

                      {/* Instant Test Mode for logged-in users */}
                      {user && (
                        <button
                          type="button"
                          onClick={handleToggleTestSubscription}
                          className="px-3.5 py-2.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-semibold transition-colors flex items-center gap-1"
                          title="Simulate student payment to test unlocked video playback"
                        >
                          <Zap className="w-3 h-3 text-amber-400" />
                          <span>Simulate Subscription Access (Demo)</span>
                        </button>
                      )}
                    </div>
                  </div>
                ) : (
                  /* ================= UNLOCKED / PREVIEW VIDEO PLAYER ================= */
                  <div className="relative w-full h-full bg-slate-950 flex items-center justify-center">
                    <video
                      ref={videoRef}
                      src={activeLesson?.videoUrl || '/videos/stunt_wod_solo_wall.mp4'}
                      className="w-full h-full object-cover cursor-pointer"
                      autoPlay
                      playsInline
                      muted={isMuted}
                      loop
                      onTimeUpdate={handleTimeUpdate}
                      onClick={togglePlay}
                    />

                    {/* Unmute / Sound Pill Overlay */}
                    <div className="absolute top-3 left-3 z-20">
                      <button
                        type="button"
                        onClick={toggleMute}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold backdrop-blur-md transition-all shadow-lg ${isMuted
                          ? 'bg-amber-500/90 hover:bg-amber-500 text-slate-950 animate-bounce'
                          : 'bg-slate-900/80 hover:bg-slate-900 text-cyan-400 border border-cyan-500/40'
                          }`}
                      >
                        {isMuted ? (
                          <>
                            <VolumeX className="w-4 h-4" />
                            <span>Click to Unmute Sound</span>
                          </>
                        ) : (
                          <>
                            <Volume2 className="w-4 h-4" />
                            <span>Audio On</span>
                          </>
                        )}
                      </button>
                    </div>

                    {/* Badge Overlay */}
                    <div className="absolute top-3 right-3 z-20">
                      {activeLesson?.isPreview ? (
                        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/20 backdrop-blur-md border border-cyan-500/40 text-cyan-300 text-xs font-bold uppercase tracking-wider">
                          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                          <span>Free Preview Lesson</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 backdrop-blur-md border border-emerald-500/40 text-emerald-300 text-xs font-bold uppercase tracking-wider">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Subscribed Trainee Unlocked</span>
                        </div>
                      )}
                    </div>

                    {/* Floating Center Play/Pause indicator on click */}
                    <button
                      type="button"
                      onClick={togglePlay}
                      className="absolute inset-0 flex items-center justify-center bg-black/20 hover:bg-black/10 transition-colors cursor-pointer group/overlay"
                    >
                      <div className="w-14 h-14 rounded-full bg-slate-950/70 backdrop-blur-md border border-slate-700/80 flex items-center justify-center text-white opacity-0 group-hover/overlay:opacity-100 transition-opacity">
                        {isPlaying ? (
                          <Pause className="w-6 h-6 fill-white" />
                        ) : (
                          <Play className="w-6 h-6 fill-white ml-0.5" />
                        )}
                      </div>
                    </button>

                    {/* Bottom Controls Bar */}
                    <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent p-4 z-20">
                      {/* Scrubber */}
                      <div
                        onClick={handleSeek}
                        className="w-full h-1.5 bg-slate-800 hover:h-2.5 rounded-full cursor-pointer relative overflow-hidden transition-all mb-3"
                      >
                        <div
                          className="h-full bg-gradient-to-r from-cyan-500 to-emerald-400 transition-all"
                          style={{ width: `${progress}%` }}
                        />
                      </div>

                      <div className="flex items-center justify-between text-xs text-slate-300">
                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            onClick={togglePlay}
                            className="p-1 rounded-lg hover:bg-slate-800 text-slate-200 transition-colors"
                          >
                            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
                          </button>

                          <button
                            type="button"
                            onClick={toggleMute}
                            className="p-1 rounded-lg hover:bg-slate-800 text-slate-200 transition-colors"
                          >
                            {isMuted ? <VolumeX className="w-4 h-4 text-amber-400" /> : <Volume2 className="w-4 h-4 text-cyan-400" />}
                          </button>

                          <span className="font-mono text-[11px] text-slate-400">
                            {currentTimeStr} / {durationStr || activeLesson?.duration || '18:00'}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-semibold text-slate-400 truncate max-w-[200px] sm:max-w-xs">
                            {activeLesson?.title}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Lesson Metadata Below Player */}
              <div className="mt-4 pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="font-bold text-cyan-400 uppercase tracking-wider">
                      {activeLesson?.moduleTitle || 'Module 1'}
                    </span>
                    <span className="text-slate-600">•</span>
                    <span className="text-slate-400 flex items-center gap-1 font-mono">
                      <Clock className="w-3 h-3 text-slate-500" />
                      {activeLesson?.duration || '18 mins'}
                    </span>
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-white mt-1">
                    {activeLesson?.title || 'Select a lesson to begin'}
                  </h3>
                  {activeLesson?.description && (
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                      {activeLesson.description}
                    </p>
                  )}
                  {activeLesson?.safetyNotice && (
                    <div className="mt-2 text-[11px] text-amber-400/90 flex items-center gap-1.5">
                      <ShieldAlert className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span>{activeLesson.safetyNotice}</span>
                    </div>
                  )}
                </div>

                {activeLesson?.isLocked && (
                  <button
                    type="button"
                    onClick={handleApplyClick}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-400 hover:to-rose-400 text-white font-extrabold text-xs uppercase tracking-wider shadow-md shrink-0 flex items-center gap-1.5 transition-all self-start sm:self-auto cursor-pointer"
                  >
                    <Lock className="w-3.5 h-3.5" />
                    <span>Unlock Video</span>
                  </button>
                )}
              </div>
            </div>

            {/* Right 4 Cols: Quick Playlist / Lesson Selector */}
            <div className="lg:col-span-4 flex flex-col bg-white/[0.04] backdrop-blur-md rounded-2xl p-4 border border-white/15">
              <div className="flex items-center justify-between pb-3 border-b border-white/15 mb-3">
                <span className="text-xs font-bold text-white uppercase tracking-wider">
                  Masterclass Playlist
                </span>
                <span className="text-[11px] text-pink-300 font-bold">
                  {isSubscribed ? '8/8 Lessons Unlocked' : '1 Preview • 7 Locked'}
                </span>
              </div>

              <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
                {courseInfo?.modules?.map((mod, modIdx) => (
                  <div key={mod._id || modIdx} className="space-y-1.5 mb-3">
                    <span className="text-[10px] font-bold text-pink-200/60 uppercase tracking-wider px-2 block">
                      Module {modIdx + 1}: {mod.title}
                    </span>
                    {mod.lessons?.map((les) => {
                      const isActive = activeLesson?._id === les._id;
                      return (
                        <div
                          key={les._id}
                          onClick={() => handleSelectLesson({ ...les, isLocked: !isSubscribed && !les.isPreview }, mod.title)}
                          className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all flex items-start gap-2.5 ${isActive
                            ? 'bg-white/20 border-pink-400/60 shadow-lg shadow-pink-950/40 ring-1 ring-pink-500/30'
                            : 'bg-white/[0.03] border-white/10 hover:bg-white/10 hover:border-white/20'
                            }`}
                        >
                          <div
                            className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${les.isLocked
                              ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                              : 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'
                              }`}
                          >
                            {les.isLocked ? (
                              <Lock className="w-3.5 h-3.5" />
                            ) : (
                              <Play className="w-3.5 h-3.5 fill-current" />
                            )}
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-1">
                              <h4
                                className={`text-xs font-bold truncate ${isActive ? 'text-cyan-300' : 'text-slate-200'
                                  }`}
                              >
                                {les.title}
                              </h4>
                            </div>

                            <div className="flex items-center justify-between mt-1 text-[10px]">
                              <span className="text-slate-400 font-mono">{les.duration}</span>
                              {les.isLocked ? (
                                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20 uppercase">
                                  Locked (Paid)
                                </span>
                              ) : (
                                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase">
                                  {les.isPreview ? 'Free Preview' : 'Unlocked'}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Prerequisites & Outcomes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <div className="p-8 rounded-3xl bg-white/[0.08] backdrop-blur-2xl border border-white/20 hover:border-pink-300/40 shadow-xl shadow-pink-950/20 card-top-line transition-all">
            <h3 className="text-lg font-bold text-white uppercase tracking-wider mb-4 border-l-2 border-pink-400 pl-3">
              Candidate Prerequisites
            </h3>
            <ul className="space-y-3 text-xs sm:text-sm text-pink-100/90 font-medium">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-pink-300 shrink-0 mt-0.5" />
                <span>Minimum 18 years of age with government photo identification</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-pink-300 shrink-0 mt-0.5" />
                <span>At least 2 years of manual motorcycle street / dirt riding experience</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-pink-300 shrink-0 mt-0.5" />
                <span>Comprehensive medical fitness declaration & zero history of untreated vestibular vertigo</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-pink-300 shrink-0 mt-0.5" />
                <span>Signed legal acceptance of safety waiver and emergency contact authorization</span>
              </li>
            </ul>
          </div>

          <div className="p-8 rounded-3xl bg-white/[0.08] backdrop-blur-2xl border border-white/20 hover:border-pink-300/40 shadow-xl shadow-pink-950/20 card-top-line transition-all">
            <h3 className="text-lg font-bold text-white uppercase tracking-wider mb-4 border-l-2 border-rose-400 pl-3">
              What You Will Learn
            </h3>
            <ul className="space-y-3 text-xs sm:text-sm text-pink-100/90 font-medium">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Mathematical equations of centripetal force vs vertical wall friction</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Motorcycle mechanical prep: carburetor jetting, tire PSI, and chassis stiffening</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Entry angle trajectory launch and steady orbital throttle control</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Emergency engine cutoff glide down and fail-safe safety recovery</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Curriculum Modules Accordion */}
        <div className="mb-16">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-2xl sm:text-4xl font-black text-white uppercase tracking-tight">
              Curriculum <span className="text-gradient-fire">Syllabus Breakdown</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-2">
              Videos are protected and unlocked sequentially following admin approval and verified tuition payment.
            </p>
          </div>

          {courseInfo?.modules && (
            <div className="space-y-4 max-w-4xl mx-auto">
              {courseInfo.modules.map((mod, idx) => {
                const isOpen = openModuleIndex === idx;
                return (
                  <div
                    key={mod._id || idx}
                    className="rounded-3xl bg-white/[0.08] backdrop-blur-2xl border border-white/20 hover:border-pink-300/40 overflow-hidden shadow-xl shadow-pink-950/20 transition-all card-top-line"
                  >
                    <button
                      onClick={() => setOpenModuleIndex(isOpen ? -1 : idx)}
                      className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 hover:bg-white/10 transition-colors"
                    >
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[11px] font-bold text-pink-300 uppercase tracking-wider">
                            Module {idx + 1}
                          </span>
                          <span className="text-xs text-pink-200/60">• {mod.lessonCount} Lessons</span>
                        </div>
                        <h3 className="text-base sm:text-lg font-bold text-white">{mod.title}</h3>
                        <p className="text-xs text-pink-100/80 mt-1 font-medium">{mod.description}</p>
                      </div>

                      <div className="p-2 rounded-xl bg-white/10 text-pink-200 border border-white/20 shrink-0">
                        {isOpen ? <ChevronUp className="w-5 h-5 text-pink-300" /> : <ChevronDown className="w-5 h-5" />}
                      </div>
                    </button>

                    {isOpen && (
                      <div className="px-5 sm:px-6 pb-6 pt-2 border-t border-white/15 space-y-3">
                        {mod.lessons.map((les) => {
                          const isCurrentActive = activeLesson?._id === les._id;
                          return (
                            <div
                              key={les._id}
                              onClick={() => handleSelectLesson(les, mod.title)}
                              className={`p-4 rounded-2xl border flex items-center justify-between gap-4 cursor-pointer transition-all ${isCurrentActive
                                ? 'bg-white/20 border-pink-400/60 ring-1 ring-pink-500/30 shadow-md shadow-pink-500/20'
                                : 'bg-white/[0.04] border-white/10 hover:border-white/25 hover:bg-white/10'
                                }`}
                            >
                              <div className="flex items-center gap-3">
                                <div
                                  className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${les.isLocked
                                    ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                                    : 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'
                                    }`}
                                >
                                  {les.isLocked ? (
                                    <Lock className="w-3.5 h-3.5" />
                                  ) : (
                                    <Play className="w-3.5 h-3.5 fill-current" />
                                  )}
                                </div>
                                <div>
                                  <h4 className="text-xs sm:text-sm font-semibold text-white flex items-center gap-2">
                                    <span>{les.title}</span>
                                    {isCurrentActive && (
                                      <span className="text-[10px] font-black text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-full border border-cyan-500/30 uppercase">
                                        Now Playing
                                      </span>
                                    )}
                                  </h4>
                                  <span className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
                                    <span>{les.duration}</span>
                                    {les.isPreview && (
                                      <span className="text-[10px] text-cyan-400 font-bold uppercase">
                                        Free Preview
                                      </span>
                                    )}
                                  </span>
                                </div>
                              </div>

                              <div className="flex items-center gap-2">
                                <span
                                  className={`text-[11px] font-bold px-2.5 py-1 rounded border whitespace-nowrap ${les.isLocked
                                    ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                                    : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                                    }`}
                                >
                                  {les.isLocked ? 'Locked (Paid)' : les.isPreview ? 'Free Preview' : 'Unlocked'}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Bottom CTA */}
        <div className="text-center p-8 sm:p-10 rounded-3xl bg-white/[0.08] backdrop-blur-2xl border border-white/20 hover:border-pink-300/40 shadow-xl shadow-pink-950/20 card-top-line transition-all">
          <h3 className="text-2xl font-black text-white uppercase tracking-tight">Ready to Begin Your Training?</h3>
          <p className="text-xs sm:text-sm text-pink-100/80 mt-2 max-w-lg mx-auto font-medium">
            Submit your background application and safety waiver. Our team will review your credentials within 24 hours.
          </p>
          <div className="mt-6">
            <button
              onClick={handleApplyClick}
              className="px-8 py-3.5 rounded-full bg-gradient-to-r from-pink-500 via-rose-500 to-fuchsia-500 hover:from-pink-400 hover:to-fuchsia-400 text-white font-bold text-sm uppercase tracking-wider shadow-lg shadow-pink-600/40 hover:shadow-pink-500/60 hover:scale-[1.02] active:scale-[0.98] transition-all inline-flex items-center gap-2 border border-white/25"
            >
              <span>{user ? 'Open Training Application' : 'Create Account & Apply'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* LOCKED VIDEO SUBSCRIPTION MODAL (Opens when clicking locked lessons)      */}
      {/* ========================================================================= */}
      {lockedModalLesson && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-lg rounded-3xl bg-[#240417]/95 border border-white/20 shadow-2xl p-6 sm:p-8 card-top-line backdrop-blur-2xl">
            <button
              type="button"
              onClick={() => setLockedModalLesson(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/10 text-pink-200 hover:text-white transition-colors border border-white/15"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-pink-500/20 to-rose-500/20 border border-pink-500/40 text-pink-400 flex items-center justify-center mx-auto mb-4 shadow-xl">
                <Lock className="w-8 h-8" />
              </div>

              <span className="text-[11px] font-black uppercase tracking-widest text-pink-300 px-3 py-1 rounded-full bg-pink-500/10 border border-pink-500/30 inline-block mb-2">
                Locked Training Video
              </span>

              <h3 className="text-xl font-black text-white uppercase tracking-tight">
                Subscription Access Required
              </h3>

              <p className="text-xs sm:text-sm text-pink-200 font-semibold mt-1">
                "{lockedModalLesson.title}"
              </p>

              <p className="text-xs text-pink-100/70 mt-3 leading-relaxed">
                This comprehensive stunt training video is reserved exclusively for enrolled Academy trainees. Non-subscribers cannot view internal throttle curves, tire PSI calculations, or live wall bailouts.
              </p>

              <div className="my-5 p-4 rounded-2xl bg-white/[0.06] border border-white/15 text-left space-y-2">
                <span className="text-[11px] font-bold text-pink-300 uppercase tracking-wider block">
                  Included in Full Academy Subscription:
                </span>
                <ul className="text-xs text-pink-100/80 space-y-1.5">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>8 Full Masterclass Video Modules (12+ hours)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Varsha Rider will guide you step by step</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Eligibility for Live Supervised Sessions</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Official Certification of Theory Completion</span>
                  </li>
                </ul>
              </div>

              <div className="flex flex-col gap-2.5">
                <button
                  type="button"
                  onClick={() => {
                    setLockedModalLesson(null);
                    handleApplyClick();
                  }}
                  className="w-full py-3.5 rounded-full bg-gradient-to-r from-pink-500 via-rose-500 to-fuchsia-500 hover:from-pink-400 hover:to-fuchsia-400 text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-pink-600/40 hover:scale-[1.02] transition-all flex items-center justify-center gap-2 border border-white/25"
                >
                  <Unlock className="w-4 h-4" />
                  <span>Subscribe & Unlock (₹{(settings.trainingFee || 4999).toLocaleString('en-IN')})</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setLockedModalLesson(null);
                    const previewLesson = courseInfo?.modules?.[0]?.lessons?.[0];
                    if (previewLesson) {
                      handleSelectLesson(previewLesson, courseInfo.modules[0].title);
                    }
                  }}
                  className="w-full py-3 rounded-full bg-white/10 hover:bg-white/15 border border-white/20 text-white font-bold text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-2"
                >
                  <Play className="w-3.5 h-3.5 text-pink-300 fill-current" />
                  <span>Watch Free Preview (Lesson 1.1)</span>
                </button>

                {user && (
                  <button
                    type="button"
                    onClick={() => {
                      setLockedModalLesson(null);
                      handleToggleTestSubscription();
                    }}
                    className="w-full py-2.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 font-semibold text-xs border border-amber-500/30 transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Zap className="w-3.5 h-3.5 text-amber-400" />
                    <span>Simulate Trainee Subscription (Test / Demo)</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
