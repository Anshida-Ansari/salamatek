import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { isValidLocale } from '@/i18n/config';
import type { Locale } from '@/i18n/config';
import { getTranslations } from '@/i18n';

// Homepage section components
import { HeroSection } from '@/components/home/HeroSection';
import { AboutSection } from '@/components/home/AboutSection';
import { DepartmentsSection } from '@/components/home/DepartmentsSection';
import { DoctorsSection } from '@/components/home/DoctorsSection';
import { WhySalamateKSection } from '@/components/home/WhySalamateKSection';
import { SARCSection } from '@/components/home/SARCSection';
import { OpticalStoreSection } from '@/components/home/OpticalStoreSection';
import { NewsSection } from '@/components/home/NewsSection';
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

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();
  const t = getTranslations(locale as Locale);

  return (
    <>
      {/* 1. Hero */}
      <HeroSection locale={locale} t={t} />

      {/* 2. About / Welcome */}
      <AboutSection locale={locale} t={t} />

      {/* 3. Departments */}
      <DepartmentsSection locale={locale} t={t} />

      {/* 4. Doctors */}
      <DoctorsSection locale={locale} t={t} />

      {/* 5. Why Salamatek */}
      <WhySalamateKSection locale={locale} t={t} />

      {/* 6. SARC */}
      <SARCSection locale={locale} t={t} />

      {/* 7. Optical Store */}
      <OpticalStoreSection locale={locale} t={t} />

      {/* 8. News & Insights */}
      <NewsSection locale={locale} t={t} />

      {/* 9. Appointment */}
      <AppointmentSection locale={locale} t={t} />
    </>
  );
}
