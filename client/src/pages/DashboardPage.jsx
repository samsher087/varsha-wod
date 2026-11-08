import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useSettings } from '../context/SettingsContext';
import { apiClient } from '../api/client';
import { StatusBadge } from '../components/StatusBadge';
import { RazorpayPaymentModal } from '../components/RazorpayPaymentModal';
import {
  User,
  GraduationCap,
  CreditCard,
  CheckCircle2,
  Clock,
  Unlock,
  Lock,
  Play,
  Download,
  AlertTriangle,
  XCircle,
  FileText,
  ChevronRight,
  ShieldCheck,
  Phone,
  Mail,
  MapPin,
  Sparkles,
  Loader2,
  Calendar,
  Award,
} from 'lucide-react';

export const DashboardPage = () => {
  const { user, updateProfile, logout } = useAuth();
  const { settings } = useSettings();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const initialTab = queryParams.get('tab') || 'status';

  const [activeTab, setActiveTab] = useState(initialTab); // 'status', 'apply', 'academy', 'payments', 'profile'
  const [application, setApplication] = useState(null);
  const [curriculum, setCurriculum] = useState(null);
  const [payments, setPayments] = useState([]);
  const [activeLesson, setActiveLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [receiptData, setReceiptData] = useState(null);
  const [viewingReceipt, setViewingReceipt] = useState(false);

  // Application Form state
  const [appForm, setAppForm] = useState({
    fullName: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    age: 22,
    dob: '2004-05-15',
    city: user?.city || '',
    state: 'Delhi',
    experienceLevel: 'Intermediate',
    reason: '',
    emergencyContactName: '',
    emergencyContactPhone: '',
    additionalExperience: '',
    agreedToSafetyWaiver: false,
  });

  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formMsg, setFormMsg] = useState({ type: '', text: '' });

  // Profile Edit state
  const [profileName, setProfileName] = useState(user?.name || '');
  const [profilePhone, setProfilePhone] = useState(user?.phone || '');
  const [profileCity, setProfileCity] = useState(user?.city || '');
  const [profileEmergencyName, setProfileEmergencyName] = useState(user?.emergencyContact?.name || '');
  const [profileEmergencyPhone, setProfileEmergencyPhone] = useState(user?.emergencyContact?.phone || '');
  const [profileMsg, setProfileMsg] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      // 1. Fetch user application
      const appRes = await apiClient.get('/applications/my-application');
      if (appRes?.application) {
        setApplication(appRes.application);

        // Prepopulate application form with existing details
        setAppForm((prev) => ({
          ...prev,
          fullName: appRes.application.fullName || prev.fullName,
          email: appRes.application.email || prev.email,
          phone: appRes.application.phone || prev.phone,
          age: appRes.application.age || prev.age,
          dob: appRes.application.dob ? appRes.application.dob.split('T')[0] : prev.dob,
          city: appRes.application.city || prev.city,
          state: appRes.application.state || prev.state,
          experienceLevel: appRes.application.experienceLevel || prev.experienceLevel,
          reason: appRes.application.reason || prev.reason,
          emergencyContactName: appRes.application.emergencyContactName || prev.emergencyContactName,
          emergencyContactPhone: appRes.application.emergencyContactPhone || prev.emergencyContactPhone,
          additionalExperience: appRes.application.additionalExperience || prev.additionalExperience,
          agreedToSafetyWaiver: appRes.application.agreedToSafetyWaiver ?? prev.agreedToSafetyWaiver,
        }));

        // Prepopulate emergency contact if in application
        if (appRes.application.emergencyContactName) {
          setProfileEmergencyName(appRes.application.emergencyContactName);
          setProfileEmergencyPhone(appRes.application.emergencyContactPhone);
        }

        // If unlocked, fetch student curriculum
        if (appRes.application.status === 'Training Unlocked') {
          fetchCurriculum();
        }
      }

      // 2. Fetch payment history
      const payRes = await apiClient.get('/payments/my-payments');
      if (payRes?.payments) {
        setPayments(payRes.payments);
      }
    } catch (err) {
      console.warn('Dashboard fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCurriculum = async () => {
    try {
      const res = await apiClient.get('/courses/student-curriculum');
      if (res?.course) {
        setCurriculum(res.course);
        // Default active lesson to first unlocked lesson
        if (res.course.modules?.[0]?.lessons?.[0]) {
          setActiveLesson(res.course.modules[0].lessons[0]);
        }
      }
    } catch (err) {
      console.warn('Curriculum access:', err.message);
    }
  };

  // Submit Training Application
  const handleApplicationSubmit = async (e) => {
    e.preventDefault();
    setFormMsg({ type: '', text: '' });

    if (!appForm.agreedToSafetyWaiver) {
      setFormMsg({
        type: 'error',
        text: 'You must check and agree to the Safety & Risk Waiver to submit your application.',
      });
      return;
    }

    if (Number(appForm.age) < 18) {
      setFormMsg({
        type: 'error',
        text: 'Applicant must be at least 18 years old to undergo training.',
      });
      return;
    }

    setFormSubmitting(true);
    try {
      const res = await apiClient.post('/applications/apply', appForm);
      if (res?.success) {
        setApplication(res.application);
        setFormMsg({
          type: 'success',
          text: 'Application submitted successfully! Our team is reviewing your profile.',
        });
        setActiveTab('status');
      }
    } catch (err) {
      setFormMsg({
        type: 'error',
        text: err.message || 'Error submitting application. Please verify inputs.',
      });
    } finally {
      setFormSubmitting(false);
    }
  };

  // Save Profile Updates
  const handleProfileSave = async (e) => {
    e.preventDefault();
    setProfileMsg({ type: '', text: '' });
    try {
      await updateProfile({
        name: profileName,
        phone: profilePhone,
        city: profileCity,
        emergencyContact: {
          name: profileEmergencyName,
          phone: profileEmergencyPhone,
        },
      });
      setProfileMsg({ type: 'success', text: 'Profile updated successfully!' });
    } catch (err) {
      setProfileMsg({ type: 'error', text: err.message || 'Failed to update profile' });
    }
  };

  // Toggle Lesson Completion
  const handleToggleLessonComplete = async (lesson, e) => {
    e.stopPropagation();
    try {
      const newStatus = !lesson.isCompleted;
      await apiClient.post('/courses/progress', {
        lessonId: lesson._id,
        moduleId: curriculum?.modules?.find((m) => m.lessons.some((l) => l._id === lesson._id))?._id,
        courseId: curriculum?._id,
        isCompleted: newStatus,
      });
      // Refresh curriculum
      fetchCurriculum();
    } catch (err) {
      console.warn('Failed to update progress', err);
    }
  };

  const isAcademyUnlocked = Boolean(
    application &&
    (application.status === 'Training Unlocked' ||
      application.status === 'approved' ||
      application.status === 'Approved' ||
      application.courseAccessGranted)
  );

  const handlePaymentSuccess = () => {
    fetchDashboardData();
    setActiveTab('status'); // Stay on Application Timeline tab to show Step 03: Waiting for Admin Approval!
  };

  // Timeline Step calculation
  // Process: 1. Application Submitted -> 2. Payment Process (attach ref no.) -> 3. Admin Approval -> 4. Training Unlocked
  const getTimelineStep = () => {
    if (!application) return 0;
    if (isAcademyUnlocked || application.status === 'Completed') return 4;
    if (
      application.paymentRefNo ||
      application.paymentStatus === 'processing' ||
      application.paymentStatus === 'paid' ||
      application.status === 'Payment Submitted — Pending Admin Approval' ||
      application.status === 'Payment Processing — Waiting for Admin Approval' ||
      application.status === 'Waiting for Admin Approval' ||
      application.status === 'Pending Admin Approval'
    ) {
      return 3; // Step 1 & 2 completed, Step 3 Admin Approval in progress
    }
    if (
      application.status === 'Application Submitted' ||
      application.status === 'Payment Pending' ||
      application.status === 'Pending Approval' ||
      application.status === 'pending' ||
      application.status === 'Approved — Payment Required'
    ) {
      return 2; // Step 1 completed, Step 2 Payment Process active
    }
    if (application.status === 'Rejected' || application.status === 'rejected') return -1;
    return 1;
  };

  const currentStep = getTimelineStep();

  return (
    <div className="bg-slate-950 min-h-screen pt-24 sm:pt-28 pb-14 text-slate-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* User Welcome Banner */}
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900/95 to-slate-900 card-top-line border border-white/10 shadow-xl mb-4 sm:mb-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-cyan-600 via-teal-500 to-emerald-400 p-[2px] shadow-lg shadow-cyan-950/50 shrink-0">
              <div className="w-full h-full bg-slate-900 rounded-[10px] flex items-center justify-center font-black text-xl text-cyan-400">
                {user?.name?.charAt(0) || 'R'}
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-lg sm:text-xl font-black text-white">{user?.name}</h1>
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-cyan-600/15 text-cyan-400 border border-cyan-500/30">
                  Trainee Portal
                </span>
              </div>
              <p className="text-xs text-zinc-400 mt-0.5 flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <Mail className="w-3 h-3 text-zinc-500" />
                  {user?.email}
                </span>
                <span className="flex items-center gap-1">
                  <Phone className="w-3 h-3 text-zinc-500" />
                  {user?.phone}
                </span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 w-full md:w-auto justify-end">
            {application && <StatusBadge status={application.status} />}
          </div>
        </div>

        {/* Dashboard Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2.5 mb-4 sm:mb-5 border-b border-white/10 scrollbar-none">
          <button
            onClick={() => setActiveTab('status')}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 ${activeTab === 'status'
              ? 'bg-gradient-to-r from-cyan-600 via-teal-600 to-emerald-500 text-white shadow-md shadow-cyan-950/50'
              : 'bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10'
              }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Application Timeline</span>
          </button>

          <button
            onClick={() => setActiveTab('apply')}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 ${activeTab === 'apply'
              ? 'bg-gradient-to-r from-cyan-600 via-teal-600 to-emerald-500 text-white shadow-md shadow-cyan-950/50'
              : 'bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10'
              }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>{application ? 'Application Details' : 'Apply for Training'}</span>
          </button>

          <button
            onClick={() => setActiveTab('academy')}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 ${activeTab === 'academy'
              ? 'bg-gradient-to-r from-cyan-600 via-teal-600 to-emerald-500 text-white shadow-md shadow-cyan-950/50'
              : 'bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10'
              }`}
          >
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Training Academy {isAcademyUnlocked ? '(Unlocked)' : '(Locked)'}</span>
          </button>

          <button
            onClick={() => setActiveTab('payments')}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 ${activeTab === 'payments'
              ? 'bg-gradient-to-r from-cyan-600 via-teal-600 to-emerald-500 text-white shadow-md shadow-cyan-950/50'
              : 'bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10'
              }`}
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span>Receipts & Payments ({payments.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 ${activeTab === 'profile'
              ? 'bg-gradient-to-r from-cyan-600 via-teal-600 to-emerald-500 text-white shadow-md shadow-cyan-950/50'
              : 'bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10'
              }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Account Settings</span>
          </button>
        </div>

        {/* TAB 1: APPLICATION STATUS TIMELINE */}
        {activeTab === 'status' && (
          <div className="space-y-8 animate-in fade-in duration-200">
            {/* Visual Step Timeline */}
            <div className="p-8 rounded-3xl bg-slate-900/90 border border-slate-800 card-top-line shadow-2xl">
              <h2 className="text-xl font-black text-white uppercase tracking-wider mb-6">
                Training Admission Timeline
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
                {/* Step 1: Application Submitted */}
                <div
                  className={`p-5 rounded-2xl border transition-all ${currentStep >= 1
                    ? 'border-emerald-500/50 bg-emerald-950/20 text-emerald-300'
                    : 'border-white/10 bg-white/5 text-zinc-500'
                    }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider">Step 01</span>
                    {currentStep >= 1 ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    ) : (
                      <Clock className="w-4 h-4" />
                    )}
                  </div>
                  <h4 className="text-sm font-bold text-white">Application Submitted</h4>
                  <p className="text-[11px] text-zinc-400 mt-1">Credentials, experience & safety waiver saved.</p>
                </div>

                {/* Step 2: Payment Process / Processing */}
                <div
                  className={`p-5 rounded-2xl border transition-all ${currentStep >= 3
                    ? 'border-emerald-500/50 bg-emerald-950/20 text-emerald-300'
                    : currentStep === 2
                      ? 'border-cyan-500/60 bg-cyan-950/30 text-cyan-300 shadow-md ring-1 ring-cyan-500/30'
                      : 'border-white/10 bg-white/5 text-zinc-500'
                    }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider">Step 02</span>
                    {currentStep >= 3 ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    ) : currentStep === 2 ? (
                      <CreditCard className="w-4 h-4 text-cyan-400" />
                    ) : (
                      <CreditCard className="w-4 h-4" />
                    )}
                  </div>
                  <h4 className="text-sm font-bold text-white">
                    {currentStep >= 3 ? 'Payment Processing (Done)' : 'Payment Process'}
                  </h4>
                  <p className="text-[11px] text-zinc-400 mt-1">
                    {currentStep >= 3
                      ? 'Payment reference attached & submitted.'
                      : 'Tuition fee payment & attach payment ref no.'}
                  </p>
                </div>

                {/* Step 3: Admin Approval */}
                <div
                  className={`p-5 rounded-2xl border transition-all ${currentStep >= 4
                    ? 'border-emerald-500/50 bg-emerald-950/20 text-emerald-300'
                    : currentStep === 3
                      ? 'border-amber-500/60 bg-amber-950/30 text-amber-300 shadow-md ring-1 ring-amber-500/30'
                      : 'border-white/10 bg-white/5 text-zinc-500'
                    }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider">Step 03</span>
                    {currentStep >= 4 ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    ) : currentStep === 3 ? (
                      <Clock className="w-4 h-4 text-amber-400 animate-spin" style={{ animationDuration: '4s' }} />
                    ) : (
                      <Clock className="w-4 h-4" />
                    )}
                  </div>
                  <h4 className="text-sm font-bold text-white">Admin Approval</h4>
                  <p className="text-[11px] text-zinc-400 mt-1">
                    {currentStep === 3 ? 'Waiting for admin approval...' : 'Review by Master Rider Varsha Rider.'}
                  </p>
                </div>

                {/* Step 4: Training Unlocked */}
                <div
                  className={`p-5 rounded-2xl border transition-all ${currentStep >= 4
                    ? 'border-emerald-500/60 bg-emerald-950/30 text-emerald-300 shadow-md'
                    : 'border-white/10 bg-white/5 text-zinc-500'
                    }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider">Step 04</span>
                    {currentStep >= 4 ? (
                      <Unlock className="w-5 h-5 text-emerald-400" />
                    ) : (
                      <Lock className="w-4 h-4" />
                    )}
                  </div>
                  <h4 className="text-sm font-bold text-white">Training Unlocked</h4>
                  <p className="text-[11px] text-zinc-400 mt-1">Full video course & arena curriculum open.</p>
                </div>
              </div>

              {/* Status Action Cards */}
              <div className="mt-8 pt-6 border-t border-white/10">
                {!application ? (
                  <div className="p-6 rounded-2xl bg-cyan-600/10 border border-cyan-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div>
                      <h4 className="text-base font-bold text-white">No Application on File</h4>
                      <p className="text-xs text-zinc-400 mt-1">
                        Submit your training application now to begin the admission process.
                      </p>
                    </div>
                    <button
                      onClick={() => setActiveTab('apply')}
                      className="px-6 py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs uppercase tracking-wider transition-colors"
                    >
                      Fill Application Form
                    </button>
                  </div>
                ) : application.status === 'Training Unlocked' ? (
                  <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="p-3 rounded-xl bg-emerald-500/20 text-emerald-400 shrink-0">
                        <Unlock className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 mb-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Step 04 Reached: Training Access Unlocked!
                        </div>
                        <h4 className="text-base font-bold text-white">Full Academy Access Active</h4>
                        <p className="text-xs text-zinc-300 mt-1">
                          Your application and payment reference have been verified by Master Rider Varsha Rider. You have full access to all course modules and masterclass training videos.
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setActiveTab('academy')}
                      className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider transition-colors flex items-center gap-2 whitespace-nowrap"
                    >
                      <Play className="w-4 h-4 fill-current" />
                      <span>Start Watching Lessons</span>
                    </button>
                  </div>
                ) : application.status === 'Rejected' ? (
                  <div className="p-6 rounded-2xl bg-red-500/10 border border-red-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="p-3 rounded-xl bg-red-500/20 text-red-400 shrink-0">
                        <XCircle className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="text-base font-bold text-white">Application Not Accepted</h4>
                        <p className="text-xs text-red-300 mt-1">
                          Reason: {application.rejectionReason || 'Did not meet physical / experience prerequisites.'}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setActiveTab('apply')}
                      className="px-6 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-colors"
                    >
                      Resubmit Application
                    </button>
                  </div>
                ) : (application.paymentRefNo || application.paymentStatus === 'processing' || currentStep === 3) ? (
                  /* Step 03 Active: Payment reference attached, awaiting Admin Approval */
                  <div className="p-6 rounded-2xl bg-slate-900/90 border border-amber-500/40 card-top-line flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 shadow-xl">
                    <div className="flex items-start gap-4">
                      <div className="p-3.5 rounded-2xl bg-amber-500/15 text-amber-400 border border-amber-500/30 shrink-0 mt-1">
                        <Clock className="w-7 h-7 animate-spin" style={{ animationDuration: '6s' }} />
                      </div>
                      <div className="space-y-2">
                        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-300 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30">
                          <Clock className="w-3 h-3 text-amber-400" />
                          Step 01 & Step 02 Done • Waiting for Admin Approval
                        </div>
                        <h4 className="text-xl font-black text-white">
                          Payment Processing — Waiting for Admin Approval
                        </h4>
                        <p className="text-xs text-zinc-300 max-w-xl leading-relaxed">
                          Your application has been submitted and your payment reference has been recorded! Master Rider Varsha Rider & the academy admin team are reviewing your details. Once approved, your complete video training curriculum will unlock immediately.
                        </p>

                        {/* Reference Number & Payment Details Pill Box */}
                        <div className="flex flex-wrap items-center gap-3 pt-2 text-xs">
                          <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center gap-2">
                            <span className="text-zinc-500">Attached Ref No:</span>
                            <code className="text-cyan-300 font-mono font-bold">{application.paymentRefNo}</code>
                          </div>
                          <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center gap-2">
                            <span className="text-zinc-500">Amount:</span>
                            <span className="text-white font-bold">
                              ₹{(application.paymentAmount || application.trainingFee || 4999).toLocaleString('en-IN')}
                            </span>
                          </div>
                          <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center gap-2">
                            <span className="text-zinc-500">Mode:</span>
                            <span className="text-zinc-300 font-semibold">{application.paymentMethod || 'UPI / QR'}</span>
                          </div>
                        </div>

                        {application.adminNotes && (
                          <p className="text-xs text-cyan-300 pt-1 italic">
                            Admin Note: "{application.adminNotes}"
                          </p>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={() => setPaymentModalOpen(true)}
                      className="px-6 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs uppercase tracking-wider transition-colors flex items-center gap-2 shrink-0 self-start lg:self-auto cursor-pointer"
                    >
                      <CreditCard className="w-4 h-4 text-cyan-400" />
                      <span>Update Payment Ref</span>
                    </button>
                  </div>
                ) : (
                  /* Step 02 Active: Application Submitted, now awaiting Payment Process & ref no attachment */
                  <div className="p-6 sm:p-8 rounded-2xl bg-slate-900/90 border border-cyan-500/40 card-top-line flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 shadow-xl">
                    <div className="flex items-start gap-4">
                      <div className="p-3.5 rounded-2xl bg-cyan-600/20 text-cyan-400 border border-cyan-500/30 shrink-0 mt-1">
                        <CreditCard className="w-7 h-7" />
                      </div>
                      <div className="space-y-1.5">
                        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-cyan-400 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          Step 01 Done • Step 02: Payment Process
                        </div>
                        <h4 className="text-xl sm:text-2xl font-black text-white">
                          Pay Training Fee & Attach Payment Reference No.
                        </h4>
                        <p className="text-xs text-zinc-300 max-w-xl leading-relaxed">
                          Your application has been received! Please complete the training fee payment of <strong className="text-cyan-300">₹{(application.trainingFee || 4999).toLocaleString('en-IN')}</strong> via UPI, QR code, or Bank Transfer, and attach your transaction reference number (UTR) to submit for Admin Approval.
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => setPaymentModalOpen(true)}
                      className="px-8 py-4 rounded-xl bg-gradient-to-r from-cyan-600 via-teal-600 to-emerald-500 hover:from-cyan-500 hover:to-emerald-400 text-white font-black text-sm uppercase tracking-wider shadow-xl shadow-cyan-950/60 hover:scale-[1.02] active:scale-[0.98] transition-all whitespace-nowrap flex items-center gap-2 shrink-0 self-start lg:self-auto cursor-pointer"
                    >
                      <CreditCard className="w-4 h-4" />
                      <span>Pay & Attach Ref No. (₹{(application.trainingFee || 4999).toLocaleString('en-IN')})</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: TRAINING APPLICATION FORM */}
        {activeTab === 'apply' && (
          <div className="max-w-5xl mx-auto p-4 sm:p-5 rounded-2xl bg-slate-900/90 border border-slate-800 card-top-line shadow-2xl animate-in fade-in duration-200">
            {/* Form Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-3.5 pb-2.5 border-b border-white/5">
              <div>
                <h2 className="text-lg sm:text-xl font-black text-white uppercase tracking-tight">
                  Training Application Form
                </h2>
                <p className="text-[11px] text-zinc-400">
                  Please provide accurate details for physical aptitude and safety assessment.
                </p>
              </div>
              {application && (
                <div className="self-start sm:self-auto">
                  <StatusBadge status={application.status} />
                </div>
              )}
            </div>

            {formMsg.text && (
              <div
                className={`mb-3 p-2.5 rounded-lg text-xs flex items-center gap-2 ${formMsg.type === 'success'
                  ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-300'
                  : 'bg-red-500/10 border border-red-500/30 text-red-300'
                  }`}
              >
                {formMsg.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
                )}
                <span>{formMsg.text}</span>
              </div>
            )}

            <form onSubmit={handleApplicationSubmit}>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 items-start">
                {/* LEFT COLUMN: Section 1 (Applicant Info) & Section 2 (Emergency Contact) */}
                <div className="space-y-3">
                  {/* 1. Applicant Information */}
                  <div className="space-y-2">
                    <h4 className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider border-l-2 border-cyan-500 pl-2">
                      1. Applicant Information
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <div>
                        <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-0.5">
                          Full Legal Name *
                        </label>
                        <input
                          type="text"
                          value={appForm.fullName}
                          onChange={(e) => setAppForm({ ...appForm, fullName: e.target.value })}
                          required
                          className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-500"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-0.5">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          value={appForm.email}
                          onChange={(e) => setAppForm({ ...appForm, email: e.target.value })}
                          required
                          className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-0.5">
                          Mobile *
                        </label>
                        <input
                          type="tel"
                          value={appForm.phone}
                          onChange={(e) => setAppForm({ ...appForm, phone: e.target.value })}
                          required
                          className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-500"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-0.5">
                          Age (18+) *
                        </label>
                        <input
                          type="number"
                          min="18"
                          max="65"
                          value={appForm.age}
                          onChange={(e) => setAppForm({ ...appForm, age: e.target.value })}
                          required
                          className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-500"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-0.5">
                          Date of Birth
                        </label>
                        <input
                          type="date"
                          value={appForm.dob}
                          onChange={(e) => setAppForm({ ...appForm, dob: e.target.value })}
                          className="w-full px-2 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-0.5">
                          City *
                        </label>
                        <input
                          type="text"
                          value={appForm.city}
                          onChange={(e) => setAppForm({ ...appForm, city: e.target.value })}
                          required
                          placeholder="e.g. New Delhi"
                          className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-500"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-0.5">
                          State *
                        </label>
                        <input
                          type="text"
                          value={appForm.state}
                          onChange={(e) => setAppForm({ ...appForm, state: e.target.value })}
                          required
                          placeholder="e.g. Uttar Pradesh"
                          className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-500"
                        />
                      </div>
                    </div>
                  </div>

                  {/* 2. Emergency Contact */}
                  <div className="space-y-2 pt-2.5 border-t border-white/5">
                    <h4 className="text-[11px] font-bold text-red-400 uppercase tracking-wider border-l-2 border-red-500 pl-2">
                      2. Emergency Contact (Mandatory)
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <div>
                        <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-0.5">
                          Contact Full Name *
                        </label>
                        <input
                          type="text"
                          value={appForm.emergencyContactName}
                          onChange={(e) => setAppForm({ ...appForm, emergencyContactName: e.target.value })}
                          required
                          placeholder="Parent / Guardian / Spouse"
                          className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-500"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-0.5">
                          Contact Mobile Phone *
                        </label>
                        <input
                          type="tel"
                          value={appForm.emergencyContactPhone}
                          onChange={(e) => setAppForm({ ...appForm, emergencyContactPhone: e.target.value })}
                          required
                          placeholder="+91 7488405975"
                          className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* RIGHT COLUMN: Section 3 (Experience), Waiver & Submit */}
                <div className="space-y-3">
                  {/* 3. Experience & Motivation */}
                  <div className="space-y-2">
                    <h4 className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider border-l-2 border-cyan-500 pl-2">
                      3. Riding Experience & Motivation
                    </h4>

                    <div>
                      <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-0.5">
                        Previous Motorcycle Riding Level *
                      </label>
                      <select
                        value={appForm.experienceLevel}
                        onChange={(e) => setAppForm({ ...appForm, experienceLevel: e.target.value })}
                        className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-500"
                      >
                        <option value="Beginner" className="bg-zinc-900">Beginner (1-2 years regular street riding)</option>
                        <option value="Intermediate" className="bg-zinc-900">Intermediate (3+ years manual clutch / track riding)</option>
                        <option value="Experienced" className="bg-zinc-900">Experienced (Dirt / stunt / motorsport competitor)</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-0.5">
                        Why do you want to learn Well of Death riding? *
                      </label>
                      <textarea
                        rows="2"
                        value={appForm.reason}
                        onChange={(e) => setAppForm({ ...appForm, reason: e.target.value })}
                        required
                        placeholder="Describe your motivations, aspirations, and commitment to discipline..."
                        className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-500 resize-none"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-0.5">
                        Additional Stunt or Mechanical Skills (Optional)
                      </label>
                      <input
                        type="text"
                        value={appForm.additionalExperience}
                        onChange={(e) => setAppForm({ ...appForm, additionalExperience: e.target.value })}
                        placeholder="e.g. 2-stroke engine mechanics, acrobatic balance"
                        className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-500"
                      />
                    </div>
                  </div>

                  {/* Safety Waiver Agreement */}
                  <div className="p-2.5 rounded-xl bg-red-950/20 border border-red-500/30">
                    <label className="flex items-start gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        id="waiver"
                        checked={appForm.agreedToSafetyWaiver}
                        onChange={(e) => setAppForm({ ...appForm, agreedToSafetyWaiver: e.target.checked })}
                        className="mt-0.5 rounded bg-black/60 border-red-500/50 text-red-600 focus:ring-0 shrink-0"
                      />
                      <span className="text-[11px] text-zinc-300 leading-snug">
                        <strong className="text-red-400 font-bold mr-1">Safety & Risk Waiver:</strong>
                        I certify medical fitness, agree to follow safety rules, and understand video training alone doesn't qualify independent riding without expert arena supervision.
                      </span>
                    </label>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={formSubmitting}
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 via-teal-600 to-emerald-500 hover:from-cyan-500 hover:to-emerald-400 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-cyan-950/50 flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-50"
                  >
                    {formSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Saving Application...</span>
                      </>
                    ) : (
                      <>
                        <ShieldCheck className="w-4 h-4" />
                        <span>{application ? 'Update & Resubmit Application' : 'Submit Application for Admin Review'}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        )}

        {/* TAB 3: UNLOCKED TRAINING ACADEMY (COURSE PLAYER) */}
        {activeTab === 'academy' && (
          <div className="animate-in fade-in duration-200">
            {!isAcademyUnlocked ? (
              <div className="p-12 text-center rounded-3xl bg-slate-900/90 border border-slate-800 card-top-line shadow-2xl max-w-2xl mx-auto space-y-4">
                <div className="w-16 h-16 rounded-full bg-red-600/20 text-red-400 border border-red-500/30 flex items-center justify-center mx-auto">
                  <Lock className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-black text-white uppercase">
                  Training Academy Portal Locked
                </h3>
                <p className="text-xs sm:text-sm text-zinc-400 max-w-md mx-auto leading-relaxed">
                  Per strict safety protocol, video courses are only accessible after your application is approved by the admin and verified payment is completed.
                </p>
                <div className="pt-2">
                  <button
                    onClick={() => setActiveTab('status')}
                    className="px-6 py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs uppercase tracking-wider transition-colors inline-flex items-center gap-2"
                  >
                    <span>Check Application & Payment Status</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : !curriculum ? (
              <div className="py-20 text-center text-zinc-500">
                <Loader2 className="w-8 h-8 animate-spin text-cyan-400 mx-auto mb-2" />
                <p className="text-xs uppercase">Loading student curriculum modules...</p>
              </div>
            ) : (
              <div className="space-y-8">
                {/* Course Progress Header */}
                <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 card-top-line flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-bold text-white">{curriculum.title}</h2>
                    <p className="text-xs text-zinc-400 mt-0.5">{curriculum.subtitle}</p>
                  </div>
                  <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                    <div className="text-right">
                      <span className="text-[11px] text-zinc-400 block">Overall Completion</span>
                      <span className="text-base font-black text-emerald-400">
                        {curriculum.stats?.completedLessons || 0} / {curriculum.stats?.totalLessons || 0} Lessons ({curriculum.stats?.completionPercentage || 0}%)
                      </span>
                    </div>
                    <div className="w-24 h-2.5 rounded-full bg-zinc-800 overflow-hidden border border-white/10">
                      <div
                        className="h-full bg-gradient-to-r from-cyan-400 to-emerald-400 transition-all duration-500"
                        style={{ width: `${curriculum.stats?.completionPercentage || 0}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Main Video Player & Lesson Curriculum Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                  {/* Left Column: Player & Active Lesson Details */}
                  <div className="lg:col-span-8 space-y-4">
                    <div className="relative aspect-video rounded-2xl overflow-hidden bg-black border border-white/10 shadow-2xl">
                      {activeLesson ? (
                        <video
                          key={activeLesson._id}
                          src={activeLesson.videoUrl || activeLesson.streamUrl || '/videos/stunt_wod_solo_wall.mp4'}
                          controls
                          autoPlay
                          className="w-full h-full object-contain"
                          controlsList="nodownload"
                        >
                          Your browser does not support HTML5 video playback.
                        </video>
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-zinc-500 text-xs">
                          Select a lesson to begin playback
                        </div>
                      )}
                    </div>

                    {activeLesson && (
                      <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 card-top-line space-y-3">
                        <div className="flex items-center justify-between gap-4">
                          <h3 className="text-lg font-bold text-white">{activeLesson.title}</h3>
                          <button
                            onClick={(e) => handleToggleLessonComplete(activeLesson, e)}
                            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${activeLesson.isCompleted
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                              : 'bg-white/5 text-zinc-400 hover:text-white border border-white/10'
                              }`}
                          >
                            <CheckCircle2 className="w-4 h-4" />
                            <span>{activeLesson.isCompleted ? 'Marked Completed' : 'Mark as Complete'}</span>
                          </button>
                        </div>

                        <p className="text-xs text-zinc-300 leading-relaxed">
                          {activeLesson.description}
                        </p>

                        {activeLesson.safetyNotice && (
                          <div className="p-3 rounded-xl bg-red-950/20 border border-red-500/30 flex items-start gap-2 text-xs text-red-300">
                            <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                            <span>Instructor Caution: {activeLesson.safetyNotice}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Right Column: Module & Lesson Playlist */}
                  <div className="lg:col-span-4 space-y-4">
                    <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 card-top-line">
                      <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
                        Curriculum Modules
                      </h4>

                      <div className="space-y-4 max-h-[600px] overflow-y-auto pr-1">
                        {curriculum.modules?.map((mod, modIdx) => (
                          <div key={mod._id || modIdx} className="space-y-2">
                            <span className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider block">
                              Module {modIdx + 1}: {mod.title}
                            </span>
                            <div className="space-y-1.5">
                              {mod.lessons?.map((les) => {
                                const isCurrent = activeLesson?._id === les._id;
                                return (
                                  <div
                                    key={les._id}
                                    onClick={() => setActiveLesson(les)}
                                    className={`p-3 rounded-xl border text-left cursor-pointer transition-all flex items-center justify-between gap-3 ${isCurrent
                                      ? 'bg-cyan-600/15 border-cyan-500/50 text-white'
                                      : 'bg-black/30 border-white/5 hover:bg-white/5 text-zinc-400'
                                      }`}
                                  >
                                    <div className="flex items-center gap-2.5 min-w-0">
                                      <div
                                        onClick={(e) => handleToggleLessonComplete(les, e)}
                                        className="shrink-0 p-1 text-zinc-500 hover:text-emerald-400 transition-colors"
                                        title={les.isCompleted ? 'Completed' : 'Click to mark complete'}
                                      >
                                        <CheckCircle2
                                          className={`w-4 h-4 ${les.isCompleted ? 'text-emerald-400 fill-emerald-500/20' : 'text-zinc-600'
                                            }`}
                                        />
                                      </div>
                                      <div className="min-w-0">
                                        <h5 className="text-xs font-medium text-white truncate line-clamp-1">
                                          {les.title}
                                        </h5>
                                        <span className="text-[10px] text-zinc-500">{les.duration}</span>
                                      </div>
                                    </div>

                                    {isCurrent ? (
                                      <Play className="w-3.5 h-3.5 text-cyan-400 fill-current shrink-0" />
                                    ) : (
                                      <ChevronRight className="w-3.5 h-3.5 text-zinc-600 shrink-0" />
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 4: PAYMENTS & RECEIPTS */}
        {activeTab === 'payments' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="p-8 rounded-3xl bg-slate-900/90 border border-slate-800 card-top-line shadow-2xl">
              <h2 className="text-xl font-black text-white uppercase tracking-wider mb-6">
                Payment History & Receipts
              </h2>

              {payments.length === 0 ? (
                <div className="py-12 text-center text-zinc-500">
                  <CreditCard className="w-10 h-10 mx-auto mb-2 text-zinc-600" />
                  <p className="text-xs">No transactions recorded yet.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-white/10 text-zinc-400 uppercase tracking-wider text-[11px]">
                        <th className="pb-3 font-semibold">Receipt #</th>
                        <th className="pb-3 font-semibold">Order ID</th>
                        <th className="pb-3 font-semibold">Payment ID</th>
                        <th className="pb-3 font-semibold">Amount</th>
                        <th className="pb-3 font-semibold">Method</th>
                        <th className="pb-3 font-semibold">Status</th>
                        <th className="pb-3 font-semibold">Date</th>
                        <th className="pb-3 font-semibold text-right">Invoice</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {payments.map((p) => (
                        <tr key={p._id} className="hover:bg-white/5 transition-colors">
                          <td className="py-4 font-mono text-cyan-400">{p.receiptNumber}</td>
                          <td className="py-4 font-mono text-zinc-300">{p.orderId}</td>
                          <td className="py-4 font-mono text-zinc-400">{p.paymentId || '—'}</td>
                          <td className="py-4 font-bold text-white">₹{p.amount?.toLocaleString('en-IN')}</td>
                          <td className="py-4 text-zinc-400">{p.paymentMethod}</td>
                          <td className="py-4">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${p.status === 'successful'
                                ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                                : p.status === 'created'
                                  ? 'bg-yellow-500/15 text-yellow-400 border border-yellow-500/30'
                                  : 'bg-red-500/15 text-red-400 border border-red-500/30'
                                }`}
                            >
                              {p.status}
                            </span>
                          </td>
                          <td className="py-4 text-zinc-500">
                            {new Date(p.createdAt).toLocaleDateString()}
                          </td>
                          <td className="py-4 text-right">
                            <button
                              onClick={() => {
                                setReceiptData({
                                  receiptNumber: p.receiptNumber,
                                  orderId: p.orderId,
                                  paymentId: p.paymentId,
                                  amount: p.amount,
                                  currency: p.currency,
                                  date: p.verifiedAt || p.createdAt,
                                  applicantName: user?.name,
                                  applicantEmail: user?.email,
                                  applicantPhone: user?.phone,
                                  status: 'PAID',
                                });
                                setViewingReceipt(true);
                              }}
                              className="px-3 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-cyan-400 font-semibold text-xs border border-white/10 inline-flex items-center gap-1"
                            >
                              <Download className="w-3.5 h-3.5" />
                              <span>View Receipt</span>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 5: PROFILE SETTINGS */}
        {activeTab === 'profile' && (
          <div className="max-w-3xl mx-auto p-8 rounded-3xl bg-slate-900/90 border border-slate-800 card-top-line shadow-2xl animate-in fade-in duration-200">
            <h2 className="text-xl font-black text-white uppercase tracking-wider mb-6">
              Account & Profile Settings
            </h2>

            {profileMsg.text && (
              <div
                className={`mb-6 p-4 rounded-xl text-xs flex items-center gap-2.5 ${profileMsg.type === 'success'
                  ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-300'
                  : 'bg-red-500/10 border border-red-500/30 text-red-300'
                  }`}
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{profileMsg.text}</span>
              </div>
            )}

            <form onSubmit={handleProfileSave} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider block mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider block mb-1">
                    Mobile Phone
                  </label>
                  <input
                    type="tel"
                    value={profilePhone}
                    onChange={(e) => setProfilePhone(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider block mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    value={profileCity}
                    onChange={(e) => setProfileCity(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-white/10 space-y-4">
                <h4 className="text-xs font-bold text-red-400 uppercase tracking-wider border-l-2 border-red-500 pl-2">
                  Emergency Contact
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider block mb-1">
                      Contact Name
                    </label>
                    <input
                      type="text"
                      value={profileEmergencyName}
                      onChange={(e) => setProfileEmergencyName(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider block mb-1">
                      Contact Phone
                    </label>
                    <input
                      type="tel"
                      value={profileEmergencyPhone}
                      onChange={(e) => setProfileEmergencyPhone(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-600 via-teal-600 to-emerald-500 text-white font-bold text-xs uppercase tracking-wider shadow-md shadow-cyan-950/50 hover:opacity-95 transition-all mt-4"
              >
                Save Profile Updates
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Razorpay Payment Modal */}
      <RazorpayPaymentModal
        isOpen={paymentModalOpen}
        onClose={() => setPaymentModalOpen(false)}
        trainingFee={application?.trainingFee || settings.trainingFee || 4999}
        existingRefNo={application?.paymentRefNo || ''}
        applicationId={application?._id}
        onPaymentSuccess={handlePaymentSuccess}
      />

      {/* Printable Receipt Modal */}
      {viewingReceipt && receiptData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in">
          <div className="relative w-full max-w-lg bg-[#0e0e14] border border-white/15 rounded-3xl p-8 shadow-2xl text-zinc-300 space-y-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <h3 className="text-lg font-black text-white uppercase tracking-wider">
                  Payment Receipt
                </h3>
                <span className="text-xs text-cyan-400 font-mono">
                  Receipt #{receiptData.receiptNumber}
                </span>
              </div>
              <span className="text-xs font-black px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                PAID
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between">
                <span className="text-zinc-500">Applicant:</span>
                <span className="font-bold text-white">{receiptData.applicantName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Order ID:</span>
                <span className="font-mono text-zinc-300">{receiptData.orderId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Payment ID:</span>
                <span className="font-mono text-zinc-300">{receiptData.paymentId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Course:</span>
                <span className="text-zinc-300">Well of Death Professional Training Academy</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-white/10 text-sm">
                <span className="font-bold text-white">Amount Paid:</span>
                <span className="font-black text-emerald-400">
                  ₹{receiptData.amount?.toLocaleString('en-IN')} INR
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-4 border-t border-white/10">
              <button
                onClick={() => window.print()}
                className="flex-1 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs uppercase tracking-wider transition-colors"
              >
                Print / Save PDF
              </button>
              <button
                onClick={() => setViewingReceipt(false)}
                className="px-6 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
