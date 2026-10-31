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
import { contactConfig, type ContactSettings } from '@/config/contact';
import { getTelLink, getMailtoLink } from '@/lib/contact';

type Props = {
  locale: Locale;
  t: Translations;
  contactSettings?: ContactSettings;
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

export function Footer({ locale, t, contactSettings }: Props) {
  const isAr = locale === 'ar';
  const year = new Date().getFullYear();
  const copyright = t.footer.copyright.replace('{year}', String(year));

  const contact = {
    ...contactConfig,
    ...(contactSettings || {}),
  };

  const address = isAr
    ? (contact.addressAr || t.footer.address)
    : (contact.address || t.footer.address);

  const emergencyHours = isAr
    ? (contact.workingHoursAr || t.footer.emergency247)
    : (contact.workingHoursEn || t.footer.emergency247);

  const mapEmbedUrl = contact.mapsEmbedUrl?.trim()
    || "https://maps.google.com/maps?q=Salamatek%20Medical%20Group,%20Safwa,%20Saudi%20Arabia&t=&z=14&ie=UTF8&iwloc=&output=embed";

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
              Logo, Name, Description & Accreditations
             ───────────────────────────────────────────────────────────── */}
          <div className="lg:col-span-4 space-y-4">
            <Link
              href={getLocalizedPath('/', locale)}
              className="inline-flex items-center transition-opacity hover:opacity-90"
              aria-label={isAr ? 'مجمع سلامتك الطبي — الرئيسية' : 'Salamatek Medical Center — Home'}
            >
              <img
                src="/images/new-logo-transparent.png"
                alt="Salamatek Medical Center"
                className="h-10 sm:h-12 w-auto object-contain"
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
              Phone Numbers, Email, Address, 24/7 Emergency
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
                  {address}
                </p>
              </div>

              {/* Phone Numbers: Landline & Additional Mobile Lines */}
              <div className="flex items-start gap-2.5">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0 mt-1" />
                <div className="space-y-1.5">
                  <div>
                    <a
                      href={getTelLink(contact.phone)}
                      className="text-white/90 hover:text-white font-medium hover:underline transition-colors block text-xs sm:text-sm"
                      dir="ltr"
                    >
                      {contact.phone}
                    </a>
                    <span className="text-[11px] text-white/50 block">
                      {isAr ? 'الهاتف الثابت / المواعيد' : 'Landline / Appointments'}
                    </span>
                  </div>

                  {/* Additional Mobile & Emergency Contacts */}
                  <div>
                    <div className="space-y-0.5" dir="ltr">
                      {contact.emergencyPhone && (
                        <a
                          href={getTelLink(contact.emergencyPhone)}
                          className="text-emerald-300 hover:text-emerald-200 font-semibold hover:underline transition-colors block text-xs sm:text-sm"
                        >
                          {contact.emergencyPhone}
                        </a>
                      )}
                      {contact.additionalPhones?.map((phone, idx) => (
                        <a
                          key={idx}
                          href={getTelLink(phone)}
                          className="text-white/85 hover:text-white font-medium hover:underline transition-colors block text-xs sm:text-sm"
                        >
                          {phone}
                        </a>
                      ))}
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
                  href={getMailtoLink(contact.email)}
                  className="text-white/80 hover:text-white hover:underline transition-colors text-xs sm:text-sm break-all"
                  dir="ltr"
                >
                  {contact.email}
                </a>
              </div>

              {/* Working Hours / Emergency Badge */}
              <div className="flex items-center gap-2.5 pt-2 border-t border-white/10">
                <Clock className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="text-xs text-emerald-300 font-medium">
                  {emergencyHours}
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
                  src={mapEmbedUrl}
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
                    {isAr ? (contact.shortLocationAr || 'صفوى') : (contact.shortLocation || 'Safwa')}
                  </p>
                  <p className="text-[11px] text-white/60 truncate">
                    {address}
                  </p>
                </div>

                <a
                  href={contact.mapsLink}
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
