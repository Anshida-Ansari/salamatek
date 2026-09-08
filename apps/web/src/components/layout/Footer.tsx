import Link from 'next/link';
import type { Locale } from '@/i18n/config';
import type { Translations } from '@/i18n';
import { getLocalizedPath } from '@/lib/utils';
import { Logo } from './Logo';

type Props = {
  locale: Locale;
  t: Translations;
};

const EXPLORE_LINKS = [
  { key: 'about' as const,        href: '/about' },
  { key: 'departments' as const,  href: '/departments' },
  { key: 'doctors' as const,      href: '/doctors' },
  { key: 'sarc' as const,         href: '/sarc' },
  { key: 'opticalStore' as const, href: '/optical-store' },
  { key: 'news' as const,         href: '/news' },
];

export function Footer({ locale, t }: Props) {
  const year = new Date().getFullYear();
  const copyright = t.footer.copyright.replace('{year}', String(year));

  return (
    <footer className="bg-brand-dark text-white" role="contentinfo">
      {/* Main footer grid */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14 lg:py-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">

          {/* Column 1 — Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Logo locale={locale} variant="light" size="md" />
            <p className="mt-4 text-sm text-white/70 leading-relaxed max-w-xs">
              {t.footer.tagline}
            </p>
          </div>

          {/* Column 2 — Explore */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-white/50 mb-5">
              {t.footer.explore}
            </h3>
            <ul className="space-y-3" role="list">
              {EXPLORE_LINKS.map(({ key, href }) => (
                <li key={key}>
                  <Link
                    href={getLocalizedPath(href, locale)}
                    className="text-sm text-white/80 hover:text-white transition-colors duration-150"
                  >
                    {t.footer.links[key]}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3 — Visit Us */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-white/50 mb-5">
              {t.footer.visitUs}
            </h3>
            <address className="not-italic space-y-3">
              <p className="text-sm text-white/80 leading-relaxed">
                {t.footer.address}
              </p>
              <p className="text-sm text-white/80 leading-relaxed">
                {t.footer.phone}
              </p>
            </address>
          </div>

          {/* Column 4 — Hours */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-white/50 mb-5">
              {t.footer.openingHours}
            </h3>
            <div className="space-y-3">
              <p className="text-sm text-white/80 leading-relaxed">
                {t.footer.hours}
              </p>
              <p className="text-sm text-white/80 leading-relaxed">
                {t.footer.hoursSub}
              </p>
            </div>
            <Link
              href={getLocalizedPath('/contact', locale)}
              className="mt-6 inline-block text-sm font-semibold text-brand-pale hover:text-white transition-colors duration-150"
            >
              {t.footer.bookAppointment}
            </Link>
          </div>
        </div>
      </div>
      
      {/* Copyright area */}
      <div className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-xs text-white/50 text-center lg:text-left">
            {copyright}
          </p>
        </div>
      </div>
    </footer>
  );
}
