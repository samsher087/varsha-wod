import React from 'react';
import { ShieldAlert, AlertTriangle, CheckCircle2, PhoneCall } from 'lucide-react';
import { Link } from 'react-router-dom';

export const SafetyDisclaimerPage = () => {
  return (
    <div className="bg-slate-950 min-h-screen pt-36 pb-24 text-slate-300">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-500/15 text-rose-300 border border-rose-500/30 text-xs font-bold uppercase tracking-wider mb-4 animate-pulse">
            <ShieldAlert className="w-4 h-4 text-rose-400" />
            Mandatory Risk & Safety Protocol
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white uppercase tracking-tight">
            Safety & Non-Attempt <span className="text-gradient-fire">Disclaimer</span>
          </h1>
          <p className="mt-3 text-xs sm:text-sm text-slate-400">
            Last Updated: Official Stunt Arena Standard 2026
          </p>
        </div>

        <div className="p-8 sm:p-10 rounded-3xl bg-slate-900/90 backdrop-blur-xl border border-slate-800 shadow-2xl space-y-8 text-xs sm:text-sm leading-relaxed card-top-line">
          {/* Prominent Callout */}
          <div className="p-5 rounded-2xl bg-rose-950/40 border border-rose-500/40 text-rose-200 space-y-2 card-top-line">
            <h3 className="font-bold uppercase tracking-wider flex items-center gap-2 text-rose-300">
              <AlertTriangle className="w-5 h-5 shrink-0" />
              Critical Life & Safety Warning
            </h3>
            <p>
              The Well of Death (Maut Ka Kuan) involves extreme centrifugal forces, steep vertical inclinations (85° to 88°), and high-speed orbital motorcycle operation. <strong>Do NOT attempt to recreate, simulate, or practice any maneuvers shown on this website on public roads, homemade structures, or without certified professional supervision.</strong>
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="text-base font-bold text-white uppercase tracking-wider border-l-2 border-cyan-400 pl-2.5">
              1. Nature of the Online Training Course
            </h3>
            <p className="text-slate-400">
              The video lessons and curriculum modules provided on this platform are designed for theoretical understanding, engineering comprehension, and physical conditioning. Completion of this online course alone does <strong>not</strong> confer a license, certification, or qualification to operate a motorcycle inside a vertical wooden barrel.
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="text-base font-bold text-white uppercase tracking-wider border-l-2 border-cyan-400 pl-2.5">
              2. Supervised Arena Training Prerequisite
            </h3>
            <p className="text-slate-400">
              Any physical practice must be conducted strictly within a certified, tension-tested wooden arena under the direct, in-person supervision of Master Rider Varsha Rider and certified stunt safety personnel. All arena sessions require emergency paramedic personnel and high-velocity safety netting.
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="text-base font-bold text-white uppercase tracking-wider border-l-2 border-cyan-400 pl-2.5">
              3. Medical and Physical Preparedness
            </h3>
            <p className="text-slate-400">
              Centrifugal acceleration subjects the human body to 2.0G to 3.0G lateral forces, causing rapid blood displacement. Trainees must have no history of cardiovascular defects, untreated vertigo, epilepsy, or inner ear vestibular imbalances. A signed medical fitness certificate is mandatory prior to any physical arena entry.
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="text-base font-bold text-white uppercase tracking-wider border-l-2 border-cyan-400 pl-2.5">
              4. Emergency Contacts & Data Usage
            </h3>
            <p className="text-slate-400">
              Emergency contact information collected during registration is strictly used for arena security and medical preparedness protocols. Access to emergency data is restricted exclusively to authorized administrative staff.
            </p>
          </div>

          <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-xs text-slate-500">
              Have questions regarding our safety protocols?
            </span>
            <Link
              to="/contact"
              className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-white font-bold text-xs border border-slate-700 hover:border-cyan-500/40 transition-colors"
            >
              Contact Safety Director
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
