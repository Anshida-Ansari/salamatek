import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Calendar, User, ChevronLeft } from 'lucide-react';

async function getNewsBySlug(slug: string) {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
    const res = await fetch(`${apiUrl}/news/slug/${slug}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data;
  } catch (error) {
    return null;
  }
}

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const article = await getNewsBySlug(slug);
  if (!article) return { title: 'Not Found' };
  return {
    title: `${article.title[locale] || article.title.en} | Salamatek News`,
    description: article.excerpt[locale] || article.excerpt.en,
  };
}

export default async function NewsDetailPage({ params }: Props) {
  const { locale, slug } = await params;
  const article = await getNewsBySlug(slug);
  if (!article || article.status !== 'published') notFound();

  const isRtl = locale === 'ar';

  return (
    <main className="min-h-screen bg-white pt-32 pb-24" dir={isRtl ? 'rtl' : 'ltr'}>
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link 
          href={`/${locale}/news`}
          className={`inline-flex items-center gap-1.5 text-sm font-semibold text-gray-500 hover:text-blue-600 transition mb-8 ${isRtl ? 'flex-row-reverse' : ''}`}
        >
          <ChevronLeft className={`w-4 h-4 ${isRtl ? 'rotate-180' : ''}`} />
          {isRtl ? 'العودة للأخبار' : 'Back to News'}
        </Link>

        <header className="mb-12 text-center">
          <div className="flex items-center justify-center gap-4 mb-6 text-sm text-gray-500">
            {article.category?.[locale] && (
              <span className="text-blue-600 font-semibold uppercase tracking-wider">
                {article.category[locale]}
              </span>
            )}
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              {new Date(article.publishedDate).toLocaleDateString(isRtl ? 'ar-SA' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </span>
            {article.author?.[locale] && (
              <span className="flex items-center gap-1.5">
                <User className="w-4 h-4" />
                {article.author[locale]}
              </span>
            )}
          </div>
          
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-8">
            {article.title[locale] || article.title.en}
          </h1>
        </header>

        {article.image && (
          <div className="relative h-64 sm:h-96 lg:h-[500px] w-full rounded-3xl overflow-hidden mb-16 shadow-2xl shadow-gray-200/50">
            <Image src={article.image} alt={article.title[locale] || article.title.en} fill className="object-cover" />
          </div>
        )}

        <div className="prose prose-lg prose-blue max-w-3xl mx-auto prose-p:text-gray-600 prose-headings:text-gray-900 prose-a:text-blue-600 prose-img:rounded-2xl">
          <p className="text-xl leading-relaxed text-gray-500 mb-8 font-medium">
            {article.excerpt[locale] || article.excerpt.en}
          </p>
          <div className="whitespace-pre-wrap leading-relaxed">
            {article.content[locale] || article.content.en}
          </div>
        </div>
      </article>
    </main>
  );
}
