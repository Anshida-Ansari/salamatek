/**
 * Salamatek Medical Centre — Services data
 * Source: Derived from client Jotform, building signage, and department listings.
 * Structure supports future API/CMS integration.
 *
 * NOTE: These represent confirmed/inferable services only.
 * Do NOT add services without client verification.
 */

export interface MedicalService {
  id: string;
  slug: string;
  name: { en: string; ar: string };
  description: { en: string; ar: string };
  /** lucide icon name or custom SVG key */
  icon: string;
  /** department this service primarily belongs to (optional) */
  departmentId?: string;
  active: boolean;
}

export const services: MedicalService[] = [
  {
    id: 'emergency-care',
    slug: 'emergency-care',
    name: { en: '24/7 Emergency Care', ar: 'رعاية طوارئ على مدار الساعة' },
    description: {
      en: 'Around-the-clock emergency medical care for urgent situations, including a dedicated emergency palliative care services centre.',
      ar: 'رعاية طبية طارئة على مدار الساعة للحالات العاجلة، بما يشمل مركز خدمات الرعاية التخفيفية للطوارئ.',
    },
    icon: 'alert-circle',
    departmentId: 'emergency',
    active: true,
  },
  {
    id: 'specialist-consultation',
    slug: 'specialist-consultation',
    name: { en: 'Specialist Consultation', ar: 'الاستشارة المتخصصة' },
    description: {
      en: 'Access experienced consultants across 12+ specialties — all in one location.',
      ar: 'وصول إلى استشاريين ذوي خبرة في أكثر من 12 تخصصًا — كلها في مكان واحد.',
    },
    icon: 'stethoscope',
    active: true,
  },
  {
    id: 'laboratory',
    slug: 'laboratory',
    name: { en: 'Laboratory & Diagnostics', ar: 'المختبر والتشخيص' },
    description: {
      en: 'Accurate clinical laboratory testing with modern diagnostic equipment for fast, reliable results.',
      ar: 'فحوصات مختبرية سريرية دقيقة باستخدام معدات تشخيصية حديثة لنتائج سريعة وموثوقة.',
    },
    icon: 'flask-conical',
    departmentId: 'laboratory',
    active: true,
  },
  {
    id: 'physiotherapy-rehabilitation',
    slug: 'physiotherapy-rehabilitation',
    name: { en: 'Physiotherapy & Rehabilitation', ar: 'العلاج الطبيعي وإعادة التأهيل' },
    description: {
      en: 'Professional rehabilitation programmes supporting injury recovery, mobility and long-term physical wellbeing.',
      ar: 'برامج إعادة تأهيل احترافية تدعم التعافي من الإصابات والحركة والسلامة الجسدية على المدى البعيد.',
    },
    icon: 'activity',
    departmentId: 'physiotherapy',
    active: true,
  },
  {
    id: 'dermatology-laser',
    slug: 'dermatology-laser',
    name: { en: 'Dermatology & Laser Treatments', ar: 'علاجات الجلدية والليزر' },
    description: {
      en: 'Advanced skin, hair and aesthetic treatments using modern laser and dermatological technology.',
      ar: 'علاجات متقدمة للبشرة والشعر والجماليات باستخدام تقنيات الليزر والجلدية الحديثة.',
    },
    icon: 'sparkles',
    departmentId: 'dermatology',
    active: true,
  },
  {
    id: 'dental-care',
    slug: 'dental-care',
    name: { en: 'Dental Care', ar: 'طب الأسنان' },
    description: {
      en: 'Complete dental services for the whole family — from routine check-ups and fillings to cosmetic dentistry.',
      ar: 'خدمات أسنان كاملة لجميع أفراد العائلة — من الفحوصات الروتينية والحشوات إلى طب الأسنان التجميلي.',
    },
    icon: 'smile',
    departmentId: 'dental',
    active: true,
  },
  {
    id: 'eye-care',
    slug: 'eye-care',
    name: { en: 'Eye Care & Ophthalmology', ar: 'رعاية العيون وطب العيون' },
    description: {
      en: 'Comprehensive eye examinations, vision correction and specialist ophthalmic treatment.',
      ar: 'فحوصات عيون شاملة وتصحيح الرؤية وعلاج متخصص لأمراض العيون.',
    },
    icon: 'eye',
    departmentId: 'ophthalmology',
    active: true,
  },
  {
    id: 'womens-health',
    slug: 'womens-health',
    name: { en: "Women's Health Services", ar: 'خدمات صحة المرأة' },
    description: {
      en: 'Private, compassionate care for women at every stage of life — from routine gynaecology to specialist care.',
      ar: 'رعاية خاصة ورحيمة للمرأة في كل مرحلة من مراحل الحياة — من أمراض النساء الروتينية إلى الرعاية المتخصصة.',
    },
    icon: 'heart',
    departmentId: 'womens-health',
    active: true,
  },
  {
    id: 'pediatric-care',
    slug: 'pediatric-care',
    name: { en: 'Pediatric Care', ar: 'رعاية الأطفال' },
    description: {
      en: 'Dedicated medical care for newborns, infants and children — supporting healthy growth at every age.',
      ar: 'رعاية طبية متخصصة للمواليد والرضّع والأطفال — تدعم النمو الصحي في كل عمر.',
    },
    icon: 'baby',
    departmentId: 'pediatrics',
    active: true,
  },
  {
    id: 'optical-store',
    slug: 'optical-store',
    name: { en: 'Optical Store', ar: 'متجر البصريات' },
    description: {
      en: 'Eyewear fitting, prescription lenses and a curated selection of optical and sunglass frames — connected to our eye-care team.',
      ar: 'تركيب النظارات والعدسات الطبية ومجموعة مختارة من إطارات النظارات الطبية والشمسية — مرتبطة بفريق رعاية العيون لدينا.',
    },
    icon: 'glasses',
    active: true,
  },
];
