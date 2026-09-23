import type { Locale } from '@/i18n/config';
import type { Translations } from '@/i18n';
import { Star } from 'lucide-react';

export interface Testimonial {
  _id: string;
  name: { en: string; ar: string };
  rating: number;
  text: { en: string; ar: string };
  date?: string;
  active: boolean;
}

type Props = {
  locale: Locale;
  t: Translations;
  testimonials: Testimonial[];
};

export function TestimonialsSection({ locale, testimonials }: Props) {
  if (!testimonials || testimonials.length === 0) return null;

  return (
    <section className="bg-surface-mint/30 py-16 md:py-24" aria-labelledby="testimonials-heading">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 md:mb-16">
          <p className="text-xs font-bold uppercase tracking-widest text-brand-medium mb-3">
            {locale === 'ar' ? 'آراء المرضى' : 'Patient Stories'}
          </p>
          <h2 id="testimonials-heading" className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-brand-dark mb-4">
            {locale === 'ar' ? 'ماذا يقول مرضانا' : 'What Our Patients Say'}
          </h2>
          <p className="text-base md:text-lg text-text-muted">
            {locale === 'ar' ? 'آراء حقيقية من مجتمعنا.' : 'Genuine feedback from our community.'}
          </p>
        </div>

        {/* CSS Scroll Snap Container */}
        <div className="flex overflow-x-auto snap-x snap-mandatory gap-6 pb-8 -mx-4 px-4 sm:mx-0 sm:px-0 hide-scrollbar">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial._id}
              className="snap-center shrink-0 w-[85vw] sm:w-[400px] lg:w-[calc(33.333333%-1rem)] bg-white rounded-3xl p-6 md:p-8 border border-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300 flex flex-col h-full relative group"
            >
              {/* Google Review Indicator */}
              <div className="absolute top-6 right-6 flex items-center gap-1.5 opacity-60 group-hover:opacity-100 transition-opacity">
                <span className="text-[10px] uppercase tracking-wider font-semibold text-gray-500">Google Review</span>
                <svg viewBox="0 0 24 24" className="w-4 h-4" aria-hidden="true">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-1 mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < testimonial.rating
                        ? 'text-yellow-400 fill-yellow-400'
                        : 'text-gray-200 fill-gray-200'
                    }`}
                  />
                ))}
              </div>

              {/* Text */}
              <p className="text-gray-700 text-sm md:text-base leading-relaxed mb-8 flex-1 italic">
                &quot;{testimonial.text[locale] || testimonial.text.en}&quot;
              </p>

              {/* Author */}
              <div className="flex items-center gap-4 mt-auto">
                <div className="w-10 h-10 rounded-full bg-brand-pale text-brand-dark flex items-center justify-center font-bold text-sm shrink-0">
                  {(testimonial.name[locale] || testimonial.name.en).charAt(0).toUpperCase()}
                </div>
                <div>
                  <h4 className="font-semibold text-brand-dark text-sm">
                    {testimonial.name[locale] || testimonial.name.en}
                  </h4>
                  {testimonial.date && (
                    <p className="text-xs text-text-muted mt-0.5">{testimonial.date}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
