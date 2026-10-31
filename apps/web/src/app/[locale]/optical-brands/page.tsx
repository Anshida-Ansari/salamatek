import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { isValidLocale, type Locale } from '@/i18n/config';
import { getTranslations } from '@/i18n';
import { getLocalizedPath } from '@/lib/utils';
import { PageHero } from '@/components/shared/PageHero';
import { OPTICAL_BRANDS } from '@/lib/constants';
import { 
  Eye, 
  Clock, 
  Wrench, 
  Sparkles, 
  MessageCircle,
  Phone,
  MapPin,
} from 'lucide-react';

type Props = {
  params: Promise<{ locale: string }>;
};

async function getPageHero(pageKey: string) {
  try {
    const apiUrl =
      (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000') + '/api';
    const res = await fetch(`${apiUrl}/page-heroes/${pageKey}`, {
      cache: 'no-store',
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data || null;
  } catch {
    return null;
  }
}

async function getOpticalBrands() {
  try {
    const apiUrl =
      (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000') + '/api';
    const res = await fetch(`${apiUrl}/optical-brands?active=true`, {
      cache: 'no-store',
    });
    if (!res.ok) return OPTICAL_BRANDS;
    const json = await res.json();
    if (Array.isArray(json.data) && json.data.length > 0) {
      return json.data;
    }
    return OPTICAL_BRANDS;
  } catch {
    return OPTICAL_BRANDS;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!isValidLocale(locale)) return {};
  const t = getTranslations(locale as Locale);
  const p = t.pages.opticalBrands;

  return {
    title: p.title,
    description: p.description,
    openGraph: {
      title: p.title,
      description: p.description,
      siteName: t.meta.siteName,
      locale: locale === 'ar' ? 'ar_SA' : 'en_US',
      type: 'website',
    },
  };
}

function BrandLogoCard({ brand }: { brand: { name: string; image: string } }) {
  const isExternalOrAbsolute =
    brand.image.startsWith('http://') ||
    brand.image.startsWith('https://') ||
    brand.image.startsWith('/');
  const logoUrl = isExternalOrAbsolute ? brand.image : `/images/opticals/${brand.image}`;

  return (
    <div className="relative w-full h-20 sm:h-24 md:h-28 flex items-center justify-center transition-all duration-300 group overflow-hidden bg-white rounded-2xl p-3 border border-border/70 hover:border-brand-medium/50 shadow-xs hover:shadow-card hover:-translate-y-1">
      <Image
        src={logoUrl}
        alt={`${brand.name || 'Brand'} Logo`}
        fill
        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
        className="object-contain p-2 md:p-3 transition-transform duration-500 ease-out group-hover:scale-105 mix-blend-multiply"
      />
    </div>
  );
}

export default async function OpticalBrandsPage({ params }: Props) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();

  const typedLocale = locale as Locale;
  const isAr = typedLocale === 'ar';

  const [heroSetting, brands] = await Promise.all([
    getPageHero('optical-brands'),
    getOpticalBrands(),
  ]);

  const contactNumber = heroSetting?.contactNumber || '+966 55 929 3222';
  const cleanPhone = contactNumber.replace(/[^0-9+]/g, '');
  const mapUrl = heroSetting?.mapUrl || 'https://maps.app.goo.gl/NCs1qV9fBLEpk9YK9?g_st=aw';
  const shortLocation = heroSetting?.shortLocation || (isAr ? 'صفوى' : 'Safwa');

  const pageTitle = isAr
    ? 'سلامتك للبصريات'
    : 'Salamatek Optical';

  const breadcrumbs = [
    { label: isAr ? 'الرئيسية' : 'Home', href: getLocalizedPath('/', typedLocale) },
    { label: isAr ? 'العلامات التجارية للبصريات' : 'Optical Brands' },
  ];

  /* ── 6 Featured Categories Matching the Reference Image ── */
  const OPTICAL_CATEGORIES = [
    {
      id: 'frames',
      label: isAr ? 'إطارات النظارات' : 'Frames',
      title: isAr ? 'إطارات النظارات الطبية' : 'Designer Optical Frames',
      image: '/images/optical-categories/frames.jpg',
    },
    {
      id: 'lense',
      label: isAr ? 'العدسات' : 'Lense',
      title: isAr ? 'العدسات والتقنيات' : 'Optical Lenses',
      image: '/images/optical-categories/lab.jpg',
    },
    {
      id: 'contact-lense',
      label: isAr ? 'العدسات اللاصقة' : 'Contact Lense',
      title: isAr ? 'العدسات اللاصقة الطبية والتجميلية' : 'Contact Lenses',
      image: '/images/optical-categories/lenses.jpg',
    },
    {
      id: 'eye-exam',
      label: isAr ? 'فحص النظر' : 'Eye Examination',
      title: isAr ? 'فحص العيون الشامل' : 'Clinical Eye Exam',
      image: '/images/optical-categories/eye-exam.jpg',
    },
    {
      id: 'sunglasses',
      label: isAr ? 'النظارات الشمسية' : 'Sunglasses',
      title: isAr ? 'النظارات الشمسية الفاخرة' : 'Polarized Sunglasses',
      image: '/images/optical-categories/sunglasses.jpg',
      active: true,
    },
    {
      id: 'rimless',
      label: isAr ? 'نظارات بدون إطار' : 'Frameless Specs',
      title: isAr ? 'نظارات بدون إطار تيتانيوم' : 'Frameless Titanium Specs',
      image: '/images/optical-categories/rimless.jpg',
    },
  ];

  /* ── 4 Core Services from the Reference Image ── */
  const OPTICAL_SERVICES = [
    {
      icon: Eye,
      title: isAr ? 'فحص عيون مجاني' : 'Free eye examination',
      desc: isAr
        ? 'فحص طبي متكامل لقياس النظر بواسطة أخصائيين معتمدين'
        : 'Comprehensive vision acuity and refraction test by certified specialists',
    },
    {
      icon: Clock,
      title: isAr ? 'خدمة سريعة خلال 24 ساعة' : '1 day express service',
      desc: isAr
        ? 'قص وتركيب فوري للعدسات لتستلم نظارتك في أسرع وقت'
        : 'Rapid precision lens cutting and 24-hour turnaround in our on-site lab',
    },
    {
      icon: Wrench,
      title: isAr ? 'صيانة وتعديل مجاني' : 'Free maintenance',
      desc: isAr
        ? 'تنظيف بالموجات فوق الصوتية، ضبط الإطار واستبدال المسامير'
        : 'Complimentary ultrasonic cleaning, frame adjustments, and screw replacement',
    },
    {
      icon: Sparkles,
      title: isAr ? 'قياس وتركيب العدسات' : 'Contact lens fitting',
      desc: isAr
        ? 'تحديد قياسات القرنية وتجربة العدسات اللاصقة بإشراف طبي'
        : 'Professional corneal curvature evaluation and trial fitting guidance',
    },
  ];

  return (
    <div className="min-h-screen bg-[#FDFDFD]">
      {/* ── 1. Page Hero Banner ── */}
      <PageHero
        locale={typedLocale}
        badge={isAr ? 'مجمع سلامتك للبصريات' : 'Salamatek Optical Center'}
        heading={pageTitle}
        subtext={
          isAr
            ? 'لأكثر من 3 سنوات، نبتكر في عالم رعاية العيون والنظارات لنمنحكم رؤية أوضح وأناقة تدوم بأعلى معايير الدقة والجودة العالمية.'
            : "For over 3 years, we've been leading innovations in eyecare and eyewear while constantly challenging boundaries."
        }
        imageSrc={heroSetting?.image || '/images/compressed/paragon-14.jpg'}
        imageAlt={pageTitle}
        breadcrumbs={breadcrumbs}
      />

      {/* ── 2. Featured Optical Categories (Direct match to user reference screenshot) ── */}
      <section className="py-16 md:py-24 bg-[#FAF9F6]/60 border-b border-border/50">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          
          {/* Section Header */}
          <div className="text-center max-w-2xl mx-auto mb-12 md:mb-14">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-[#1E3A34] uppercase font-sans">
              {isAr ? 'سلامتك للبصريات' : 'SALAMATEK OPTICAL'}
            </h2>
            <p className="mt-3 text-xs sm:text-sm md:text-base text-[#6B7280] leading-relaxed max-w-xl mx-auto">
              {isAr
                ? 'لأكثر من 3 سنوات، نبتكر في عالم رعاية العيون والنظارات الطبية والشمسية لنجمع بين الرؤية المثالية والأناقة العصرية.'
                : "For over 3 years, we've been leading innovations in eyecare and eyewear while constantly challenging boundaries"}
            </p>
          </div>

          {/* 3x2 Grid of Cards exactly as shown in reference */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 sm:gap-6 lg:gap-7 items-stretch">
            {OPTICAL_CATEGORIES.map((cat) => (
              <div
                key={cat.id}
                className={`group relative rounded-2xl p-2.5 sm:p-3 transition-all duration-300 flex flex-col justify-between ${
                  cat.active
                    ? 'bg-[#EFECE6] border-2 border-[#D9D3C7] shadow-md -translate-y-1'
                    : 'bg-white/90 hover:bg-[#F7F5F0] border border-border/80 hover:border-[#D9D3C7] shadow-xs hover:shadow-md hover:-translate-y-1'
                }`}
              >
                {/* Rounded Photo */}
                <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden bg-slate-100 shadow-2xs">
                  <Image
                    src={cat.image}
                    alt={cat.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover object-center transition-transform duration-500 ease-out group-hover:scale-105"
                  />
                </div>

                {/* Single-line centered label directly below photo */}
                <div className="pt-3.5 pb-2 text-center">
                  <span className="text-xs sm:text-sm font-semibold tracking-wider text-[#374151] group-hover:text-[#111827] uppercase font-sans">
                    {cat.label}
                  </span>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ── 3. Our Services Section (4 Features from Reference) ── */}
      <section className="bg-white py-16 md:py-24 border-y border-border/60">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-12 md:mb-16">
            <span className="inline-block px-3.5 py-1 rounded-full bg-brand-mint text-brand-dark text-xs font-bold tracking-widest uppercase mb-3 border border-brand-pale">
              {isAr ? 'خدمات متميزة' : 'Optical Excellence'}
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-brand-dark tracking-tight">
              {isAr ? 'خدماتنا' : 'Our Services'}
            </h2>
            <p className="mt-3 text-sm sm:text-base text-text-muted leading-relaxed">
              {isAr
                ? 'خدمات بصرية متكاملة تحت سقف واحد تضمن لكم الراحة والدقة بأعلى المقاييس.'
                : 'Specialized optical care and on-site support to guarantee precision, comfort, and peace of mind.'}
            </p>
          </div>

          {/* 4 Service Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-7">
            {OPTICAL_SERVICES.map((srv, idx) => {
              const IconComp = srv.icon;
              return (
                <div
                  key={idx}
                  className="group relative bg-[#F8FAF9] rounded-2xl p-6 border border-border/70 hover:border-brand-pale transition-all duration-300 hover:-translate-y-1 hover:shadow-card text-center flex flex-col items-center"
                >
                  {/* Service Icon Badge */}
                  <div className="w-14 h-14 rounded-2xl bg-white border border-brand-pale/60 flex items-center justify-center text-brand-dark shadow-xs group-hover:bg-brand-dark group-hover:text-white transition-all duration-300 mb-4">
                    <IconComp className="w-6 h-6 shrink-0 transition-transform duration-300 group-hover:scale-110" />
                  </div>

                  <h3 className="text-sm sm:text-base font-bold text-brand-dark mb-2 group-hover:text-brand transition-colors">
                    {srv.title}
                  </h3>
                  <p className="text-xs text-text-muted leading-relaxed">
                    {srv.desc}
                  </p>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* ── 4. Our Brands Section (Designer Brand Showcase) ── */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
            <span className="inline-block px-3.5 py-1 rounded-full bg-brand-mint text-brand-dark text-xs font-bold tracking-widest uppercase mb-3 border border-brand-pale">
              {isAr ? 'علامات تجارية عالمية' : 'Curated Eyewear'}
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-brand-dark tracking-tight">
              {isAr ? 'علاماتنا التجارية' : 'Our Brands'}
            </h2>
            <p className="mt-4 text-sm sm:text-base md:text-lg text-text-muted leading-relaxed max-w-2xl mx-auto">
              {isAr
                ? 'اكتشف مجموعتنا المتميزة من النظارات الطبية والشمسية من أشهر بيوت الأزياء والعلامات التجارية العالمية.'
                : 'Discover our premium selection of optical frames and sunglasses from world-renowned luxury brands.'}
            </p>
          </div>

          {/* Brands Logo Grid */}
          <div className="flex flex-wrap justify-center gap-3 sm:gap-4 md:gap-5">
            {brands.map((brand: any, idx: number) => (
              <div
                key={brand._id || brand.name || idx}
                className="w-[calc(50%-0.5rem)] sm:w-[calc(33.333%-0.75rem)] md:w-[calc(25%-1rem)] lg:w-[calc(20%-1rem)] xl:w-[calc(16.666%-1rem)]"
              >
                <BrandLogoCard brand={brand} />
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ── 5. Optical Consultation & Contact Banner ── */}
      <section className="bg-gradient-to-br from-brand-dark via-[#0C3528] to-[#08221A] text-white py-14 md:py-20 overflow-hidden relative">
        {/* Glow decoration */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-light/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-brand-pale/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center sm:text-start">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="max-w-2xl">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-3">
                <span className="inline-block px-3.5 py-1 rounded-full bg-white/10 text-brand-pale text-xs font-semibold tracking-wider uppercase border border-white/10">
                  {isAr ? 'استشارة وفحص النظر' : 'Optical Consultations'}
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold border border-emerald-500/30">
                  <MapPin className="w-3.5 h-3.5 shrink-0" />
                  <span>{isAr ? `الموقع: ${shortLocation}` : `Location: ${shortLocation}`}</span>
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-white tracking-tight leading-tight">
                {isAr
                  ? 'هل تبحث عن النظارة المثالية أو ترغب في فحص نظرك؟'
                  : 'Looking for the Perfect Frames or a Vision Check?'}
              </h2>
              <p className="mt-3 text-sm sm:text-base text-brand-pale/85 leading-relaxed">
                {isAr
                  ? `تفضل بزيارة مركز سلامتك للبصريات (${shortLocation})، أو تواصل معنا مباشرة لحجز موعد واستشارة أخصائي البصريات.`
                  : `Visit Salamatek Optical Center (${shortLocation}) or contact us directly to schedule an appointment and consult with our specialists.`}
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3.5 shrink-0 w-full sm:w-auto">
              {/* Clickable Phone Call */}
              <a
                href={`tel:${cleanPhone}`}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-brand hover:bg-brand-medium text-white font-bold text-sm transition-all shadow-md hover:scale-105 active:scale-95 duration-200"
                aria-label={isAr ? `اتصل بنا على ${contactNumber}` : `Call us at ${contactNumber}`}
              >
                <Phone className="w-4 h-4 shrink-0 text-white" />
                <span dir="ltr">{contactNumber}</span>
              </a>

              {/* Clickable Google Maps Location Link (Short text) */}
              <a
                href={mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm border border-white/20 transition-all hover:scale-105 active:scale-95 duration-200"
                aria-label={isAr ? `الموقع: ${shortLocation}` : `Location: ${shortLocation}`}
              >
                <MapPin className="w-4 h-4 shrink-0 text-brand-light" />
                <span>{isAr ? `الموقع: ${shortLocation}` : `Location: ${shortLocation}`}</span>
              </a>

              {/* Clickable WhatsApp */}
              <a
                href={`https://wa.me/${cleanPhone.replace('+', '')}?text=${encodeURIComponent(
                  isAr ? 'مرحباً، أود الاستفسار عن خدمات ونظارات مركز البصريات' : 'Hello, I would like to inquire about Salamatek Optical services and frames'
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm transition-all shadow-md hover:scale-105 active:scale-95 duration-200"
                aria-label={isAr ? 'تواصل عبر واتساب' : 'Chat on WhatsApp'}
              >
                <MessageCircle className="w-4 h-4 shrink-0" />
                <span>{isAr ? 'واتساب' : 'WhatsApp'}</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
