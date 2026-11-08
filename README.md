# Well of Death (Maut Ka Kuan) Rider — Official Website & Online Training Platform

A complete, high-octane, production-ready website and certified online training platform for professional Well of Death (Maut Ka Kuan) stunt rider **Samsher Alam**.

Built with a bold, cinematic dark theme accented with fiery reds, blazing oranges, and golden yellows, this platform showcases the rider's profile, live arena stunts, photo gallery, public video reels, achievements, and features an end-to-end training application, admin vetting, Razorpay payment verification, and an access-controlled student training academy.

---

## 🚀 Key Features

### 1. Website Design & Branding
- **Fiery Dark Theme**: Deep black (`#08080a`) with glowing red, orange, and amber accents.
- **Cinematic Hero**: Video background with adrenaline sound toggle, headline, dynamic CTAs, and live physics telemetry counters (88° wall incline, 14+ years experience, 650+ shows, 100% zero-injury record).
- **Interactive Stunt Highlights**: Physics breakdowns of vertical orbits, hands-free peg stands, tandem twin-motorcycle synchronization, and sensory blindfold climbs.
- **Dynamic Content Management (CMS)**: Brand name, tagline, hero text, training price, contact details, and social links are editable in real-time from the Admin dashboard.

### 2. Public Pages
- **Home Page (`/`)**: Hero section, bio spotlight, stunt highlights, photo & video showcases, 4-step academy teaser, audience testimonials, and arena tour information.
- **About Rider (`/about`)**: Biography, origin story, physics principles (centripetal force, static friction, gyroscopic inertia), career milestones, and safety protocols.
- **Photo Gallery (`/gallery`)**: Filterable categories (Live Shows, Riding Stunts, Events, Behind the Scenes, Achievements), keyword search, and fullscreen image lightbox with next/previous keyboard navigation.
- **Public Videos (`/videos`)**: Curated public stunt reels with embedded HD video player modal. Strictly separated from protected training videos.
- **Training Overview (`/training`)**: Curriculum syllabus, prerequisites, risk acknowledgement, and application walkthrough.
- **Contact & Booking (`/contact`)**: Booking and inquiry form with anti-spam honeypot, validation, headquarters address, and direct WhatsApp / phone links.
- **Compliance & Legal**:
  - `/safety-disclaimer`: Mandatory risk warnings, non-attempt notice, medical fitness requirements.
  - `/terms`: Terms of service, safety rules, intellectual property protection.
  - `/privacy`: Data confidentiality and emergency contact security.
  - `/refund-policy`: Transparent fee policies.

### 3. User Authentication & Authorization
- Secure JWT-based authentication with bcrypt password hashing.
- Role-based access control (`user` vs `admin`).
- User profile management, password resets, and session recovery.
- One-click demo credential fillers on login page for instant testing.

### 4. Training Registration & Approval Workflow
1. **Apply for Training**: Logged-in user submits age (18+), experience level, motivation, emergency contact details, and signs the legal safety waiver.
2. **Admin Review**: Application enters `Pending Approval`. Master Rider Samsher Alam reviews credentials and sets approved status or rejection reason.
3. **Razorpay Payment**: Approved applicant sees configured fee in dashboard. Complete checkout with UPI, Card, NetBanking (supports Razorpay test mode & interactive simulation). Backend verifies cryptographic HMAC SHA256 signatures.
4. **Academy Unlocked**: Upon successful backend verification, status updates to `Training Unlocked`. Video streaming routes (`/api/courses/stream/:lessonId`) verify short-lived JWT playback tokens, preventing unauthorized URL access.
5. **Progress Tracking**: Trainees can mark lessons completed, monitor progress percentages, and resume where they left off.

### 5. Admin / Owner Dashboard (`/admin`)
- **Overview Analytics**: Real-time KPI counters (Total users, applications, pending approvals, approved awaiting payment, paid active students, verified revenue in INR, gallery items, videos).
- **Application Management**: Filter by status, search by candidate, approve with custom fee override, reject with mandatory reason, add internal admin notes.
- **User Management**: View accounts, search, toggle active / suspended status.
- **Payment Ledger**: Transaction table with order IDs, payment IDs, amounts, payment methods, and one-click CSV export.
- **Course & Video Management**: Manage modules, lessons, durations, video sources, and revoke access with an audit trail.
- **Website CMS**: Live editing of hero copy, rider bio, contact numbers, social links, and Razorpay API credentials.
- **Gallery & Video Manager**: Upload and remove photos and public videos.
- **Audit Logs**: Chronological logging of all administrative actions.

---

## 🛠 Technology Stack

- **Frontend**: React 19, Vite, Tailwind CSS v4, React Router v7, Lucide Icons, Canvas Confetti.
- **Backend**: Node.js, Express.js, Mongoose, JSON Web Tokens (JWT), BcryptJS, Helmet, CORS, Morgan, Crypto (HMAC SHA-256).
- **Database**: MongoDB (Local or MongoDB Atlas).
- **Payment Processing**: Razorpay (Test mode & interactive simulator with server-side signature verification).

---

## 🔑 Demo Credentials (Seeded by Default)

| Role | Email | Password |
| :--- | :--- | :--- |
| **Admin / Owner** | `admin@samsher-wod.com` | `AdminPassword@123` |
| **Sample Trainee** | `rider.trainee@example.com` | `Password@123` |

---

## 🏃 Getting Started & Running Locally

### 1. Prerequisites
- Node.js (v18+)
- MongoDB (Running locally on `mongodb://127.0.0.1:27017` or MongoDB Atlas URI)

### 2. Installation
```bash
# Clone the repository
git clone <repo-url>
cd beingsamsher-wod

# Install all workspace dependencies (root, server, client)
npm install
```

### 3. Environment Variables
Server environment variables are configured in `server/.env`:
```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/well_of_death
JWT_SECRET=well_of_death_jwt_super_secret_key_stunt_rider_2026
RAZORPAY_KEY_ID=rzp_test_WODLiveDemoKey
RAZORPAY_KEY_SECRET=WOD_TestSecret_VerifySig99
NODE_ENV=development
```

### 4. Seed the Database
Populates admin user, trainee user, courses, modules, gallery images, videos, and settings:
```bash
node server/utils/seedData.js
```

### 5. Build and Start Application
```bash
# Build the production frontend bundle
npm --prefix client run build

# Start the full-stack server (serves frontend and API on port 5000)
node server/index.js
```
Open [http://localhost:5000](http://localhost:5000) in your web browser.

For frontend hot-reload development:
```bash
# In separate terminal:
npm --prefix client run dev
```
Open [http://localhost:3000](http://localhost:3000).

---

## 🧪 Automated End-to-End Test

To run the automated 12-step test script:
```bash
node test_e2e_flow.js
```

**Verified Test Steps:**
1. Visitor registers a new account.
2. Visitor logs in and receives JWT authentication token.
3. User submits training application with age, experience, reason, emergency contact, and signed waiver.
4. Application appears in Admin dashboard under `Pending Approval`.
5. Admin reviews and approves application (status -> `Approved — Payment Required`).
6. User sees approved tuition fee (₹4,999) and payment CTA.
7. Verification that course is locked (403 Forbidden) prior to payment.
8. Failed / tampered payment signature test (rejected with 400 Bad Request, access remains locked).
9. User completes Razorpay payment and backend validates signature.
10. Training course is unlocked (`Training Unlocked`) with tokenized video stream links.
11. An unapproved second user receives 403 Forbidden attempting to access the curriculum.
12. Admin revokes access with audit log note (status -> locked again).

---

## 🔒 Security & Data Protection
- Passwords salted and hashed with `bcryptjs`.
- Sensitive admin endpoints protected by `protect` and `adminOnly` middlewares.
- Payment signatures cryptographically verified with `crypto.createHmac('sha256', secret)`.
- Protected training video streams require signed, short-lived tokens.
- Contact form protected with validation and anti-spam honeypot.
- Emergency contact details restricted exclusively to administrative personnel.
