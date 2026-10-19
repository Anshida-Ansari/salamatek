import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { isValidLocale, type Locale } from '@/i18n/config';
import { getTranslations } from '@/i18n';
import { getLocalizedPath } from '@/lib/utils';
import { PageHero } from '@/components/shared/PageHero';
import { CTASection } from '@/components/shared/CTASection';
import { INSURANCE_PARTNERS } from '@/lib/constants';
import { ShieldCheck, FileCheck2, UserCheck2, HelpCircle } from 'lucide-react';

type Props = {
  params: Promise<{ locale: string }>;
};

async function getPageHero(pageKey: string) {
  try {
    const apiUrl =
      (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000') + '/api';
    const res = await fetch(`${apiUrl}/page-heroes/${pageKey}`, {
      next: { revalidate: 60, tags: ['page-heroes'] },
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data || null;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!isValidLocale(locale)) return {};
  const t = getTranslations(locale as Locale);
  const p = t.pages.insurancePartners;

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

export default async function InsurancePartnersPage({ params }: Props) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();

  const typedLocale = locale as Locale;
  const t = getTranslations(typedLocale);
  const isAr = typedLocale === 'ar';

  const heroSetting = await getPageHero('insurance-partners');

  const pageTitle = isAr
    ? 'شركاء التأمين'
    : 'Our Insurance Partners';

  const breadcrumbs = [
    { label: isAr ? 'الرئيسية' : 'Home', href: getLocalizedPath('/', typedLocale) },
    { label: pageTitle },
  ];

  return (
    <>
      <PageHero
        locale={typedLocale}
        badge={isAr ? 'الرعاية التأمينية' : 'Insurance Network'}
        heading={pageTitle}
        subtext={
          isAr
            ? 'نعمل بشراكة وثيقة مع كبرى شركات التأمين الطبي في المملكة لتقديم رعاية صحية عالية الجودة بيسر وسهولة.'
            : 'We partner with the Kingdom’s premier medical insurance providers to ensure seamless, direct-billing access to world-class healthcare.'
        }
        imageSrc={heroSetting?.image}
        breadcrumbs={breadcrumbs}
      />

      {/* Insurance Advantages & Coverage Process */}
      <section className="bg-white py-14 md:py-20 border-b border-border/60">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="inline-block px-3.5 py-1 rounded-full bg-surface-mint text-brand-dark text-xs font-bold tracking-wider uppercase mb-3 border border-brand-pale/30">
              {isAr ? 'إجراءات ميسرة ومعتمدة' : 'Seamless Coverage'}
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-brand-dark mb-4">
              {isAr
                ? 'كيف تستفيد من تأمينك في سلامتك'
                : 'Healthcare Coverage Made Simple'}
            </h2>
            <p className="text-sm sm:text-base text-text-muted leading-relaxed max-w-2xl mx-auto">
              {isAr
                ? 'فريق مكتب التأمين الطبي لدينا يحرص على توفير تجربة مريحة وسريعة لإنهاء الموافقات والتغطيات الطبية فور وصولك.'
                : 'Our dedicated medical insurance desk handles electronic eligibility verifications and approvals smoothly upon arrival.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            <div className="p-7 rounded-3xl bg-surface-light border border-border/70 hover:shadow-card transition-shadow flex flex-col">
              <div className="w-12 h-12 rounded-2xl bg-surface-mint text-brand flex items-center justify-center mb-5">
                <FileCheck2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-serif font-bold text-brand-dark mb-2.5">
                {isAr ? 'ربط آلي وموافقات فورية' : 'Electronic Direct Billing'}
              </h3>
              <p className="text-sm text-text-muted leading-relaxed">
                {isAr
                  ? 'ربط مباشر مع بوابات شركات التأمين يتيح استخراج الموافقات الطبية للفحوصات والأشعة والعيادات في دقائق معدودة.'
                  : 'Direct online sync with insurance portals enables instant medical approvals and claims processing in minutes.'}
              </p>
            </div>

            <div className="p-7 rounded-3xl bg-surface-light border border-border/70 hover:shadow-card transition-shadow flex flex-col">
              <div className="w-12 h-12 rounded-2xl bg-surface-mint text-brand flex items-center justify-center mb-5">
                <UserCheck2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-serif font-bold text-brand-dark mb-2.5">
                {isAr ? 'مكتب متخصص لخدمتكم' : 'Dedicated Insurance Desk'}
              </h3>
              <p className="text-sm text-text-muted leading-relaxed">
                {isAr
                  ? 'أخصائيو تأمين جاهزون لمساعدتكم في مراجعة جدول المنافع، نسبة التحمل، والرد على أي استفسارات تتعلق بوثيقتكم.'
                  : 'Experienced insurance coordinators on site to assist with policy benefits, co-pay inquiries, and pre-authorizations.'}
              </p>
            </div>

            <div className="p-7 rounded-3xl bg-surface-light border border-border/70 hover:shadow-card transition-shadow flex flex-col">
              <div className="w-12 h-12 rounded-2xl bg-surface-mint text-brand flex items-center justify-center mb-5">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-serif font-bold text-brand-dark mb-2.5">
                {isAr ? 'اعتماد مجلس الضمان الصحي (CCHI)' : 'CCHI Accredited Center'}
              </h3>
              <p className="text-sm text-text-muted leading-relaxed">
                {isAr
                  ? 'مجمع سلامتك مرخص ومعتمد بالكامل وفق معايير مجلس الضمان الصحي التعاوني بالمملكة العربية السعودية.'
                  : 'Fully compliant and licensed under the regulations of the Council of Health Insurance (CCHI) in Saudi Arabia.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Insurance Partners Directory Grid */}
      <section className="bg-[#F8FAF9] py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="inline-block px-3.5 py-1 rounded-full bg-surface-mint text-brand-dark text-xs font-bold tracking-wider uppercase mb-3 border border-brand-pale/30">
              {isAr ? 'شبكتنا التأمينية' : 'Approved Providers'}
            </span>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-brand-dark mb-4">
              {isAr
                ? 'شركات التأمين المعتمدة لدى مجمع سلامتك'
                : 'Accepted Insurance Companies'}
            </h2>
            <p className="text-base md:text-lg text-text-muted leading-relaxed max-w-2xl mx-auto">
              {isAr
                ? 'نستقبل المرضى وحاملي بطاقات التأمين من أكثر من 26 شركة ومؤسسة تأمين رائدة محلياً وإقليمياً.'
                : 'We welcome policyholders and corporate members from over 26 leading health insurance organizations.'}
            </p>
          </div>

          {/* Grid Layout matching brand styling */}
          <div className="flex flex-wrap justify-center gap-4 sm:gap-5 md:gap-6">
            {INSURANCE_PARTNERS.map((partner, idx) => {
              const logoUrl = `/images/insurance/${partner.image}`;
              return (
                <div
                  key={idx}
                  className="w-[calc(50%-0.5rem)] sm:w-[calc(33.333%-0.85rem)] md:w-[calc(25%-1.125rem)] lg:w-[calc(20%-1.2rem)] xl:w-[calc(16.666%-1.25rem)] bg-white rounded-2xl p-4 border border-border/70 hover:border-brand-pale/80 shadow-xs hover:shadow-card hover:-translate-y-1 transition-all duration-300 flex flex-col items-center justify-center group"
                >
                  <div className="relative w-full h-20 md:h-24 flex items-center justify-center overflow-hidden">
                    <Image
                      src={logoUrl}
                      alt={`${partner.name} Logo`}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                      className="object-contain p-2 md:p-3 transition-transform duration-500 ease-out group-hover:scale-110 mix-blend-multiply"
                    />
                  </div>
                  <span className="mt-2 text-xs font-semibold text-text-subtle group-hover:text-brand-dark transition-colors text-center line-clamp-1">
                    {partner.name}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Verification Note */}
          <div className="mt-12 max-w-2xl mx-auto p-5 rounded-2xl bg-white border border-border/80 flex items-center gap-4 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-surface-mint text-brand flex items-center justify-center shrink-0">
              <HelpCircle className="w-5 h-5" />
            </div>
            <p className="text-xs sm:text-sm text-text-muted leading-relaxed">
              {isAr
                ? 'لا تجد شركة تأمينك بالقائمة أو ترغب بالتحقق من تغطية شبكتك المحددة؟ يرجى التواصل مع مكتب الاستقبال والتأمين لدينا للمساعدة الفورية.'
                : 'Do not see your provider or want to confirm specific network tier eligibility? Please contact our reception desk for immediate verification.'}
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <CTASection
        heading={
          isAr
            ? 'تفضل بزيارتنا أو استفسر عن تأمينك الطبي'
            : 'Visit Us or Inquire About Your Insurance'
        }
        subtext={
          isAr
            ? 'فريقنا مستعد دائماً لاستقبالكم وتسهيل كافة الإجراءات الطبية والتأمينية.'
            : 'Our medical and administrative teams are here to ensure a pleasant, hassle-free healthcare experience.'
        }
        ctaLabel={t.common.contactUs}
        ctaHref={getLocalizedPath('/contact', typedLocale)}
      />
    </>
  );
}
