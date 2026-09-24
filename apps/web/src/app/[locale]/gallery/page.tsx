import type { Locale } from '@/i18n/config';
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

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function GalleryPage({ params }: Props) {
  const { locale } = await params;
  const typedLocale = locale as Locale;
  const t = getTranslations(typedLocale);
  const isAr = typedLocale === 'ar';
  
  const images = await getGalleryImages();

  return (
    <main className="min-h-screen bg-[#F8FAF9]">
      <PageHero
        locale={typedLocale}
        badge={isAr ? 'المعرض' : 'Gallery'}
        heading={isAr ? 'معرض الصور' : 'Gallery'}
        subtext={isAr ? 'ألق نظرة على منشآتنا الطبية المتميزة وخدماتنا' : 'Take a look at our premium medical facilities and services.'}
        breadcrumbs={[
          { label: t.nav.home, href: '/' },
          { label: isAr ? 'المعرض' : 'Gallery' },
        ]}
      />
      
      <GalleryGrid images={images} isAr={isAr} />
    </main>
  );
}
