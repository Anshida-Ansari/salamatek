import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { isValidLocale, type Locale } from '@/i18n/config';
import { getLocalizedPath } from '@/lib/utils';
import { CTASection } from '@/components/shared/CTASection';

type Props = {
  params: Promise<{ locale: string }>;
};

async function getPageHero(pageKey: string) {
  try {
    const apiUrl = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000') + '/api';
    const res = await fetch(`${apiUrl}/page-heroes/${pageKey}`, { next: { revalidate: 60 } });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data || null;
  } catch { return null; }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!isValidLocale(locale)) return {};
  return {
    title: 'SARC — Site & Remote Clinical Services | Salamatek Medical Center',
    description: 'SARC is the industrial healthcare division of Salamatek Medical Center. We provide on-site clinics, mobile medical units, qualified medical staff and ambulance services to worksites across Saudi Arabia.',
    openGraph: {
      title: 'SARC — Industrial Healthcare Division | Salamatek',
      description: 'On-site medical teams, clinics and ambulances built around your workforce.',
      type: 'website',
    },
  };
}

// ────────────────────────────────────────────────────────
// SARC Services data (from official SARC document)
// ────────────────────────────────────────────────────────
const SERVICES = [
  {
    id: 'equipping-clinics',
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3.75h.75m-.75 3.75h.75m3-7.5h.75m-.75 3.75h.75m-.75 3.75h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z" />
      </svg>
    ),
    title: 'Equipping Clinics',
    desc: 'Setting up remote medical clinics at work sites according to your needs with the latest appropriate medical equipment and supplies, fully managed and operated by our qualified and specialized medical team.',
  },
  {
    id: 'worker-safety',
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
      </svg>
    ),
    title: 'Enhanced Worker Safety',
    desc: 'With our on-site clinics and mobile medical solutions, SARC provides immediate access to medical attention for injuries and minor illnesses. Our specially trained medical staff handles a wide range of situations, enhancing worker safety and minimising project delays.',
  },
  {
    id: 'employee-health',
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
      </svg>
    ),
    title: 'Comprehensive Employee Health Services',
    desc: 'We offer a range of employee health services tailored to the construction industry. Our customised health programs promote worker well-being, address underlying medical conditions, and improve overall health and productivity.',
  },
  {
    id: 'follow-up',
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
      </svg>
    ),
    title: 'Efficient Follow-Up Care & Case Management',
    desc: 'In the event of an injury that requires hospitalisation or recuperation, our healthcare team manages care by working closely with off-site medical staff and the injured employee to ensure appropriate treatment and follow-up.',
  },
  {
    id: 'onsite',
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
      </svg>
    ),
    title: 'On-Site Services',
    desc: 'Our on-site clinics bring medical expertise directly to your construction site. Equipped with essential medical equipment and staffed by experienced professionals for immediate treatment of injuries and minor illnesses.',
  },
  {
    id: 'mobile',
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
      </svg>
    ),
    title: 'Mobile Medical Services',
    desc: 'SARC offers mobile medical services for construction projects that require flexibility. Our mobile units are equipped to provide essential medical services wherever your construction site is located.',
  },
  {
    id: 'immediate-care',
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
      </svg>
    ),
    title: 'Improved Access to Immediate Care',
    desc: 'For workers with minor injuries, on-site first aid allows them to quickly return to their duties without taking time off, reducing healthcare costs and improving overall productivity.',
  },
  {
    id: 'ambulance',
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
      </svg>
    ),
    title: 'Ambulance Service',
    desc: 'SARC provides ambulances on rental basis to companies all over the Kingdom. We specialise in comprehensive service packages that include highly qualified medics, drivers, and full emergency first-aid equipment.',
  },
];

// Staff types
const STAFF = [
  { title: 'Physicians', sub: 'Qualified on-site doctors' },
  { title: 'Paramedics', sub: 'Immediate first responders' },
  { title: 'Registered Nurses', sub: 'Clinic support staff' },
  { title: 'Ambulance Crews', sub: 'Drivers & medics' },
];

// 4-step process
const PROCESS = [
  { num: '01', title: 'Assess the Workforce', desc: 'Review headcount, shifts, location, risk level and project requirements.' },
  { num: '02', title: 'Build the Medical Team', desc: 'Assign qualified doctors, nurses or supporting medical personnel.' },
  { num: '03', title: 'Mobilise & Configure', desc: 'Deploy the team and set up on-site or mobile medical coverage.' },
  { num: '04', title: 'Ongoing Support', desc: 'Continuous monitoring, follow-up care and case management.' },
];

export default async function SARCPage({ params }: Props) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();

  const typedLocale = locale as Locale;
  const heroSetting = await getPageHero('sarc');
  const isAr = typedLocale === 'ar';

  return (
    <>
      {/* ── 1. Hero ─────────────────────────────────────────────── */}
      <section
        className="relative min-h-[80vh] flex flex-col justify-end overflow-hidden"
        aria-label="SARC — Industrial Healthcare Division"
        style={{ background: heroSetting?.image ? undefined : 'linear-gradient(135deg, #E05522 0%, #B8441A 30%, #8B2615 65%, #3B1408 100%)' }}
      >
        {/* Background photo */}
        {heroSetting?.image && (
          <>
            <div className="absolute inset-0 z-0">
              <img src={heroSetting.image} alt="SARC Hero" className="w-full h-full object-cover object-center" />
            </div>
            <div
              className="absolute inset-0 z-0"
              style={{ background: 'linear-gradient(to right, rgba(62,14,5,0.97) 0%, rgba(139,38,21,0.80) 55%, rgba(224,85,34,0.30) 100%)' }}
            />
          </>
        )}

        {/* Decorative abstract grid */}
        <div className="absolute inset-0 z-0 opacity-[0.06]" aria-hidden="true"
          style={{ backgroundImage: 'repeating-linear-gradient(0deg, #fff 0, #fff 1px, transparent 1px, transparent 40px), repeating-linear-gradient(90deg, #fff 0, #fff 1px, transparent 1px, transparent 40px)' }} />

        {/* Content */}
        <div className="relative z-10 mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 pb-0">
          <div className="max-w-3xl pt-32 pb-14">
            {/* SARC wordmark */}
            <div className="flex items-center gap-2 mb-6">
              <span className="text-5xl font-black text-white tracking-tight leading-none">SARC</span>
              <div className="h-10 w-px bg-white/20 mx-2" />
              <span className="text-sm font-bold uppercase tracking-widest text-white/60 leading-tight">
                {isAr ? 'خدمات الرعاية الطبية الميدانية' : 'Industrial Healthcare Division'}
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold text-white leading-tight mb-6">
              {isAr ? (
                <>
                  فرق طبية ميدانية<br />
                  <span className="text-orange-300 italic">مصممة لقوى عملك</span>
                </>
              ) : (
                <>
                  On-site medical teams.<br />
                  <span className="text-orange-300 italic">Built around your workforce.</span>
                </>
              )}
            </h1>

            <p className="text-base md:text-lg text-white/70 leading-relaxed mb-10 max-w-2xl">
              {isAr
                ? 'نحن في سلامتك نُبسّط خدمات الرعاية الصحية في مواقع العمل من خلال أطباء مؤهلين وممرضين وكوادر طبية مدربة وتجهيزات طبية حديثة.'
                : 'SARC is the division of Salamatek Medical Center. We simplify healthcare services at work sites with the latest medical tools and supplies through qualified Doctors, Nurses, Paramedical Staff and other high-quality medical teams to provide an effective medical environment that meets the needs of client companies.'
              }
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <a
                href="#enquire"
                className="inline-flex items-center px-6 py-3 rounded-xl bg-white text-[#8B2615] text-sm font-bold hover:bg-orange-50 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                {isAr ? 'استفسر الآن' : 'Request a Staffing Proposal'}
              </a>
              <a
                href="#services"
                className="inline-flex items-center px-6 py-3 rounded-xl border border-white/30 text-white text-sm font-semibold hover:bg-white/10 transition-colors duration-200"
              >
                {isAr ? 'استعرض خدماتنا' : 'Explore Services'}
                <svg className="w-4 h-4 ms-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
              </a>
            </div>
          </div>

          {/* Stats strip */}
          <div className="border-t border-white/10 py-6 flex flex-wrap items-center gap-x-10 gap-y-4">
            {[
              { value: '24/7', label: isAr ? 'رعاية طارئة' : 'Emergency Care' },
              { value: '4+', label: isAr ? 'أنواع كوادر طبية' : 'Medical Staff Types' },
              { value: 'KSA', label: isAr ? 'خدمة على مستوى المملكة' : 'Kingdom-wide Coverage' },
              { value: 'B2B', label: isAr ? 'حلول مؤسسية' : 'Industrial Solutions' },
            ].map(stat => (
              <div key={stat.value}>
                <p className="text-2xl font-bold font-serif text-white leading-none">{stat.value}</p>
                <p className="text-xs text-white/50 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 2. Who We Are ───────────────────────────────────────── */}
      <section className="bg-white py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-[#E05522] mb-4">
                {isAr ? 'من نحن' : 'About SARC'}
              </p>
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-slate-900 leading-tight mb-6">
                {isAr
                  ? 'نحن ذراع الرعاية الطبية الصناعية في سلامتك'
                  : 'The Industrial Healthcare Arm of Salamatek Medical Center'
                }
              </h2>
              <p className="text-base text-slate-600 leading-relaxed mb-4">
                We, at Salamatek Medical Center, a Multi-Speciality Medical Center located in the Eastern Province of Saudi Arabia, provide the most modern infrastructure facilities and quality services to serve the people.
              </p>
              <p className="text-base text-slate-600 leading-relaxed mb-8">
                SARC is the division of Salamatek Medical Center. At SARC, we simplify the healthcare services at work sites with the latest medical tools and supplies through qualified Doctors, Nurses, Paramedical Staff and other high-quality medical teams to provide an effective medical health environment at work sites that meet the needs of our client companies.
              </p>

              {/* Staff tags */}
              <div className="grid grid-cols-2 gap-3">
                {STAFF.map(s => (
                  <div key={s.title} className="flex items-start gap-3 p-4 rounded-xl bg-orange-50 border border-orange-100">
                    <span className="w-2 h-2 rounded-full bg-[#E05522] mt-2 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-bold text-slate-800">{s.title}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{s.sub}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Process card */}
            <div className="rounded-2xl overflow-hidden border border-slate-100 shadow-xl">
              <div className="px-6 py-4 flex items-center justify-between" style={{ background: 'linear-gradient(135deg, #E05522, #8B2615)' }}>
                <span className="text-[10px] font-bold uppercase tracking-widest text-white/60">Industrial Coverage Model</span>
                <span className="text-xs font-semibold text-white">The right team for every site.</span>
              </div>
              <div className="divide-y divide-slate-100 bg-slate-50">
                {PROCESS.map(step => (
                  <div key={step.num} className="flex gap-4 px-6 py-5">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 border-2 border-[#E05522]/20 bg-orange-50">
                      <span className="text-[10px] font-black text-[#E05522]">{step.num}</span>
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-800 mb-1">{step.title}</h3>
                      <p className="text-xs text-slate-500 leading-relaxed">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="px-6 py-4 bg-white border-t border-slate-100">
                <div className="flex items-center gap-2 bg-slate-50 rounded-lg px-4 py-3 border border-slate-100">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 flex-shrink-0" />
                  <span className="text-xs text-slate-600">Staffing tailored to project and workforce requirements.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. Services Grid ────────────────────────────────────── */}
      <section id="services" className="bg-slate-50 py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-xs font-bold uppercase tracking-widest text-[#E05522] mb-3">
              {isAr ? 'خدماتنا' : 'What We Offer'}
            </p>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-slate-900 mb-4">
              {isAr ? 'حلول طبية شاملة لمواقع العمل' : 'Comprehensive Worksite Medical Solutions'}
            </h2>
            <p className="text-slate-500 max-w-xl mx-auto">
              {isAr
                ? 'من عيادات ثابتة إلى وحدات متنقلة وخدمات إسعاف — كل ما تحتاجه في موقع عملك'
                : 'From fixed clinics to mobile units and ambulance services — everything your worksite needs.'
              }
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {SERVICES.map(service => (
              <div
                key={service.id}
                className="group bg-white rounded-2xl p-6 border border-slate-100 hover:border-orange-200 hover:shadow-lg transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center text-[#E05522] mb-5 group-hover:bg-[#E05522] group-hover:text-white transition-colors duration-300">
                  {service.icon}
                </div>
                <h3 className="text-base font-bold text-slate-800 mb-2 leading-snug">{service.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{service.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 4. Ambulance Banner ─────────────────────────────────── */}
      <section
        className="py-16 md:py-24 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #1E293B 0%, #0F172A 100%)' }}
      >
        <div className="absolute inset-0 opacity-5" aria-hidden="true"
          style={{ backgroundImage: 'repeating-linear-gradient(0deg, #fff 0, #fff 1px, transparent 1px, transparent 60px), repeating-linear-gradient(90deg, #fff 0, #fff 1px, transparent 1px, transparent 60px)' }} />
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-[#E05522] mb-4">
                {isAr ? 'خدمة الإسعاف' : 'Ambulance Service'}
              </p>
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-white mb-6 leading-tight">
                {isAr
                  ? 'سيارات إسعاف بالإيجار في كل أنحاء المملكة'
                  : 'Ambulances on Rental Basis Across the Kingdom'
                }
              </h2>
              <p className="text-slate-400 leading-relaxed mb-6">
                SARC provides Ambulances on rental basis to companies all over the Kingdom. We can assist in a tailor-made solution to suit your requirements, whether it is a short-term ambulance hire to cover a breakdown or long-term hire of a special purpose vehicle designed specifically to suit your individual needs.
              </p>
              <p className="text-slate-400 leading-relaxed mb-8">
                We can provide an alternative solution that matches your budget. We specialise in providing our clients with a comprehensive service package that includes highly qualified medics, drivers, and other emergency first aid equipment.
              </p>
              <a
                href="#enquire"
                className="inline-flex items-center px-6 py-3 rounded-xl bg-[#E05522] text-white text-sm font-bold hover:bg-[#B8441A] transition-colors duration-200"
              >
                {isAr ? 'طلب الاستعلام' : 'Enquire About Ambulance Hire'}
              </a>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: '🚑', title: 'Short-Term Hire', desc: 'Flexible solutions for temporary project coverage' },
                { icon: '📅', title: 'Long-Term Contracts', desc: 'Dedicated ambulances for ongoing project needs' },
                { icon: '👨‍⚕️', title: 'Qualified Medics', desc: 'Trained medical professionals on every vehicle' },
                { icon: '🩺', title: 'Full Equipment', desc: 'Emergency first-aid equipment included' },
              ].map(item => (
                <div key={item.title} className="bg-white/5 border border-white/10 rounded-xl p-5 hover:bg-white/10 transition-colors">
                  <span className="text-2xl mb-3 block">{item.icon}</span>
                  <h3 className="text-sm font-bold text-white mb-1">{item.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── 5. Enquiry Form ─────────────────────────────────────── */}
      <section id="enquire" className="bg-white py-16 md:py-24">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-xs font-bold uppercase tracking-widest text-[#E05522] mb-3">
              {isAr ? 'تواصل معنا' : 'Request a Proposal'}
            </p>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-slate-900 mb-4">
              {isAr ? 'تواصل مع فريق SARC' : "Let's Build Your Site Medical Team"}
            </h2>
            <p className="text-slate-500">
              {isAr
                ? 'سواء كان مشروعاً صغيراً أو منشأة كبرى، لدينا الحل المناسب لك.'
                : 'Whether it\'s a small project or a large industrial facility, we have a tailored solution for you.'
              }
            </p>
          </div>

          {/* Enquiry form routes to the contact/SARC enquiry endpoint */}
          <SARCEnquiryForm locale={typedLocale} isAr={isAr} />
        </div>
      </section>

      {/* ── 6. Final CTA ─────────────────────────────────────────── */}
      <CTASection
        heading={isAr ? 'هل تبحث عن حلول طبية لموقع عملك؟' : 'Need on-site medical support for your project?'}
        subtext={isAr ? 'تواصل مع فريق SARC اليوم.' : 'Contact the SARC team today.'}
        ctaLabel={isAr ? 'ابدأ الآن' : 'Get Started'}
        ctaHref={getLocalizedPath('/contact', typedLocale)}
      />
    </>
  );
}

// ────────────────────────────────────────────────────────
// SARC Enquiry Form (client component)
// ────────────────────────────────────────────────────────
function SARCEnquiryForm({ locale: _locale, isAr }: { locale: Locale; isAr: boolean }) {
  return (
    <div className="bg-slate-50 rounded-3xl p-8 md:p-12 border border-slate-100 shadow-sm">
      <form
        action={`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/sarc-enquiries`}
        method="POST"
        className="space-y-6"
        onSubmit={undefined}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Company Name */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              {isAr ? 'اسم الشركة' : 'Company Name'} <span className="text-[#E05522]">*</span>
            </label>
            <input
              type="text"
              name="companyName"
              required
              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#E05522]/40 focus:border-[#E05522] transition"
              placeholder={isAr ? 'مثال: أرامكو السعودية' : 'e.g. Saudi Aramco'}
            />
          </div>

          {/* Contact Person */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              {isAr ? 'اسم المسؤول' : 'Contact Person'} <span className="text-[#E05522]">*</span>
            </label>
            <input
              type="text"
              name="contactName"
              required
              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#E05522]/40 focus:border-[#E05522] transition"
              placeholder={isAr ? 'الاسم الكامل' : 'Full Name'}
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              {isAr ? 'البريد الإلكتروني' : 'Email Address'} <span className="text-[#E05522]">*</span>
            </label>
            <input
              type="email"
              name="email"
              required
              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#E05522]/40 focus:border-[#E05522] transition"
              placeholder="contact@company.com"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              {isAr ? 'رقم الهاتف' : 'Phone Number'}
            </label>
            <input
              type="tel"
              name="phone"
              dir="ltr"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#E05522]/40 focus:border-[#E05522] transition"
              placeholder="+966 5X XXX XXXX"
            />
          </div>

          {/* Service Type */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              {isAr ? 'نوع الخدمة المطلوبة' : 'Service Required'}
            </label>
            <select
              name="serviceType"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#E05522]/40 focus:border-[#E05522] transition bg-white"
            >
              <option value="">{isAr ? 'اختر نوع الخدمة' : 'Select a service'}</option>
              <option value="on-site-clinic">{isAr ? 'عيادة ميدانية' : 'On-Site Clinic Setup'}</option>
              <option value="mobile-unit">{isAr ? 'وحدة طبية متنقلة' : 'Mobile Medical Unit'}</option>
              <option value="ambulance">{isAr ? 'خدمة إسعاف' : 'Ambulance Service'}</option>
              <option value="staffing">{isAr ? 'توفير كوادر طبية' : 'Medical Staffing'}</option>
              <option value="full-package">{isAr ? 'باقة شاملة' : 'Full Package'}</option>
            </select>
          </div>

          {/* Workforce Size */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              {isAr ? 'حجم القوى العاملة' : 'Workforce Size'}
            </label>
            <select
              name="workforceSize"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#E05522]/40 focus:border-[#E05522] transition bg-white"
            >
              <option value="">{isAr ? 'اختر الحجم' : 'Select size'}</option>
              <option value="<50">{isAr ? 'أقل من 50 عامل' : 'Less than 50 workers'}</option>
              <option value="50-200">50 – 200</option>
              <option value="200-500">200 – 500</option>
              <option value="500-1000">500 – 1,000</option>
              <option value=">1000">{isAr ? 'أكثر من 1000 عامل' : 'More than 1,000 workers'}</option>
            </select>
          </div>
        </div>

        {/* Message */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            {isAr ? 'تفاصيل إضافية' : 'Project / Requirements Details'}
          </label>
          <textarea
            name="message"
            rows={4}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#E05522]/40 focus:border-[#E05522] transition resize-none"
            placeholder={isAr ? 'أخبرنا عن احتياجاتك...' : 'Tell us about your project location, duration, and specific medical requirements...'}
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full py-4 rounded-xl bg-[#E05522] text-white font-bold text-sm hover:bg-[#B8441A] transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#E05522] focus:ring-offset-2"
        >
          {isAr ? 'إرسال الاستفسار' : 'Send Enquiry'}
        </button>

        <p className="text-center text-xs text-slate-400">
          {isAr
            ? 'سيتواصل معك فريق SARC خلال 24 ساعة.'
            : 'A SARC team member will respond within 24 hours.'
          }
        </p>
      </form>
    </div>
  );
}
