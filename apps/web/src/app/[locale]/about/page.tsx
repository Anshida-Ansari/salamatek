import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { isValidLocale } from '@/i18n/config';
import type { Locale } from '@/i18n/config';
import { getTranslations } from '@/i18n';
import { getLocalizedPath } from '@/lib/utils';
import { PageHero } from '@/components/shared/PageHero';
import { CTASection } from '@/components/shared/CTASection';
import {
  Quote,
  Target,
  Compass,
  ShieldCheck,
  Sparkles,
  Building2,
  Clock,
  Users,
  Activity,
  CheckCircle2,
} from 'lucide-react';

// ─── SALAMATEK Values Definition ─────────────────────────────────────────────
const VALUES_EN = [
  { letter: 'S', title: 'Service', desc: 'Putting patient well-being and exceptional medical care above all else.' },
  { letter: 'A', title: 'Accountability', desc: 'Taking full ownership of our medical outcomes, safety, and patient trust.' },
  { letter: 'L', title: 'Loyalty', desc: 'Unwavering dedication to our community, patients, and healthcare mission.' },
  { letter: 'A', title: 'Accuracy', desc: 'Precision in diagnostics, surgical interventions, and laboratory testing.' },
  { letter: 'M', title: 'Motivation', desc: 'Inspiring wellness, proactive healing, and healthy lifestyle choices.' },
  { letter: 'A', title: 'Awareness', desc: 'Promoting community health literacy, preventive care, and education.' },
  { letter: 'T', title: 'Team Work', desc: 'Multidisciplinary collaboration across doctors, nurses, and staff.' },
  { letter: 'E', title: 'Efficiency', desc: 'Streamlined clinical operations minimizing wait times and delays.' },
  { letter: 'K', title: 'Knowledge', desc: 'Continuous medical training, evidence-based practices, and learning.' },
];

const VALUES_AR = [
  { letter: 'S', title: 'الخدمة', desc: 'وضع صحة المريض وراحته فوق كل اعتبار في كافة الإجراءات.' },
  { letter: 'A', title: 'المساءلة', desc: 'تحمل المسؤولية الكاملة عن السلامة السريرية وثقة المراجعين.' },
  { letter: 'L', title: 'الولاء', desc: 'التفاني الدائم في خدمة مجتمع صفوى ورسالتنا الإنسانية النبيلة.' },
  { letter: 'A', title: 'الدقة', desc: 'الالتزام بأعلى درجات الدقة في التشخيص والتحاليل والخطط العلاجية.' },
  { letter: 'M', title: 'التحفيز', desc: 'تشجيع المرضى على الشفاء وتبني أسلوب حياة صحي ومستدام.' },
  { letter: 'A', title: 'الوعي', desc: 'نشر التثقيف الصحي والوقائي وتعزيز ثقافة السلامة للجميع.' },
  { letter: 'T', title: 'العمل الجماعي', desc: 'تكامل وتناغم الكوادر الطبية والتمريضية لتقديم رعاية موحدة.' },
  { letter: 'E', title: 'الكفاءة', desc: 'إدارة تشغيلية ورعاية سريعة تُقلل فترات الانتظار بدقة عالية.' },
  { letter: 'K', title: 'المعرفة', desc: 'التعلم الطبي المستمر والاعتماد على أحدث البروتوكولات العالمية.' },
];

// ─── Chairman's Message Content ──────────────────────────────────────────────
const CHAIRMAN_MESSAGE_EN = {
  badge: "Chairman's Message",
  title: 'Putting Patients First',
  lead: 'It gives me immense pleasure to welcome you to Salamatek Medical Center, where our commitment is centered on one fundamental principle — Putting patients first.',
  paragraphs: [
    'Healthcare is not merely about treating illness; it is about caring for people, understanding their needs, and giving them confidence and hope during some of the most important moments of their lives. Our vision is to provide high-quality, compassionate, accessible, and patient-centered healthcare services to the community we serve.',
    'We are committed to continuously improving our medical services by investing in modern technology, maintaining high standards of quality and safety, and encouraging continuous learning and professional development among our healthcare team. Our dedicated doctors, nurses, technicians, administrative staff, and support teams work together with a shared sense of responsibility and purpose.',
    'We believe that quality healthcare is built on trust. Every patient who walks through our doors deserves to be treated with dignity, respect, compassion, and professionalism. We will continue to strengthen this trust by maintaining transparency, ethical practices, clinical excellence, and a culture of continuous improvement.',
    'Our achievements are the result of the collective dedication and hard work of our entire team. I sincerely appreciate their commitment and thank our patients and the community for the confidence they place in us.',
    'As we move forward, our goal remains clear: to build a medical center recognized for excellence in healthcare, compassion in service, and integrity in everything we do.',
    'Together, we look forward to a healthier and brighter future for our community.',
  ],
  authorName: 'Asaf Muhamed Nechikkadan',
  authorRole: 'Chairman & Managing Director',
  authorCompany: 'Salamatek Medical Center Company',
  pillars: [
    'Patient-Centered Care',
    'Clinical Excellence & Safety',
    'Transparency & Ethical Practice',
    'Continuous Medical Innovation',
  ],
};

const CHAIRMAN_MESSAGE_AR = {
  badge: 'رسالة رئيس مجلس الإدارة',
  title: 'وضع المريض أولاً في صميم رسالتنا',
  lead: 'يسعدني ويشرفني أن أرحب بكم في مجمع سلامتك الطبي، حيث يتمحور التزامنا حول مبدأ أساسي واحد — وضع المريض أولاً.',
  paragraphs: [
    'إن الرعاية الصحية ليست مجرد علاج للأمراض؛ بل هي اهتمام حقيقي بالإنسان، وتفهم عميق لاحتياجاته، وبث الثقة والأمل في نفوس المرضى في أدق وأهم لحظات حياتهم. تتمثل رؤيتنا في تقديم خدمات رعاية صحية عالية الجودة، إنسانية، سهلة الوصول، ومتمحورة حول المريض لمجتمعنا العزيز.',
    'نحن ملتزمون بالتطوير المستمر لخدماتنا الطبية من خلال الاستثمار في التقنيات الطبية الحديثة، وتطبيق أعلى معايير الجودة والسلامة، وتشجيع التعليم والتدريب المهني المستمر لكوادرنا الطبية. يعمل أطباؤنا المخلصون وهيئة التمريض والفنيون والإداريون وفرق الدعم كفريق واحد بروح عالية من المسؤولية والهدف المشترك.',
    'نؤمن بأن الرعاية الصحية المتميزة تُبنى على الثقة. فكل مراجع يدخل أبوابنا يستحق أن يُعامل بكرامة واحترام وعطف واحترافية. وسنواصل ترسيخ هذه الثقة من خلال الشفافية، والممارسات الأخلاقية، والتميز السريري، وترسيخ ثقافة التحسين المستمر.',
    'إن إنجازاتنا هي ثمرة التفاني والعمل الدؤوب المشترك لكافة أفراد عائلتنا الطبية. وإني أتوجه إليهم بخالص التقدير والامتنان، كما أشكر مرضانا ومجتمعنا على ثقتهم الغالية التي نعتز بها.',
    'ومع مضينا قدماً، يظل هدفنا واضحاً وجلياً: بناء صرح طبي رائد يُشار إليه بالبنان في تميز الرعاية الصحية، وإنسانية الخدمة، والنزاهة في كل ما نقدمه.',
    'معاً، نتطلع إلى مستقبل أكثر صحة وإشراقاً لمجتمعنا.',
  ],
  authorName: 'عساف محمد نيتشيكادان',
  authorRole: 'رئيس مجلس الإدارة والعضو المنتدب',
  authorCompany: 'شركة مجمع سلامتك الطبي',
  pillars: [
    'الرعاية المتمحورة حول المريض',
    'التميز السريري والسلامة',
    'الشفافية والممارسات الأخلاقية',
    'الابتكار الطبي المستمر',
  ],
};

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!isValidLocale(locale)) return {};
  const t = getTranslations(locale as Locale);
  const pa = t.pages.about;
  return {
    title: pa.title,
    description: pa.description,
    openGraph: {
      title: pa.title,
      description: pa.description,
      siteName: t.meta.siteName,
      locale: locale === 'ar' ? 'ar_SA' : 'en_US',
      type: 'website',
    },
    alternates: { languages: { en: '/en/about', ar: '/ar/about' } },
  };
}

export default async function AboutPage({ params }: Props) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();

  const typedLocale = locale as Locale;
  const t = getTranslations(typedLocale);
  const pa = t.pages.about;
  const isAr = typedLocale === 'ar';
  const values = isAr ? VALUES_AR : VALUES_EN;
  const chairman = isAr ? CHAIRMAN_MESSAGE_AR : CHAIRMAN_MESSAGE_EN;

  const breadcrumbs = [
    { label: isAr ? 'الرئيسية' : 'Home', href: getLocalizedPath('/', typedLocale) },
    { label: isAr ? 'من نحن' : 'About' },
  ];

  const stats = [
    { value: '40+', label: isAr ? 'عاماً من الخبرة والرعاية' : 'Years of Trusted Care', icon: Clock },
    { value: '15+', label: isAr ? 'قسماً وتخصصاً طبياً' : 'Specialized Departments', icon: Building2 },
    { value: '24/7', label: isAr ? 'رعاية طوارئ متواصلة' : 'Emergency Palliative Care', icon: Activity },
    { value: '100K+', label: isAr ? 'مريض تم خدمتهم بأمانة' : 'Happy Patients Served', icon: Users },
  ];

  return (
    <>
      {/* ── 1. Hero ─────────────────────────────────────────────────────── */}
      <PageHero
        locale={typedLocale}
        badge={pa.heroBadge}
        heading={pa.heroHeading}
        subtext={pa.heroSubtext}
        breadcrumbs={breadcrumbs}
        imageSrc="/images/hospital/exterior.jpg"
        imageAlt={isAr ? 'مجمع سلامتك الطبي' : 'Salamatek Medical Centre'}
      />

      {/* ── 2. Overview & Key Stats ──────────────────────────────────────── */}
      <section className="bg-white py-14 md:py-20 border-b border-border" aria-labelledby="about-intro-heading">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
            {/* Text side */}
            <div className="lg:col-span-6 space-y-6">
              <span className="inline-block px-3.5 py-1 rounded-full bg-surface-mint text-brand-dark text-xs font-bold tracking-wider uppercase">
                {isAr ? 'عن سلامتك' : 'Who We Are'}
              </span>
              <h2
                id="about-intro-heading"
                className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-brand-dark leading-tight"
              >
                {pa.introHeading}
              </h2>
              <p className="text-base sm:text-lg text-text-muted leading-relaxed">
                {pa.introText}
              </p>
              <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-bold text-brand-dark">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#F8FAF9] border border-border">
                  <CheckCircle2 className="w-4 h-4 text-brand" />
                  {isAr ? 'عيادة متكاملة شاملة' : 'One-Stop Medical Care'}
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#F8FAF9] border border-border">
                  <CheckCircle2 className="w-4 h-4 text-brand" />
                  {isAr ? 'طوارئ على مدار 24 ساعة' : '24/7 Urgent Palliative Unit'}
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#F8FAF9] border border-border">
                  <CheckCircle2 className="w-4 h-4 text-brand" />
                  {isAr ? 'أحدث التقنيات التشخيصية' : 'Advanced Diagnostics'}
                </span>
              </div>
            </div>

            {/* Image side */}
            <div className="lg:col-span-6">
              <div className="relative rounded-3xl overflow-hidden aspect-[4/3] w-full border border-border shadow-card">
                <Image
                  src="/images/hospital/entrance.jpg"
                  alt={isAr ? 'مدخل مجمع سلامتك الطبي' : 'Salamatek Medical Centre entrance'}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover object-center"
                  priority
                />
              </div>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mt-14 pt-10 border-t border-border">
            {stats.map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <div key={idx} className="bg-[#F8FAF9] rounded-2xl p-5 border border-border/80 text-center space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-surface-mint text-brand mx-auto flex items-center justify-center">
                    <Icon className="w-5 h-5" />
                  </div>
                  <p className="text-2xl sm:text-3xl font-serif font-bold text-brand-dark tabular-nums">
                    {stat.value}
                  </p>
                  <p className="text-xs sm:text-sm font-medium text-text-muted">
                    {stat.label}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── 3. Chairman's Message (Executive Address) ────────────────────── */}
      <section className="bg-[#F8FAF9] py-16 md:py-24 relative overflow-hidden" aria-labelledby="chairman-heading">
        {/* Subtle ambient lighting */}
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-brand/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-brand-light/10 blur-3xl pointer-events-none" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="bg-white rounded-3xl sm:rounded-[36px] border border-border/90 shadow-card overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-12">
              
              {/* Executive Sidebar / Signature Card (4 cols) */}
              <div className="lg:col-span-4 bg-gradient-to-br from-brand-dark via-[#0C3528] to-[#08221A] text-white p-8 sm:p-10 flex flex-col justify-between relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-brand/15 rounded-full blur-2xl pointer-events-none" />

                <div className="relative z-10 space-y-6">
                  {/* Leadership Badge */}
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/15 text-brand-pale text-xs font-semibold">
                    <Sparkles className="w-3.5 h-3.5 text-brand-light" />
                    <span>{chairman.badge}</span>
                  </div>

                  {/* Brand Monogram Seal */}
                  <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 p-3.5 flex items-center justify-center shadow-lg">
                    <Image
                      src="/images/logo.png"
                      alt="Salamatek Crest"
                      width={80}
                      height={80}
                      className="w-full h-full object-contain"
                    />
                  </div>

                  {/* Chairman Identity */}
                  <div>
                    <h3 className="text-xl sm:text-2xl font-serif font-bold text-white tracking-tight">
                      {chairman.authorName}
                    </h3>
                    <p className="text-xs sm:text-sm font-medium text-brand-pale mt-1">
                      {chairman.authorRole}
                    </p>
                    <p className="text-xs text-white/60 mt-0.5 font-sans">
                      {chairman.authorCompany}
                    </p>
                  </div>
                </div>

                {/* Core Guiding Pillars */}
                <div className="relative z-10 pt-8 mt-8 border-t border-white/15 space-y-3">
                  <p className="text-[11px] uppercase tracking-widest text-brand-pale font-bold">
                    {isAr ? 'ركائز القيادة الطبية' : 'Leadership Commitments'}
                  </p>
                  <div className="space-y-2">
                    {chairman.pillars.map((pillar, idx) => (
                      <div key={idx} className="flex items-center gap-2.5 text-xs text-white/80">
                        <div className="w-1.5 h-1.5 rounded-full bg-brand-light flex-shrink-0" />
                        <span>{pillar}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Main Message Content (8 cols) */}
              <div className="lg:col-span-8 p-8 sm:p-12 lg:p-14 flex flex-col justify-between">
                <div>
                  {/* Decorative Quote Icon & Eyebrow */}
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-xs font-bold uppercase tracking-widest text-brand">
                      {chairman.badge}
                    </span>
                    <Quote className="w-10 h-10 text-surface-mint/80 text-brand-pale/40 rotate-180" />
                  </div>

                  {/* Opening Headline / Lead */}
                  <h2
                    id="chairman-heading"
                    className="text-2xl sm:text-3xl font-serif font-bold text-brand-dark leading-snug mb-6"
                  >
                    &ldquo;{chairman.title}&rdquo;
                  </h2>

                  {/* Primary Lead Highlight */}
                  <div className="bg-surface-mint/60 border-s-4 border-brand p-4 sm:p-5 rounded-r-2xl mb-8">
                    <p className="text-base sm:text-lg font-serif italic text-brand-dark leading-relaxed font-medium">
                      {chairman.lead}
                    </p>
                  </div>

                  {/* Letter Body Paragraphs */}
                  <div className="space-y-4 text-text-muted text-sm sm:text-base leading-relaxed">
                    {chairman.paragraphs.map((p, idx) => (
                      <p key={idx} className="leading-relaxed">
                        {p}
                      </p>
                    ))}
                  </div>
                </div>

                {/* Sign-off Block */}
                <div className="mt-10 pt-8 border-t border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-bold text-brand-dark">
                      {chairman.authorName}
                    </p>
                    <p className="text-xs text-text-muted">
                      {chairman.authorRole} • {chairman.authorCompany}
                    </p>
                  </div>
                  <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand">
                    <ShieldCheck className="w-4 h-4 text-brand" />
                    <span>{isAr ? 'التزام بالجودة والسلامة' : 'Quality & Ethical Care Verified'}</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* ── 4. Mission + Vision ──────────────────────────────────────────── */}
      <section className="bg-white py-16 md:py-24 border-b border-border" aria-labelledby="mission-vision-heading">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="inline-block px-3.5 py-1 rounded-full bg-surface-mint text-brand-dark text-xs font-bold tracking-wider uppercase mb-3">
              {isAr ? 'الغاية والوجهة' : 'Our Guiding Compass'}
            </span>
            <h2 id="mission-vision-heading" className="text-2xl sm:text-3xl font-serif font-bold text-brand-dark">
              {isAr ? 'رسالتنا ورؤيتنا المستقبلية' : 'Our Mission & Strategic Vision'}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Mission */}
            <div className="bg-[#F8FAF9] rounded-3xl border border-border p-8 sm:p-10 shadow-card hover:shadow-card-hover transition-all">
              <div className="w-12 h-12 rounded-2xl bg-surface-mint text-brand flex items-center justify-center mb-6 shadow-sm">
                <Target className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-serif font-bold text-brand-dark mb-3">
                {pa.missionHeading}
              </h3>
              <p className="text-base text-text-muted leading-relaxed">
                {pa.missionText}
              </p>
            </div>

            {/* Vision */}
            <div className="bg-brand-dark text-white rounded-3xl p-8 sm:p-10 shadow-card hover:shadow-card-hover transition-all relative overflow-hidden">
              <div className="w-12 h-12 rounded-2xl bg-white/10 text-brand-light flex items-center justify-center mb-6 shadow-sm border border-white/15">
                <Compass className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-serif font-bold text-white mb-3">
                {pa.visionHeading}
              </h3>
              <p className="text-base text-white/75 leading-relaxed">
                {pa.visionText}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 5. SALAMATEK Core Values ─────────────────────────────────────── */}
      <section className="bg-[#F8FAF9] py-16 md:py-24" aria-labelledby="values-heading">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="inline-block px-3.5 py-1 rounded-full bg-surface-mint text-brand-dark text-xs font-bold tracking-wider uppercase mb-3">
              {pa.valuesHeading}
            </span>
            <h2 id="values-heading" className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-brand-dark mb-3">
              {isAr ? 'قيم سلامتك الجوهرية (SALAMATEK)' : 'The SALAMATEK Core Values'}
            </h2>
            <p className="text-sm sm:text-base text-text-muted leading-relaxed">
              {pa.valuesSubtext}
            </p>
          </div>

          {/* Values grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {values.map((v, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-7 border border-border shadow-card hover:shadow-card-hover hover:border-brand/40 transition-all group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="w-10 h-10 rounded-xl bg-surface-mint text-brand font-serif font-bold text-lg flex items-center justify-center group-hover:bg-brand group-hover:text-white transition-colors">
                      {v.letter}
                    </span>
                    <span className="text-xs font-bold text-text-subtle tabular-nums">
                      {String(idx + 1).padStart(2, '0')}
                    </span>
                  </div>
                  <h3 className="text-lg font-serif font-bold text-brand-dark mb-2 group-hover:text-brand transition-colors">
                    {v.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-text-muted leading-relaxed">
                    {v.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 6. Our Facilities & Journey ───────────────────────────────────── */}
      <section
        className="py-16 md:py-24 overflow-hidden text-white"
        style={{ background: 'linear-gradient(135deg, #0C3528 0%, #1A6B4A 100%)' }}
        aria-labelledby="history-heading"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
            {/* Image */}
            <div className="lg:col-span-6 relative rounded-3xl overflow-hidden aspect-[4/3] w-full border border-white/20 shadow-2xl order-2 lg:order-1">
              <Image
                src="/images/hospital/reception.jpg"
                alt={isAr ? 'مجمع سلامتك — الاستقبال' : 'Salamatek Medical Centre — reception area'}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover object-center"
              />
            </div>

            {/* Text */}
            <div className="lg:col-span-6 order-1 lg:order-2 space-y-6">
              <span className="inline-block px-3.5 py-1 rounded-full bg-white/10 text-brand-light text-xs font-bold tracking-wider uppercase border border-white/15">
                {pa.historyHeading}
              </span>
              <h2
                id="history-heading"
                className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-white leading-tight"
              >
                {isAr ? 'أربعة عقود من الرعاية المخلصة والتفوق الطبي' : 'Four Decades of Trusted Healing & Compassion'}
              </h2>
              <p className="text-sm sm:text-base text-white/80 leading-relaxed">
                {pa.historyText}
              </p>
              <div className="pt-2 flex flex-wrap gap-4">
                <Link
                  href={getLocalizedPath('/departments', typedLocale)}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-brand-dark font-bold text-sm shadow-md hover:bg-brand-pale transition-all"
                >
                  <span>{pa.ctaLink.replace('→', '').trim()}</span>
                  <span className={isAr ? 'rotate-180' : ''}>→</span>
                </Link>
                <Link
                  href={getLocalizedPath('/contact', typedLocale)}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/10 border border-white/20 text-white font-semibold text-sm hover:bg-white/20 transition-all"
                >
                  <span>{isAr ? 'تواصل معنا' : 'Contact Us'}</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 7. CTA ───────────────────────────────────────────────────────── */}
      <CTASection
        heading={pa.ctaHeading}
        ctaLabel={pa.ctaBtn}
        ctaHref={getLocalizedPath('/contact', typedLocale)}
        variant="mint"
      />
    </>
  );
}
