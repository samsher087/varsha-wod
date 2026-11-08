import React from 'react';
import { Link } from 'react-router-dom';
import { Flame, Home, ArrowLeft } from 'lucide-react';

export const NotFoundPage = () => {
  return (
    <div className="bg-slate-950 min-h-screen pt-36 pb-24 flex items-center justify-center px-4 text-center">
      <div className="max-w-md mx-auto space-y-6">
        <div className="w-20 h-20 rounded-3xl bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 flex items-center justify-center mx-auto shadow-2xl shadow-cyan-950/50">
          <Flame className="w-10 h-10 animate-bounce" />
        </div>
        <h1 className="text-6xl sm:text-7xl font-black text-white">404</h1>
        <h2 className="text-xl font-bold text-slate-200 uppercase tracking-wider">
          Track Out of Bounds
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
          The stunt track or page you are looking for has been relocated or does not exist.
        </p>
        <div className="pt-2">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-cyan-600 via-teal-600 to-emerald-500 hover:from-cyan-500 hover:to-emerald-400 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-cyan-950/60 transition-all"
          >
            <Home className="w-4 h-4" />
            <span>Return to Arena Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
