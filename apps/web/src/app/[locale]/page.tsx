import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { isValidLocale } from '@/i18n/config';
import type { Locale } from '@/i18n/config';
import { getTranslations } from '@/i18n';
import { getContactSettings } from '@/lib/contact';

// Homepage section components
import { HeroSection } from '@/components/home/HeroSection';
import { AboutSection } from '@/components/home/AboutSection';
import { DepartmentsSection } from '@/components/home/DepartmentsSection';
import { DoctorsSection } from '@/components/home/DoctorsSection';
import { CoreValuesSection } from '@/components/home/CoreValuesSection';
import { SARCSection } from '@/components/home/SARCSection';
import { OpticalStoreSection } from '@/components/home/OpticalStoreSection';
import { NewsSection } from '@/components/home/NewsSection';
import { TestimonialsSection } from '@/components/home/TestimonialsSection';
import { AppointmentSection } from '@/components/home/AppointmentSection';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!isValidLocale(locale)) return {};
  const t = getTranslations(locale as Locale);

  return {
    title: t.pages.home.title,
    description: t.pages.home.description,
    openGraph: {
      title: t.pages.home.title,
      description: t.pages.home.description,
      siteName: t.meta.siteName,
      locale: locale === 'ar' ? 'ar_SA' : 'en_US',
      type: 'website',
    },
    alternates: {
      languages: {
        en: '/en',
        ar: '/ar',
      },
    },
  };
}

const DEPARTMENT_SLUG_ORDER = [
  'internal-medicine',
  'general-medicine',
  'obstetrics-gynaecology',
  'paediatrics',
  'dermatology-cosmetology',
  'cosmetology',
  'ophthalmology',
  'orthopaedics',
  'orthodontics',
  'ent',
  'general-surgeon',
  'dental',
  'physiotherapy',
  'laboratory',
  'radiology',
  'pharmacy',
  'iqama-baladia',
];

function sortDepartments(list: any[]): any[] {
  return [...list].sort((a: any, b: any) => {
    const idxA = DEPARTMENT_SLUG_ORDER.indexOf(a.slug);
    const idxB = DEPARTMENT_SLUG_ORDER.indexOf(b.slug);
    if (idxA !== -1 && idxB !== -1) return idxA - idxB;
    if (idxA !== -1) return -1;
    if (idxB !== -1) return 1;
    return (a.order ?? 999) - (b.order ?? 999);
  });
}

async function getDepartments() {
  try {
    const apiUrl = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000') + '/api';
    const res = await fetch(`${apiUrl}/departments?active=true&limit=100`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return [];
    const json = await res.json();
    return json.data || [];
  } catch {
    return [];
  }
}

async function getTestimonials() {
  try {
    const apiUrl = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000') + '/api';
    const res = await fetch(`${apiUrl}/testimonials?active=true&limit=20`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return [];
    const json = await res.json();
    return json.data || [];
  } catch {
    return [];
  }
}

/** Fetch hero images array for the homepage carousel from CMS */
async function getPageHeroImages(pageKey: string): Promise<string[]> {
  try {
    const apiUrl = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000') + '/api';
    const res = await fetch(`${apiUrl}/page-heroes/${pageKey}`, { next: { revalidate: 60 } });
    if (!res.ok) return [];
    const json = await res.json();
    // Prefer the `images` array; fall back to single `image` for backward compat
    if (json.data?.images?.length) return json.data.images as string[];
    if (json.data?.image) return [json.data.image as string];
    return [];
  } catch {
    return [];
  }
}

/** Fetch a single page-hero image from CMS */
async function getPageHeroImage(pageKey: string): Promise<string | undefined> {
  try {
    const apiUrl = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000') + '/api';
    const res = await fetch(`${apiUrl}/page-heroes/${pageKey}`, { next: { revalidate: 60 } });
    if (!res.ok) return undefined;
    const json = await res.json();
    return json.data?.image || undefined;
  } catch {
    return undefined;
  }
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();
  const t = getTranslations(locale as Locale);

  // Fetch all data in parallel
  const [depts, testimonials, heroImages, sarcImage, contactSettings] = await Promise.all([
    getDepartments(),
    getTestimonials(),
    getPageHeroImages('home'),
    getPageHeroImage('sarc'),
    getContactSettings(),
  ]);

  return (
    <>
      {/* 1. Hero — dynamic images from CMS, falls back to local hospital images */}
      <HeroSection locale={locale} t={t} heroImages={heroImages} contactSettings={contactSettings} />

      {/* 2. About / Welcome */}
      <AboutSection locale={locale} t={t} />

      {/* 3. Departments */}
      <DepartmentsSection locale={locale} t={t} />

      {/* 4. Doctors */}
      <DoctorsSection locale={locale} t={t} departments={sortDepartments(depts)} />

      {/* 5. Core Values — SALAMATEK letter design */}
      <CoreValuesSection locale={locale} t={t} />

      {/* 6. SARC — dynamic image from CMS */}
      <SARCSection locale={locale} t={t} imageSrc={sarcImage} />

      {/* 7. Optical Store */}
      <OpticalStoreSection locale={locale} t={t} />

      {/* 8. News & Insights */}
      <NewsSection locale={locale} t={t} />

      {/* 9. Testimonials */}
      <TestimonialsSection locale={locale} t={t} testimonials={testimonials} />

      {/* 10. Appointment */}
      <AppointmentSection locale={locale} t={t} contactSettings={contactSettings} />
    </>
  );
}
