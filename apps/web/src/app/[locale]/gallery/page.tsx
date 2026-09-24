import { getDictionary } from '@/i18n';
import type { Locale } from '@/i18n/config';
import { PageHeader } from '@/components/layout/PageHeader';
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

export default async function GalleryPage({
  params: { locale },
}: {
  params: { locale: Locale };
}) {
  const t = await getDictionary(locale);
  const isAr = locale === 'ar';
  
  const images = await getGalleryImages();

  return (
    <main className="min-h-screen bg-[#F8FAF9]">
      <PageHeader
        title={isAr ? 'معرض الصور' : 'Gallery'}
        description={isAr ? 'ألق نظرة على منشآتنا الطبية المتميزة وخدماتنا' : 'Take a look at our premium medical facilities and services.'}
        breadcrumbs={[
          { label: t.nav.home, href: '/' },
          { label: isAr ? 'المعرض' : 'Gallery' },
        ]}
      />
      
      <GalleryGrid images={images} isAr={isAr} />
    </main>
  );
}
