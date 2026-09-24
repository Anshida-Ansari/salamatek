const fs = require('fs');
const path = 'd:/Salamatek/apps/web/src/app/[locale]/sarc/page.tsx';
let content = fs.readFileSync(path, 'utf8');

const tSarcStr = `
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
    hero: { divisionOf: 'A Division of', salamatek: 'Salamatek Medical Center', subtitle: 'Industrial Healthcare Manpower', title1: 'Medical teams', title2: 'deployed around', title3: 'your workforce.', desc: 'SARC simplifies healthcare at work sites by providing qualified doctors, nurses, paramedical staff, ambulance services and other medical support tailored to each client company.', reqProposal: 'Request a staffing proposal', exploreCap: 'Explore capabilities', features: ['Work-site healthcare', 'Qualified personnel', 'Tailored deployment'] },
    services: { tag: 'What SARC Provides', title1: 'A complete work-site', title2: 'healthcare team.', desc: 'Each solution is shaped around client needs, from essential clinical manpower to broader on-site medical support.', items: [ { num: '01', title: 'Qualified doctors', desc: 'Physicians selected and mobilized to support the medical needs of industrial work sites.' }, { num: '02', title: 'Nursing teams', desc: 'Professional nurses scheduled around workforce size, shifts and site coverage requirements.' }, { num: '03', title: 'Paramedical staff', desc: 'Additional medical personnel configured to match the project scope and operating environment.' }, { num: '04', title: 'Ambulance services', desc: 'Ambulance coverage and supporting medical services for a more complete work-site healthcare environment.' } ] },
    factors: { tag: 'Workforce-based staffing', title1: 'Not a fixed package.', title2: 'A team designed for the site.', link: 'Discuss your site requirements', items: [ { num: '01', title: 'Workforce headcount', desc: 'Coverage planned around the number of workers on site.' }, { num: '02', title: 'Shift pattern', desc: 'Personnel scheduled around working hours and rotation needs.' }, { num: '03', title: 'Site environment', desc: 'Scope shaped by location, access and operational risk.' }, { num: '04', title: 'Client requirements', desc: 'Deployment aligned to the project\\'s medical-service brief.' } ] },
    capabilities: { tag: 'What we do', title1: 'Full-spectrum care', title2: 'at every worksite.', items: [ { title: 'Equipping Clinics', icon: '🏥', desc: 'Remote medical clinics set up at your worksite with the latest equipment. Our team fully manages and operates the clinic to international standards.' }, { title: 'Enhanced Worker Safety', icon: '🦺', desc: 'Immediate on-site access to medical attention for injuries and illnesses — minimizing project delays and keeping productivity high.' }, { title: 'Employee Health Services', icon: '❤️', desc: 'Customized health programs tailored to the construction industry that promote worker well-being and address underlying medical conditions.' }, { title: 'Follow-Up & Case Management', icon: '📋', desc: 'Our team works closely with off-site medical staff to ensure injured workers receive appropriate treatment and follow-up appointments.' }, { title: 'On-Site Services', icon: '⛑️', desc: 'Medical expertise delivered directly to your site, staffed by experienced professionals for immediate treatment of injuries and minor illnesses.' }, { title: 'Mobile Medical Services', icon: '🚑', desc: 'Flexible mobile units that bring essential medical services to any project location — wherever your construction site is located.' } ], bottomDesc: 'Improved access to immediate care — SARC brings healthcare directly to the worksite, ensuring first aid response is always available where it matters most.' },
    readiness: { tag: 'Real people. Real readiness.', title1: 'Prepared before', title2: 'they reach the site.', desc: 'SARC teams combine professional medical staffing with practical preparation for work-site healthcare, emergency response and coordinated patient care.', card1: { title: 'Clinical team preparation', desc: 'Structured training and team coordination' }, card2: { title: 'Emergency readiness', desc: 'Hands-on response practice' }, card3: { title: 'On-site clinical capability', desc: 'Equipped for the work environment' } },
    coverage: { tag: 'Where we support', title1: 'Healthcare coverage', title2: 'where work happens.', desc: 'Flexible medical manpower for demanding industrial and project environments.', items: ['Energy & industrial sites', 'Construction & infrastructure', 'Manufacturing facilities', 'Remote project locations'] },
    form: { tag: 'Contact SARC', title: 'Let\\'s Build Your Site Medical Team', desc: 'Tell us about your project requirements and we will design a staffing solution.', company: 'Company Name', person: 'Contact Person', email: 'Email Address', phone: 'Phone Number', details: 'Project Details', detailsPlaceholder: 'Tell us about your project location, duration, and specific medical requirements...', submit: 'Send Enquiry' },
    cta: { heading: 'Need on-site medical support?', subtext: 'Contact the SARC team today for a tailored proposal.', btn: 'Get Started' }
  }
};
`;

content = content.replace(/const SERVICES = \[[\s\S]*?\];\s*const FACTORS = \[[\s\S]*?\];/, tSarcStr);
content = content.replace("const isAr = typedLocale === 'ar';", "const isAr = typedLocale === 'ar';\n  const t = isAr ? tSarc.ar : tSarc.en;");

// Hero Section
content = content.replace('A Division of', '{t.hero.divisionOf}');
content = content.replace('Salamatek Medical Center', '{t.hero.salamatek}');
content = content.replace('Industrial Healthcare Manpower', '{t.hero.subtitle}');
content = content.replace('Medical teams<br />', '{t.hero.title1}<br />');
content = content.replace('deployed around<br />', '{t.hero.title2}<br />');
content = content.replace('your workforce.', '{t.hero.title3}');
content = content.replace('SARC simplifies healthcare at work sites by providing qualified doctors, nurses, paramedical staff, ambulance services and other medical support tailored to each client company.', '{t.hero.desc}');
content = content.replace('Request a staffing proposal', '{t.hero.reqProposal}');
content = content.replace('Explore capabilities', '{t.hero.exploreCap}');
content = content.replace('Work-site healthcare', '{t.hero.features[0]}');
content = content.replace('Qualified personnel', '{t.hero.features[1]}');
content = content.replace('Tailored deployment', '{t.hero.features[2]}');
content = content.replace('Request a Proposal', '{t.hero.reqProposal}');

// Services Section
content = content.replace('What SARC Provides', '{t.services.tag}');
content = content.replace('A complete work-site<br />healthcare team.', '{t.services.title1}<br />{t.services.title2}');
content = content.replace('Each solution is shaped around client needs, from essential clinical manpower to broader on-site medical support.', '{t.services.desc}');
content = content.replace('SERVICES.map', 't.services.items.map');

// Workforce Section
content = content.replace('Workforce-based staffing', '{t.factors.tag}');
content = content.replace('Not a fixed package.<br />A team designed for the site.', '{t.factors.title1}<br />{t.factors.title2}');
content = content.replace('Discuss your site requirements', '{t.factors.link}');
content = content.replace('FACTORS.map', 't.factors.items.map');

// Capabilities Section
content = content.replace('What we do', '{t.capabilities.tag}');
content = content.replace('Full-spectrum care<br /><span className="italic text-[#E05522]">at every worksite.</span>', '{t.capabilities.title1}<br /><span className="italic text-[#E05522]">{t.capabilities.title2}</span>');

const capsOld = `            {[
              { title: 'Equipping Clinics', icon: '🏥', desc: 'Remote medical clinics set up at your worksite with the latest equipment. Our team fully manages and operates the clinic to international standards.' },
              { title: 'Enhanced Worker Safety', icon: '🦺', desc: 'Immediate on-site access to medical attention for injuries and illnesses — minimizing project delays and keeping productivity high.' },
              { title: 'Employee Health Services', icon: '❤️', desc: 'Customized health programs tailored to the construction industry that promote worker well-being and address underlying medical conditions.' },
              { title: 'Follow-Up & Case Management', icon: '📋', desc: 'Our team works closely with off-site medical staff to ensure injured workers receive appropriate treatment and follow-up appointments.' },
              { title: 'On-Site Services', icon: '⛑️', desc: 'Medical expertise delivered directly to your site, staffed by experienced professionals for immediate treatment of injuries and minor illnesses.' },
              { title: 'Mobile Medical Services', icon: '🚑', desc: 'Flexible mobile units that bring essential medical services to any project location — wherever your construction site is located.' },
            ].map(({ title, icon, desc }) => (`
content = content.replace(capsOld, '            {t.capabilities.items.map(({ title, icon, desc }) => (');
content = content.replace('Improved access to immediate care — SARC brings healthcare directly to the worksite, ensuring first aid response is always available where it matters most.', '{t.capabilities.bottomDesc}');

// Readiness Section
content = content.replace('Real people. Real readiness.', '{t.readiness.tag}');
content = content.replace('Prepared before<br />they reach the site.', '{t.readiness.title1}<br />{t.readiness.title2}');
content = content.replace('SARC teams combine professional medical staffing with practical preparation for work-site healthcare, emergency response and coordinated patient care.', '{t.readiness.desc}');
content = content.replace('>Clinical team preparation</h3>', '>{t.readiness.card1.title}</h3>');
content = content.replace('>Structured training and team coordination</p>', '>{t.readiness.card1.desc}</p>');
content = content.replace('>Emergency readiness</h3>', '>{t.readiness.card2.title}</h3>');
content = content.replace('>Hands-on response practice</p>', '>{t.readiness.card2.desc}</p>');
content = content.replace('>On-site clinical capability</h3>', '>{t.readiness.card3.title}</h3>');
content = content.replace('>Equipped for the work environment</p>', '>{t.readiness.card3.desc}</p>');

// Coverage Banner
content = content.replace('Where we support', '{t.coverage.tag}');
content = content.replace('Healthcare coverage<br />where work happens.', '{t.coverage.title1}<br />{t.coverage.title2}');
content = content.replace('Flexible medical manpower for demanding industrial and project environments.', '{t.coverage.desc}');
content = content.replace('<p className="text-sm text-white/90">Energy & industrial sites</p>', '<p className="text-sm text-white/90">{t.coverage.items[0]}</p>');
content = content.replace('<p className="text-sm text-white/90">Construction & infrastructure</p>', '<p className="text-sm text-white/90">{t.coverage.items[1]}</p>');
content = content.replace('<p className="text-sm text-white/90">Manufacturing facilities</p>', '<p className="text-sm text-white/90">{t.coverage.items[2]}</p>');
content = content.replace('<p className="text-sm text-white/90">Remote project locations</p>', '<p className="text-sm text-white/90">{t.coverage.items[3]}</p>');

// Form Section
content = content.replace('Contact SARC', '{t.form.tag}');
content = content.replace('Let&apos;s Build Your Site Medical Team', '{t.form.title}');
content = content.replace('Tell us about your project requirements and we will design a staffing solution.', '{t.form.desc}');

// CTA Section
content = content.replace('heading="Need on-site medical support?"', 'heading={t.cta.heading}');
content = content.replace('subtext="Contact the SARC team today for a tailored proposal."', 'subtext={t.cta.subtext}');
content = content.replace('ctaLabel="Get Started"', 'ctaLabel={t.cta.btn}');

// Form Component
content = content.replace('function SARCEnquiryForm({ locale: _locale, isAr: _isAr }: { locale: Locale; isAr: boolean }) {', 'function SARCEnquiryForm({ locale: _locale, isAr }: { locale: Locale; isAr: boolean }) {\n  const t = isAr ? tSarc.ar : tSarc.en;');
content = content.replace('>Company Name', '>{t.form.company}');
content = content.replace('placeholder="e.g. Saudi Aramco"', 'placeholder={isAr ? "مثال: أرامكو السعودية" : "e.g. Saudi Aramco"}');
content = content.replace('>Contact Person', '>{t.form.person}');
content = content.replace('placeholder="Full Name"', 'placeholder={isAr ? "الاسم الكامل" : "Full Name"}');
content = content.replace('>Email Address', '>{t.form.email}');
content = content.replace('>Phone Number', '>{t.form.phone}');
content = content.replace('>Project Details', '>{t.form.details}');
content = content.replace('placeholder="Tell us about your project location, duration, and specific medical requirements..."', 'placeholder={t.form.detailsPlaceholder}');
content = content.replace('>\n          Send Enquiry\n        </button>', '>\n          {t.form.submit}\n        </button>');

fs.writeFileSync(path, content, 'utf8');
