import React from 'react';

export const TermsPage = () => {
  return (
    <div className="bg-slate-950 min-h-screen pt-36 pb-24 text-slate-300">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <h1 className="text-3xl sm:text-5xl font-black text-white uppercase tracking-tight">
            Terms & <span className="text-gradient-fire">Conditions</span>
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-slate-400">
            Terms of Use for Well of Death Rider Platform & Training Academy
          </p>
        </div>

        <div className="p-8 sm:p-10 rounded-3xl bg-slate-900/90 backdrop-blur-xl border border-slate-800 shadow-2xl space-y-6 text-xs sm:text-sm leading-relaxed text-slate-400 card-top-line">
          <section className="space-y-2">
            <h3 className="text-base font-bold text-white uppercase flex items-center gap-2">
              <span className="text-cyan-400 font-mono">01.</span> Acceptance of Terms
            </h3>
            <p>
              By accessing, browsing, registering, or purchasing training on this website, you agree to be bound by these Terms and all applicable laws and regulations of India.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="text-base font-bold text-white uppercase flex items-center gap-2">
              <span className="text-cyan-400 font-mono">02.</span> Training Enrollment & Admission
            </h3>
            <p>
              Submission of a training application does not guarantee admission. The administration reserves the sole right to approve, reject, or terminate any candidate’s enrollment based on physical suitability, psychological discipline, or breach of safety rules.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="text-base font-bold text-white uppercase flex items-center gap-2">
              <span className="text-cyan-400 font-mono">03.</span> Intellectual Property & Video Protection
            </h3>
            <p>
              All video footage, curriculum modules, technical diagrams, and trademarks are the proprietary intellectual property of Varsha Rider. Downloading, redistributing, or recording paid curriculum videos is strictly prohibited and subject to legal prosecution.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="text-base font-bold text-white uppercase flex items-center gap-2">
              <span className="text-cyan-400 font-mono">04.</span> Limitation of Liability
            </h3>
            <p>
              Under no circumstances shall the platform, owner, or instructors be liable for damages or injuries arising from unauthorized stunt recreation or failure to heed safety instructions.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};
