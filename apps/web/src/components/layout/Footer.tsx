import Link from 'next/link';
import Image from 'next/image';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  ExternalLink,
} from 'lucide-react';
import type { Locale } from '@/i18n/config';
import type { Translations } from '@/i18n';
import { getLocalizedPath } from '@/lib/utils';
import { contactConfig } from '@/config/contact';

type Props = {
  locale: Locale;
  t: Translations;
};

/**
 * Section 2: Quick Links
 * Only verified existing routes in the project.
 * Careers and Contact are intentionally accessible through the footer.
 */
const QUICK_LINKS = [
  { key: 'home' as const,              href: '/' },
  { key: 'about' as const,             href: '/about' },
  { key: 'services' as const,          href: '/services' },
  { key: 'doctors' as const,           href: '/doctors' },
  { key: 'opticalBrands' as const,     href: '/optical-brands' },
  { key: 'insurancePartners' as const, href: '/insurance-partners' },
  { key: 'careers' as const,           href: '/careers' },
  { key: 'contact' as const,           href: '/contact' },
] as const;

function InstagramIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
    </svg>
  );
}

function SnapchatIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 2.25c-3.6 0-5.75 2.5-5.75 5.8 0 .85.18 1.7.42 2.38-.63.2-1.63.6-1.87 1.52-.15.57.13 1.1.68 1.31.1.04.23.07.37.09-.16.37-.44.86-.94 1.15-.56.31-1.01.26-1.25.67-.18.3-.05.68.3 1.03.59.57 1.41.74 2.3.82.24.02.45.15.56.36.3.61.77 1.16 1.79 1.3.49.07 1.12-.05 1.74-.24.42-.13.86-.13 1.28 0 .61.19 1.24.31 1.73.24 1.02-.14 1.49-.69 1.79-1.3.11-.21.32-.34.56-.36.89-.08 1.71-.25 2.3-.82.35-.35.48-.73.3-1.03-.24-.41-.69-.36-1.25-.67-.5-.29-.78-.78-.94-1.15.14-.02.27-.05.37-.09.55-.21.83-.74.68-1.31-.24-.92-1.24-1.32-1.87-1.52.24-.68.42-1.53.42-2.38 0-3.3-2.15-5.8-5.75-5.8z" />
    </svg>
  );
}

function WhatsAppIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
      <path d="M12 0C5.373 0 0 5.373 0 12c0 2.116.554 4.103 1.524 5.827L0 24l6.341-1.499A11.947 11.947 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.817 9.817 0 01-5.003-1.366l-.359-.213-3.764.89.952-3.664-.234-.376A9.787 9.787 0 012.182 12C2.182 6.573 6.573 2.182 12 2.182c5.428 0 9.818 4.391 9.818 9.818 0 5.428-4.39 9.818-9.818 9.818z"/>
    </svg>
  );
}

export function Footer({ locale, t }: Props) {
  const isAr = locale === 'ar';
  const year = new Date().getFullYear();
  const copyright = t.footer.copyright.replace('{year}', String(year));

  return (
    <footer
      className="bg-brand-dark text-white border-t border-white/10"
      role="contentinfo"
      dir={isAr ? 'rtl' : 'ltr'}
    >
      {/* Main Multi-Column Content Area */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-8 items-start">

          {/* ─────────────────────────────────────────────────────────────
              SECTION 1: Medical Center Information
              Logo, Name, Description, Badges & Social Links
             ───────────────────────────────────────────────────────────── */}
          <div className="lg:col-span-4 space-y-4">
            <Link
              href={getLocalizedPath('/', locale)}
              className="inline-flex items-center bg-white px-3.5 py-2 rounded-xl shadow-sm border border-white/20 transition-transform hover:scale-[1.02]"
              aria-label={isAr ? 'مجمع سلامتك الطبي — الرئيسية' : 'Salamatek Medical Center — Home'}
            >
              <img
                src="/images/new-logo-transparent.png"
                alt="Salamatek Medical Center"
                className="h-9 sm:h-10 w-auto object-contain"
              />
            </Link>

            <div>
              <h2 className="text-base font-bold text-white tracking-wide">
                {isAr ? 'مجمع سلامتك الطبي' : 'Salamatek Medical Center'}
              </h2>
              <p className="text-xs text-emerald-400 font-medium mt-0.5">
                {t.footer.tagline}
              </p>
            </div>

            <p className="text-sm text-white/70 leading-relaxed max-w-sm">
              {t.footer.aboutText}
            </p>

            {/* Official Accreditations */}
            <div className="flex items-center gap-3 pt-1">
              <div
                className="bg-white/10 backdrop-blur-sm border border-white/15 rounded-lg px-2.5 py-1.5 flex items-center shadow-inner"
                title="CBAHI Accredited"
              >
                <Image
                  src="/images/cbahi-logo-transparent.png"
                  alt="CBAHI Accredited"
                  width={72}
                  height={28}
                  className="h-6 w-auto object-contain brightness-110"
                />
              </div>

              <div
                className="bg-white/10 backdrop-blur-sm border border-white/15 rounded-lg px-2.5 py-1.5 flex items-center shadow-inner"
                title="24/7 Emergency Service"
              >
                <Image
                  src="/images/24-7-logo-transparent.png"
                  alt="24/7 Service"
                  width={72}
                  height={28}
                  className="h-6 w-auto object-contain brightness-110"
                />
              </div>
            </div>

            {/* Social Media Links: Instagram, Snapchat, Facebook, LinkedIn, WhatsApp */}
            <div className="pt-2">
              <div className="flex items-center gap-2">
                <a
                  href={`https://wa.me/${contactConfig.whatsappNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-lg bg-[#25D366]/20 hover:bg-[#25D366] border border-[#25D366]/40 flex items-center justify-center text-[#25D366] hover:text-white transition-all shadow-sm"
                  aria-label="WhatsApp"
                  title="WhatsApp"
                >
                  <WhatsAppIcon className="w-4 h-4" />
                </a>

                <a
                  href={contactConfig.social.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-lg bg-pink-500/20 hover:bg-gradient-to-tr hover:from-amber-500 hover:via-pink-500 hover:to-purple-600 border border-pink-500/40 flex items-center justify-center text-pink-400 hover:text-white transition-all shadow-sm"
                  aria-label="Instagram"
                  title="Instagram"
                >
                  <InstagramIcon className="w-4 h-4" />
                </a>

                <a
                  href={contactConfig.social.snapchat}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-lg bg-amber-400/20 hover:bg-[#FFFC00] border border-amber-400/40 flex items-center justify-center text-amber-300 hover:text-black transition-all shadow-sm"
                  aria-label="Snapchat"
                  title="Snapchat"
                >
                  <SnapchatIcon className="w-4 h-4" />
                </a>

                <a
                  href={contactConfig.social.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-lg bg-white/5 hover:bg-blue-600 border border-white/10 flex items-center justify-center text-white/70 hover:text-white transition-colors"
                  aria-label="Facebook"
                  title="Facebook"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                  </svg>
                </a>

                <a
                  href={contactConfig.social.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-lg bg-white/5 hover:bg-sky-600 border border-white/10 flex items-center justify-center text-white/70 hover:text-white transition-colors"
                  aria-label="LinkedIn"
                  title="LinkedIn"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" />
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* ─────────────────────────────────────────────────────────────
              SECTION 2: Quick Links
              Home, About Us, Services, Doctors, Optical Brands,
              Insurance Partners, Careers, Contact
             ───────────────────────────────────────────────────────────── */}
          <div className="lg:col-span-2 space-y-3.5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
              {t.footer.quickLinks}
            </h3>

            <ul className="space-y-2" role="list">
              {QUICK_LINKS.map(({ key, href }) => (
                <li key={key}>
                  <Link
                    href={getLocalizedPath(href, locale)}
                    className="text-sm text-white/75 hover:text-white flex items-center gap-1.5 group transition-colors duration-150 py-0.5"
                  >
                    <span className="text-emerald-400/60 group-hover:text-emerald-400 group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5 transition-transform text-xs font-mono">
                      {isAr ? '‹' : '›'}
                    </span>
                    <span className="group-hover:underline underline-offset-4 decoration-emerald-400/50">
                      {t.footer.links[key]}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ─────────────────────────────────────────────────────────────
              SECTION 3: Contact Information
              Phone Numbers, Email, Address, WhatsApp & Social Links
             ───────────────────────────────────────────────────────────── */}
          <div className="lg:col-span-3 space-y-3.5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
              {t.footer.contactInfo}
            </h3>

            <div className="space-y-3 text-sm">
              {/* Physical Address */}
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-1" />
                <p className="text-white/75 leading-relaxed text-xs sm:text-sm">
                  {t.footer.address}
                </p>
              </div>

              {/* Phone Numbers: Landline & Additional Mobile Lines */}
              <div className="flex items-start gap-2.5">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0 mt-1" />
                <div className="space-y-1.5">
                  <div>
                    <a
                      href="tel:0136642193"
                      className="text-white/90 hover:text-white font-medium hover:underline transition-colors block text-xs sm:text-sm"
                      dir="ltr"
                    >
                      013 664 2193
                    </a>
                    <span className="text-[11px] text-white/50 block">
                      {isAr ? 'الهاتف الثابت / المواعيد' : 'Landline / Appointments'}
                    </span>
                  </div>

                  {/* Additional Mobile & Emergency Contacts */}
                  <div>
                    <div className="space-y-0.5" dir="ltr">
                      <a
                        href="tel:+966532963521"
                        className="text-emerald-300 hover:text-emerald-200 font-semibold hover:underline transition-colors block text-xs sm:text-sm"
                      >
                        +966 53 296 3521
                      </a>
                      <a
                        href="tel:+966557400450"
                        className="text-white/85 hover:text-white font-medium hover:underline transition-colors block text-xs sm:text-sm"
                      >
                        +966 55 740 0450
                      </a>
                      <a
                        href="tel:+966553504004"
                        className="text-white/85 hover:text-white font-medium hover:underline transition-colors block text-xs sm:text-sm"
                      >
                        +966 55 350 4004
                      </a>
                    </div>
                    <span className="text-[11px] text-white/50 block mt-0.5">
                      {isAr ? 'أرقام التواصل والطوارئ' : 'Direct & Emergency Contacts'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Email Address */}
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                <a
                  href={`mailto:${contactConfig.email}`}
                  className="text-white/80 hover:text-white hover:underline transition-colors text-xs sm:text-sm break-all"
                  dir="ltr"
                >
                  {contactConfig.email}
                </a>
              </div>

              {/* WhatsApp Navigation & Social Channels */}
              <div className="pt-2 border-t border-white/10 space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <a
                    href={`https://wa.me/${contactConfig.whatsappNumber}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#25D366]/20 hover:bg-[#25D366] text-[#25D366] hover:text-white border border-[#25D366]/40 text-xs font-semibold transition-all shadow-sm"
                  >
                    <WhatsAppIcon className="w-3.5 h-3.5 shrink-0" />
                    <span>WhatsApp</span>
                  </a>

                  <a
                    href={contactConfig.social.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-pink-500/20 hover:bg-gradient-to-tr hover:from-amber-500 hover:via-pink-500 hover:to-purple-600 text-pink-300 hover:text-white border border-pink-500/40 text-xs font-semibold transition-all shadow-sm"
                  >
                    <InstagramIcon className="w-3.5 h-3.5 shrink-0" />
                    <span>Instagram</span>
                  </a>

                  <a
                    href={contactConfig.social.snapchat}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-400/20 hover:bg-[#FFFC00] text-amber-300 hover:text-black border border-amber-400/40 text-xs font-semibold transition-all shadow-sm"
                  >
                    <SnapchatIcon className="w-3.5 h-3.5 shrink-0" />
                    <span>Snapchat</span>
                  </a>
                </div>
              </div>

              {/* Working Hours / Emergency Badge */}
              <div className="flex items-center gap-2.5 pt-1 border-t border-white/10">
                <Clock className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="text-xs text-emerald-300 font-medium">
                  {t.footer.emergency247}
                </span>
              </div>
            </div>
          </div>

          {/* ─────────────────────────────────────────────────────────────
              SECTION 4: Location and Map
              Dedicated Google Maps Embed, Address, and "Get Directions"
             ───────────────────────────────────────────────────────────── */}
          <div className="lg:col-span-3 space-y-3.5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
              {t.footer.locationMap}
            </h3>

            <div className="rounded-xl overflow-hidden border border-white/10 bg-white/5 shadow-md flex flex-col">
              {/* Responsive Compact Interactive Map Embed */}
              <div className="relative w-full h-[170px] bg-slate-900">
                <iframe
                  src="https://maps.google.com/maps?q=Salamatek%20Medical%20Group,%20Safwa,%20Saudi%20Arabia&t=&z=14&ie=UTF8&iwloc=&output=embed"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title={isAr ? 'موقع مجمع سلامتك الطبي' : 'Salamatek Medical Center Location'}
                  className="w-full h-full"
                />
              </div>

              {/* Location Card Footer with "Get Directions" */}
              <div className="p-3 bg-brand-dark/95 border-t border-white/10 flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-white truncate">
                    {isAr ? 'صفوى، المنطقة الشرقية' : 'Safwa, Eastern Province'}
                  </p>
                  <p className="text-[11px] text-white/60 truncate">
                    {isAr ? 'شارع بلال بن رباح' : 'Belal Ibn Rabah St'}
                  </p>
                </div>

                <a
                  href={contactConfig.mapsLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shrink-0 inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 text-xs font-medium transition-colors"
                  aria-label={isAr ? 'الاتجاهات على الخريطة (يفتح في علامة تبويب جديدة)' : 'Get Directions (opens in new tab)'}
                >
                  <span>{t.footer.getDirections}</span>
                  <ExternalLink className="w-3 h-3 shrink-0" />
                </a>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          BOTTOM BAR: Copyright & Official Accreditation Statement
         ───────────────────────────────────────────────────────────── */}
      <div className="border-t border-white/10 bg-black/25">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/50">
          <p className="text-center sm:text-left">
            {copyright}
          </p>

          <p className="text-center sm:text-right text-emerald-400/80 font-medium">
            {t.footer.mohCbahi}
          </p>
        </div>
      </div>
    </footer>
  );
}
