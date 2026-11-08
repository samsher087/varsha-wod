import {
  initialSettings,
  initialUsers,
  initialCourse,
  initialGallery,
  initialVideos,
  initialApplications,
  initialPayments,
  initialAuditLogs,
} from './mockData';

// Helper to safely read and write to localStorage
const loadStorage = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) {
      localStorage.setItem(key, JSON.stringify(fallback));
      return fallback;
    }
    const parsed = JSON.parse(raw);

    // Merge any missing seed items into existing storage so other browsers get all initial records
    if (key === 'wod_applications' && Array.isArray(parsed) && Array.isArray(fallback)) {
      const existingIds = new Set(parsed.map((item) => item._id));
      const existingEmails = new Set(parsed.map((item) => item.email?.toLowerCase()).filter(Boolean));
      const missing = fallback.filter((item) => !existingIds.has(item._id) && !existingEmails.has(item.email?.toLowerCase()));
      if (missing.length > 0) {
        const merged = [...parsed, ...missing];
        localStorage.setItem(key, JSON.stringify(merged));
        return merged;
      }
    }

    if (key === 'wod_users' && Array.isArray(parsed) && Array.isArray(fallback)) {
      const existingEmails = new Set(parsed.map((item) => item.email?.toLowerCase()));
      const missing = fallback.filter((item) => !existingEmails.has(item.email?.toLowerCase()));
      if (missing.length > 0) {
        const merged = [...parsed, ...missing];
        localStorage.setItem(key, JSON.stringify(merged));
        return merged;
      }
    }

    if (key === 'wod_payments' && Array.isArray(parsed) && Array.isArray(fallback)) {
      const existingIds = new Set(parsed.map((item) => item._id || item.transactionId));
      const missing = fallback.filter((item) => !existingIds.has(item._id || item.transactionId));
      if (missing.length > 0) {
        const merged = [...parsed, ...missing];
        localStorage.setItem(key, JSON.stringify(merged));
        return merged;
      }
    }

    return parsed;
  } catch {
    return fallback;
  }
};

const saveStorage = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (err) {
    console.warn(`[Storage Warning] Failed to persist ${key}:`, err);
  }
};

// Initialize default storage collections if not present
const getStore = () => {
  const loadedSettings = { ...initialSettings, ...loadStorage('wod_settings', initialSettings) };
  if (loadedSettings.heroSubheadline === 'Witness the Courage. Learn the Discipline. Respect the Risk.') {
    loadedSettings.heroSubheadline = '';
  }
  if (
    !loadedSettings.aboutBio ||
    loadedSettings.aboutBio.includes('Riding on nearly vertical wooden walls') ||
    loadedSettings.aboutBio.includes('With over 14 years of daredevil riding experience')
  ) {
    loadedSettings.aboutBio = initialSettings.aboutBio;
  }
  return {
    settings: loadedSettings,
    users: loadStorage('wod_users', initialUsers),
    course: loadStorage('wod_course', initialCourse),
    gallery: loadStorage('wod_gallery', initialGallery),
    videos: loadStorage('wod_videos', initialVideos),
    applications: loadStorage('wod_applications', initialApplications),
    payments: loadStorage('wod_payments', initialPayments),
    auditLogs: loadStorage('wod_audit_logs', initialAuditLogs),
    progress: loadStorage('wod_progress', {}),
  };
};

// Helper: Convert File or Blob to optimized Data URL
const fileToDataUrl = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        // Resize large images using canvas to prevent exceeding localStorage quota
        const maxDim = 1200;
        let { width, height } = img;
        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', 0.82));
      };
      img.onerror = () => resolve(e.target.result);
      img.src = e.target.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

// Current authenticated user helper
const getCurrentUser = () => {
  try {
    const raw = localStorage.getItem('wod_user');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

// The in-browser Mock Router
const mockRouter = async (method, endpoint, body) => {
  // Normalize endpoint path and extract query params
  const [pathOnly, queryString] = endpoint.split('?');
  const path = pathOnly.replace(/\/$/, '') || '/';
  const query = new URLSearchParams(queryString || '');
  const store = getStore();
  const currentUser = getCurrentUser();

  // Artificial ultra-fast network latency (40ms) for snappy, realistic UX
  await new Promise((r) => setTimeout(r, 40));

  // 1. AUTH ROUTES
  if (path === '/auth/login' && method === 'POST') {
    const { email, password } = body || {};
    const cleanEmail = (email || '').trim().toLowerCase();
    const cleanPass = (password || '').trim();

    let user = store.users.find(
      (u) => (u.email || '').trim().toLowerCase() === cleanEmail
    );

    // Auto-provision any valid trainee account (including sushil@gmail.com) if not yet in this browser's localStorage
    if (!user && cleanEmail.includes('@') && cleanEmail !== 'admin@samsher-wod.com') {
      const namePart = cleanEmail.split('@')[0];
      const displayName = cleanEmail === 'sushil@gmail.com' ? 'Sushil' : namePart.charAt(0).toUpperCase() + namePart.slice(1);
      user = {
        _id: cleanEmail === 'sushil@gmail.com' ? 'user_trainee_sushil' : `user_${Date.now()}`,
        name: displayName,
        email: cleanEmail,
        phone: cleanEmail === 'sushil@gmail.com' ? '+91 98123 45678' : '+91 98765 43210',
        password: cleanPass || 'Password@123',
        role: 'user',
        city: 'Giridih, Jharkhand',
        status: 'active',
        createdAt: new Date().toISOString(),
      };
      store.users.push(user);
      saveStorage('wod_users', store.users);
    }

    if (!user) {
      const err = new Error('Invalid email or password.');
      err.status = 401;
      throw err;
    }

    // Trainee flexible password handling so users are never locked out across browsers/devices
    if (user.role !== 'admin') {
      if (!user.password || (cleanPass && user.password !== cleanPass && user.password !== password)) {
        user.password = cleanPass || password || 'Password@123';
        saveStorage('wod_users', store.users);
      }

      // Ensure candidate application exists and is tracked across browsers
      const existingApp = store.applications.find(
        (a) => (a.email || '').toLowerCase() === cleanEmail || (a.user && a.user._id === user._id)
      );
      if (!existingApp) {
        const seedApp = initialApplications.find((a) => (a.email || '').toLowerCase() === cleanEmail);
        const linkedApp = seedApp
          ? { ...seedApp, user: { _id: user._id, name: user.name, email: user.email, phone: user.phone } }
          : {
            _id: `app_${Date.now()}`,
            user: {
              _id: user._id,
              name: user.name,
              email: user.email,
              phone: user.phone || '',
            },
            fullName: user.name,
            email: user.email,
            phone: user.phone || '',
            age: 22,
            city: user.city || 'India',
            state: 'India',
            experienceLevel: 'Intermediate',
            ridingExperienceYears: 2,
            ridingBackground: 'Registered Trainee Candidate',
            reason: 'Passionate about Well of Death stunt riding under Master Varsha.',
            emergencyContactName: 'Family Contact',
            emergencyContactPhone: user.phone || '',
            paymentRefNo: '',
            paymentAmount: 4999,
            trainingFee: 4999,
            paymentMethod: '',
            paymentStatus: 'unpaid',
            status: 'Application Submitted',
            courseAccessGranted: false,
            appliedAt: new Date().toISOString(),
          };
        store.applications.unshift(linkedApp);
        saveStorage('wod_applications', store.applications);
      }
    } else {
      // Strictly enforce Admin password
      if (user.password !== password && user.password !== cleanPass) {
        const err = new Error('Invalid email or password.');
        err.status = 401;
        throw err;
      }
    }

    if (user.status === 'suspended') {
      const err = new Error('Your account is currently suspended. Please contact administrator.');
      err.status = 403;
      throw err;
    }

    const { password: _, ...safeUser } = user;
    const token = `wod_token_${user._id}_${Date.now()}`;
    return { success: true, token, user: safeUser };
  }

  if (path === '/auth/register' && method === 'POST') {
    const { name, email, password, phone, city } = body || {};
    const cleanEmail = (email || '').trim().toLowerCase();
    const cleanName = (name || '').trim();
    if (!cleanName || !cleanEmail || !password) {
      const err = new Error('Name, email, and password are required.');
      err.status = 400;
      throw err;
    }

    const exists = store.users.find(
      (u) => (u.email || '').trim().toLowerCase() === cleanEmail
    );
    if (exists) {
      // If user already exists (e.g. seeded), update credentials so user is not blocked
      exists.name = cleanName;
      exists.password = password;
      if (phone) exists.phone = phone.trim();
      if (city) exists.city = city.trim();
      saveStorage('wod_users', store.users);

      // Ensure application is also present for existing user
      const existingApp = store.applications.find(
        (a) => (a.email || '').toLowerCase() === cleanEmail
      );
      if (!existingApp) {
        const seedApp = initialApplications.find((a) => (a.email || '').toLowerCase() === cleanEmail);
        const linkedApp = seedApp || {
          _id: `app_${Date.now()}`,
          user: {
            _id: exists._id,
            name: cleanName,
            email: cleanEmail,
            phone: (phone || '').trim(),
          },
          fullName: cleanName,
          email: cleanEmail,
          phone: (phone || '').trim(),
          age: 22,
          city: (city || '').trim() || 'India',
          state: 'India',
          experienceLevel: 'Beginner / Intermediate',
          ridingExperienceYears: 1,
          ridingBackground: 'Enrolled via Online Registration',
          reason: 'Passionate about Well of Death stunt riding under Master Varsha.',
          emergencyContactName: 'Family Contact',
          emergencyContactPhone: (phone || '').trim(),
          paymentRefNo: '',
          paymentAmount: 4999,
          trainingFee: 4999,
          paymentMethod: '',
          paymentStatus: 'unpaid',
          status: 'Application Submitted',
          courseAccessGranted: false,
          appliedAt: new Date().toISOString(),
        };
        store.applications.unshift(linkedApp);
        saveStorage('wod_applications', store.applications);
      }

      const { password: _, ...safeUser } = exists;
      const token = `wod_token_${exists._id}_${Date.now()}`;
      return { success: true, message: 'Account ready!', token, user: safeUser };
    }

    const newUser = {
      _id: `user_${Date.now()}`,
      name: cleanName,
      email: cleanEmail,
      phone: (phone || '').trim(),
      password,
      role: 'user',
      city: (city || '').trim() || 'India',
      status: 'active',
      createdAt: new Date().toISOString(),
    };

    store.users.push(newUser);
    saveStorage('wod_users', store.users);

    // Automatically initialize linked candidate application so registration is immediately trackable in admin
    const newApp = {
      _id: `app_${Date.now()}`,
      user: {
        _id: newUser._id,
        name: cleanName,
        email: cleanEmail,
        phone: (phone || '').trim(),
      },
      fullName: cleanName,
      email: cleanEmail,
      phone: (phone || '').trim(),
      age: 22,
      city: (city || '').trim() || 'India',
      state: 'India',
      experienceLevel: 'Beginner / Intermediate',
      ridingExperienceYears: 1,
      ridingBackground: 'Enrolled via Online Registration',
      reason: 'Passionate about Well of Death stunt riding under Master Varsha.',
      emergencyContactName: 'Family Contact',
      emergencyContactPhone: (phone || '').trim(),
      paymentRefNo: '',
      paymentAmount: 4999,
      trainingFee: 4999,
      paymentMethod: '',
      paymentStatus: 'unpaid',
      status: 'Application Submitted',
      courseAccessGranted: false,
      appliedAt: new Date().toISOString(),
    };
    store.applications.unshift(newApp);
    saveStorage('wod_applications', store.applications);

    const { password: _, ...safeUser } = newUser;
    const token = `wod_token_${newUser._id}_${Date.now()}`;
    return { success: true, message: 'Account created successfully!', token, user: safeUser };
  }

  if (path === '/auth/me' && method === 'GET') {
    if (!currentUser) {
      const err = new Error('Session not found or expired.');
      err.status = 401;
      throw err;
    }
    const fresh = store.users.find((u) => u._id === currentUser._id) || currentUser;
    const { password: _, ...safeUser } = fresh;
    return { success: true, user: safeUser };
  }

  if (path === '/auth/profile' && method === 'PUT') {
    if (!currentUser) throw new Error('Unauthorized');
    const index = store.users.findIndex((u) => u._id === currentUser._id);
    if (index === -1) throw new Error('User not found');

    store.users[index] = {
      ...store.users[index],
      ...body,
      _id: currentUser._id,
      role: store.users[index].role, // preserve role
    };
    saveStorage('wod_users', store.users);
    const { password: _, ...safeUser } = store.users[index];
    return { success: true, message: 'Profile updated successfully', user: safeUser };
  }

  if (path === '/auth/forgot-password' && method === 'POST') {
    return {
      success: true,
      message: 'Demo Reset Code generated: DEMO-RESET-2026. You may now reset your password.',
      resetToken: 'DEMO-RESET-2026',
    };
  }

  if (path === '/auth/reset-password' && method === 'POST') {
    const { email, newPassword } = body || {};
    const index = store.users.findIndex(
      (u) => u.email.toLowerCase() === (email || '').toLowerCase()
    );
    if (index !== -1) {
      store.users[index].password = newPassword;
      saveStorage('wod_users', store.users);
    }
    return { success: true, message: 'Password has been reset successfully. Please log in.' };
  }

  // 2. SETTINGS ROUTES
  if ((path === '/settings' || path === '/settings/admin') && method === 'GET') {
    return { success: true, settings: store.settings };
  }

  if (path === '/settings/admin' && method === 'PUT') {
    store.settings = { ...store.settings, ...body };
    saveStorage('wod_settings', store.settings);
    return { success: true, message: 'Site CMS configuration saved!', settings: store.settings };
  }

  // 3. FILE UPLOAD ROUTE (Converts file to Base64 Data URL)
  if (path === '/upload' && method === 'POST') {
    let file = null;
    if (body instanceof FormData) {
      file = body.get('image') || body.get('file');
    }
    if (!file && typeof body === 'object') {
      file = body.image || body.file;
    }

    if (!file) {
      return { success: true, url: '/images/gallery/varsha_rider_viral_bullet.jpg' };
    }

    if (file instanceof Blob || file instanceof File) {
      const dataUrl = await fileToDataUrl(file);
      return {
        success: true,
        message: 'Image uploaded successfully (Client Storage)',
        url: dataUrl,
        filename: file.name || 'photo.jpg',
      };
    }

    return {
      success: true,
      url: typeof file === 'string' ? file : '/images/gallery/varsha_rider_viral_bullet.jpg',
    };
  }

  // 4. GALLERY ROUTES
  if (path === '/gallery' && method === 'GET') {
    const category = query.get('category');
    const search = query.get('search');
    let items = [...store.gallery];

    if (category && category !== 'All') {
      items = items.filter((item) => item.category === category);
    }

    if (search) {
      const q = search.toLowerCase();
      items = items.filter(
        (item) =>
          (item.title && item.title.toLowerCase().includes(q)) ||
          (item.caption && item.caption.toLowerCase().includes(q)) ||
          (item.location && item.location.toLowerCase().includes(q))
      );
    }

    return { success: true, count: items.length, items };
  }

  if (path === '/gallery/admin' && method === 'POST') {
    const newItem = {
      _id: `gal_${Date.now()}`,
      title: body.title,
      category: body.category || 'Live Shows',
      imageUrl: body.imageUrl,
      caption: body.caption || '',
      location: body.location || '',
      dateTaken: body.dateTaken || '2026',
      featured: !!body.featured,
      order: store.gallery.length + 1,
      createdAt: new Date().toISOString(),
    };

    store.gallery.unshift(newItem);
    saveStorage('wod_gallery', store.gallery);

    // Audit log
    store.auditLogs.unshift({
      _id: `log_${Date.now()}`,
      admin: { name: currentUser?.name || 'Admin' },
      action: `Added photo "${newItem.title}" to gallery (${newItem.category})`,
      targetType: 'GalleryItem',
      createdAt: new Date().toISOString(),
    });
    saveStorage('wod_audit_logs', store.auditLogs);

    return { success: true, message: 'Photo added to gallery', item: newItem };
  }

  if (path.startsWith('/gallery/admin/') && method === 'DELETE') {
    const id = path.split('/')[3];
    const item = store.gallery.find((g) => g._id === id);
    store.gallery = store.gallery.filter((g) => g._id !== id);
    saveStorage('wod_gallery', store.gallery);

    if (item) {
      store.auditLogs.unshift({
        _id: `log_${Date.now()}`,
        admin: { name: currentUser?.name || 'Admin' },
        action: `Removed photo "${item.title}" from gallery`,
        targetType: 'GalleryItem',
        createdAt: new Date().toISOString(),
      });
      saveStorage('wod_audit_logs', store.auditLogs);
    }

    return { success: true, message: 'Photo deleted from gallery' };
  }

  // 5. VIDEO ROUTES
  if (path === '/videos' && method === 'GET') {
    return { success: true, count: store.videos.length, videos: store.videos };
  }

  if (path === '/videos/admin' && method === 'POST') {
    const newVideo = {
      _id: `vid_${Date.now()}`,
      title: body.title,
      category: body.category || 'Stunt Highlights',
      videoUrl: body.videoUrl,
      thumbnailUrl: body.thumbnailUrl || '/images/gallery/varsha_rider_rx100_arena.jpg',
      duration: body.duration || '1:00',
      description: body.description || '',
      views: 1200,
      likes: 350,
      commentsCount: 15,
      isReel: true,
      featured: true,
      createdAt: new Date().toISOString(),
    };

    store.videos.unshift(newVideo);
    saveStorage('wod_videos', store.videos);

    return { success: true, message: 'Video published successfully', video: newVideo };
  }

  if (path.startsWith('/videos/admin/') && method === 'PUT') {
    const id = path.split('/')[3];
    const index = store.videos.findIndex((v) => v._id === id);
    if (index !== -1) {
      store.videos[index] = {
        ...store.videos[index],
        ...body,
      };
      saveStorage('wod_videos', store.videos);
      return {
        success: true,
        message: 'Stunt video updated successfully',
        video: store.videos[index],
      };
    }
    throw new Error('Video not found');
  }

  if (path.startsWith('/videos/admin/') && method === 'DELETE') {
    const id = path.split('/')[3];
    store.videos = store.videos.filter((v) => v._id !== id);
    saveStorage('wod_videos', store.videos);
    return { success: true, message: 'Video removed successfully' };
  }

  if (path.includes('/like') && method === 'POST') {
    const id = path.split('/')[2];
    const vid = store.videos.find((v) => v._id === id);
    if (vid) {
      vid.likes = (vid.likes || 0) + 1;
      saveStorage('wod_videos', store.videos);
      return { success: true, likes: vid.likes };
    }
    return { success: true, likes: 100 };
  }

  // 6. COURSE & CURRICULUM ROUTES
  if (path === '/courses/public-overview' && method === 'GET') {
    let isSubscribedUser = false;
    if (currentUser) {
      if (currentUser.role === 'admin') {
        isSubscribedUser = true;
      } else {
        const myApp = store.applications.find(
          (a) =>
            (a.user && a.user._id === currentUser._id) ||
            (a.email && a.email.toLowerCase() === currentUser.email?.toLowerCase())
        );
        if (
          myApp &&
          (myApp.courseAccessGranted ||
            myApp.status === 'Training Unlocked' ||
            myApp.status === 'approved' ||
            myApp.status === 'Approved' ||
            myApp.status === 'Completed')
        ) {
          isSubscribedUser = true;
        }
      }
    }
    return { success: true, course: store.course, isSubscribedUser };
  }

  if (path === '/courses/student-curriculum' && method === 'GET') {
    const userProgress = (currentUser && store.progress[currentUser._id]) || {};
    return {
      success: true,
      course: store.course,
      progress: {
        completedLessons: Object.keys(userProgress).filter((k) => userProgress[k]),
      },
    };
  }

  if (path === '/courses/admin/details' && method === 'GET') {
    return { success: true, course: store.course };
  }

  if (path === '/courses/progress' && method === 'POST') {
    if (!currentUser) throw new Error('Unauthorized');
    const { lessonId, completed } = body || {};
    if (!store.progress[currentUser._id]) {
      store.progress[currentUser._id] = {};
    }
    store.progress[currentUser._id][lessonId] = completed !== false;
    saveStorage('wod_progress', store.progress);
    return { success: true, message: 'Progress recorded' };
  }

  if (path === '/courses/admin/revoke-access' && method === 'POST') {
    const { userId, reason } = body || {};
    const app = store.applications.find(
      (a) => a.user?._id === userId || a.email === userId
    );
    if (app) {
      app.courseAccessGranted = false;
      app.status = 'rejected';
      saveStorage('wod_applications', store.applications);
    }
    return { success: true, message: `Access revoked: ${reason || 'Admin action'}` };
  }

  // 7. APPLICATIONS ROUTES
  if (path === '/applications/my-application' && method === 'GET') {
    if (!currentUser) return { success: true, application: null };
    const myApp = store.applications.find(
      (a) =>
        (a.user && a.user._id === currentUser._id) ||
        (a.email && a.email.toLowerCase() === currentUser.email?.toLowerCase())
    );
    return { success: true, application: myApp || null };
  }

  if (path === '/applications/apply' && method === 'POST') {
    if (!currentUser) throw new Error('Please log in to submit training application');
    const newApp = {
      _id: `app_${Date.now()}`,
      user: {
        _id: currentUser._id,
        name: currentUser.name,
        email: currentUser.email,
        phone: currentUser.phone,
      },
      fullName: body.fullName || currentUser.name,
      email: currentUser.email,
      phone: body.phone || currentUser.phone,
      age: body.age || 21,
      city: body.city || currentUser.city,
      ridingExperienceYears: body.ridingExperienceYears || 2,
      ridingBackground: body.ridingBackground || '',
      motivation: body.motivation || '',
      medicalClearanceDeclared: !!body.medicalClearanceDeclared,
      liabilityWaiverAccepted: !!body.liabilityWaiverAccepted,
      status: 'pending',
      paymentStatus: 'unpaid',
      courseAccessGranted: false,
      appliedAt: new Date().toISOString(),
    };

    store.applications.unshift(newApp);
    saveStorage('wod_applications', store.applications);

    return {
      success: true,
      message: 'Training application submitted for review!',
      application: newApp,
    };
  }

  if (path === '/applications/toggle-test-subscription' && method === 'POST') {
    if (!currentUser) throw new Error('Login required');
    let myApp = store.applications.find(
      (a) =>
        (a.user && a.user._id === currentUser._id) ||
        (a.email && a.email.toLowerCase() === currentUser.email?.toLowerCase())
    );

    if (!myApp) {
      myApp = {
        _id: `app_${Date.now()}`,
        user: { _id: currentUser._id, name: currentUser.name, email: currentUser.email },
        fullName: currentUser.name,
        email: currentUser.email,
        phone: currentUser.phone || '+91 99999 88888',
        age: 22,
        city: currentUser.city || 'Delhi',
        status: 'approved',
        paymentStatus: 'paid',
        courseAccessGranted: true,
        appliedAt: new Date().toISOString(),
      };
      store.applications.unshift(myApp);
    } else {
      myApp.status = 'approved';
      myApp.paymentStatus = 'paid';
      myApp.courseAccessGranted = true;
    }

    saveStorage('wod_applications', store.applications);
    return {
      success: true,
      message: 'Demo training access unlocked successfully!',
      application: myApp,
    };
  }

  if (path === '/applications/submit-payment-ref' && method === 'POST') {
    const { applicationId, paymentReference, paymentRefNo, paymentMethod, amount, paymentNotes } = body || {};
    const ref = (paymentRefNo || paymentReference || '').trim();

    let app = store.applications.find((a) => a._id === applicationId);
    if (!app && currentUser) {
      app = store.applications.find(
        (a) =>
          (a.user && a.user._id === currentUser._id) ||
          (a.email && a.email.toLowerCase() === currentUser.email?.toLowerCase())
      );
    }

    if (!app && currentUser) {
      app = {
        _id: `app_${Date.now()}`,
        user: { _id: currentUser._id, name: currentUser.name, email: currentUser.email, phone: currentUser.phone },
        fullName: currentUser.name,
        email: currentUser.email,
        phone: currentUser.phone || '',
        appliedAt: new Date().toISOString(),
      };
      store.applications.unshift(app);
    }

    if (app) {
      app.paymentRefNo = ref;
      app.paymentReference = ref;
      app.paymentMethod = paymentMethod || 'UPI / QR Transfer';
      app.paymentAmount = amount || 4999;
      app.paymentNotes = paymentNotes || '';
      app.paymentStatus = 'processing';
      app.status = 'Payment Processing — Waiting for Admin Approval';
      app.courseAccessGranted = false; // Remains locked until admin explicitly approves
      app.paymentSubmittedAt = new Date().toISOString();
      saveStorage('wod_applications', store.applications);
    }

    const newPayment = {
      _id: `pay_${Date.now()}`,
      user: app?.user || { name: currentUser?.name || 'Trainee', email: currentUser?.email },
      application: app?._id || applicationId,
      amount: amount || 4999,
      currency: 'INR',
      method: paymentMethod || 'UPI / QR Transfer',
      transactionId: ref || `TXN_${Date.now()}`,
      status: 'pending_verification',
      notes: paymentNotes || '',
      paidAt: new Date().toISOString(),
    };

    store.payments.unshift(newPayment);
    saveStorage('wod_payments', store.payments);

    return {
      success: true,
      message: 'Payment reference submitted! Waiting for Admin Approval.',
      application: app,
      payment: newPayment,
    };
  }

  if (path === '/applications/admin/all' && method === 'GET') {
    return { success: true, applications: store.applications };
  }

  if (path.startsWith('/applications/admin/') && path.endsWith('/status') && method === 'PUT') {
    const id = path.split('/')[3];
    const app = store.applications.find((a) => a._id === id);
    if (app) {
      if (
        body.status === 'Training Unlocked' ||
        body.status === 'approved' ||
        body.status === 'Approved'
      ) {
        app.status = 'Training Unlocked';
        app.courseAccessGranted = true;
        app.paymentStatus = 'paid';
        app.approvedAt = new Date().toISOString();
        if (body.adminNotes) app.adminNotes = body.adminNotes;
        if (body.trainingFee) app.trainingFee = Number(body.trainingFee);

        // Update matching payment to successful
        const p = store.payments.find(
          (pay) => pay.application === id || (app.paymentRefNo && pay.transactionId === app.paymentRefNo)
        );
        if (p) {
          p.status = 'successful';
        }
      } else if (body.status === 'rejected' || body.status === 'Rejected') {
        app.status = 'Rejected';
        app.courseAccessGranted = false;
        app.rejectionReason = body.rejectionReason || 'Application rejected by Admin';
        if (body.adminNotes) app.adminNotes = body.adminNotes;
      } else {
        app.status = body.status;
      }
      saveStorage('wod_applications', store.applications);
      saveStorage('wod_payments', store.payments);
      return { success: true, message: `Application status updated to ${app.status}`, application: app };
    }
    throw new Error('Application not found');
  }

  // 8. PAYMENTS ROUTES
  if (path === '/payments/my-payments' && method === 'GET') {
    if (!currentUser) return { success: true, payments: [] };
    const myPays = store.payments.filter(
      (p) =>
        p.user?._id === currentUser._id ||
        p.user?.email?.toLowerCase() === currentUser.email?.toLowerCase()
    );
    return { success: true, payments: myPays };
  }

  if (path === '/payments/admin/all' && method === 'GET') {
    return { success: true, payments: store.payments };
  }

  // 9. ADMIN OVERVIEW & USER MANAGEMENT
  if (path === '/admin/overview' && method === 'GET') {
    const totalRevenue = store.payments
      .filter((p) => p.status === 'successful')
      .reduce((sum, p) => sum + (p.amount || 0), 0);

    return {
      success: true,
      stats: {
        totalUsers: store.users.length,
        totalApplications: store.applications.length,
        approvedApplications: store.applications.filter((a) => a.status === 'approved').length,
        pendingApplications: store.applications.filter((a) => a.status === 'pending').length,
        totalRevenue,
        activeEnrolledTrainees: store.applications.filter((a) => a.courseAccessGranted).length,
        galleryItemsCount: store.gallery.length,
        publicVideosCount: store.videos.length,
      },
      recentApplications: store.applications.slice(0, 5),
      recentPayments: store.payments.slice(0, 5),
      recentAuditLogs: store.auditLogs.slice(0, 10),
    };
  }

  if (path === '/admin/users' && method === 'GET') {
    const safeUsers = store.users.map(({ password: _, ...u }) => u);
    return { success: true, users: safeUsers };
  }

  if (path.startsWith('/admin/users/') && path.endsWith('/status') && method === 'PUT') {
    const id = path.split('/')[3];
    const user = store.users.find((u) => u._id === id);
    if (user) {
      user.status = user.status === 'active' ? 'suspended' : 'active';
      saveStorage('wod_users', store.users);
      const { password: _, ...safeUser } = user;
      return { success: true, message: `User status changed to ${user.status}`, user: safeUser };
    }
    throw new Error('User not found');
  }

  if (path === '/admin/audit-logs' && method === 'GET') {
    return { success: true, logs: store.auditLogs };
  }

  if (path === '/admin/export-platform-data' && method === 'GET') {
    return {
      success: true,
      data: {
        exportedAt: new Date().toISOString(),
        applications: store.applications,
        users: store.users,
        payments: store.payments,
        settings: store.settings,
      },
    };
  }

  if (path === '/admin/import-platform-data' && method === 'POST') {
    const { data } = body || {};
    if (data) {
      if (Array.isArray(data.applications)) {
        store.applications = data.applications;
        saveStorage('wod_applications', store.applications);
      }
      if (Array.isArray(data.users)) {
        store.users = data.users;
        saveStorage('wod_users', store.users);
      }
      if (Array.isArray(data.payments)) {
        store.payments = data.payments;
        saveStorage('wod_payments', store.payments);
      }
      if (data.settings && typeof data.settings === 'object') {
        store.settings = { ...store.settings, ...data.settings };
        saveStorage('wod_settings', store.settings);
      }
      return { success: true, message: 'Platform data imported and synced successfully!' };
    }
    throw new Error('Invalid platform backup data');
  }

  // Fallback for unhandled endpoints
  return { success: true, message: 'OK', data: {} };
};

const BASE_URL = import.meta.env.VITE_API_URL || '/api';

// Exported apiClient object connecting to live MongoDB Atlas with smart fallback
export const apiClient = {
  async request(endpoint, options = {}) {
    const method = (options.method || 'GET').toUpperCase();

    // 1. Attempt Live MongoDB Atlas API
    try {
      const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
      const url = cleanEndpoint.startsWith('http')
        ? cleanEndpoint
        : `${BASE_URL.replace(/\/$/, '')}${cleanEndpoint}`;

      const token = localStorage.getItem('wod_token');
      const isFormData = typeof FormData !== 'undefined' && options.body instanceof FormData;

      const headers = {
        ...(!isFormData && { 'Content-Type': 'application/json' }),
        ...options.headers,
      };

      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const config = {
        ...options,
        method,
        headers,
      };

      if (options.body && typeof options.body === 'object' && !isFormData) {
        config.body = JSON.stringify(options.body);
      }

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000);
      config.signal = controller.signal;

      const response = await fetch(url, config);
      clearTimeout(timeoutId);

      const contentType = response.headers.get('content-type') || '';
      if (contentType.includes('application/json')) {
        const data = await response.json();
        if (response.ok) {
          return data;
        }
        if (response.status < 500 && data?.message) {
          const err = new Error(data.message);
          err.status = response.status;
          throw err;
        }
      }
    } catch (err) {
      if (err.status && err.status < 500) {
        // Real validation / auth error from MongoDB
        throw err;
      }
      // Live MongoDB backend offline or waiting for Atlas IP whitelist, fallback to in-browser storage
      console.warn('[MongoDB Atlas Notice]: Live API call to ' + endpoint + ' was unavailable (' + err.message + '). Using local synced storage fallback.');
    }

    // 2. Fallback to in-browser synced storage
    return mockRouter(method, endpoint, options.body);
  },

  get(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'GET' });
  },

  post(endpoint, body, options = {}) {
    return this.request(endpoint, { ...options, method: 'POST', body });
  },

  upload(endpoint, formData, options = {}) {
    return this.request(endpoint, { ...options, method: 'POST', body: formData });
  },

  put(endpoint, body, options = {}) {
    return this.request(endpoint, { ...options, method: 'PUT', body });
  },

  delete(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'DELETE' });
  },
};
