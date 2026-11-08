import React from 'react';

export const InstagramIcon = ({ className = 'w-4 h-4' }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

export const YoutubeIcon = ({ className = 'w-4 h-4' }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
    <path d="m10 15 5-3-5-3z" />
  </svg>
);

export const FacebookIcon = ({ className = 'w-4 h-4' }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

export const InstagramReelIcon = ({ className = 'w-4 h-4' }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect width="18" height="18" x="3" y="3" rx="4" />
    <path d="M3 9h18" />
    <path d="M8.5 3 6.5 9" />
    <path d="M14.5 3 12.5 9" />
    <polygon points="10 12.5 15 15.5 10 18.5 10 12.5" fill="currentColor" stroke="none" />
  </svg>
);

// Official Full Color Instagram Icon (As uploaded)
export const InstagramColorIcon = ({ className = 'w-4 h-4' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none">
    <defs>
      <radialGradient id="igRadialGrad" cx="15%" cy="105%" r="120%">
        <stop offset="0%" stopColor="#ffd600" />
        <stop offset="15%" stopColor="#ff7a00" />
        <stop offset="50%" stopColor="#ff0169" />
        <stop offset="100%" stopColor="#d300c5" />
      </radialGradient>
      <linearGradient id="igLinearGrad" x1="0%" y1="100%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#ff7a00" />
        <stop offset="50%" stopColor="#ff0169" />
        <stop offset="100%" stopColor="#7638fa" />
      </linearGradient>
    </defs>
    <rect width="24" height="24" rx="6.5" fill="url(#igLinearGrad)" />
    <rect width="24" height="24" rx="6.5" fill="url(#igRadialGrad)" opacity="0.85" />
    <rect x="3.5" y="3.5" width="17" height="17" rx="4.8" stroke="#ffffff" strokeWidth="1.9" fill="none" />
    <circle cx="12" cy="12" r="4.3" stroke="#ffffff" strokeWidth="1.9" fill="none" />
    <circle cx="17.2" cy="6.8" r="1.25" fill="#ffffff" />
  </svg>
);

// Official Full Color Facebook Icon (Circular blue with white 'f', as uploaded)
export const FacebookColorIcon = ({ className = 'w-4 h-4' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="12" fill="#1877F2" />
    <path
      d="M16.5 12.2h-2.9V21h-3.7v-8.8H8.1V9.2h1.8V7c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.5h-1.3c-1.2 0-1.6.8-1.6 1.6v1.8h3.1l-.5 3z"
      fill="#ffffff"
    />
  </svg>
);

