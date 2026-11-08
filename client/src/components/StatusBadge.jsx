import React from 'react';
import {
  Clock,
  CreditCard,
  CheckCircle2,
  Unlock,
  XCircle,
  AlertCircle,
  Award,
} from 'lucide-react';

export const StatusBadge = ({ status }) => {
  switch (status) {
    case 'Application Submitted':
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
          <Clock className="w-3.5 h-3.5 text-cyan-400" />
          Application Submitted
        </span>
      );

    case 'Payment Submitted — Pending Admin Approval':
    case 'Payment Processing — Waiting for Admin Approval':
    case 'Waiting for Admin Approval':
    case 'Pending Admin Approval':
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-300 border border-amber-500/40">
          <Clock className="w-3.5 h-3.5 text-amber-400 animate-spin" style={{ animationDuration: '4s' }} />
          Payment Attached — Waiting for Admin Approval
        </span>
      );

    case 'Pending Approval':
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-300 border border-amber-500/30">
          <Clock className="w-3.5 h-3.5 text-amber-400 animate-spin" style={{ animationDuration: '4s' }} />
          Pending Approval
        </span>
      );

    case 'Approved — Payment Required':
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/15 text-cyan-300 border border-cyan-500/40">
          <CreditCard className="w-3.5 h-3.5 text-cyan-400" />
          Approved — Payment Required
        </span>
      );

    case 'Payment Pending':
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-yellow-500/15 text-yellow-300 border border-yellow-500/30">
          <AlertCircle className="w-3.5 h-3.5 text-yellow-400" />
          Payment Pending
        </span>
      );

    case 'Payment Successful':
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/15 text-blue-300 border border-blue-500/30">
          <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />
          Payment Successful
        </span>
      );

    case 'approved':
    case 'Approved':
    case 'Training Unlocked':
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm shadow-emerald-500/20">
          <Unlock className="w-3.5 h-3.5 text-emerald-400" />
          Training Unlocked
        </span>
      );

    case 'Rejected':
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-red-500/15 text-red-300 border border-red-500/30">
          <XCircle className="w-3.5 h-3.5 text-red-400" />
          Rejected
        </span>
      );

    case 'Completed':
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-purple-500/15 text-purple-300 border border-purple-500/30">
          <Award className="w-3.5 h-3.5 text-purple-400" />
          Certified Complete
        </span>
      );

    default:
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-zinc-800 text-zinc-300 border border-zinc-700">
          {status || 'Unknown'}
        </span>
      );
  }
};
