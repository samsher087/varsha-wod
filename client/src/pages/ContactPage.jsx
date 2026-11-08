import React, { useState } from 'react';
import { useSettings } from '../context/SettingsContext';
import {
  Mail,
  Phone,
  MapPin,
  Send,
  CheckCircle2,
  AlertCircle,
  MessageSquare,
  Flame,
} from 'lucide-react';
import { InstagramIcon, YoutubeIcon, FacebookIcon } from '../components/SocialIcons';

export const ContactPage = () => {
  const { settings } = useSettings();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    inquiryType: 'Training Question',
    message: '',
    honeypot: '', // anti-spam
  });

  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [lastWhatsAppUrl, setLastWhatsAppUrl] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.honeypot) return; // bot detected

    if (!formData.name || !formData.email || !formData.phone || !formData.message) {
      setError('Please fill out all required contact fields.');
      return;
    }

    setSubmitting(true);
    setError('');

    const targetPhone = (settings.contactWhatsApp || settings.contactPhone || '7488405975').replace(/[^0-9]/g, '');
    const cleanPhone = targetPhone.startsWith('91') ? targetPhone : `91${targetPhone}`;

    const text = `*New Arena Inquiry - ${settings.brandName || 'Varsha Rider / Well of Death'}*\n\n` +
      `👤 *Name:* ${formData.name}\n` +
      `📧 *Email:* ${formData.email}\n` +
      `📱 *Phone:* ${formData.phone}\n` +
      `📋 *Nature of Inquiry:* ${formData.inquiryType}\n\n` +
      `💬 *Message:*\n${formData.message}`;

    const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
    setLastWhatsAppUrl(whatsappUrl);

    // Open WhatsApp in new window / tab
    window.open(whatsappUrl, '_blank');

    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        inquiryType: 'Training Question',
        message: '',
        honeypot: '',
      });
    }, 400);
  };

  return (
    <div className="bg-transparent min-h-screen pt-36 pb-24 text-rose-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-3xl mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 border border-white/30 text-pink-200 text-xs font-bold uppercase tracking-wider mb-4">
            <MessageSquare className="w-3.5 h-3.5 text-pink-300" />
            Arena Booking & Inquiries
          </div>
          <h1 className="text-4xl sm:text-6xl font-black text-white uppercase tracking-tight">
            Get in <span className="text-gradient-fire">Touch</span>
          </h1>
          <p className="mt-4 text-base text-pink-100/80 leading-relaxed">
            For live show arena bookings, festival invitations, media interviews, or training consultations, reach out to our team directly.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
          {/* Contact Details & Headquarters */}
          <div className="lg:col-span-5 flex flex-col h-full">
            <div className="p-8 sm:p-10 rounded-3xl bg-white/[0.08] backdrop-blur-2xl border border-white/20 shadow-2xl shadow-pink-950/30 card-top-line flex flex-col justify-between h-full">
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-white uppercase tracking-wider mb-2">
                    Official Arena Office
                  </h3>
                  <p className="text-xs text-slate-400 mt-2 pl-3">
                    Headquarters for arena bookings, media & stunt academy.
                  </p>
                </div>

                <div className="space-y-5 text-sm pt-2">
                  <div className="flex items-start gap-3.5">
                    <div className="p-2.5 rounded-xl bg-cyan-500/15 text-cyan-400 border border-cyan-500/20 shrink-0">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white">Compound Location</h4>
                      <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                        {settings.headquartersAddress || 'Kanijari, Mandar Ranchi, Jharkhand'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5">
                    <div className="p-2.5 rounded-xl bg-amber-400/15 text-amber-400 border border-amber-400/20 shrink-0">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white">Direct Phone & WhatsApp</h4>
                      <a
                        href={`tel:${settings.contactPhone || '+917488405975'}`}
                        className="text-xs text-slate-300 hover:text-white transition-colors block mt-1"
                      >
                        {settings.contactPhone || '+91 7488405975'}
                      </a>
                      {settings.contactWhatsApp && (
                        <a
                          href={`https://wa.me/${settings.contactWhatsApp.replace(/[^0-9]/g, '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[11px] text-emerald-400 hover:underline mt-0.5 block font-semibold"
                        >
                          Open WhatsApp Chat →
                        </a>
                      )}
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5">
                    <div className="p-2.5 rounded-xl bg-teal-500/15 text-teal-400 border border-teal-500/20 shrink-0">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white">Email Inquiries</h4>
                      <a
                        href={`mailto:${settings.contactEmail}`}
                        className="text-xs text-slate-300 hover:text-white transition-colors block mt-1"
                      >
                        {settings.contactEmail || 'contact@samsher-wod.com'}
                      </a>
                    </div>
                  </div>
                </div>

                {/* Status / Working Hours Pill */}
                <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <span className="relative flex h-2.5 w-2.5 shrink-0">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                    </span>
                    <div>
                      <span className="text-xs font-bold text-white block">Arena Tours Active</span>
                      <span className="text-[11px] text-slate-400 block">Mon - Sun: 9:00 AM - 10:00 PM IST</span>
                    </div>
                  </div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-cyan-400 bg-cyan-500/10 px-2.5 py-1 rounded-full border border-cyan-500/20 shrink-0">
                    Live Shows
                  </span>
                </div>
              </div>

              {/* Social Channels */}
              <div className="pt-6 border-t border-slate-800/80 mt-6">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                  Follow the Action
                </h4>
                <div className="flex items-center gap-3">
                  {settings.socialLinks?.instagram && (
                    <a
                      href={settings.socialLinks.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 rounded-xl bg-slate-950 hover:bg-cyan-500/20 text-slate-400 hover:text-cyan-300 border border-slate-800 transition-colors"
                      aria-label="Instagram"
                    >
                      <InstagramIcon className="w-5 h-5" />
                    </a>
                  )}
                  {settings.socialLinks?.youtube && (
                    <a
                      href={settings.socialLinks.youtube}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 rounded-xl bg-slate-950 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 border border-slate-800 transition-colors"
                      aria-label="YouTube"
                    >
                      <YoutubeIcon className="w-5 h-5" />
                    </a>
                  )}
                  {settings.socialLinks?.facebook && (
                    <a
                      href={settings.socialLinks.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 rounded-xl bg-slate-950 hover:bg-blue-500/20 text-slate-400 hover:text-blue-400 border border-slate-800 transition-colors"
                      aria-label="Facebook"
                    >
                      <FacebookIcon className="w-5 h-5" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Contact & Booking Form */}
          <div className="lg:col-span-7 flex flex-col h-full">
            <div className="p-8 sm:p-10 rounded-3xl bg-slate-900/90 backdrop-blur-xl border border-slate-800 shadow-2xl relative card-top-line flex flex-col justify-between h-full">
              <div className="mb-6">
                <h3 className="text-xl font-bold text-white uppercase tracking-wider mb-2">
                  Send an Inquiry
                </h3>
                <p className="text-xs text-slate-400">
                  Our management will respond within 24 business hours.
                </p>
              </div>

              {submitted ? (
                <div className="p-8 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-4">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h4 className="text-lg font-bold text-white">Inquiry Forwarded to WhatsApp!</h4>
                  <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
                    Thank you for reaching out. We have opened WhatsApp with your inquiry pre-filled for Master Rider Varsha Rider. If it didn't open automatically, click below to chat:
                  </p>
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                    {lastWhatsAppUrl && (
                      <a
                        href={lastWhatsAppUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white uppercase tracking-wider transition-all flex items-center gap-2 shadow-lg shadow-emerald-950/50"
                      >
                        <MessageSquare className="w-4 h-4" />
                        <span>Open WhatsApp Chat</span>
                      </a>
                    )}
                    <button
                      onClick={() => setSubmitted(false)}
                      className="px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white transition-colors"
                    >
                      Send Another Inquiry
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {error && (
                    <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-300 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                      <span>{error}</span>
                    </div>
                  )}

                  {/* Anti-spam honeypot */}
                  <input
                    type="text"
                    name="honeypot"
                    value={formData.honeypot}
                    onChange={handleChange}
                    className="hidden"
                    tabIndex="-1"
                    autoComplete="off"
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1.5">
                        Your Full Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="John Doe"
                        required
                        className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1.5">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="john@example.com"
                        required
                        className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1.5">
                        Mobile Number *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+91 7488405975"
                        required
                        className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1.5">
                        Inquiry Nature
                      </label>
                      <select
                        name="inquiryType"
                        value={formData.inquiryType}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-500 transition-colors"
                      >
                        <option value="Training Question" className="bg-slate-900">Training Academy Question</option>
                        <option value="Live Show Booking" className="bg-slate-900">Live Show / Carnival Booking</option>
                        <option value="Media & Sponsorship" className="bg-slate-900">Media, Film & Sponsorship</option>
                        <option value="Other" className="bg-slate-900">General Inquiry</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1.5">
                      Your Message *
                    </label>
                    <textarea
                      name="message"
                      rows="4"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Please specify dates, arena requirements, or specific training questions..."
                      required
                      className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-4 rounded-xl bg-gradient-to-r from-cyan-600 via-teal-600 to-emerald-500 hover:from-cyan-500 hover:to-emerald-400 text-white font-bold text-sm tracking-wide uppercase transition-all shadow-lg shadow-cyan-950/60 flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                  >
                    {submitting ? (
                      <span>Redirecting to WhatsApp...</span>
                    ) : (
                      <>
                        <MessageSquare className="w-4 h-4" />
                        <span>Send Inquiry on WhatsApp</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
