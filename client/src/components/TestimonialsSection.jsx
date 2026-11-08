import React from 'react';
import { useSettings } from '../context/SettingsContext';
import { Star, Quote, CheckCircle2 } from 'lucide-react';

export const TestimonialsSection = () => {
  const { settings } = useSettings();

  const defaultTestimonials = [
    {
      name: 'Being Samsher',
      role: 'SW Engineer',
      quote:
        'Watching Varsha Rider ride the vertical wooden wall hands-free is nothing short of hypnotic physics. He treats risk with immense respect and scientific discipline.',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
      rating: 5,
    },
    {
      name: 'Ananya Deshmukh',
      role: 'Stunt Trainee Graduate',
      quote:
        'The online training academy broke down every single mechanical nuance, tire pressure equation, and entry angle before I ever entered the physical arena. Top notch coaching.',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      rating: 5,
    },
    {
      name: 'Rohan Mehra',
      role: 'Circus Arena Coordinator',
      quote:
        'In 20 years of event production, I have never seen a rider with such meticulous safety standards. Zero incidents, pure professionalism every night.',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
      rating: 5,
    },
  ];

  const testimonials = settings.testimonials && settings.testimonials.length > 0
    ? settings.testimonials
    : defaultTestimonials;

  return (
    <section className="py-24 bg-transparent border-t border-white/10 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/15 border border-white/30 text-pink-200 text-xs font-bold uppercase tracking-wider mb-3">
            <Star className="w-3.5 h-3.5 fill-current text-amber-300" />
            Audience & Trainee Acclaim
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white uppercase tracking-tight">
            Reputation Forged <span className="text-gradient-fire">in the Arena</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="p-8 rounded-3xl bg-white/[0.08] backdrop-blur-2xl border border-white/20 hover:border-pink-300/60 transition-all duration-300 relative flex flex-col justify-between card-top-line shadow-xl hover:shadow-pink-500/20 hover:-translate-y-1"
            >
              <div>
                <Quote className="w-8 h-8 text-pink-300/40 mb-4" />
                <div className="flex items-center gap-1 text-amber-300 mb-4">
                  {[...Array(t.rating || 5)].map((_, idx) => (
                    <Star key={idx} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <p className="text-sm text-pink-100/90 italic leading-relaxed mb-6 font-light">
                  "{t.quote}"
                </p>
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-white/15">
                <img
                  src={t.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80'}
                  alt={t.name}
                  className="w-11 h-11 rounded-full object-cover border-2 border-white/60 shadow"
                />
                <div>
                  <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                    {t.name}
                    <CheckCircle2 className="w-3.5 h-3.5 text-pink-300" />
                  </h4>
                  <p className="text-xs text-pink-200/80">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
