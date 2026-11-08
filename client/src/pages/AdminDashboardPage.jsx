import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useSettings } from '../context/SettingsContext';
import { apiClient } from '../api/client';
import { StatusBadge } from '../components/StatusBadge';
import {
  Shield,
  Users,
  FileText,
  CreditCard,
  GraduationCap,
  Settings as SettingsIcon,
  Image as ImageIcon,
  PlaySquare,
  History,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Search,
  Filter,
  DollarSign,
  Download,
  Plus,
  Trash2,
  Edit,
  Eye,
  RefreshCw,
  Clock,
  Sparkles,
  Lock,
  Unlock,
  ChevronRight,
  Loader2,
  Upload,
  X,
} from 'lucide-react';

export const AdminDashboardPage = () => {
  const { user, isAdmin } = useAuth();
  const { settings, refreshSettings } = useSettings();

  const [activeTab, setActiveTab] = useState('overview'); // overview, applications, users, payments, courses, cms, gallery, videos, logs
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState({ type: '', text: '' });

  // Data states
  const [metrics, setMetrics] = useState(null);
  const [recentApplications, setRecentApplications] = useState([]);
  const [recentPayments, setRecentPayments] = useState([]);

  // Applications tab state
  const [allApplications, setAllApplications] = useState([]);
  const [appFilterStatus, setAppFilterStatus] = useState('All');
  const [appSearch, setAppSearch] = useState('');
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [adminActionModal, setAdminActionModal] = useState(null); // 'approve', 'reject', 'details'
  const [rejectionReason, setRejectionReason] = useState('');
  const [adminNotes, setAdminNotes] = useState('');
  const [customFee, setCustomFee] = useState(4999);

  // Users tab state
  const [usersList, setUsersList] = useState([]);
  const [userSearch, setUserSearch] = useState('');

  // Payments tab state
  const [paymentsList, setPaymentsList] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(0);

  // Course tab state
  const [adminCourse, setAdminCourse] = useState(null);

  // CMS Settings state
  const [cmsForm, setCmsForm] = useState({ ...settings });
  const [cmsSavedPopup, setCmsSavedPopup] = useState(false);
  const [cmsSaving, setCmsSaving] = useState(false);

  // Gallery & Video Management states
  const [galleryItems, setGalleryItems] = useState([]);
  const [newPhoto, setNewPhoto] = useState({
    title: '',
    category: 'Live Shows',
    imageUrl: '',
    caption: '',
    location: '',
  });
  const [photoSourceType, setPhotoSourceType] = useState('file'); // 'file' or 'url'
  const [selectedPhotoFile, setSelectedPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState('');
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const photoFileInputRef = useRef(null);

  const [publicVideos, setPublicVideos] = useState([]);
  const [newVideo, setNewVideo] = useState({
    title: '',
    category: 'Stunt Highlights',
    videoUrl: '',
    thumbnailUrl: '',
    duration: '3:30',
    description: '',
  });
  const [videoThumbSourceType, setVideoThumbSourceType] = useState('url');
  const [selectedVideoThumbFile, setSelectedVideoThumbFile] = useState(null);
  const [videoThumbPreview, setVideoThumbPreview] = useState('');
  const [isPublishingVideo, setIsPublishingVideo] = useState(false);
  const videoThumbInputRef = useRef(null);

  // Audit Logs
  const [auditLogs, setAuditLogs] = useState([]);

  useEffect(() => {
    loadAllAdminData();
  }, []);

  const loadAllAdminData = async () => {
    try {
      setLoading(true);
      // 1. Overview metrics
      const ovRes = await apiClient.get('/admin/overview');
      if (ovRes?.metrics) {
        setMetrics(ovRes.metrics);
        setRecentApplications(ovRes.recentApplications || []);
        setRecentPayments(ovRes.recentPayments || []);
      }

      // 2. Applications
      const appRes = await apiClient.get('/applications/admin/all');
      if (appRes?.applications) {
        setAllApplications(appRes.applications);
        try { localStorage.setItem('wod_applications', JSON.stringify(appRes.applications)); } catch {}
      }

      // 3. Users
      const uRes = await apiClient.get('/admin/users');
      if (uRes?.users) {
        setUsersList(uRes.users);
        try { localStorage.setItem('wod_users', JSON.stringify(uRes.users)); } catch {}
      }

      // 4. Payments
      const pRes = await apiClient.get('/payments/admin/all');
      if (pRes?.payments) {
        setPaymentsList(pRes.payments);
        setTotalRevenue(pRes.totalRevenue || 0);
      }

      // 5. Course details
      const cRes = await apiClient.get('/courses/admin/details');
      if (cRes?.course) setAdminCourse(cRes.course);

      // 6. Settings for CMS
      const sRes = await apiClient.get('/settings/admin');
      if (sRes?.settings) setCmsForm(sRes.settings);

      // 7. Gallery & Videos
      const gRes = await apiClient.get('/gallery');
      if (gRes?.items) setGalleryItems(gRes.items);

      const vRes = await apiClient.get('/videos');
      if (vRes?.videos) setPublicVideos(vRes.videos);

      // 8. Audit logs
      const lRes = await apiClient.get('/admin/audit-logs');
      if (lRes?.logs) setAuditLogs(lRes.logs);
    } catch (err) {
      console.warn('Error loading admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Status Action: Approve Application (Step 3 -> Step 4 Training Unlocked)
  const handleApproveApplication = async (appId, targetStatus = 'Training Unlocked') => {
    try {
      const res = await apiClient.put(`/applications/admin/${appId}/status`, {
        status: targetStatus,
        trainingFee: Number(customFee) || 4999,
        adminNotes,
      });
      setMsg({ type: 'success', text: res.message });
      setAdminActionModal(null);
      loadAllAdminData();
    } catch (err) {
      setMsg({ type: 'error', text: err.message || 'Failed to approve application.' });
    }
  };

  // Status Action: Reject Application
  const handleRejectApplication = async (appId) => {
    if (!rejectionReason.trim()) {
      alert('Please enter a rejection reason.');
      return;
    }
    try {
      const res = await apiClient.put(`/applications/admin/${appId}/status`, {
        status: 'Rejected',
        rejectionReason,
        adminNotes,
      });
      setMsg({ type: 'success', text: res.message });
      setAdminActionModal(null);
      loadAllAdminData();
    } catch (err) {
      setMsg({ type: 'error', text: err.message || 'Failed to reject application.' });
    }
  };

  // Toggle user suspension
  const handleToggleUserStatus = async (userId) => {
    try {
      const res = await apiClient.put(`/admin/users/${userId}/status`);
      setMsg({ type: 'success', text: res.message });
      loadAllAdminData();
    } catch (err) {
      setMsg({ type: 'error', text: err.message });
    }
  };

  // Save Website CMS settings
  const handleSaveCmsSettings = async (e) => {
    e.preventDefault();
    setCmsSaving(true);
    try {
      const res = await apiClient.put('/settings/admin', cmsForm);
      setMsg({ type: 'success', text: res.message || 'CMS configuration saved successfully!' });
      refreshSettings();
      loadAllAdminData();
      setCmsSavedPopup(true);
    } catch (err) {
      setMsg({ type: 'error', text: err.message });
    } finally {
      setCmsSaving(false);
    }
  };

  // Export platform data (JSON) to sync across browsers/devices
  const handleExportData = async () => {
    try {
      const res = await apiClient.get('/admin/export-platform-data');
      if (res?.data) {
        const blob = new Blob([JSON.stringify(res.data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `wod_platform_data_${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
        setMsg({ type: 'success', text: 'Platform data exported! Use Import Data in another browser to sync.' });
      }
    } catch (err) {
      setMsg({ type: 'error', text: 'Failed to export data: ' + err.message });
    }
  };

  // Import platform data (JSON)
  const handleImportData = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const text = await file.text();
      const parsed = JSON.parse(text);
      const res = await apiClient.post('/admin/import-platform-data', { data: parsed });
      setMsg({ type: 'success', text: res.message || 'Platform data imported and synced successfully!' });
      loadAllAdminData();
    } catch (err) {
      setMsg({ type: 'error', text: 'Failed to import data: ' + err.message });
    } finally {
      e.target.value = '';
    }
  };

  const handlePhotoFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setMsg({ type: 'error', text: 'Please select a valid image file (JPEG, PNG, WebP, GIF, SVG).' });
      return;
    }

    if (file.size > 25 * 1024 * 1024) {
      setMsg({ type: 'error', text: 'Image file size must be less than 25MB.' });
      return;
    }

    if (photoPreview) {
      URL.revokeObjectURL(photoPreview);
    }

    setSelectedPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));

    // Autofill title if currently empty
    if (!newPhoto.title.trim()) {
      const cleanName = file.name.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' ');
      setNewPhoto((prev) => ({ ...prev, title: cleanName }));
    }
  };

  const handleClearSelectedPhoto = () => {
    setSelectedPhotoFile(null);
    if (photoPreview) {
      URL.revokeObjectURL(photoPreview);
      setPhotoPreview('');
    }
    if (photoFileInputRef.current) {
      photoFileInputRef.current.value = '';
    }
  };

  // Add Gallery Photo
  const handleAddPhoto = async (e) => {
    e.preventDefault();
    try {
      let finalImageUrl = newPhoto.imageUrl;

      if (photoSourceType === 'file') {
        if (!selectedPhotoFile && !newPhoto.imageUrl) {
          setMsg({ type: 'error', text: 'Please browse and select an image file to upload.' });
          return;
        }

        if (selectedPhotoFile) {
          setIsUploadingPhoto(true);
          const formData = new FormData();
          formData.append('image', selectedPhotoFile);
          const uploadRes = await apiClient.upload('/upload', formData);
          finalImageUrl = uploadRes.url;
        }
      } else {
        if (!newPhoto.imageUrl || !newPhoto.imageUrl.trim()) {
          setMsg({ type: 'error', text: 'Please enter a valid image URL.' });
          return;
        }
      }

      const res = await apiClient.post('/gallery/admin', {
        ...newPhoto,
        imageUrl: finalImageUrl,
      });

      setMsg({ type: 'success', text: res.message || 'Photo added to gallery successfully!' });
      setNewPhoto({ title: '', category: 'Live Shows', imageUrl: '', caption: '', location: '' });
      handleClearSelectedPhoto();
      loadAllAdminData();
    } catch (err) {
      setMsg({ type: 'error', text: err.message || 'Failed to add photo' });
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  // Delete Gallery Photo
  const handleDeletePhoto = async (photoId) => {
    if (!window.confirm('Delete this photo from gallery?')) return;
    try {
      await apiClient.delete(`/gallery/admin/${photoId}`);
      setMsg({ type: 'success', text: 'Photo deleted successfully.' });
      loadAllAdminData();
    } catch (err) {
      setMsg({ type: 'error', text: err.message });
    }
  };

  const handleVideoThumbChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setMsg({ type: 'error', text: 'Please select a valid image file for video thumbnail.' });
      return;
    }

    if (videoThumbPreview) {
      URL.revokeObjectURL(videoThumbPreview);
    }

    setSelectedVideoThumbFile(file);
    setVideoThumbPreview(URL.createObjectURL(file));
  };

  const handleClearVideoThumb = () => {
    setSelectedVideoThumbFile(null);
    if (videoThumbPreview) {
      URL.revokeObjectURL(videoThumbPreview);
      setVideoThumbPreview('');
    }
    if (videoThumbInputRef.current) {
      videoThumbInputRef.current.value = '';
    }
  };

  // Add Public Video
  const handleAddVideo = async (e) => {
    e.preventDefault();
    try {
      setIsPublishingVideo(true);
      let finalThumbUrl = newVideo.thumbnailUrl;

      if (videoThumbSourceType === 'file' && selectedVideoThumbFile) {
        const formData = new FormData();
        formData.append('image', selectedVideoThumbFile);
        const uploadRes = await apiClient.upload('/upload', formData);
        finalThumbUrl = uploadRes.url;
      }

      const res = await apiClient.post('/videos/admin', {
        ...newVideo,
        thumbnailUrl: finalThumbUrl,
      });

      setMsg({ type: 'success', text: res.message || 'Video published successfully' });
      setNewVideo({
        title: '',
        category: 'Stunt Highlights',
        videoUrl: '',
        thumbnailUrl: '',
        duration: '3:30',
        description: '',
      });
      handleClearVideoThumb();
      loadAllAdminData();
    } catch (err) {
      setMsg({ type: 'error', text: err.message });
    } finally {
      setIsPublishingVideo(false);
    }
  };

  // Delete Public Video
  const handleDeleteVideo = async (videoId) => {
    if (!window.confirm('Delete this public video record?')) return;
    try {
      await apiClient.delete(`/videos/admin/${videoId}`);
      setMsg({ type: 'success', text: 'Video removed.' });
      loadAllAdminData();
    } catch (err) {
      setMsg({ type: 'error', text: err.message });
    }
  };

  // Revoke Student Access
  const handleRevokeStudentAccess = async (userId) => {
    const reason = window.prompt('Enter reason for revoking course access:');
    if (!reason) return;
    try {
      const res = await apiClient.post('/courses/admin/revoke-access', { userId, reason });
      setMsg({ type: 'success', text: res.message });
      loadAllAdminData();
    } catch (err) {
      setMsg({ type: 'error', text: err.message });
    }
  };

  // Export payments to CSV
  const handleExportPaymentsCSV = () => {
    if (paymentsList.length === 0) return;
    const headers = 'Receipt,OrderID,PaymentID,Amount,Status,Method,Date\n';
    const rows = paymentsList
      .map(
        (p) =>
          `"${p.receiptNumber}","${p.orderId}","${p.paymentId || ''}",${p.amount},"${p.status}","${p.paymentMethod}","${new Date(p.createdAt).toLocaleDateString()}"`
      )
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `wod_payments_${Date.now()}.csv`;
    a.click();
  };

  if (!isAdmin) {
    return (
      <div className="bg-slate-950 min-h-screen pt-36 pb-20 flex items-center justify-center px-4">
        <div className="p-8 rounded-3xl bg-slate-900/90 card-top-line border border-red-500/30 text-center max-w-md space-y-4">
          <div className="w-16 h-16 rounded-full bg-red-600/20 text-red-400 flex items-center justify-center mx-auto">
            <Lock className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-black text-white uppercase">Access Denied</h2>
          <p className="text-xs text-zinc-400">
            Administrative credentials are required to view the Master Rider Control Center.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-950 min-h-screen pt-36 pb-24 text-slate-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Admin Header */}
        <div className="p-6 sm:p-8 rounded-3xl bg-[#111118] border border-red-500/30 shadow-2xl mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-red-600/20 text-red-400 border border-red-500/40 flex items-center justify-center shadow-lg shadow-red-600/20">
              <Shield className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black text-white uppercase tracking-wider">
                  Admin Command Center
                </h1>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-red-500/20 text-red-400 border border-red-500/30 uppercase">
                  Owner Portal
                </span>
              </div>
              <p className="text-xs text-zinc-400 mt-1">
                Manage applications, verified payments, protected video courses, and website CMS.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={handleExportData}
              className="px-3.5 py-2 rounded-xl bg-cyan-950/40 hover:bg-cyan-950/70 text-cyan-300 font-bold text-xs flex items-center gap-1.5 border border-cyan-500/30 transition-colors cursor-pointer"
              title="Download backup file to sync with another browser or device"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Sync Data</span>
            </button>

            <label className="px-3.5 py-2 rounded-xl bg-emerald-950/40 hover:bg-emerald-950/70 text-emerald-300 font-bold text-xs flex items-center gap-1.5 border border-emerald-500/30 transition-colors cursor-pointer">
              <Upload className="w-3.5 h-3.5" />
              <span>Import Sync Data</span>
              <input
                type="file"
                accept=".json"
                className="hidden"
                onChange={handleImportData}
              />
            </label>

            <button
              type="button"
              onClick={loadAllAdminData}
              className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 font-bold text-xs flex items-center gap-2 border border-white/10 transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {/* Global Toast Notification */}
        {msg.text && (
          <div
            className={`mb-6 p-4 rounded-xl text-xs flex items-center justify-between gap-3 ${msg.type === 'success'
              ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-300'
              : 'bg-red-500/15 border border-red-500/30 text-red-300'
              }`}
          >
            <div className="flex items-center gap-2">
              {msg.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-red-400" />
              )}
              <span>{msg.text}</span>
            </div>
            <button onClick={() => setMsg({ type: '', text: '' })} className="text-zinc-500 hover:text-white">
              ✕
            </button>
          </div>
        )}

        {/* Admin Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 border-b border-white/10 scrollbar-none">
          {[
            { id: 'overview', name: 'Overview Analytics', icon: Shield },
            { id: 'applications', name: `Applications (${allApplications.length})`, icon: FileText },
            { id: 'users', name: `Users (${usersList.length})`, icon: Users },
            { id: 'payments', name: `Payments (₹${totalRevenue.toLocaleString('en-IN')})`, icon: CreditCard },
            { id: 'courses', name: 'Course Curriculum', icon: GraduationCap },
            { id: 'cms', name: 'Website CMS & Fees', icon: SettingsIcon },
            { id: 'gallery', name: `Gallery (${galleryItems.length})`, icon: ImageIcon },
            { id: 'videos', name: `Public Videos (${publicVideos.length})`, icon: PlaySquare },
            { id: 'logs', name: 'Audit Logs', icon: History },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 ${active
                  ? 'bg-gradient-to-r from-cyan-600 via-teal-600 to-emerald-500 text-white shadow-md shadow-cyan-950/50'
                  : 'bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10'
                  }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.name}</span>
              </button>
            );
          })}
        </div>

        {/* TAB 1: OVERVIEW ANALYTICS */}
        {activeTab === 'overview' && (
          <div className="space-y-8 animate-in fade-in duration-200">
            {/* KPI Cards Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 card-top-line">
                <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block">
                  Total Applications
                </span>
                <span className="text-3xl font-black text-white mt-1 block">
                  {metrics?.totalApplications || 0}
                </span>
                <span className="text-[11px] text-cyan-400 mt-1 block">
                  {metrics?.pendingApplications || 0} Pending Review
                </span>
              </div>

              <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 card-top-line">
                <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block">
                  Approved (Awaiting Fee)
                </span>
                <span className="text-3xl font-black text-amber-400 mt-1 block">
                  {metrics?.approvedAwaitingPayment || 0}
                </span>
                <span className="text-[11px] text-zinc-500 mt-1 block">Awaiting Student Checkout</span>
              </div>

              <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 card-top-line">
                <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block">
                  Paid & Unlocked Students
                </span>
                <span className="text-3xl font-black text-emerald-400 mt-1 block">
                  {metrics?.paidAndUnlockedStudents || 0}
                </span>
                <span className="text-[11px] text-emerald-400/80 mt-1 block">Active Trainees</span>
              </div>

              <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 card-top-line">
                <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block">
                  Total Verified Revenue
                </span>
                <span className="text-3xl font-black text-white mt-1 block">
                  ₹{(metrics?.totalRevenue || 0).toLocaleString('en-IN')}
                </span>
                <span className="text-[11px] text-zinc-500 mt-1 block">
                  {metrics?.successfulPaymentsCount || 0} Settled Payments
                </span>
              </div>
            </div>

            {/* Quick Action: Pending Applications Review Table */}
            <div className="p-8 rounded-3xl bg-slate-900/90 border border-slate-800 card-top-line shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-white uppercase tracking-wider">
                    Recent Applications Pending Review
                  </h3>
                  <p className="text-xs text-zinc-400">
                    Review and approve or reject candidates directly.
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab('applications')}
                  className="text-xs text-cyan-400 hover:underline font-bold"
                >
                  View All Applications ({allApplications.length}) →
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-white/10 text-zinc-400 uppercase tracking-wider text-[11px]">
                      <th className="pb-3 font-semibold">Applicant</th>
                      <th className="pb-3 font-semibold">Age / City</th>
                      <th className="pb-3 font-semibold">Experience</th>
                      <th className="pb-3 font-semibold">Status</th>
                      <th className="pb-3 font-semibold">Emergency Contact</th>
                      <th className="pb-3 font-semibold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {allApplications.slice(0, 5).map((app) => (
                      <tr key={app._id} className="hover:bg-white/5 transition-colors">
                        <td className="py-3">
                          <span className="font-bold text-white block">{app.fullName}</span>
                          <span className="text-[11px] text-zinc-400">{app.email} • {app.phone}</span>
                        </td>
                        <td className="py-3 text-zinc-300">
                          {app.age} yrs • {app.city}, {app.state}
                        </td>
                        <td className="py-3">
                          <span className="px-2 py-0.5 rounded bg-white/5 text-cyan-400 border border-white/10">
                            {app.experienceLevel}
                          </span>
                        </td>
                        <td className="py-3">
                          <StatusBadge status={app.status} />
                        </td>
                        <td className="py-3 text-zinc-400">
                          {app.emergencyContactName} ({app.emergencyContactPhone})
                        </td>
                        <td className="py-3 text-right space-x-2">
                          <button
                            onClick={() => {
                              setSelectedApplication(app);
                              setCustomFee(app.trainingFee || 4999);
                              setAdminNotes(app.adminNotes || '');
                              setAdminActionModal('details');
                            }}
                            className="px-3 py-1 rounded bg-white/5 hover:bg-white/10 text-white text-[11px] font-semibold border border-white/10"
                          >
                            Review & Decide
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: APPLICATIONS MANAGEMENT */}
        {activeTab === 'applications' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Filters */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/90 border border-slate-800 card-top-line">
              <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto">
                {['All', 'Payment Attached (Awaiting Approval)', 'Application Submitted', 'Training Unlocked', 'Rejected'].map(
                  (st) => (
                    <button
                      key={st}
                      onClick={() => setAppFilterStatus(st)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${appFilterStatus === st
                        ? 'bg-cyan-600 text-white'
                        : 'bg-white/5 text-zinc-400 hover:text-white'
                        }`}
                    >
                      {st}
                    </button>
                  )
                )}
              </div>

              <div className="relative w-full md:w-72">
                <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search name, phone, ref no..."
                  value={appSearch}
                  onChange={(e) => setAppSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            {/* Applications Full Table */}
            <div className="p-8 rounded-3xl bg-slate-900/90 border border-slate-800 card-top-line shadow-xl overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-white/10 text-zinc-400 uppercase tracking-wider text-[11px]">
                    <th className="pb-3 font-semibold">Applicant</th>
                    <th className="pb-3 font-semibold">Age / City</th>
                    <th className="pb-3 font-semibold">Experience</th>
                    <th className="pb-3 font-semibold">Payment Ref No</th>
                    <th className="pb-3 font-semibold">Status</th>
                    <th className="pb-3 font-semibold">Emergency Contact</th>
                    <th className="pb-3 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {allApplications
                    .filter((app) => {
                      if (appFilterStatus === 'All') return true;
                      if (appFilterStatus === 'Payment Attached (Awaiting Approval)') {
                        return (
                          Boolean(app.paymentRefNo || app.paymentStatus === 'processing') &&
                          app.status !== 'Training Unlocked' &&
                          app.status !== 'approved' &&
                          app.status !== 'Rejected'
                        );
                      }
                      if (appFilterStatus === 'Application Submitted') {
                        return (
                          !app.paymentRefNo &&
                          app.paymentStatus !== 'processing' &&
                          app.status !== 'Training Unlocked' &&
                          app.status !== 'approved' &&
                          app.status !== 'Rejected'
                        );
                      }
                      if (appFilterStatus === 'Training Unlocked') {
                        return app.status === 'Training Unlocked' || app.status === 'approved' || app.courseAccessGranted;
                      }
                      if (appFilterStatus === 'Rejected') return app.status === 'Rejected';
                      return app.status === appFilterStatus;
                    })
                    .filter(
                      (app) =>
                        !appSearch ||
                        app.fullName?.toLowerCase().includes(appSearch.toLowerCase()) ||
                        app.email?.toLowerCase().includes(appSearch.toLowerCase()) ||
                        app.phone?.includes(appSearch) ||
                        app.paymentRefNo?.toLowerCase().includes(appSearch.toLowerCase())
                    )
                    .map((app) => (
                      <tr key={app._id} className="hover:bg-white/5 transition-colors">
                        <td className="py-4">
                          <span className="font-bold text-white block">{app.fullName}</span>
                          <span className="text-[11px] text-zinc-400">{app.email} • {app.phone}</span>
                        </td>
                        <td className="py-4 text-zinc-300">
                          {app.age} yrs • {app.city}, {app.state}
                        </td>
                        <td className="py-4">
                          <span className="px-2 py-0.5 rounded bg-white/5 text-cyan-400 border border-white/10">
                            {app.experienceLevel}
                          </span>
                        </td>
                        <td className="py-4">
                          {app.paymentRefNo ? (
                            <div>
                              <code className="text-cyan-300 font-mono font-bold bg-slate-950 px-2 py-0.5 rounded border border-cyan-500/30">
                                {app.paymentRefNo}
                              </code>
                              <span className="text-[10px] text-zinc-400 block mt-0.5">
                                {app.paymentMethod || 'UPI'} • ₹{(app.paymentAmount || app.trainingFee || 4999).toLocaleString('en-IN')}
                              </span>
                            </div>
                          ) : (
                            <span className="text-zinc-500 italic text-[11px]">Ref not attached</span>
                          )}
                        </td>
                        <td className="py-4">
                          <StatusBadge status={app.status} />
                        </td>
                        <td className="py-4 text-zinc-400">
                          {app.emergencyContactName} ({app.emergencyContactPhone})
                        </td>
                        <td className="py-4 text-right space-x-2">
                          <button
                            onClick={() => {
                              setSelectedApplication(app);
                              setCustomFee(app.trainingFee || 4999);
                              setAdminNotes(app.adminNotes || '');
                              setRejectionReason(app.rejectionReason || '');
                              setAdminActionModal('details');
                            }}
                            className="px-3 py-1.5 rounded-lg bg-cyan-600/20 text-cyan-300 hover:bg-cyan-600/30 text-xs font-semibold border border-cyan-500/30 transition-colors cursor-pointer"
                          >
                            Review & Decide
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: USER MANAGEMENT */}
        {activeTab === 'users' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="p-8 rounded-3xl bg-slate-900/90 border border-slate-800 card-top-line shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-white uppercase tracking-wider">
                  Registered User Accounts
                </h3>
                <div className="relative w-64">
                  <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search users..."
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                    className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                  />
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-white/10 text-zinc-400 uppercase tracking-wider text-[11px]">
                      <th className="pb-3 font-semibold">User</th>
                      <th className="pb-3 font-semibold">Mobile</th>
                      <th className="pb-3 font-semibold">Role</th>
                      <th className="pb-3 font-semibold">Status</th>
                      <th className="pb-3 font-semibold">Registered Date</th>
                      <th className="pb-3 font-semibold text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {usersList
                      .filter(
                        (u) =>
                          !userSearch ||
                          u.name?.toLowerCase().includes(userSearch.toLowerCase()) ||
                          u.email?.toLowerCase().includes(userSearch.toLowerCase())
                      )
                      .map((u) => (
                        <tr key={u._id} className="hover:bg-white/5 transition-colors">
                          <td className="py-4">
                            <span className="font-bold text-white block">{u.name}</span>
                            <span className="text-[11px] text-zinc-500">{u.email}</span>
                          </td>
                          <td className="py-4 text-zinc-300">{u.phone}</td>
                          <td className="py-4">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${u.role === 'admin'
                                ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                                : 'bg-zinc-800 text-zinc-300'
                                }`}
                            >
                              {u.role}
                            </span>
                          </td>
                          <td className="py-4">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${u.status === 'active'
                                ? 'bg-emerald-500/20 text-emerald-400'
                                : 'bg-red-500/20 text-red-400'
                                }`}
                            >
                              {u.status}
                            </span>
                          </td>
                          <td className="py-4 text-zinc-500">
                            {new Date(u.createdAt).toLocaleDateString()}
                          </td>
                          <td className="py-4 text-right">
                            {u.role !== 'admin' && (
                              <button
                                onClick={() => handleToggleUserStatus(u._id)}
                                className={`px-3 py-1 rounded-lg text-xs font-semibold ${u.status === 'active'
                                  ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                                  : 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30'
                                  }`}
                              >
                                {u.status === 'active' ? 'Suspend' : 'Activate'}
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: PAYMENT TRANSACTIONS */}
        {activeTab === 'payments' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="p-8 rounded-3xl bg-slate-900/90 border border-slate-800 card-top-line shadow-xl space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-bold text-white uppercase tracking-wider">
                    Razorpay Transactions Ledger
                  </h3>
                  <p className="text-xs text-zinc-400">
                    Total Verified Revenue: <strong className="text-emerald-400">₹{totalRevenue.toLocaleString('en-IN')} INR</strong>
                  </p>
                </div>
                <button
                  onClick={handleExportPaymentsCSV}
                  className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs flex items-center gap-2 transition-colors shrink-0"
                >
                  <Download className="w-4 h-4" />
                  <span>Export to CSV</span>
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-white/10 text-zinc-400 uppercase tracking-wider text-[11px]">
                      <th className="pb-3 font-semibold">Receipt #</th>
                      <th className="pb-3 font-semibold">User</th>
                      <th className="pb-3 font-semibold">Order ID</th>
                      <th className="pb-3 font-semibold">Payment ID</th>
                      <th className="pb-3 font-semibold">Amount</th>
                      <th className="pb-3 font-semibold">Method</th>
                      <th className="pb-3 font-semibold">Status</th>
                      <th className="pb-3 font-semibold">Verified Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {paymentsList.map((p) => (
                      <tr key={p._id} className="hover:bg-white/5 transition-colors">
                        <td className="py-4 font-mono text-cyan-400">{p.receiptNumber}</td>
                        <td className="py-4">
                          <span className="font-bold text-white block">{p.user?.name}</span>
                          <span className="text-[11px] text-zinc-500">{p.user?.email}</span>
                        </td>
                        <td className="py-4 font-mono text-zinc-300">{p.orderId}</td>
                        <td className="py-4 font-mono text-zinc-400">{p.paymentId || '—'}</td>
                        <td className="py-4 font-bold text-white">₹{p.amount?.toLocaleString('en-IN')}</td>
                        <td className="py-4 text-zinc-400">{p.paymentMethod}</td>
                        <td className="py-4">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${p.status === 'successful'
                              ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                              : 'bg-yellow-500/15 text-yellow-400'
                              }`}
                          >
                            {p.status}
                          </span>
                        </td>
                        <td className="py-4 text-zinc-500">
                          {p.verifiedAt ? new Date(p.verifiedAt).toLocaleString() : 'Pending'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: COURSE CURRICULUM MANAGEMENT */}
        {activeTab === 'courses' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="p-8 rounded-3xl bg-slate-900/90 border border-slate-800 card-top-line shadow-xl space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-white uppercase tracking-wider">
                    Curriculum & Video Modules Management
                  </h3>
                  <p className="text-xs text-zinc-400">
                    Configure protected video links, durations, and module titles.
                  </p>
                </div>
              </div>

              {adminCourse && (
                <div className="space-y-6">
                  {adminCourse.modules?.map((mod, modIdx) => (
                    <div key={mod._id || modIdx} className="p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="text-base font-bold text-white">
                          Module {modIdx + 1}: {mod.title}
                        </h4>
                        <span className="text-xs text-zinc-500">{mod.lessons.length} Lessons</span>
                      </div>

                      <div className="space-y-2">
                        {mod.lessons.map((les) => (
                          <div
                            key={les._id}
                            className="p-3 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between gap-4 text-xs"
                          >
                            <div>
                              <h5 className="font-semibold text-white">{les.title}</h5>
                              <p className="text-[11px] text-zinc-400 mt-0.5 line-clamp-1">{les.description}</p>
                              <span className="text-[10px] text-cyan-400 mt-0.5 block font-mono">
                                Video Source: {les.videoUrl}
                              </span>
                            </div>
                            <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-zinc-800 text-zinc-300">
                              {les.duration}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 6: WEBSITE CMS & SETTINGS */}
        {activeTab === 'cms' && (
          <div className="max-w-4xl mx-auto p-8 rounded-3xl bg-slate-900/90 border border-slate-800 card-top-line shadow-2xl space-y-6 animate-in fade-in duration-200">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <h3 className="text-xl font-bold text-white uppercase tracking-wider">
                  Website CMS & Global Brand Settings
                </h3>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Changes made here update dynamically across all public pages.
                </p>
              </div>
            </div>

            <form onSubmit={handleSaveCmsSettings} className="space-y-6">
              {/* Branding & Headlines */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-wider border-l-2 border-cyan-500 pl-2">
                  Branding & Hero Copy
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-zinc-300 block mb-1">Brand Name / Title</label>
                    <input
                      type="text"
                      value={cmsForm.brandName || ''}
                      onChange={(e) => setCmsForm({ ...cmsForm, brandName: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-zinc-300 block mb-1">Rider Professional Subtitle</label>
                    <input
                      type="text"
                      value={cmsForm.riderTitle || ''}
                      onChange={(e) => setCmsForm({ ...cmsForm, riderTitle: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-zinc-300 block mb-1">Hero Section Headline</label>
                  <input
                    type="text"
                    value={cmsForm.heroHeadline || ''}
                    onChange={(e) => setCmsForm({ ...cmsForm, heroHeadline: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-zinc-300 block mb-1">Hero Subheadline</label>
                  <input
                    type="text"
                    value={cmsForm.heroSubheadline || ''}
                    onChange={(e) => setCmsForm({ ...cmsForm, heroSubheadline: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-zinc-300 block mb-1">Rider Biography Text</label>
                  <textarea
                    rows="4"
                    value={cmsForm.aboutBio || ''}
                    onChange={(e) => setCmsForm({ ...cmsForm, aboutBio: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                  />
                </div>
              </div>

              {/* Training Fee & Razorpay Keys */}
              <div className="space-y-4 pt-4 border-t border-white/10">
                <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-wider border-l-2 border-cyan-500 pl-2">
                  Training Price & Gateway Credentials
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs font-bold text-zinc-300 block mb-1">Default Training Fee (INR)</label>
                    <input
                      type="number"
                      value={cmsForm.trainingFee || 4999}
                      onChange={(e) => setCmsForm({ ...cmsForm, trainingFee: Number(e.target.value) })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-zinc-300 block mb-1">Razorpay Key ID</label>
                    <input
                      type="text"
                      value={cmsForm.razorpayKeyId || ''}
                      onChange={(e) => setCmsForm({ ...cmsForm, razorpayKeyId: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-zinc-300 block mb-1">Razorpay Key Secret</label>
                    <input
                      type="password"
                      value={cmsForm.razorpayKeySecret || ''}
                      onChange={(e) => setCmsForm({ ...cmsForm, razorpayKeySecret: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="space-y-4 pt-4 border-t border-white/10">
                <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-wider border-l-2 border-cyan-500 pl-2">
                  Contact & Arena Headquarters
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs font-bold text-zinc-300 block mb-1">Official Email</label>
                    <input
                      type="email"
                      value={cmsForm.contactEmail || ''}
                      onChange={(e) => setCmsForm({ ...cmsForm, contactEmail: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-zinc-300 block mb-1">Contact Phone</label>
                    <input
                      type="tel"
                      value={cmsForm.contactPhone || ''}
                      onChange={(e) => setCmsForm({ ...cmsForm, contactPhone: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-zinc-300 block mb-1">WhatsApp Number</label>
                    <input
                      type="tel"
                      value={cmsForm.contactWhatsApp || ''}
                      onChange={(e) => setCmsForm({ ...cmsForm, contactWhatsApp: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={cmsSaving}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-600 via-teal-600 to-emerald-500 hover:from-cyan-500 hover:to-emerald-400 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-cyan-950/50 hover:opacity-95 transition-all mt-4 disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
              >
                {cmsSaving ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Saving CMS Settings...</span>
                  </>
                ) : (
                  <span>Save CMS Configuration</span>
                )}
              </button>
            </form>
          </div>
        )}

        {/* TAB 7: GALLERY MANAGER */}
        {activeTab === 'gallery' && (
          <div className="space-y-8 animate-in fade-in duration-200">
            {/* Add Photo Form */}
            <div className="p-8 rounded-3xl bg-slate-900/90 border border-slate-800 card-top-line shadow-xl space-y-4">
              <h3 className="text-lg font-bold text-white uppercase tracking-wider">
                Add Photo to Gallery
              </h3>
              <form onSubmit={handleAddPhoto} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-bold text-zinc-300 block mb-1">Photo Title *</label>
                  <input
                    type="text"
                    required
                    value={newPhoto.title}
                    onChange={(e) => setNewPhoto({ ...newPhoto, title: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-zinc-300 block mb-1">Category *</label>
                  <select
                    value={newPhoto.category}
                    onChange={(e) => setNewPhoto({ ...newPhoto, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                  >
                    <option value="Live Shows">Live Shows</option>
                    <option value="Riding Stunts">Riding Stunts</option>
                    <option value="Events">Events</option>
                    <option value="Behind the Scenes">Behind the Scenes</option>
                    <option value="Achievements">Achievements</option>
                  </select>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-bold text-zinc-300">
                      {photoSourceType === 'file' ? 'Photo Image *' : 'Image URL *'}
                    </label>
                    <div className="flex items-center gap-1 bg-slate-950 p-0.5 rounded-lg border border-slate-800">
                      <button
                        type="button"
                        onClick={() => setPhotoSourceType('file')}
                        className={`px-2 py-0.5 text-[10px] font-bold rounded-md transition-colors ${photoSourceType === 'file'
                          ? 'bg-cyan-500 text-black shadow-sm'
                          : 'text-zinc-400 hover:text-white'
                          }`}
                        title="Browse local photo file"
                      >
                        📁 Browse
                      </button>
                      <button
                        type="button"
                        onClick={() => setPhotoSourceType('url')}
                        className={`px-2 py-0.5 text-[10px] font-bold rounded-md transition-colors ${photoSourceType === 'url'
                          ? 'bg-cyan-500 text-black shadow-sm'
                          : 'text-zinc-400 hover:text-white'
                          }`}
                        title="Enter direct image URL"
                      >
                        🔗 URL
                      </button>
                    </div>
                  </div>

                  {photoSourceType === 'file' ? (
                    <div>
                      <input
                        ref={photoFileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handlePhotoFileChange}
                      />
                      {!selectedPhotoFile ? (
                        <div
                          onClick={() => photoFileInputRef.current?.click()}
                          className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-dashed border-slate-700 hover:border-cyan-500 cursor-pointer transition-colors flex items-center justify-between group"
                        >
                          <div className="flex items-center gap-2 overflow-hidden text-zinc-400 group-hover:text-zinc-200">
                            <Upload className="w-4 h-4 text-cyan-400 shrink-0 group-hover:scale-110 transition-transform" />
                            <span className="text-xs truncate">Choose from device...</span>
                          </div>
                          <span className="px-2.5 py-1 text-[10px] font-bold text-black bg-cyan-400 rounded-lg group-hover:bg-cyan-300 transition-colors shrink-0">
                            Browse
                          </span>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between gap-2 p-1.5 rounded-xl bg-slate-950 border border-cyan-500/50">
                          <div className="flex items-center gap-2 overflow-hidden">
                            <img
                              src={photoPreview}
                              alt="Selected preview"
                              className="w-8 h-8 rounded-lg object-cover border border-slate-800 shrink-0"
                            />
                            <div className="truncate">
                              <p className="text-xs font-semibold text-white truncate max-w-[130px]">
                                {selectedPhotoFile.name}
                              </p>
                              <p className="text-[10px] text-zinc-400">
                                {selectedPhotoFile.size / (1024 * 1024) >= 1
                                  ? `${(selectedPhotoFile.size / (1024 * 1024)).toFixed(1)} MB`
                                  : `${Math.round(selectedPhotoFile.size / 1024)} KB`}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-1 shrink-0">
                            <button
                              type="button"
                              onClick={() => photoFileInputRef.current?.click()}
                              className="px-2 py-1 text-[10px] font-bold text-cyan-400 hover:text-white rounded bg-slate-900 border border-slate-800 transition-colors"
                            >
                              Change
                            </button>
                            <button
                              type="button"
                              onClick={handleClearSelectedPhoto}
                              className="p-1 text-zinc-400 hover:text-red-400 rounded transition-colors"
                              title="Remove selected file"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <input
                      type="url"
                      required={photoSourceType === 'url'}
                      value={newPhoto.imageUrl}
                      onChange={(e) => setNewPhoto({ ...newPhoto, imageUrl: e.target.value })}
                      placeholder="https://..."
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-cyan-500"
                    />
                  )}
                </div>
                <div>
                  <label className="text-xs font-bold text-zinc-300 block mb-1">Location</label>
                  <input
                    type="text"
                    value={newPhoto.location}
                    onChange={(e) => setNewPhoto({ ...newPhoto, location: e.target.value })}
                    placeholder="e.g. Pushkar Fair"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-xs font-bold text-zinc-300 block mb-1">Caption / Description</label>
                  <input
                    type="text"
                    value={newPhoto.caption}
                    onChange={(e) => setNewPhoto({ ...newPhoto, caption: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                  />
                </div>
                <div className="lg:col-span-3">
                  <button
                    type="submit"
                    disabled={isUploadingPhoto}
                    className="px-6 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white font-bold text-xs uppercase tracking-wider transition-colors inline-flex items-center gap-1.5"
                  >
                    {isUploadingPhoto ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Uploading & Adding Photo...</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4" />
                        <span>Upload & Add to Gallery</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>

            {/* Existing Gallery Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {galleryItems.map((item) => (
                <div
                  key={item._id}
                  className="rounded-2xl bg-slate-900/90 border border-slate-800 card-top-line overflow-hidden relative group"
                >
                  <div className="aspect-[4/3] bg-zinc-900 overflow-hidden">
                    <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="p-3.5 flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-white truncate max-w-[150px]">{item.title}</h4>
                      <span className="text-[10px] text-cyan-400">{item.category}</span>
                    </div>
                    <button
                      onClick={() => handleDeletePhoto(item._id)}
                      className="p-1.5 text-zinc-500 hover:text-red-400 transition-colors"
                      title="Delete photo"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 8: PUBLIC VIDEOS MANAGER */}
        {activeTab === 'videos' && (
          <div className="space-y-8 animate-in fade-in duration-200">
            {/* Add Video Form */}
            <div className="p-8 rounded-3xl bg-slate-900/90 border border-slate-800 card-top-line shadow-xl space-y-4">
              <h3 className="text-lg font-bold text-white uppercase tracking-wider">
                Add Public Stunt Video
              </h3>
              <form onSubmit={handleAddVideo} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-bold text-zinc-300 block mb-1">Video Title *</label>
                  <input
                    type="text"
                    required
                    value={newVideo.title}
                    onChange={(e) => setNewVideo({ ...newVideo, title: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-zinc-300 block mb-1">Category</label>
                  <input
                    type="text"
                    value={newVideo.category}
                    onChange={(e) => setNewVideo({ ...newVideo, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-zinc-300 block mb-1">Duration</label>
                  <input
                    type="text"
                    value={newVideo.duration}
                    onChange={(e) => setNewVideo({ ...newVideo, duration: e.target.value })}
                    placeholder="3:45"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-xs font-bold text-zinc-300 block mb-1">Direct Video URL *</label>
                  <input
                    type="url"
                    required
                    value={newVideo.videoUrl}
                    onChange={(e) => setNewVideo({ ...newVideo, videoUrl: e.target.value })}
                    placeholder="https://...mp4"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                  />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-bold text-zinc-300">Thumbnail</label>
                    <div className="flex items-center gap-1 bg-slate-950 p-0.5 rounded-lg border border-slate-800">
                      <button
                        type="button"
                        onClick={() => setVideoThumbSourceType('file')}
                        className={`px-2 py-0.5 text-[10px] font-bold rounded-md transition-colors ${videoThumbSourceType === 'file'
                          ? 'bg-cyan-500 text-black shadow-sm'
                          : 'text-zinc-400 hover:text-white'
                          }`}
                      >
                        📁 Browse
                      </button>
                      <button
                        type="button"
                        onClick={() => setVideoThumbSourceType('url')}
                        className={`px-2 py-0.5 text-[10px] font-bold rounded-md transition-colors ${videoThumbSourceType === 'url'
                          ? 'bg-cyan-500 text-black shadow-sm'
                          : 'text-zinc-400 hover:text-white'
                          }`}
                      >
                        🔗 URL
                      </button>
                    </div>
                  </div>

                  {videoThumbSourceType === 'file' ? (
                    <div>
                      <input
                        ref={videoThumbInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleVideoThumbChange}
                      />
                      {!selectedVideoThumbFile ? (
                        <div
                          onClick={() => videoThumbInputRef.current?.click()}
                          className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-dashed border-slate-700 hover:border-cyan-500 cursor-pointer transition-colors flex items-center justify-between group"
                        >
                          <div className="flex items-center gap-2 overflow-hidden text-zinc-400 group-hover:text-zinc-200">
                            <Upload className="w-4 h-4 text-cyan-400 shrink-0 group-hover:scale-110 transition-transform" />
                            <span className="text-xs truncate">Choose thumbnail...</span>
                          </div>
                          <span className="px-2 py-1 text-[10px] font-bold text-black bg-cyan-400 rounded-lg group-hover:bg-cyan-300 transition-colors shrink-0">
                            Browse
                          </span>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between gap-2 p-1.5 rounded-xl bg-slate-950 border border-cyan-500/50">
                          <div className="flex items-center gap-2 overflow-hidden">
                            <img
                              src={videoThumbPreview}
                              alt="Thumbnail preview"
                              className="w-8 h-8 rounded-lg object-cover border border-slate-800 shrink-0"
                            />
                            <div className="truncate">
                              <p className="text-xs font-semibold text-white truncate max-w-[120px]">
                                {selectedVideoThumbFile.name}
                              </p>
                              <p className="text-[10px] text-zinc-400">
                                {Math.round(selectedVideoThumbFile.size / 1024)} KB
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-1 shrink-0">
                            <button
                              type="button"
                              onClick={() => videoThumbInputRef.current?.click()}
                              className="px-2 py-1 text-[10px] font-bold text-cyan-400 hover:text-white rounded bg-slate-900 border border-slate-800 transition-colors"
                            >
                              Change
                            </button>
                            <button
                              type="button"
                              onClick={handleClearVideoThumb}
                              className="p-1 text-zinc-400 hover:text-red-400 rounded transition-colors"
                              title="Remove selected file"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <input
                      type="url"
                      value={newVideo.thumbnailUrl}
                      onChange={(e) => setNewVideo({ ...newVideo, thumbnailUrl: e.target.value })}
                      placeholder="https://..."
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-cyan-500"
                    />
                  )}
                </div>
                <div className="sm:col-span-3">
                  <button
                    type="submit"
                    disabled={isPublishingVideo}
                    className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-bold text-xs uppercase tracking-wider transition-colors inline-flex items-center gap-1.5"
                  >
                    {isPublishingVideo ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Publishing Video...</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4" />
                        <span>Publish Video</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>

            {/* Public Video Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {publicVideos.map((vid) => (
                <div key={vid._id} className="rounded-2xl bg-slate-900/90 border border-slate-800 card-top-line p-4 space-y-3">
                  <div className="aspect-video bg-zinc-900 rounded-xl overflow-hidden relative">
                    <img src={vid.thumbnailUrl} alt={vid.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="text-sm font-bold text-white line-clamp-1">{vid.title}</h4>
                      <span className="text-[11px] text-cyan-400">{vid.category}</span>
                    </div>
                    <button
                      onClick={() => handleDeleteVideo(vid._id)}
                      className="p-1.5 text-zinc-500 hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 9: AUDIT LOGS */}
        {activeTab === 'logs' && (
          <div className="p-8 rounded-3xl bg-slate-900/90 border border-slate-800 card-top-line shadow-xl space-y-4 animate-in fade-in duration-200">
            <h3 className="text-lg font-bold text-white uppercase tracking-wider">
              System & Admin Audit Logs
            </h3>
            <p className="text-xs text-zinc-400">
              Complete chronological audit trail of all approvals, status transitions, and payments.
            </p>

            <div className="divide-y divide-white/5 max-h-[600px] overflow-y-auto">
              {auditLogs.map((log) => (
                <div key={log._id} className="py-3 text-xs flex items-start justify-between gap-4">
                  <div>
                    <span className="font-semibold text-white block">{log.action}</span>
                    <span className="text-[11px] text-zinc-400">{log.details}</span>
                  </div>
                  <span className="text-[10px] text-zinc-500 font-mono whitespace-nowrap">
                    {new Date(log.createdAt).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Application Review & Decision Modal */}
      {adminActionModal && selectedApplication && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-2 sm:p-3 animate-in fade-in">
          <div className="relative w-full max-w-lg bg-slate-900/95 border border-slate-800 card-top-line rounded-xl p-3 sm:p-4 shadow-2xl flex flex-col max-h-[85vh] overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-2 shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 flex items-center justify-center shrink-0 font-bold">
                  <FileText className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h3 className="text-xs sm:text-sm font-black text-white uppercase tracking-tight">
                    Candidate Application Review
                  </h3>
                  <span className="text-[10px] text-zinc-400">
                    Application ID: <code className="font-mono text-cyan-400">{selectedApplication._id}</code>
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <StatusBadge status={selectedApplication.status} />
                <button
                  type="button"
                  onClick={() => setAdminActionModal(null)}
                  className="p-1 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors cursor-pointer"
                  title="Close modal"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Scrollable Modal Body */}
            <div className="overflow-y-auto space-y-2 pr-1 text-xs">
              {/* Candidate Details Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 bg-slate-950/70 p-2.5 rounded-lg border border-white/5">
                <div>
                  <span className="text-zinc-500 block text-[9px] uppercase font-bold">Full Name</span>
                  <span className="font-bold text-white text-[11px] truncate block">{selectedApplication.fullName}</span>
                </div>
                <div>
                  <span className="text-zinc-500 block text-[9px] uppercase font-bold">Mobile</span>
                  <span className="text-zinc-300 text-[11px] block">{selectedApplication.phone || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-zinc-500 block text-[9px] uppercase font-bold">Age & City</span>
                  <span className="text-zinc-300 text-[11px] truncate block">
                    {selectedApplication.age ? `${selectedApplication.age} yrs` : ''} • {selectedApplication.city || 'N/A'}
                  </span>
                </div>
                <div>
                  <span className="text-zinc-500 block text-[9px] uppercase font-bold">Riding Level</span>
                  <span className="text-cyan-400 font-semibold text-[11px] block truncate">
                    {selectedApplication.experienceLevel || `${selectedApplication.ridingExperienceYears || 2} yrs exp`}
                  </span>
                </div>

                {(selectedApplication.emergencyContactName || selectedApplication.emergencyContactPhone) && (
                  <div className="col-span-2 sm:col-span-4 pt-1 border-t border-white/5 text-[10px]">
                    <span className="text-zinc-500 font-bold">Emergency Contact:</span>{' '}
                    <span className="text-red-300 font-semibold">
                      {selectedApplication.emergencyContactName} ({selectedApplication.emergencyContactPhone})
                    </span>
                  </div>
                )}

                {selectedApplication.reason && (
                  <div className="col-span-2 sm:col-span-4 pt-0.5 border-t border-white/5 text-[10px] text-zinc-400">
                    <span className="text-zinc-500 font-bold">Statement:</span>{' '}
                    <span className="italic text-zinc-300">"{selectedApplication.reason}"</span>
                  </div>
                )}
              </div>

              {/* STEP 2 PAYMENT VERIFICATION BLOCK */}
              <div className="p-2.5 rounded-lg bg-cyan-950/30 border border-cyan-500/30 space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <CreditCard className="w-3.5 h-3.5 text-cyan-400" />
                    <span className="text-[10px] font-bold text-white uppercase tracking-wider">
                      Step 02: Candidate Attached Payment Details
                    </span>
                  </div>
                  {selectedApplication.paymentRefNo ? (
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                      Ref Attached
                    </span>
                  ) : (
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      Pending Ref
                    </span>
                  )}
                </div>

                {selectedApplication.paymentRefNo ? (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5 pt-0.5">
                    <div className="sm:col-span-2 bg-slate-950/90 px-2.5 py-1.5 rounded-lg border border-cyan-500/20">
                      <span className="text-[8px] uppercase font-bold text-zinc-400 block mb-0.5">
                        Payment Ref No / UTR / Txn ID
                      </span>
                      <code className="text-xs font-mono font-black text-cyan-300 select-all tracking-wide">
                        {selectedApplication.paymentRefNo}
                      </code>
                    </div>
                    <div className="bg-slate-950/90 px-2.5 py-1.5 rounded-lg border border-white/5">
                      <span className="text-[8px] uppercase font-bold text-zinc-400 block mb-0.5">
                        Reported Amount
                      </span>
                      <span className="text-xs font-black text-emerald-400">
                        ₹{(selectedApplication.paymentAmount || customFee || 4999).toLocaleString('en-IN')}
                      </span>
                    </div>
                    <div className="sm:col-span-3 text-[9px] text-zinc-400 flex items-center justify-between pt-0.5">
                      <span>
                        Method: <strong className="text-zinc-200">{selectedApplication.paymentMethod || 'UPI / QR Transfer'}</strong>
                      </span>
                      <span>
                        Attached:{' '}
                        <strong className="text-zinc-300">
                          {selectedApplication.paymentSubmittedAt
                            ? new Date(selectedApplication.paymentSubmittedAt).toLocaleDateString()
                            : 'Recent'}
                        </strong>
                      </span>
                    </div>
                  </div>
                ) : (
                  <p className="text-[10px] text-amber-300/90 italic bg-amber-950/20 p-1.5 rounded-lg border border-amber-500/20">
                    Candidate has submitted application, but has not yet attached payment reference.
                  </p>
                )}
              </div>

              {/* Decision Controls */}
              <div className="space-y-2 pt-1 border-t border-white/10">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] font-bold text-zinc-300 block mb-0.5">
                      Tuition Fee (INR)
                    </label>
                    <input
                      type="number"
                      value={customFee}
                      onChange={(e) => setCustomFee(e.target.value)}
                      className="w-full px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white focus:border-cyan-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-zinc-300 block mb-0.5">
                      Internal Admin Notes
                    </label>
                    <input
                      type="text"
                      value={adminNotes}
                      onChange={(e) => setAdminNotes(e.target.value)}
                      placeholder="e.g. UTR verified in bank statement"
                      className="w-full px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white focus:border-cyan-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-red-300 block mb-0.5">
                    Rejection Reason (Required only if rejecting)
                  </label>
                  <input
                    type="text"
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    placeholder="e.g. Invalid UTR reference number or payment not received"
                    className="w-full px-2.5 py-1 rounded-lg bg-black/40 border border-red-500/20 text-xs text-white focus:border-red-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Fixed Bottom Action Buttons Bar */}
            <div className="flex items-center gap-2 pt-2.5 mt-2 border-t border-white/10 shrink-0">
              {(selectedApplication.status === 'Training Unlocked' || selectedApplication.status === 'approved' || selectedApplication.courseAccessGranted) ? (
                <div className="flex-1 py-2.5 px-3 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 font-bold text-xs flex items-center justify-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Training Unlocked & Active</span>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => handleApproveApplication(selectedApplication._id, 'Training Unlocked')}
                  className="flex-1 py-2.5 px-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs uppercase tracking-wider transition-all shadow-md shadow-emerald-900/30 flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Unlock className="w-4 h-4" />
                  <span>Verify Payment & Unlock</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => handleRejectApplication(selectedApplication._id)}
                className="py-2.5 px-3.5 rounded-xl bg-red-600/30 hover:bg-red-600/50 text-red-300 border border-red-500/30 font-bold text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <XCircle className="w-4 h-4" />
                <span>Reject</span>
              </button>

              {selectedApplication.status === 'Training Unlocked' && (
                <button
                  type="button"
                  onClick={() => handleRevokeStudentAccess(selectedApplication.user?._id || selectedApplication.user)}
                  className="py-2.5 px-3 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
                >
                  Revoke
                </button>
              )}

              <button
                type="button"
                onClick={() => setAdminActionModal(null)}
                className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CMS Saved Success Popup Modal */}
      {cmsSavedPopup && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setCmsSavedPopup(false)}
        >
          <div
            className="bg-slate-900 border border-emerald-500/40 rounded-3xl p-6 sm:p-8 max-w-sm w-full text-center shadow-2xl space-y-4 card-top-line animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/10">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div className="space-y-1.5">
              <h3 className="text-xl font-black text-white uppercase tracking-tight">
                Successfully Saved
              </h3>
              <p className="text-xs text-zinc-300 leading-relaxed">
                Website CMS configuration and site settings have been updated and saved successfully!
              </p>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => setCmsSavedPopup(false)}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-emerald-950/60 transition-all cursor-pointer"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
