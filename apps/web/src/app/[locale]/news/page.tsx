import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { FileText, Calendar, User, ArrowRight } from 'lucide-react';
import { PageHero } from '@/components/shared/PageHero';

export const metadata: Metadata = {
  title: 'News & Blog | Salamatek Medical Center',
  description: 'Stay updated with the latest medical news, health tips, and hospital announcements.',
};

async function getNews() {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
    const res = await fetch(`${apiUrl}/news?status=published&limit=100`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return [];
    const json = await res.json();
    return json.data || [];
  } catch (error) {
    return [];
  }
}

async function getPageHero(pageKey: string) {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
    const res = await fetch(`${apiUrl}/page-heroes/${pageKey}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data || null;
  } catch (error) {
    return null;
  }
}

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function NewsPage({ params }: Props) {
  const { locale } = await params;
  const typedLocale = locale as 'en' | 'ar';
  const isRtl = locale === 'ar';
  
  const [newsList, heroSetting] = await Promise.all([
    getNews(),
    getPageHero('news')
  ]);

  const featured = newsList.find((n: any) => n.featured) || newsList[0];
  const regularNews = newsList.filter((n: any) => n._id !== featured?._id);

  const defaultHeading = isRtl ? 'أحدث الأخبار والمقالات الطبية' : 'Latest News & Medical Articles';
  const defaultSubtext = isRtl 
    ? 'ابق على اطلاع بآخر النصائح الصحية والأخبار والتحديثات من مركز سلامتك الطبي.' 
    : 'Stay updated with the latest health tips, news, and announcements from Salamatek.';

  const heading = heroSetting?.heading?.[typedLocale] || defaultHeading;
  const subtext = heroSetting?.subtext?.[typedLocale] || defaultSubtext;

  return (
    <>
      <PageHero 
        locale={typedLocale}
        badge={isRtl ? 'المركز الإعلامي' : 'Media Center'}
        heading={heading}
        subtext={subtext}
        imageSrc={heroSetting?.image}
      />

      <main className="min-h-screen bg-slate-50 pt-16 pb-24" dir={isRtl ? 'rtl' : 'ltr'}>

        {newsList.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl shadow-sm border border-gray-100">
            <FileText className="w-16 h-16 text-gray-300 mb-4" />
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              {isRtl ? 'لا توجد مقالات حالياً' : 'No articles currently available'}
            </h3>
            <p className="text-gray-500 text-center max-w-md">
              {isRtl ? 'يرجى التحقق مرة أخرى لاحقاً.' : 'Please check back later for updates.'}
            </p>
          </div>
        ) : (
          <div className="space-y-16">
            {/* Featured Article */}
            {featured && (
              <Link href={`/${locale}/news/${featured.slug}`} className="group block bg-white rounded-3xl shadow-lg shadow-gray-200/50 overflow-hidden border border-gray-100 transition-transform hover:-translate-y-1">
                <div className="grid grid-cols-1 lg:grid-cols-2">
                  <div className="relative h-64 lg:h-full bg-gray-100 overflow-hidden">
                    {featured.image ? (
                      <Image src={featured.image} alt={featured.title[locale] || featured.title.en} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center bg-blue-50">
                        <FileText className="w-16 h-16 text-blue-200" />
                      </div>
                    )}
                  </div>
                  <div className="p-8 lg:p-12 flex flex-col justify-center">
                    <div className="flex items-center gap-4 mb-6 text-sm text-gray-500">
                      {featured.category?.[locale] && (
                        <span className="bg-blue-50 text-blue-700 font-semibold px-3 py-1 rounded-full">
                          {featured.category[locale]}
                        </span>
                      )}
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-4 h-4" />
                        {new Date(featured.publishedDate).toLocaleDateString(isRtl ? 'ar-SA' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                      </span>
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900 group-hover:text-blue-600 transition mb-4">
                      {featured.title[locale] || featured.title.en}
                    </h2>
                    <p className="text-gray-600 leading-relaxed mb-8">
                      {featured.excerpt[locale] || featured.excerpt.en}
                    </p>
                    <div className="mt-auto flex items-center gap-2 font-bold text-blue-600">
                      {isRtl ? 'اقرأ المزيد' : 'Read Article'}
                      <ArrowRight className={`w-4 h-4 ${isRtl ? 'rotate-180' : ''}`} />
                    </div>
                  </div>
                </div>
              </Link>
            )}

            {/* Grid Articles */}
            {regularNews.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {regularNews.map((article: any) => (
                  <Link href={`/${locale}/news/${article.slug}`} key={article._id} className="group flex flex-col bg-white rounded-3xl shadow-sm hover:shadow-lg hover:shadow-gray-200/50 overflow-hidden border border-gray-100 transition-all hover:-translate-y-1">
                    <div className="relative h-56 bg-gray-100 overflow-hidden">
                      {article.image ? (
                        <Image src={article.image} alt={article.title[locale] || article.title.en} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center bg-blue-50">
                          <FileText className="w-12 h-12 text-blue-200" />
                        </div>
                      )}
                    </div>
                    <div className="p-6 sm:p-8 flex-1 flex flex-col">
                      <div className="flex items-center justify-between gap-4 mb-4 text-xs font-medium text-gray-500">
                        {article.category?.[locale] && (
                          <span className="text-blue-600 uppercase tracking-wider">{article.category[locale]}</span>
                        )}
                        <span className="flex items-center gap-1.5">
                          {new Date(article.publishedDate).toLocaleDateString(isRtl ? 'ar-SA' : 'en-US')}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition mb-3 line-clamp-2">
                        {article.title[locale] || article.title.en}
                      </h3>
                      <p className="text-gray-600 text-sm leading-relaxed mb-6 line-clamp-3">
                        {article.excerpt[locale] || article.excerpt.en}
                      </p>
                      <div className="mt-auto pt-6 border-t border-gray-100 flex items-center justify-between">
                        {article.author?.[locale] ? (
                          <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                            <User className="w-4 h-4 text-gray-400" />
                            {article.author[locale]}
                          </div>
                        ) : <div />}
                        <ArrowRight className={`w-5 h-5 text-gray-400 group-hover:text-blue-600 transition ${isRtl ? 'rotate-180' : ''}`} />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
      </main>
    </>
  );
}
