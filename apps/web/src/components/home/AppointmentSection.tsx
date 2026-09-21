import type { Locale } from '@/i18n/config';
import type { Translations } from '@/i18n';
import Image from 'next/image';

type Props = {
  locale: Locale;
  t: Translations;
};

const WA_NUMBER = '966532963521';
const WA_MSG_EN = 'Hello%2C%20I%20would%20like%20to%20enquire%20about%20booking%20an%20appointment%20at%20Salamatek%20Medical%20Centre.';
const WA_MSG_AR = '%D9%85%D8%B1%D8%AD%D8%A8%D8%A7%D9%8B%D8%8C%20%D8%A3%D9%88%D8%AF%20%D8%A7%D9%84%D8%A7%D8%B3%D8%AA%D9%81%D8%B3%D8%A7%D8%B1%20%D8%B9%D9%86%20%D8%AD%D8%AC%D8%B2%20%D9%85%D9%88%D8%B9%D8%AF%20%D9%81%D9%8A%20%D9%85%D8%AC%D9%85%D8%B9%20%D8%B3%D9%84%D8%A7%D9%85%D8%AA%D9%83%20%D8%A7%D9%84%D8%B7%D8%A8%D9%8A.';
const PHONE = '0136642193';

export function AppointmentSection({ locale, t }: Props) {
  const p = t.pages.home;
  const isAr = locale === 'ar';
  const waMsg = isAr ? WA_MSG_AR : WA_MSG_EN;
  const waUrl = `https://wa.me/${WA_NUMBER}?text=${waMsg}`;

  return (
    <section
      className="relative bg-brand-mint py-16 md:py-24 overflow-hidden"
      aria-labelledby="appointment-heading"
      id="book-appointment"
      dir={isAr ? 'rtl' : 'ltr'}
    >
      {/* Background blobs */}
      <div className="absolute inset-0 z-0 opacity-40" aria-hidden="true">
        <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[60%] rounded-full bg-brand-pale/30 blur-3xl mix-blend-multiply" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[50%] h-[50%] rounded-full bg-white/60 blur-3xl mix-blend-overlay" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="bg-white rounded-3xl shadow-card-lg overflow-hidden flex flex-col lg:flex-row">

          {/* Image Side */}
          <div className="lg:w-5/12 relative min-h-[280px] lg:min-h-full bg-brand-light">
            <Image
              src="/images/doctor-patient.jpg"
              alt={isAr ? 'طبيب مع مريض' : 'Doctor consulting with patient'}
              fill
              className="object-cover object-center"
              sizes="(max-width: 1024px) 100vw, 40vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/80 via-brand-dark/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
              <h3 className="text-2xl font-serif font-bold mb-2">
                {isAr ? 'رعاية تثق بها' : 'Care you can trust'}
              </h3>
              <p className="text-white/80 text-sm leading-relaxed">
                {isAr
                  ? 'فريقنا الطبي جاهز لتقديم أفضل رعاية لك ولعائلتك.'
                  : 'Our medical team is ready to provide the best care for you and your family.'}
              </p>
            </div>
          </div>

          {/* CTA Side */}
          <div className="lg:w-7/12 flex flex-col justify-center p-8 md:p-12 lg:p-16">

            {/* Header */}
            <div className="mb-8">
              <p className="text-xs font-bold uppercase tracking-widest text-brand-red mb-3">
                {isAr ? 'حجز موعد' : 'Book your visit'}
              </p>
              <h2
                id="appointment-heading"
                className="text-3xl md:text-display-sm font-serif font-bold text-text-base mb-3 leading-tight"
              >
                {p.appointmentHeading}
              </h2>
              <p className="text-text-muted text-base">
                {isAr
                  ? 'تواصل معنا مباشرة عبر واتساب أو الهاتف لحجز موعدك مع أحد متخصصينا.'
                  : 'Reach us directly on WhatsApp or phone to book your appointment with one of our specialists.'}
              </p>
            </div>

            {/* Primary CTA: WhatsApp */}
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-3 w-full sm:w-auto px-8 py-4 rounded-xl bg-[#25D366] text-white text-base font-bold hover:bg-[#1ebe5c] active:bg-[#17a84f] transition-colors duration-150 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366] focus-visible:ring-offset-2 mb-4"
            >
              {/* WhatsApp icon */}
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 flex-shrink-0" aria-hidden="true">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                <path d="M12 0C5.373 0 0 5.373 0 12c0 2.116.554 4.103 1.524 5.827L0 24l6.341-1.499A11.947 11.947 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.817 9.817 0 01-5.003-1.366l-.359-.213-3.764.89.952-3.664-.234-.376A9.787 9.787 0 012.182 12C2.182 6.573 6.573 2.182 12 2.182c5.428 0 9.818 4.391 9.818 9.818 0 5.428-4.39 9.818-9.818 9.818z"/>
              </svg>
              {isAr ? 'استفسار عن موعد عبر واتساب' : 'Appointment Enquiry on WhatsApp'}
            </a>

            {/* Secondary: Phone */}
            <a
              href={`tel:${PHONE}`}
              className="inline-flex items-center justify-center gap-3 w-full sm:w-auto px-8 py-4 rounded-xl border border-border text-text-base text-base font-semibold hover:bg-surface-mint hover:border-brand/30 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-5 h-5 flex-shrink-0" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
              </svg>
              {p.appointmentPhone || '013 664 2193'}
            </a>

            {/* Note */}
            <p className="mt-6 text-xs text-text-subtle">
              {isAr
                ? 'سيقوم فريقنا بالرد والتأكيد خلال أوقات العمل.'
                : 'Our team will respond and confirm during working hours.'}
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}
