import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { isValidLocale, LOCALES, LOCALE_DIR } from '@/i18n/config';
import type { Locale } from '@/i18n/config';
import { getTranslations } from '@/i18n';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { HtmlAttributes } from '@/components/layout/HtmlAttributes';
import { WhatsAppCTA } from '@/components/shared/WhatsAppCTA';

export function generateStaticParams(): Array<{ locale: string }> {
  return LOCALES.map((locale) => ({ locale }));
}

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isValidLocale(locale)) return {};
  const t = getTranslations(locale as Locale);
  return {
    title: { default: t.meta.siteName, template: `%s | ${t.meta.siteName}` },
    description: t.meta.siteDescription,
    metadataBase: new URL(process.env['NEXT_PUBLIC_SITE_URL'] ?? 'http://localhost:3000'),
    openGraph: { type: 'website', siteName: t.meta.siteName },
    robots: { index: true, follow: true },
  };
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  if (!isValidLocale(locale)) {
    notFound();
  }

  const typedLocale = locale as Locale;
  const dir = LOCALE_DIR[typedLocale];
  const t = getTranslations(typedLocale);

  return (
    <>
      <HtmlAttributes locale={typedLocale} dir={dir} />
      <div className={`min-h-screen flex flex-col ${dir === 'rtl' ? 'font-arabic' : 'font-sans'}`} dir={dir} lang={typedLocale}>
        <Header locale={typedLocale} t={t} />
        <main id="main-content" className="flex-1" tabIndex={-1}>
          {children}
        </main>
        <Footer locale={typedLocale} t={t} />
        <WhatsAppCTA />
      </div>
    </>
  );
}
