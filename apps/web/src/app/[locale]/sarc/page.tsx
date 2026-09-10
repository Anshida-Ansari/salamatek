import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations } from '@/i18n';
import { isValidLocale, type Locale } from '@/i18n/config';
import { getLocalizedPath } from '@/lib/utils';
import { PageHero } from '@/components/shared/PageHero';
import { CTASection } from '@/components/shared/CTASection';

type Props = {
  params: Promise<{ locale: string }>;
};

async function getPageHero(pageKey: string) {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
    const res = await fetch(`${apiUrl}/page-heroes/${pageKey}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data || null;
  } catch (error) {
    return null;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!isValidLocale(locale)) return {};
  const t = getTranslations(locale as Locale);

  return {
    title: t.pages.sarc.title,
    description: t.pages.sarc.description,
  };
}

export default async function SARCPage({ params }: Props) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();
  
  const typedLocale = locale as Locale;
  const t = getTranslations(typedLocale);
  const p = t.pages.sarc;
  
  const heroSetting = await getPageHero('sarc');

  const heading = heroSetting?.heading?.[typedLocale] || p.title;
  const subtext = heroSetting?.subtext?.[typedLocale] || p.description;

  return (
    <>
      <PageHero 
        locale={typedLocale}
        badge={p.title}
        heading={heading}
        subtext={subtext}
        imageSrc={heroSetting?.image}
      />

      <section className="py-16 md:py-24 bg-surface-light">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xl text-text-muted leading-relaxed mb-12">
            {p.introText || 'SARC is the division of Salamatek Medical Center. We simplify healthcare services at work sites with the latest medical tools and supplies.'}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[
              { id: 1, title: 'Doctors', desc: 'Qualified physicians providing on-site medical care' },
              { id: 2, title: 'Nurses', desc: 'Registered nurses supporting on-site clinics' },
              { id: 3, title: 'Paramedics', desc: 'Trained paramedics providing immediate first aid' },
              { id: 4, title: 'Ambulance Support', desc: 'Ambulances provided on a rental basis' }
            ].map(service => (
              <div key={service.id} className="bg-white p-6 rounded-2xl shadow-sm border border-border">
                <h3 className="text-lg font-bold text-text-base mb-2">{service.title}</h3>
                <p className="text-text-muted text-sm">{service.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CTASection 
        heading={t.pages.home.appointmentHeading}
        subtext={t.pages.home.appointmentSubtext}
        ctaLabel="Enquire Now"
        ctaHref={getLocalizedPath('/sarc/enquire', typedLocale)}
      />
    </>
  );
}
