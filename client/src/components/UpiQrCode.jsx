import React, { useMemo, useState } from 'react';
import { Copy, Check, ExternalLink, QrCode as QrIcon, ShieldCheck } from 'lucide-react';
import paymentQrImg from '../assets/payment_upi_qr.jpg';

export const UpiQrCode = ({
  upiId = '9006284803-2@axl',
  name = 'Md Nijamuddin Ansari',
  amount = 4999,
  note = 'Well of Death Training Fee',
  qrImageUrl = paymentQrImg,
}) => {
  const [copied, setCopied] = useState(false);

  // Standard UPI URI format (with exact parameters matching the official QR)
  const upiUri = useMemo(() => {
    return `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(
      name
    )}&am=${amount}&cu=INR&tn=${encodeURIComponent(note)}&mode=02&purpose=00`;
  }, [upiId, name, amount, note]);

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(upiId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-2xl bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950 border border-cyan-500/30 p-5 space-y-4 shadow-xl text-center animate-in fade-in">
      {/* Header Badge */}
      <div className="flex items-center justify-between pb-2 border-b border-white/10 text-xs">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
            <QrIcon className="w-4 h-4 text-cyan-400" />
            Official UPI QR Code
          </span>
        </div>
        <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-extrabold text-[11px] border border-emerald-500/30">
          ₹{amount.toLocaleString('en-IN')}
        </span>
      </div>

      {/* Main Scannable QR Code Card */}
      <div className="relative inline-block mx-auto">
        <div className="p-3 bg-white rounded-2xl shadow-2xl border-2 border-cyan-500/40 inline-block relative group max-w-[260px] sm:max-w-[280px]">
          <img
            src={qrImageUrl || paymentQrImg}
            alt="Official PhonePe / Airtel Payments Bank QR Code"
            className="w-full h-auto block rounded-xl shadow-sm object-contain"
          />
        </div>

        {/* Scan instruction subtitle */}
        <p className="text-[11px] font-semibold text-zinc-300 mt-2.5 flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
          <span>Scan with PhonePe, Google Pay, Paytm, or BHIM</span>
        </p>
      </div>

      {/* UPI Apps supported bar */}
      <div className="flex items-center justify-center gap-2 text-[10px] font-bold text-zinc-400 uppercase tracking-wider py-1.5 px-3 rounded-xl bg-slate-900 border border-slate-800">
        <span className="text-white">Supported:</span>
        <span className="text-purple-400 font-extrabold">PhonePe</span>
        <span>•</span>
        <span className="text-cyan-400 font-bold">GPay</span>
        <span>•</span>
        <span className="text-sky-400 font-bold">Paytm</span>
        <span>•</span>
        <span className="text-emerald-400 font-bold">BHIM UPI</span>
      </div>

      {/* Payee Details Card */}
      <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5 text-xs text-left">
        <div className="flex items-center justify-between">
          <span className="text-[10px] uppercase font-bold text-zinc-500">
            Payee Name
          </span>
          <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded-full">
            Verified Merchant
          </span>
        </div>
        <div className="font-bold text-white text-sm">
          {name}
        </div>
        <div className="text-[11px] text-zinc-400 flex items-center gap-1.5">
          <span className="inline-block w-2 h-2 rounded-full bg-cyan-400" />
          <span>Airtel Payments Bank (A/C: •••• 4803)</span>
        </div>
      </div>

      {/* UPI ID Row with Quick Copy */}
      <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs text-left">
        <div>
          <span className="text-[10px] uppercase font-bold text-zinc-500 block">
            Payee UPI ID
          </span>
          <code className="text-cyan-300 font-mono font-bold text-sm tracking-wide select-all">
            {upiId}
          </code>
        </div>
        <button
          type="button"
          onClick={handleCopyUpi}
          className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-zinc-200 text-xs font-bold transition-all flex items-center gap-1.5 border border-slate-700 cursor-pointer"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 text-zinc-400" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Mobile Deep Link */}
      <div className="pt-1">
        <a
          href={upiUri}
          className="w-full py-2.5 px-4 rounded-xl bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-300 border border-cyan-500/30 text-xs font-bold transition-all flex items-center justify-center gap-2"
        >
          <span>Tap to Pay on Mobile UPI App</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  );
};
