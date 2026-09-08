/**
 * Salamatek Medical Centre — Department data
 * Source: Building signage, client Jotform, and known specialties
 * Structure supports future API/CMS integration
 */

export interface Department {
  id: string;
  name: { en: string; ar: string };
  description: { en: string; ar: string };
  icon: string; // lucide icon name or SVG path key
  slug: string;
}

export const departments: Department[] = [
  {
    id: 'dermatology',
    name: { en: 'Dermatology & Laser', ar: 'الجلدية والليزر' },
    description: { en: 'Advanced skin, hair and aesthetic care.', ar: 'رعاية متقدمة للبشرة والشعر والتجميل.' },
    icon: 'sparkles',
    slug: 'dermatology-laser',
  },
  {
    id: 'dental',
    name: { en: 'Dental Care', ar: 'طب الأسنان' },
    description: { en: 'Complete family and cosmetic dentistry.', ar: 'طب أسنان شامل للعائلة وتجميلي.' },
    icon: 'tooth',
    slug: 'dental-care',
  },
  {
    id: 'ophthalmology',
    name: { en: 'Ophthalmology', ar: 'طب العيون' },
    description: { en: 'Specialist eye examinations and treatment.', ar: 'فحوصات وعلاج متخصص للعيون.' },
    icon: 'eye',
    slug: 'ophthalmology',
  },
  {
    id: 'womens-health',
    name: { en: "Women's Health", ar: 'صحة المرأة' },
    description: { en: 'Private, compassionate care for every stage.', ar: 'رعاية خاصة وإنسانية في كل مرحلة.' },
    icon: 'heart',
    slug: 'womens-health',
  },
  {
    id: 'general-medicine',
    name: { en: 'General Medicine', ar: 'الطب العام' },
    description: { en: 'Everyday healthcare for the whole family.', ar: 'رعاية صحية يومية لجميع أفراد الأسرة.' },
    icon: 'plus',
    slug: 'general-medicine',
  },
  {
    id: 'laboratory',
    name: { en: 'Laboratory', ar: 'المختبر' },
    description: { en: 'Accurate testing with modern diagnostics.', ar: 'فحوصات دقيقة بتشخيص حديث.' },
    icon: 'flask',
    slug: 'laboratory',
  },
  {
    id: 'physiotherapy',
    name: { en: 'Physiotherapy', ar: 'العلاج الطبيعي' },
    description: { en: 'Rehabilitation and movement recovery.', ar: 'إعادة التأهيل واستعادة الحركة.' },
    icon: 'activity',
    slug: 'physiotherapy',
  },
  {
    id: 'pediatrics',
    name: { en: 'Pediatrics', ar: 'طب الأطفال' },
    description: { en: 'Dedicated care for children of all ages.', ar: 'رعاية متخصصة للأطفال بجميع أعمارهم.' },
    icon: 'baby',
    slug: 'pediatrics',
  },
  {
    id: 'emergency',
    name: { en: '24/7 Emergency', ar: 'الطوارئ 24/7' },
    description: { en: 'Around-the-clock emergency medical care.', ar: 'رعاية طبية طارئة على مدار الساعة.' },
    icon: 'alert',
    slug: 'emergency',
  },
];
