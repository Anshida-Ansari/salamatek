import type { Metadata } from 'next';
import type { Locale } from '@/i18n/config';
import { isValidLocale } from '@/i18n/config';
import { notFound } from 'next/navigation';
import { getTranslations } from '@/i18n';
import { PageHero } from '@/components/shared/PageHero';
import { GalleryGrid } from '@/components/gallery/GalleryGrid';

export const revalidate = 60; // Revalidate every minute

async function getGalleryImages() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/gallery-images?active=true&limit=100`, {
      next: { revalidate: 60, tags: ['gallery'] }
    });
    if (!res.ok) return [];
    const json = await res.json();
    return json.data || [];
  } catch (error) {
    console.error('Error fetching gallery images:', error);
    return [];
  }
}

async function getPageHero(pageKey: string) {
  try {
    const apiUrl = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000') + '/api';
    const res = await fetch(`${apiUrl}/page-heroes/${pageKey}`, {
      next: { revalidate: 60, tags: ['page-heroes'] },
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data || null;
  } catch (error) {
    return null;
  }
}

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!isValidLocale(locale)) return {};
  const isAr = locale === 'ar';

  return {
    title: isAr ? 'معرض الصور | مجمع سلامتك الطبي' : 'Gallery | Salamatek Medical Center',
    description: isAr
      ? 'ألق نظرة على منشآتنا الطبية المتميزة وخدماتنا في مجمع سلامتك الطبي'
      : 'Explore our modern facilities, advanced medical equipment, and healthcare center at Salamatek Medical Center.',
  };
}

export default async function GalleryPage({ params }: Props) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();

  const typedLocale = locale as Locale;
  const t = getTranslations(typedLocale);
  const isAr = typedLocale === 'ar';
  
  const [images, heroSetting] = await Promise.all([
    getGalleryImages(),
    getPageHero('gallery')
  ]);

  return (
    <main className="min-h-screen bg-[#F8FAF9]">
      <PageHero
        locale={typedLocale}
        badge={isAr ? 'المعرض' : 'Gallery'}
        heading={heroSetting?.heading?.[typedLocale] || (isAr ? 'معرض الصور' : 'Gallery')}
        subtext={heroSetting?.subtext?.[typedLocale] || (isAr ? 'ألق نظرة على منشآتنا الطبية المتميزة وخدماتنا' : 'Take a look at our premium medical facilities and services.')}
        imageSrc={heroSetting?.image}
        breadcrumbs={[
          { label: t.nav.home, href: '/' },
          { label: isAr ? 'المعرض' : 'Gallery' },
        ]}
      />
      
      <GalleryGrid images={images} isAr={isAr} />
    </main>
  );
}
