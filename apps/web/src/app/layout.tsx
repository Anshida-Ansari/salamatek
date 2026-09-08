import type { Metadata } from 'next';
import { Inter, Noto_Kufi_Arabic } from 'next/font/google';
import './globals.css';
import { SITE_NAME, SITE_DESCRIPTION } from '@salamatek/config';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const notoKufiArabic = Noto_Kufi_Arabic({
  subsets: ['arabic'],
  variable: '--font-noto-kufi',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: SITE_NAME.en,
    template: `%s | ${SITE_NAME.en}`,
  },
  description: SITE_DESCRIPTION.en,
  metadataBase: new URL(
    process.env['NEXT_PUBLIC_SITE_URL'] ?? 'http://localhost:3000'
  ),
  openGraph: {
    type: 'website',
    siteName: SITE_NAME.en,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      dir="ltr"
      className={`${inter.variable} ${notoKufiArabic.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
