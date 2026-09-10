import Image from 'next/image';
import Link from 'next/link';
import type { Locale } from '@/i18n/config';
import type { Translations } from '@/i18n';
import { getLocalizedPath } from '@/lib/utils';

type Props = {
  locale: Locale;
  t: Translations;
};

async function getNews() {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
    const res = await fetch(`${apiUrl}/news?active=true&limit=3`, {
      cache: 'no-store',
    });
    if (!res.ok) return [];
    const json = await res.json();
    return json.data || [];
  } catch (error) {
    return [];
  }
}

function NewsCard({
  article,
  locale,
  t,
  featured = false,
}: {
  article: any;
  locale: Locale;
  t: Translations;
  featured?: boolean;
}) {
  const isLink = t.common.readInsight;

  return (
    <article className={`flex flex-col ${featured ? '' : ''}`}>
      {/* Image */}
      <div className={`relative overflow-hidden rounded-2xl ${featured ? 'aspect-[4/3]' : 'aspect-[16/10]'} mb-5`}>
        <Image
          src={article.image || '/images/placeholder.jpg'}
          alt={article.title[locale] || article.title.en}
          fill
          sizes={featured ? '(max-width: 768px) 100vw, 45vw' : '(max-width: 768px) 100vw, 28vw'}
          className="object-cover object-center transition-transform duration-500 group-hover:scale-[1.03]"
        />
      </div>

      {/* Category */}
      <p className="text-[10px] font-bold uppercase tracking-widest text-brand-red mb-2">
        {article.category?.[locale] || article.category?.en || 'News'}
      </p>

      {/* Title */}
      <h3 className={`font-serif font-bold text-text-base leading-snug mb-3 ${featured ? 'text-xl md:text-2xl' : 'text-base'}`}>
        {article.title[locale] || article.title.en}
      </h3>

      {/* Excerpt — only on featured */}
      {featured && (
        <p className="text-sm text-text-muted leading-relaxed mb-4 line-clamp-2">
          {article.content?.[locale] || article.content?.en || ''}
        </p>
      )}

      {/* Read link */}
      <Link
        href={getLocalizedPath(`/news/${article.slug}`, locale)}
        className="text-xs font-semibold text-brand-red hover:text-brand-red-dark transition-colors duration-150"
        aria-label={`${isLink} — ${article.title[locale] || article.title.en}`}
      >
        {t.common.readInsight}
      </Link>
    </article>
  );
}

export async function NewsSection({ locale, t }: Props) {
  const p = t.pages.home;
  const news = await getNews();
  const [featured, ...rest] = news;

  if (!featured) return null;

  return (
    <section
      className="bg-white py-16 md:py-24"
      aria-labelledby="news-heading"
      id="news"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start mb-12">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-brand-red mb-4">
              {p.newsEyebrow}
            </p>
            <h2
              id="news-heading"
              className="text-display-md md:text-display-lg font-serif font-bold text-text-base leading-tight"
            >
              <span className="block">{p.newsHeading1}</span>
              <span className="block">{p.newsHeading2}</span>
            </h2>
          </div>
          <div className="md:pt-12 flex flex-col gap-3">
            <p className="text-sm text-text-muted leading-relaxed max-w-xs">
              {p.newsSubtext}
            </p>
            <Link
              href={getLocalizedPath('/news', locale)}
              className="text-sm font-semibold text-brand-red hover:text-brand-red-dark transition-colors duration-150"
            >
              {t.common.viewAllStories}
            </Link>
          </div>
        </div>

        {/* Cards grid — 1 featured large + 2 smaller */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {/* Featured */}
          <div className="md:col-span-1 group">
            <NewsCard article={featured} locale={locale} t={t} featured />
          </div>

          {/* Secondary articles */}
          <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {rest.slice(0, 2).map((article: any) => (
              <div key={article._id} className="group">
                <NewsCard article={article} locale={locale} t={t} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
