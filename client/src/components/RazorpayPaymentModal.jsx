import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { apiClient } from '../api/client';
import { UpiQrCode } from './UpiQrCode';
import {
  CreditCard,
  CheckCircle2,
  AlertTriangle,
  X,
  Lock,
  Smartphone,
  Building,
  ShieldCheck,
  Loader2,
  QrCode,
  ArrowRight,
  Copy,
  Check,
  FileCheck2,
} from 'lucide-react';

export const RazorpayPaymentModal = ({
  isOpen,
  onClose,
  trainingFee = 4999,
  existingRefNo = '',
  applicationId = '',
  onPaymentSuccess,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedMethod, setSelectedMethod] = useState('UPI'); // 'UPI', 'Bank', 'Gateway'
  const [paymentRefNo, setPaymentRefNo] = useState(existingRefNo || '');
  const [paymentNotes, setPaymentNotes] = useState('');
  const [copiedField, setCopiedField] = useState('');

  // Keep reference field blank for user to enter manually on open
  useEffect(() => {
    if (isOpen) {
      setPaymentRefNo(existingRefNo || '');
      setError('');
    }
  }, [isOpen, existingRefNo]);

  if (!isOpen) return null;

  const handleCopy = (text, fieldName) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(''), 2000);
  };

  const handleSubmitPaymentRef = async (e) => {
    if (e) e.preventDefault();
    if (!paymentRefNo.trim()) {
      setError('Please manually enter your Payment Reference Number / UTR / Transaction ID.');
      return;
    }

    try {
      setLoading(true);
      setError('');

      const res = await apiClient.post('/applications/submit-payment-ref', {
        applicationId: applicationId || undefined,
        paymentRefNo: paymentRefNo.trim(),
        paymentReference: paymentRefNo.trim(),
        paymentMethod:
          selectedMethod === 'UPI'
            ? 'UPI / QR Transfer'
            : 'Bank Transfer (IMPS/NEFT)',
        amount: trainingFee,
        paymentNotes: paymentNotes.trim(),
      });

      if (res?.success) {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#00e5ff', '#00ff88', '#ffb700', '#ff3366'],
        });

        if (onPaymentSuccess) {
          onPaymentSuccess(res.application);
        }
        onClose();
      }
    } catch (err) {
      setError(err.message || 'Failed to submit payment reference. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-slate-900/95 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl card-top-line max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-950 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 flex items-center justify-center">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                Step 02: Payment Process
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-400 font-bold border border-cyan-500/30">
                  ATTACH REF NO.
                </span>
              </h3>
              <p className="text-xs text-slate-400">Well of Death Professional Training Academy</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 space-y-5 overflow-y-auto flex-1">
          {error && (
            <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 flex items-start gap-2.5 text-xs text-red-300">
              <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Pricing summary */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-400 uppercase font-semibold tracking-wider">
                Approved Tuition Fee
              </span>
              <h4 className="text-2xl font-black text-white">
                <span className="text-cyan-300">₹{trainingFee.toLocaleString('en-IN')}</span>
                <span className="text-xs font-normal text-slate-400 ml-1.5">(All Inclusive)</span>
              </h4>
            </div>
            <div className="text-right">
              <span className="text-[11px] px-2.5 py-1 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 font-semibold">
                8-Week Curriculum
              </span>
            </div>
          </div>

          {/* Payment Method Tabs */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
              Choose Payment Mode
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setSelectedMethod('UPI')}
                className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-1.5 transition-all cursor-pointer ${selectedMethod === 'UPI'
                    ? 'border-cyan-500 bg-cyan-500/15 text-cyan-300 shadow-md ring-1 ring-cyan-500/30'
                    : 'border-slate-800 bg-slate-950 text-slate-400 hover:bg-slate-800'
                  }`}
              >
                <Smartphone className="w-4 h-4" />
                UPI / QR Code
              </button>
              <button
                type="button"
                onClick={() => setSelectedMethod('Bank')}
                className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-1.5 transition-all cursor-pointer ${selectedMethod === 'Bank'
                    ? 'border-cyan-500 bg-cyan-500/15 text-cyan-300 shadow-md ring-1 ring-cyan-500/30'
                    : 'border-slate-800 bg-slate-950 text-slate-400 hover:bg-slate-800'
                  }`}
              >
                <Building className="w-4 h-4" />
                Bank Transfer
              </button>
            </div>
          </div>

          {/* Method Details Box: UPI / QR Code */}
          {selectedMethod === 'UPI' && (
            <div className="space-y-3 animate-in fade-in">
              <UpiQrCode
                upiId="9006284803-2@axl"
                name="Varsha Rider"
                amount={trainingFee}
                note="Well of Death Training Fee"
                qrImageUrl="/images/payment_upi_qr.jpg"
              />

              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-400">Official Mobile / GPay / PhonePe:</span>
                <div className="flex items-center gap-2">
                  <code className="text-slate-200 font-mono font-bold">+91 9006284803</code>
                  <button
                    type="button"
                    onClick={() => handleCopy('+91 9006284803', 'phone')}
                    className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
                  >
                    {copiedField === 'phone' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <p className="text-[11px] text-slate-400 leading-relaxed px-1">
                Scan the QR code above with PhonePe, Google Pay, Paytm, or BHIM. After payment is completed, copy the 12-digit UPI Reference / UTR Number and paste it in the field below.
              </p>
            </div>
          )}

          {selectedMethod === 'Bank' && (
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2.5 text-xs animate-in fade-in">
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Account Name:</span>
                <span className="font-bold text-white">Md Nijamuddin Ansari</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Bank Name:</span>
                <span className="font-bold text-white">Bank of India</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Branch:</span>
                <span className="font-medium text-slate-300">Remba (Giridih, Jharkhand)</span>
              </div>
              <div className="flex justify-between items-center pt-1 border-t border-slate-800/80">
                <span className="text-slate-400">Account Number:</span>
                <div className="flex items-center gap-2">
                  <code className="text-cyan-300 font-mono font-bold select-all">48710110003304</code>
                  <button
                    type="button"
                    onClick={() => handleCopy('48710110003304', 'acc')}
                    className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 cursor-pointer transition-colors"
                  >
                    {copiedField === 'acc' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">IFSC Code:</span>
                <div className="flex items-center gap-2">
                  <code className="text-cyan-300 font-mono font-bold select-all">BKID0004887</code>
                  <button
                    type="button"
                    onClick={() => handleCopy('BKID0004887', 'ifsc')}
                    className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 cursor-pointer transition-colors"
                  >
                    {copiedField === 'ifsc' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* REQUIRED REFERENCE NUMBER INPUT FORM - MANUALLY FILLED BY USER */}
          <form onSubmit={handleSubmitPaymentRef} className="space-y-4 pt-2">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                  <FileCheck2 className="w-4 h-4 text-cyan-400" />
                  Attach Payment Reference Number *
                </label>
                <span className="text-[10px] text-amber-400 font-bold">MANUAL ENTRY REQUIRED</span>
              </div>
              <input
                type="text"
                required
                value={paymentRefNo}
                onChange={(e) => setPaymentRefNo(e.target.value)}
                placeholder="Enter 12-digit UPI UTR / Ref No. manually (e.g. 529104829104)"
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 focus:border-cyan-500 text-sm font-mono text-cyan-300 placeholder-slate-600 focus:outline-none shadow-inner"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Enter the 12-digit UTR or transaction reference number from your payment app manually.
              </p>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">
                Additional Notes / Remarks (Optional)
              </label>
              <input
                type="text"
                value={paymentNotes}
                onChange={(e) => setPaymentNotes(e.target.value)}
                placeholder="e.g. Sent via PhonePe from mobile ending in 5975"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-slate-700"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-cyan-600 via-teal-600 to-emerald-500 hover:from-cyan-500 hover:to-emerald-400 text-white font-extrabold text-sm uppercase tracking-wider shadow-xl shadow-cyan-950/60 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Attaching Reference & Submitting...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Attach Reference & Submit for Admin Approval</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
