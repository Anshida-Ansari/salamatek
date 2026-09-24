import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { isValidLocale, type Locale } from '@/i18n/config';
import { getLocalizedPath } from '@/lib/utils';
import { CTASection } from '@/components/shared/CTASection';
import Image from 'next/image';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!isValidLocale(locale)) return {};
  return {
    title: 'SARC — Site & Remote Clinical Services | {t.hero.salamatek}',
    description: 'SARC is the industrial healthcare division of Salamatek Medical Center. We provide on-site clinics, mobile medical units, qualified medical staff and ambulance services to worksites across Saudi Arabia.',
    openGraph: {
      title: 'SARC — Industrial Healthcare Division | Salamatek',
      description: 'On-site medical teams, clinics and ambulances built around {t.hero.title3}',
      type: 'website',
    },
  };
}

// ────────────────────────────────────────────────────────
// SARC Data
// ────────────────────────────────────────────────────────

const tSarc = {
  ar: {
    hero: { divisionOf: 'قسم من', salamatek: 'مجمع سلامتك الطبي', subtitle: 'القوى العاملة الطبية الصناعية', title1: 'فرق طبية', title2: 'منتشرة حول', title3: 'قوتك العاملة.', desc: 'سارك يبسط الرعاية الصحية في مواقع العمل من خلال توفير أطباء مؤهلين وممرضين وطاقم طبي مساند وخدمات إسعاف ودعم طبي آخر مصمم خصيصاً لكل شركة عميلة.', reqProposal: 'طلب عرض أسعار', exploreCap: 'اكتشف قدراتنا', features: ['رعاية صحية في موقع العمل', 'طاقم مؤهل', 'انتشار مخصص'] },
    services: { tag: 'ما تقدمه سارك', title1: 'فريق طبي متكامل', title2: 'في موقع العمل.', desc: 'كل حل يتم تصميمه حول احتياجات العميل، من الكوادر الطبية الأساسية إلى الدعم الطبي الشامل في الموقع.', items: [ { num: '01', title: 'أطباء مؤهلون', desc: 'أطباء مختارون ومجهزون لدعم الاحتياجات الطبية في مواقع العمل الصناعية.' }, { num: '02', title: 'فرق التمريض', desc: 'ممرضون محترفون مخصصون حسب حجم القوى العاملة ومناوبات العمل.' }, { num: '03', title: 'طاقم طبي مساند', desc: 'كوادر طبية إضافية مجهزة لتناسب حجم المشروع وبيئة العمل.' }, { num: '04', title: 'خدمات الإسعاف', desc: 'تغطية إسعافية وخدمات طبية داعمة لبيئة رعاية صحية متكاملة.' } ] },
    factors: { tag: 'توظيف مبني على القوى العاملة', title1: 'ليس باقة ثابتة.', title2: 'فريق مصمم لموقعك.', link: 'ناقش متطلبات موقعك', items: [ { num: '01', title: 'حجم القوى العاملة', desc: 'تغطية مخصصة بناءً على عدد العمال في الموقع.' }, { num: '02', title: 'نظام المناوبات', desc: 'جدولة الطاقم لتتناسب مع ساعات العمل واحتياجات التناوب.' }, { num: '03', title: 'بيئة الموقع', desc: 'تحديد النطاق بناءً على الموقع والوصول والمخاطر التشغيلية.' }, { num: '04', title: 'متطلبات العميل', desc: 'انتشار يتوافق مع الملخص الطبي للمشروع.' } ] },
    capabilities: { tag: 'ماذا نفعل', title1: 'رعاية متكاملة', title2: 'في كل موقع عمل.', items: [ { title: 'تجهيز العيادات', icon: '🏥', desc: 'عيادات طبية مجهزة بأحدث المعدات في موقع عملك. يقوم فريقنا بإدارتها وتشغيلها بالكامل وفقاً للمعايير العالمية.' }, { title: 'تعزيز سلامة العمال', icon: '🦺', desc: 'وصول فوري للعناية الطبية للإصابات والأمراض — مما يقلل من تأخير المشروع ويحافظ على الإنتاجية.' }, { title: 'خدمات صحة الموظفين', icon: '❤️', desc: 'برامج صحية مخصصة تلبي احتياجات قطاع البناء لتعزيز رفاهية العمال ومعالجة الحالات الطبية.' }, { title: 'متابعة وإدارة الحالات', icon: '📋', desc: 'يعمل فريقنا عن كثب مع الطاقم الطبي الخارجي لضمان تلقي العمال المصابين للعلاج المناسب ومواعيد المتابعة.' }, { title: 'خدمات في الموقع', icon: '⛑️', desc: 'خبرات طبية تقدم مباشرة إلى موقعك، يديرها محترفون ذوو خبرة لعلاج الإصابات والأمراض البسيطة.' }, { title: 'خدمات طبية متنقلة', icon: '🚑', desc: 'وحدات متنقلة مرنة توفر الخدمات الطبية الأساسية لأي موقع مشروع — أينما كان موقع عملك.' } ], bottomDesc: 'وصول أفضل للرعاية الفورية — سارك تجلب الرعاية الصحية مباشرة إلى موقع العمل، لضمان توفر الإسعافات الأولية دائماً.' },
    readiness: { tag: 'أشخاص حقيقيون. جاهزية حقيقية.', title1: 'مستعدون قبل', title2: 'وصولهم للموقع.', desc: 'تجمع فرق سارك بين الكوادر الطبية المحترفة والإعداد العملي للرعاية الصحية في الموقع، والاستجابة للطوارئ، ورعاية المرضى.', card1: { title: 'إعداد الفريق الطبي', desc: 'تدريب منظم وتنسيق جماعي' }, card2: { title: 'الاستعداد للطوارئ', desc: 'تدريب عملي على الاستجابة' }, card3: { title: 'قدرات طبية ميدانية', desc: 'مجهزة لبيئة العمل' } },
    coverage: { tag: 'أين ندعم', title1: 'تغطية صحية', title2: 'أينما كان العمل.', desc: 'كوادر طبية مرنة للبيئات الصناعية والمشاريع ذات المتطلبات الصعبة.', items: ['مواقع الطاقة والصناعة', 'البناء والبنية التحتية', 'منشآت التصنيع', 'مواقع المشاريع النائية'] },
    form: { tag: 'تواصل مع سارك', title: 'دعنا نبني فريقك الطبي', desc: 'أخبرنا عن متطلبات مشروعك وسنقوم بتصميم حل التوظيف المناسب.', company: 'اسم الشركة', person: 'جهة الاتصال', email: 'البريد الإلكتروني', phone: 'رقم الهاتف', details: 'تفاصيل المشروع', detailsPlaceholder: 'أخبرنا عن موقع مشروعك ومدته والاحتياجات الطبية المحددة...', submit: 'إرسال الطلب' },
    cta: { heading: 'تحتاج إلى دعم طبي في الموقع؟', subtext: 'تواصل مع فريق سارك اليوم للحصول على عرض مخصص.', btn: 'ابدأ الآن' }
  },
  en: {
    hero: { divisionOf: '{t.hero.divisionOf}', salamatek: 'Salamatek Medical Center', subtitle: '{t.hero.subtitle}', title1: 'Medical teams', title2: 'deployed around', title3: 'your workforce.', desc: '{t.hero.desc}', reqProposal: '{t.hero.reqProposal}', exploreCap: '{t.hero.exploreCap}', features: ['{t.hero.features[0]}', '{t.hero.features[1]}', '{t.hero.features[2]}'] },
    services: { tag: '{t.services.tag}', title1: 'A complete work-site', title2: 'healthcare team.', desc: '{t.services.desc}', items: [ { num: '01', title: 'Qualified doctors', desc: 'Physicians selected and mobilized to support the medical needs of industrial work sites.' }, { num: '02', title: 'Nursing teams', desc: 'Professional nurses scheduled around workforce size, shifts and site coverage requirements.' }, { num: '03', title: 'Paramedical staff', desc: 'Additional medical personnel configured to match the project scope and operating environment.' }, { num: '04', title: 'Ambulance services', desc: 'Ambulance coverage and supporting medical services for a more complete work-site healthcare environment.' } ] },
    factors: { tag: '{t.factors.tag}', title1: 'Not a fixed package.', title2: 'A team designed for the site.', link: '{t.factors.link}', items: [ { num: '01', title: 'Workforce headcount', desc: 'Coverage planned around the number of workers on site.' }, { num: '02', title: 'Shift pattern', desc: 'Personnel scheduled around working hours and rotation needs.' }, { num: '03', title: 'Site environment', desc: 'Scope shaped by location, access and operational risk.' }, { num: '04', title: 'Client requirements', desc: 'Deployment aligned to the project\'s medical-service brief.' } ] },
    capabilities: { tag: '{t.capabilities.tag}', title1: 'Full-spectrum care', title2: 'at every worksite.', items: [ { title: 'Equipping Clinics', icon: '🏥', desc: 'Remote medical clinics set up at your worksite with the latest equipment. Our team fully manages and operates the clinic to international standards.' }, { title: 'Enhanced Worker Safety', icon: '🦺', desc: 'Immediate on-site access to medical attention for injuries and illnesses — minimizing project delays and keeping productivity high.' }, { title: 'Employee Health Services', icon: '❤️', desc: 'Customized health programs tailored to the construction industry that promote worker well-being and address underlying medical conditions.' }, { title: 'Follow-Up & Case Management', icon: '📋', desc: 'Our team works closely with off-site medical staff to ensure injured workers receive appropriate treatment and follow-up appointments.' }, { title: 'On-Site Services', icon: '⛑️', desc: 'Medical expertise delivered directly to your site, staffed by experienced professionals for immediate treatment of injuries and minor illnesses.' }, { title: 'Mobile Medical Services', icon: '🚑', desc: 'Flexible mobile units that bring essential medical services to any project location — wherever your construction site is located.' } ], bottomDesc: '{t.capabilities.bottomDesc}' },
    readiness: { tag: '{t.readiness.tag}', title1: 'Prepared before', title2: 'they reach the site.', desc: '{t.readiness.desc}', card1: { title: 'Clinical team preparation', desc: 'Structured training and team coordination' }, card2: { title: 'Emergency readiness', desc: 'Hands-on response practice' }, card3: { title: 'On-site clinical capability', desc: 'Equipped for the work environment' } },
    coverage: { tag: '{t.coverage.tag}', title1: 'Healthcare coverage', title2: 'where work happens.', desc: '{t.coverage.desc}', items: ['Energy & industrial sites', 'Construction & infrastructure', 'Manufacturing facilities', 'Remote project locations'] },
    form: { tag: '{t.form.tag}', title: 'Let\'s Build Your Site Medical Team', desc: '{t.form.desc}', company: 'Company Name', person: 'Contact Person', email: 'Email Address', phone: 'Phone Number', details: 'Project Details', detailsPlaceholder: 'Tell us about your project location, duration, and specific medical requirements...', submit: 'Send Enquiry' },
    cta: { heading: 'Need on-site medical support?', subtext: 'Contact the SARC team today for a tailored proposal.', btn: 'Get Started' }
  }
};


export default async function SARCPage({ params }: Props) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();

  const typedLocale = locale as Locale;
  const isAr = typedLocale === 'ar';
  const t = isAr ? tSarc.ar : tSarc.en;

  return (
    <>
      {/* ── 1. Hero ─────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex flex-col justify-center pt-20 pb-16 md:pt-24 md:pb-20 overflow-hidden bg-gradient-to-br from-[#712316] to-[#3B1408]">
        {/* Soft red glow */}
        <div className="absolute top-0 right-0 w-[700px] h-[700px] bg-[#E05522] opacity-10 rounded-full blur-[120px] -translate-y-1/3 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#E05522] opacity-5 rounded-full blur-[80px] translate-y-1/3 -translate-x-1/4" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-12 items-center">

            {/* Left side content */}
            <div className="flex flex-col">

              {/* Logo & Division Lockup — tight horizontal brand badge */}
              <div className="flex items-center gap-4 mb-8">
                <div className="flex-shrink-0 w-24 sm:w-28">
                  <Image
                    src="/sarc/sarc-logo-transparent-cropped.png"
                    alt="SARC Logo"
                    width={140}
                    height={45}
                    className="object-contain w-full h-auto"
                    priority
                  />
                </div>
                <div className="h-10 w-px bg-white/25 flex-shrink-0" />
                <div className="flex flex-col gap-0.5">
                  <span className="text-[9px] font-semibold text-white/50 uppercase tracking-[0.18em] leading-none">
                    A Division of
                  </span>
                  <span className="text-[11px] font-bold text-white/90 uppercase tracking-widest leading-tight">
                    Salamatek Medical Center
                  </span>
                </div>
              </div>

              <p className="text-[#E05522] text-[11px] font-bold uppercase tracking-[0.2em] mb-5">
                Industrial Healthcare Manpower
              </p>

              <h1 className="text-5xl md:text-6xl lg:text-[64px] font-serif font-bold text-white leading-[1.08] mb-6">
                {t.hero.title1}<br />
                {t.hero.title2}<br />
                <span className="italic text-[#E05522]">your workforce.</span>
              </h1>

              <p className="text-base text-white/65 mb-8 leading-relaxed max-w-md">
                SARC simplifies healthcare at work sites by providing qualified doctors, nurses, paramedical staff, ambulance services and other medical support tailored to each client company.
              </p>

              <div className="flex flex-wrap items-center gap-3 mb-8">
                <a
                  href="#enquire"
                  className="px-7 py-3.5 rounded-xl bg-[#E05522] text-white text-sm font-bold hover:bg-[#B8441A] transition-colors shadow-lg"
                >
                  Request a staffing proposal
                </a>
                <a
                  href="#services"
                  className="px-7 py-3.5 rounded-xl border border-white/20 text-white text-sm font-semibold hover:bg-white/10 transition-colors"
                >
                  Explore capabilities
                </a>
              </div>

              <div className="flex flex-wrap items-center gap-5 text-[11px] text-white/45 font-medium">
                <span className="flex items-center gap-1.5">
                  <svg className="w-3.5 h-3.5 text-[#E05522]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                  Work-site healthcare
                </span>
                <span className="flex items-center gap-1.5">
                  <svg className="w-3.5 h-3.5 text-[#E05522]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                  Qualified personnel
                </span>
                <span className="flex items-center gap-1.5">
                  <svg className="w-3.5 h-3.5 text-[#E05522]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                  Tailored deployment
                </span>
              </div>
            </div>

            {/* Right side image */}
            <div className="relative">
              <div className="relative rounded-[36px] overflow-hidden shadow-2xl h-[500px] md:h-[580px] lg:h-[620px] w-full bg-slate-800">
                <Image src="/images/sarc-hero-new.jpg" alt="SARC Medical Team" fill className="object-cover object-center" priority />
                {/* subtle inner vignette */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
              </div>

              {/* Floating card */}
              <div className="absolute -left-4 md:-left-8 bottom-10 bg-white rounded-2xl p-5 md:p-6 shadow-2xl max-w-[240px] z-20">
                <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400 mb-1.5">Built for the site</p>
                <p className="text-base font-serif font-bold text-slate-900 leading-snug">The right medical coverage for every workforce.</p>
              </div>
            </div>

          </div>
        </div>
      </section>



      <section id="services" className="bg-white py-24 md:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-start mb-16">
            <div className="lg:col-span-5">
              <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">What SARC Provides</p>
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-slate-900 leading-tight">
                {t.services.title1}<br />{t.services.title2}
              </h2>
            </div>
            <div className="lg:col-span-6 lg:col-start-7 lg:pt-8">
              <p className="text-lg text-slate-500 leading-relaxed max-w-lg">
                Each solution is shaped around client needs, from essential clinical manpower to broader on-site medical support.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {t.services.items.map(service => (
              <div key={service.num} className="bg-[#FAF7F2] rounded-2xl p-8 hover:bg-[#F3EFE9] transition-colors border border-[#EFECE5]">
                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-[#E05522] text-xs font-bold mb-8 shadow-sm">
                  {service.num}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{service.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{service.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 3. Workforce Based Staffing ─────────────────────────── */}
      <section className="bg-[#FAF7F2] py-24 md:py-32 border-t border-[#EFECE5]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8">
            <div className="lg:col-span-4">
              <p className="text-xs font-bold uppercase tracking-widest text-[#E05522] mb-4">Workforce-based staffing</p>
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-slate-900 leading-tight mb-8">
                {t.factors.title1}<br />{t.factors.title2}
              </h2>
              <a href="#enquire" className="inline-flex items-center text-[#E05522] font-semibold text-sm hover:text-[#B8441A] group">
                Discuss your site requirements
                <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
              </a>
            </div>
            
            <div className="lg:col-span-7 lg:col-start-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {t.factors.items.map(factor => (
                  <div key={factor.num} className="bg-white rounded-2xl p-8 border border-[#EFECE5] shadow-sm">
                    <div className="text-[10px] font-bold text-[#E05522] mb-6">{factor.num}</div>
                    <h3 className="text-lg font-bold text-slate-900 mb-2">{factor.title}</h3>
                    <p className="text-sm text-slate-500 leading-relaxed">{factor.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 3.5 SARC Capabilities ────────────────────────────────────── */}
      <section className="bg-gradient-to-br from-[#712316] to-[#3B1408] py-24 md:py-32 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#E05522] opacity-10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#E05522] opacity-5 rounded-full blur-[80px]" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          {/* Section header */}
          <div className="max-w-2xl mb-16">
            <p className="text-[#E05522] text-[11px] font-bold uppercase tracking-[0.2em] mb-4">What we do</p>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-white leading-tight">
              {t.capabilities.title1}<br /><span className="italic text-[#E05522]">{t.capabilities.title2}</span>
            </h2>
          </div>

          {/* Cards grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">

            {t.capabilities.items.map(({ title, icon, desc }) => (
              <div key={title} className="bg-white/5 border border-white/10 rounded-2xl p-7 hover:bg-white/10 transition-colors group">
                <div className="text-3xl mb-5">{icon}</div>
                <h3 className="text-lg font-bold text-white mb-3 group-hover:text-[#E05522] transition-colors">{title}</h3>
                <p className="text-sm text-white/60 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>

          {/* Bottom call-out */}
          <div className="mt-14 pt-10 border-t border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <p className="text-white/70 text-base max-w-xl leading-relaxed">
              Improved access to immediate care — SARC brings healthcare directly to the worksite, ensuring first aid response is always available where it matters most.
            </p>
            <a href="#enquire" className="flex-shrink-0 px-7 py-3.5 rounded-xl bg-[#E05522] text-white text-sm font-bold hover:bg-[#B8441A] transition-colors shadow-lg whitespace-nowrap">
              {t.hero.reqProposal}
            </a>
          </div>

        </div>
      </section>

      <section className="bg-white py-24 md:py-32 border-t border-slate-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 mb-16">
            <div className="lg:col-span-6">
              <p className="text-xs font-bold uppercase tracking-widest text-[#E05522] mb-4">Real people. Real readiness.</p>
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-slate-900 leading-tight">
                {t.readiness.title1}<br />{t.readiness.title2}
              </h2>
            </div>
            <div className="lg:col-span-5 lg:col-start-8 lg:pt-8">
              <p className="text-base text-slate-600 leading-relaxed">
                SARC teams combine professional medical staffing with practical preparation for work-site healthcare, emergency response and coordinated patient care.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left large image */}
            <div className="relative rounded-[2rem] overflow-hidden h-[400px] md:h-[600px] group">
              <Image src="/images/sarc-clinic.jpg" alt="Clinical team preparation" fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-10 left-10 text-white z-10">
                <h3 className="text-2xl font-serif font-bold mb-2">{t.readiness.card1.title}</h3>
                <p className="text-sm text-white/80">{t.readiness.card1.desc}</p>
              </div>
            </div>

            {/* Right stacked images */}
            <div className="grid grid-rows-2 gap-6 h-[400px] md:h-[600px]">
              <div className="relative rounded-[2rem] overflow-hidden group">
                <Image src="/sarc/hero-team.jpg" alt="Emergency readiness" fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-8 left-8 text-white z-10">
                  <h3 className="text-xl font-serif font-bold mb-1">{t.readiness.card2.title}</h3>
                  <p className="text-sm text-white/80">{t.readiness.card2.desc}</p>
                </div>
              </div>
              
              <div className="relative rounded-[2rem] overflow-hidden group">
                <Image src="/images/sarc-field.jpg" alt="On-site clinical capability" fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-8 left-8 text-white z-10">
                  <h3 className="text-xl font-serif font-bold mb-1">{t.readiness.card3.title}</h3>
                  <p className="text-sm text-white/80">{t.readiness.card3.desc}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 5. Coverage Banner ──────────────────────────────────── */}
      <section className="bg-gradient-to-br from-[#8B2615] to-[#4A140B] py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-[#E05522] mb-4">Where we support</p>
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-white leading-tight">
                {t.coverage.title1}<br />{t.coverage.title2}
              </h2>
            </div>
            <div className="lg:pt-8">
              <p className="text-white/70 max-w-sm">Flexible medical manpower for demanding industrial and project environments.</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16 pt-12 border-t border-white/10">
            <p className="text-sm text-white/90">{t.coverage.items[0]}</p>
            <p className="text-sm text-white/90">{t.coverage.items[1]}</p>
            <p className="text-sm text-white/90">{t.coverage.items[2]}</p>
            <p className="text-sm text-white/90">{t.coverage.items[3]}</p>
          </div>
        </div>
      </section>

      {/* ── 6. Enquiry Form ─────────────────────────────────────── */}
      <section id="enquire" className="bg-white py-24">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-xs font-bold uppercase tracking-widest text-[#E05522] mb-4">Contact SARC</p>
            <h2 className="text-4xl font-serif font-bold text-slate-900 mb-4">
              {t.form.title}
            </h2>
            <p className="text-lg text-slate-500">
              Tell us about your project requirements and we will design a staffing solution.
            </p>
          </div>
          <SARCEnquiryForm locale={typedLocale} isAr={isAr} />
        </div>
      </section>
      
      {/* ── 7. Final CTA ─────────────────────────────────────────── */}
      <CTASection
        heading={t.cta.heading}
        subtext={t.cta.subtext}
        ctaLabel={t.cta.btn}
        ctaHref={getLocalizedPath('/contact', typedLocale)}
      />
    </>
  );
}

// ────────────────────────────────────────────────────────
// SARC Enquiry Form (client component)
// ────────────────────────────────────────────────────────
function SARCEnquiryForm({ locale: _locale, isAr }: { locale: Locale; isAr: boolean }) {
  const t = isAr ? tSarc.ar : tSarc.en;
  return (
    <div className="bg-[#FAF7F2] rounded-3xl p-8 md:p-12 border border-[#EFECE5] shadow-sm">
      <form
        action={`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/sarc-enquiries`}
        method="POST"
        className="space-y-6"
        onSubmit={undefined}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-2">{t.form.company} <span className="text-[#E05522]">*</span></label>
            <input type="text" name="companyName" required className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#E05522]/40" placeholder={isAr ? "مثال: أرامكو السعودية" : "e.g. Saudi Aramco"} />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-2">{t.form.person} <span className="text-[#E05522]">*</span></label>
            <input type="text" name="contactName" required className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#E05522]/40" placeholder={isAr ? "الاسم الكامل" : "Full Name"} />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-2">{t.form.email} <span className="text-[#E05522]">*</span></label>
            <input type="email" name="email" required className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#E05522]/40" placeholder="contact@company.com" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-2">{t.form.phone}</label>
            <input type="tel" name="phone" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#E05522]/40" placeholder="+966 5X XXX XXXX" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-900 mb-2">{t.form.details}</label>
          <textarea name="message" rows={4} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#E05522]/40 resize-none" placeholder={t.form.detailsPlaceholder} />
        </div>

        <button type="submit" className="w-full py-4 rounded-xl bg-[#E05522] text-white font-bold text-sm hover:bg-[#B8441A] transition-colors shadow-md">
          {t.form.submit}
        </button>
      </form>
    </div>
  );
}
