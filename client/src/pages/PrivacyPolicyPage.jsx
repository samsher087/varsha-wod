import React from 'react';

export const PrivacyPolicyPage = () => {
  return (
    <div className="bg-slate-950 min-h-screen pt-36 pb-24 text-slate-300">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <h1 className="text-3xl sm:text-5xl font-black text-white uppercase tracking-tight">
            Privacy <span className="text-gradient-fire">Policy</span>
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-slate-400">
            Commitment to Candidate Data Protection & Safety Contact Confidentiality
          </p>
        </div>

        <div className="p-8 sm:p-10 rounded-3xl bg-slate-900/90 backdrop-blur-xl border border-slate-800 shadow-2xl space-y-6 text-xs sm:text-sm leading-relaxed text-slate-400 card-top-line">
          <section className="space-y-2">
            <h3 className="text-base font-bold text-white uppercase flex items-center gap-2">
              <span className="text-cyan-400 font-mono">01.</span> Information We Collect
            </h3>
            <p>
              We collect user registration details (name, email, phone, city) and application details (age, riding history, emergency contact information). Passwords are never stored in plain text and are hashed using cryptographic salt algorithms.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="text-base font-bold text-white uppercase flex items-center gap-2">
              <span className="text-cyan-400 font-mono">02.</span> Use of Emergency Contact Data
            </h3>
            <p>
              Emergency contact information is gathered solely for emergency medical and safety coordination in arena settings. We never sell, monetize, or disclose your personal contacts to external third-party marketing networks.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="text-base font-bold text-white uppercase flex items-center gap-2">
              <span className="text-cyan-400 font-mono">03.</span> Payment Security
            </h3>
            <p>
              All online payments are securely processed through Razorpay. We do not store or process credit/debit card numbers or UPI PINs on our servers.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};
