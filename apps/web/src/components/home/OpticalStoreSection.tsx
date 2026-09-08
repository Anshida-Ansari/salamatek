import Image from 'next/image';
import Link from 'next/link';
import type { Locale } from '@/i18n/config';
import type { Translations } from '@/i18n';
import { getLocalizedPath } from '@/lib/utils';

type Props = {
  locale: Locale;
  t: Translations;
};

export function OpticalStoreSection({ locale, t }: Props) {
  const p = t.pages.home;

  return (
    <section
      className="bg-brand-dark py-16 md:py-24 overflow-hidden"
      aria-labelledby="optical-heading"
      id="optical-store"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">

          {/* Left: Content */}
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-brand-light mb-5">
              {p.opticalEyebrow}
            </p>

            <h2
              id="optical-heading"
              className="text-3xl md:text-display-md font-serif font-bold text-white leading-tight mb-6"
            >
              <span className="block">{p.opticalHeading1}</span>
              <span className="block">{p.opticalHeading2}</span>
            </h2>

            <p className="text-sm md:text-base text-white/65 leading-relaxed mb-8 max-w-md">
              {p.opticalSubtext}
            </p>

            <Link
              href={getLocalizedPath('/optical-store', locale)}
              className="inline-flex items-center px-6 py-3 rounded-lg border border-white text-white text-sm font-semibold hover:bg-white/10 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              {t.common.exploreOptical}
            </Link>
          </div>

          {/* Right: Image */}
          <div className="relative">
            <div className="relative rounded-3xl overflow-hidden aspect-[4/3]">
              <Image
                src="/images/hospital/reception.jpg"
                alt={
                  locale === 'ar'
                    ? 'متجر البصريات في مجمع سلامتك الطبي'
                    : 'Salamatek Optical Store — eyewear fitting consultation'
                }
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover object-center"
              />
              {/* Badge overlay */}
              <div className="absolute bottom-4 end-4 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-1.5">
                <p className="text-[11px] font-semibold text-text-base">
                  {p.opticalBadge}
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
