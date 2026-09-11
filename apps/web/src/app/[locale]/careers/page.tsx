import { Metadata } from 'next';
import Link from 'next/link';
import { Briefcase, MapPin, Clock, ArrowRight, Sparkles, Award, Users, HeartHandshake } from 'lucide-react';
import { PageHero } from '@/components/shared/PageHero';
import { isValidLocale, type Locale } from '@/i18n/config';
import { notFound } from 'next/navigation';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const isRtl = locale === 'ar';
  return {
    title: isRtl ? 'الوظائف | مركز سلامتك الطبي' : 'Careers & Opportunities | Salamatek Medical Centre',
    description: isRtl 
      ? 'استكشف الفرص الوظيفية المتاحة في مركز سلامتك الطبي وانضم إلى فريق الرعاية الصحية المتميز في صفوى.' 
      : 'Explore current career opportunities at Salamatek Medical Centre and join our compassionate healthcare team in Safwa.',
  };
}

async function getCareers() {
  try {
    const apiUrl = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000') + '/api';
    const res = await fetch(`${apiUrl}/careers?active=true&limit=100`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return [];
    const json = await res.json();
    return json.data || [];
  } catch {
    return [];
  }
}

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function CareersPage({ params }: Props) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();

  const typedLocale = locale as Locale;
  const isRtl = typedLocale === 'ar';
  const careers = await getCareers();

  const benefits = [
    {
      icon: Award,
      title: isRtl ? 'بيئة سريرية متطورة' : 'Advanced Clinical Environment',
      desc: isRtl ? 'أحدث التقنيات والمعدات التشخيصية والعلاجية لخدمة المرضى.' : 'Equipped with modern diagnostic tools and patient-first clinical facilities.',
    },
    {
      icon: Sparkles,
      title: isRtl ? 'تطوير مهني مستمر' : 'Continuous Development',
      desc: isRtl ? 'فرص تدريب واعتماد مستمر لجميع الكوادر الطبية والإدارية.' : 'CME programs, internal training, and leadership advancement pathways.',
    },
    {
      icon: Users,
      title: isRtl ? 'فريق عمل متكامل' : 'Collaborative Culture',
      desc: isRtl ? 'ثقافة عمل تقوم على الاحترام المتبادل والتعاون بين مختلف التخصصات.' : 'A respectful, multidisciplinary team dedicated to patient safety and excellence.',
    },
    {
      icon: HeartHandshake,
      title: isRtl ? 'مزايا وحوافز مجزية' : 'Competitive Benefits',
      desc: isRtl ? 'حزم تعويضات تنافسية وتأمين طبي شامل لراحة بالك واستقرارك.' : 'Comprehensive healthcare coverage, attractive packages, and work-life balance.',
    },
  ];

  return (
    <main className="min-h-screen bg-[#F8FAF9]" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Standard PageHero Banner matching the rest of the public website */}
      <PageHero
        locale={typedLocale}
        badge={isRtl ? 'الوظائف والفرص المهنية' : 'Careers & Opportunities'}
        heading={isRtl ? 'انضم إلى فريق سلامتك الطبي\nوابنِ مستقبلك المهني معنا' : 'Join the Salamatek Team\nDeliver Healthcare with Purpose'}
        subtext={isRtl 
          ? 'نبحث دائماً عن الكوادر الطبية والتمريضية والإدارية المتميزة لتقديم رعاية صحية بمعايير عالمية في صفوى والمنطقة الشرقية.' 
          : 'We are always seeking passionate medical, nursing, and administrative professionals dedicated to raising healthcare standards in Safwa.'}
        imageSrc="/images/hospital/exterior.jpg"
        imageAlt="Salamatek Medical Centre"
        breadcrumbs={[
          { label: isRtl ? 'الرئيسية' : 'Home', href: `/${locale}` },
          { label: isRtl ? 'الوظائف' : 'Careers' },
        ]}
      />

      {/* Why Join Us Highlight Section */}
      <section className="py-12 md:py-16 border-b border-border bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10 md:mb-12">
            <span className="inline-block px-3 py-1 rounded-full bg-surface-mint text-brand-dark text-xs font-bold tracking-wider uppercase mb-3">
              {isRtl ? 'لماذا تختار سلامتك؟' : 'Why Work at Salamatek?'}
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-brand-dark">
              {isRtl ? 'مكان يمكنك فيه إحداث فرق حقيقي' : 'A Workplace Where You Truly Make a Difference'}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((b, i) => {
              const Icon = b.icon;
              return (
                <div
                  key={i}
                  className="bg-[#F8FAF9] rounded-2xl p-6 border border-border/80 hover:border-brand/30 hover:shadow-card transition-all group"
                >
                  <div className="w-12 h-12 rounded-xl bg-surface-mint text-brand flex items-center justify-center mb-4 group-hover:bg-brand group-hover:text-white transition-colors">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-serif font-bold text-brand-dark mb-2">
                    {b.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-text-muted leading-relaxed">
                    {b.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Open Positions Section */}
      <section className="py-14 md:py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <span className="inline-block px-3 py-1 rounded-full bg-surface-mint text-brand-dark text-xs font-bold tracking-wider uppercase mb-2">
                {isRtl ? 'الوظائف الشاغرة' : 'Available Openings'}
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-brand-dark">
                {isRtl ? 'استكشف الفرص المتاحة' : 'Current Job Openings'}
              </h2>
            </div>
            <p className="text-xs sm:text-sm font-semibold text-text-muted">
              {careers.length} {isRtl ? 'وظيفة معلنة' : `position${careers.length !== 1 ? 's' : ''} available`}
            </p>
          </div>

          {careers.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-border shadow-card max-w-xl mx-auto">
              <div className="w-16 h-16 rounded-2xl bg-surface-mint text-brand flex items-center justify-center mx-auto mb-4 border border-brand/10">
                <Briefcase className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-serif font-bold text-brand-dark mb-2">
                {isRtl ? 'لا توجد شواغر معلنة حالياً' : 'No Open Positions Right Now'}
              </h3>
              <p className="text-sm text-text-muted leading-relaxed mb-6">
                {isRtl 
                  ? 'نقوم بتحديث الشواغر باستمرار. يمكنك إرسال سيرتك الذاتية وسنتواصل معك فور توفر فرصة تلائم خبراتك.' 
                  : 'We update our opportunities regularly. Feel free to submit an open application and we will get in touch when a matching role opens.'}
              </p>
              <a
                href={`mailto:careers@salamatek.com`}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand text-white text-sm font-semibold hover:bg-brand-medium transition"
              >
                {isRtl ? 'إرسال سيرة ذاتية عامة' : 'Send General Application'}
              </a>
            </div>
          ) : (
            <div className="space-y-4">
              {careers.map((career: any) => {
                const title = career.title?.[typedLocale] || career.title?.en || 'Position';
                const dept = career.department?.[typedLocale] || career.department?.en;
                const location = career.location?.[typedLocale] || career.location?.en;
                const type = career.employmentType?.[typedLocale] || career.employmentType?.en;
                const desc = career.description?.[typedLocale] || career.description?.en;

                return (
                  <Link 
                    href={`/${locale}/careers/${career.slug}`} 
                    key={career._id}
                    className="group block bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-7 border border-border shadow-card hover:shadow-card-hover hover:border-brand/40 transition-all"
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-2.5">
                          {dept && (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-mint text-brand-dark text-xs font-bold">
                              <Briefcase className="w-3.5 h-3.5 text-brand" />
                              {dept}
                            </span>
                          )}
                          {type && (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-medium">
                              <Clock className="w-3.5 h-3.5 text-slate-500" />
                              {type}
                            </span>
                          )}
                          {location && (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-medium">
                              <MapPin className="w-3.5 h-3.5 text-slate-500" />
                              {location}
                            </span>
                          )}
                        </div>

                        <h3 className="text-xl sm:text-2xl font-serif font-bold text-brand-dark group-hover:text-brand transition-colors mb-2">
                          {title}
                        </h3>

                        {desc && (
                          <p className="text-sm text-text-muted line-clamp-2 leading-relaxed">
                            {desc}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center gap-3 sm:gap-4 flex-shrink-0 self-start md:self-center">
                        <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-surface-mint text-brand font-semibold text-xs sm:text-sm group-hover:bg-brand group-hover:text-white transition-all shadow-sm">
                          <span>{isRtl ? 'تفاصيل الوظيفة والتقديم' : 'View & Apply'}</span>
                          <ArrowRight className={`w-4 h-4 transition-transform group-hover:translate-x-1 ${isRtl ? 'rotate-180 group-hover:-translate-x-1' : ''}`} />
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}

          {/* Spontaneous Application Footer Card */}
          <div className="mt-12 bg-gradient-to-br from-brand-dark to-[#08221A] text-white rounded-3xl p-8 sm:p-10 shadow-xl relative overflow-hidden">
            <div className="absolute -right-16 -bottom-16 w-64 h-64 rounded-full bg-brand/20 blur-3xl pointer-events-none" />
            <div className="relative z-10 max-w-2xl">
              <span className="inline-block px-3 py-1 rounded-full bg-white/10 text-brand-pale text-xs font-bold uppercase tracking-wider mb-3">
                {isRtl ? 'طلبات التوظيف العامة' : 'General Inquiries'}
              </span>
              <h3 className="text-xl sm:text-2xl font-serif font-bold text-white mb-2">
                {isRtl ? 'هل تبحث عن فرصة لم تُدرج بعد؟' : 'Don’t See a Suitable Role Listed?'}
              </h3>
              <p className="text-white/70 text-xs sm:text-sm leading-relaxed mb-6">
                {isRtl 
                  ? 'يسعدنا دائماً استلام السير الذاتية للأطباء والأخصائيين والكوادر التمريضية والإدارية. أرسل سيرتك وسنحتفظ بها في قاعدة بياناتنا للمفاضلة عند فتح شواغر جديدة.' 
                  : 'We are constantly growing our team. Submit your CV and portfolio to our talent pool, and our HR team will reach out when a relevant opportunity arises.'}
              </p>
              <a
                href="mailto:careers@salamatek.com"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-brand-dark hover:bg-brand-pale font-bold text-xs sm:text-sm shadow-md transition-all"
              >
                <span>{isRtl ? 'راسل قسم الموارد البشرية' : 'Contact HR at careers@salamatek.com'}</span>
                <ArrowRight className={`w-4 h-4 ${isRtl ? 'rotate-180' : ''}`} />
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
