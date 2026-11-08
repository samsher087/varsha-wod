import React from 'react';

export const RefundPolicyPage = () => {
  return (
    <div className="bg-slate-950 min-h-screen pt-36 pb-24 text-slate-300">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <h1 className="text-3xl sm:text-5xl font-black text-white uppercase tracking-tight">
            Fee & Refund <span className="text-gradient-fire">Policy</span>
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-slate-400">
            Transparent Guidelines for Training Tuition & Processing
          </p>
        </div>

        <div className="p-8 sm:p-10 rounded-3xl bg-slate-900/90 backdrop-blur-xl border border-slate-800 shadow-2xl space-y-6 text-xs sm:text-sm leading-relaxed text-slate-400 card-top-line">
          <section className="space-y-2">
            <h3 className="text-base font-bold text-white uppercase flex items-center gap-2">
              <span className="text-cyan-400 font-mono">01.</span> Application Review Fee
            </h3>
            <p>
              Submitting an initial application for vetting and instructor review is 100% free of charge. No payment is collected until your application is approved by Master Rider Varsha Rider.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="text-base font-bold text-white uppercase flex items-center gap-2">
              <span className="text-cyan-400 font-mono">02.</span> Tuition Refund Window
            </h3>
            <p>
              Following approved tuition payment and prior to streaming more than 2 video modules, students may request a 100% refund within 48 hours by contacting support.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="text-base font-bold text-white uppercase flex items-center gap-2">
              <span className="text-cyan-400 font-mono">03.</span> Processing of Approved Refunds
            </h3>
            <p>
              Verified refunds are processed back to the original source account (UPI, Bank, Card) via the Razorpay payment gateway within 5 to 7 business days.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};
