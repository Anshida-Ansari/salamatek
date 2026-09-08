/**
 * Salamatek Medical Centre — News & Insights data
 * Source: Placeholder / demonstration content only
 * These are NOT official Salamatek publications.
 * Replace with CMS/API data in a future phase.
 */

export interface NewsArticle {
  id: string;
  category: { en: string; ar: string };
  title: { en: string; ar: string };
  excerpt: { en: string; ar: string };
  image: string;
  slug: string;
  date: string;
  featured?: boolean;
}

// NOTE: Demo content only — not official Salamatek publications
export const newsArticles: NewsArticle[] = [
  {
    id: 'news-001',
    category: { en: 'SARC — Work-Site Healthcare', ar: 'سارك — الرعاية الصحية الصناعية' },
    title: {
      en: 'Building stronger work-site readiness through trained medical teams',
      ar: 'تعزيز الجاهزية الطبية في مواقع العمل من خلال الفرق المدربة',
    },
    excerpt: {
      en: 'How preparation, coordinated staffing and emergency-response practice support dependable industrial healthcare.',
      ar: 'كيف تدعم الاستعداد والتوظيف المنسق وممارسات الاستجابة الطارئة رعاية صناعية موثوقة.',
    },
    image: '/images/hospital/emergency-ward.jpg',
    slug: 'work-site-readiness-medical-teams',
    date: '2025-08-12',
    featured: true,
  },
  {
    id: 'news-002',
    category: { en: 'Eye Health', ar: 'صحة العيون' },
    title: {
      en: 'What to expect from a comprehensive eye examination',
      ar: 'ما يمكن توقعه من فحص العيون الشامل',
    },
    excerpt: {
      en: 'A step-by-step guide to what happens during a full eye health assessment at Salamatek.',
      ar: 'دليل خطوة بخطوة لما يحدث أثناء تقييم صحة العيون الكامل في سلامتك.',
    },
    image: '/images/hospital/reception.jpg',
    slug: 'comprehensive-eye-examination',
    date: '2025-07-28',
  },
  {
    id: 'news-003',
    category: { en: 'Inside Salamatek', ar: 'داخل سلامتك' },
    title: {
      en: 'One connected destination for family healthcare in Safwa',
      ar: 'وجهة متكاملة للرعاية الصحية الأسرية في صفوى',
    },
    excerpt: {
      en: "From everyday check-ups to specialist consultations — how Salamatek brings it all together in one location.",
      ar: 'من الفحوصات اليومية إلى الاستشارات المتخصصة — كيف تجمع سلامتك كل ذلك في مكان واحد.',
    },
    image: '/images/hospital/exterior.jpg',
    slug: 'connected-destination-safwa',
    date: '2025-07-10',
  },
];
