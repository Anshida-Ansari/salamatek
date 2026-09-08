import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { isValidLocale } from '@/i18n/config';
import type { Locale } from '@/i18n/config';
import { getTranslations } from '@/i18n';
import { Section, Container, Heading, Button, Card, Badge } from '@/components/ui';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!isValidLocale(locale)) return {};
  const t = getTranslations(locale as Locale);
  return { title: t.pages.home.title };
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();
  const t = getTranslations(locale as Locale);

  return (
    <>
      {/* Hero Placeholder */}
      <section
        className="relative bg-brand-dark text-white py-28 md:py-40 overflow-hidden"
        aria-label="Hero"
      >
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-[0.04]" aria-hidden="true">
          <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />
        </div>

        <Container className="relative">
          <div className="max-w-2xl">
            <p className="label-sm text-brand-light mb-6">{t.pages.home.heroEyebrow}</p>
            <h1 className="font-serif text-display-xl md:text-display-2xl font-bold leading-tight mb-6">
              {locale === 'ar' ? (
                <>
                  <span className="block">٤٠ عامًا من الرعاية.</span>
                  <span className="block text-brand-light italic">لا يزال يرعى. لا يزال يخدم.</span>
                </>
              ) : (
                <>
                  <span className="block">40 Years of Care.</span>
                  <span className="block text-brand-light italic">Still caring. Still serving.</span>
                </>
              )}
            </h1>
            <p className="body-lg text-white/70 mb-8 max-w-xl">
              {t.meta.siteDescription}
            </p>
            <div className="flex flex-wrap gap-3">
              <Button variant="primary" size="lg">{t.nav.bookAppointment}</Button>
              <Button variant="outline" size="lg" className="border-white/30 text-white hover:bg-white/10 hover:border-white/50">
                {t.common.explore}
              </Button>
            </div>

            {/* Stats */}
            <div className="mt-14 flex flex-wrap gap-8">
              {[
                { value: locale === 'ar' ? 'أجيال' : 'Generations', label: locale === 'ar' ? 'من الرعاية الموثوقة' : 'of trusted care' },
                { value: '12', label: locale === 'ar' ? 'تخصصًا طبيًا' : 'Specialities' },
                { value: '24/7', label: locale === 'ar' ? 'دعم المرضى' : 'Patient support' },
              ].map(({ value, label }) => (
                <div key={label}>
                  <p className="text-2xl font-bold font-serif">{value}</p>
                  <p className="text-sm text-white/60 mt-0.5">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* Design System Showcase — Phase 1 */}
      <Section bg="cream" spacing="lg">
        <div className="text-center mb-12">
          <Badge variant="brand" className="mb-4">Phase 1 Foundation</Badge>
          <Heading level={2} variant="h2" className="text-text-base">
            {locale === 'ar' ? 'نظام التصميم — المرحلة الأولى' : 'Design System — Phase 1 Foundation'}
          </Heading>
          <p className="body-base mt-4 max-w-xl mx-auto">
            {locale === 'ar'
              ? 'هذه الصفحة تعرض نظام التصميم والمكونات الأساسية. سيتم استبدالها بمحتوى الصفحة الرئيسية الكامل في المرحلة التالية.'
              : 'This page demonstrates the design system and reusable components. It will be replaced with full homepage content in the next phase.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {[
            { title: locale === 'ar' ? 'الجلدية والليزر' : 'Dermatology & Laser',   desc: locale === 'ar' ? 'رعاية متقدمة للبشرة والشعر.' : 'Advanced skin, hair and aesthetic care.' },
            { title: locale === 'ar' ? 'طب الأسنان' : 'Dental Care',               desc: locale === 'ar' ? 'طب أسنان شامل وتجميلي.' : 'Complete family and cosmetic dentistry.' },
            { title: locale === 'ar' ? 'طب العيون' : 'Ophthalmology',              desc: locale === 'ar' ? 'فحوصات وعلاج متخصص للعيون.' : 'Specialist eye examinations and treatment.' },
          ].map(({ title, desc }) => (
            <Card key={title} hover variant="default" className="group">
              <div className="w-10 h-10 rounded-xl bg-brand-mint flex items-center justify-center mb-4">
                <svg className="w-5 h-5 text-brand-medium" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <h3 className="font-semibold text-text-base text-lg mb-2">{title}</h3>
              <p className="text-sm text-text-muted mb-4">{desc}</p>
              <span className="text-sm font-semibold text-brand-red group-hover:underline">
                {t.common.learnMore}
              </span>
            </Card>
          ))}
        </div>

        {/* Button variants */}
        <div className="flex flex-wrap gap-3 justify-center">
          <Button variant="primary">{t.nav.bookAppointment}</Button>
          <Button variant="secondary">{t.common.explore}</Button>
          <Button variant="outline">{t.common.learnMore}</Button>
          <Button variant="sarc">SARC</Button>
          <Button variant="ghost">{t.common.viewAll}</Button>
        </div>
      </Section>
    </>
  );
}
