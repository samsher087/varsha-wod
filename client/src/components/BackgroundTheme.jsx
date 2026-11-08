import React from 'react';

export const BackgroundTheme = () => {
  return (
    <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden select-none">
      {/* 3D Satin Pink Wallpaper Base */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-1000 scale-[1.02]"
        style={{
          backgroundImage: "url('/images/theme_bg_pink_3d.jpg')",
          backgroundAttachment: 'fixed',
        }}
      />

      {/* Atmospheric Soft Pink / Velvet Plum Overlay for Optimum Text Legibility */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#260519]/75 via-[#1c0312]/50 to-[#260519]/85" />
      <div className="absolute inset-0 bg-radial from-transparent via-[#1a0210]/40 to-[#12010b]/90" />

      {/* Ambient 3D Glowing Light Spheres */}
      <div className="absolute -top-32 -left-32 w-[650px] h-[650px] rounded-full bg-gradient-to-br from-pink-500/25 via-rose-500/15 to-transparent blur-[140px]" />
      <div className="absolute top-1/3 -right-40 w-[600px] h-[600px] rounded-full bg-gradient-to-bl from-fuchsia-600/20 via-pink-500/15 to-transparent blur-[150px]" />
      <div className="absolute -bottom-32 left-1/4 w-[750px] h-[550px] rounded-full bg-gradient-to-t from-rose-600/25 via-pink-600/15 to-transparent blur-[160px]" />

      {/* Subtle Micro-glint Overlay */}
      <div className="absolute inset-0 opacity-[0.035] bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px]" />
    </div>
  );
};

