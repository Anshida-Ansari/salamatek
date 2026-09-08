import type { Metadata } from 'next';
import { Inter, Noto_Kufi_Arabic, Playfair_Display } from 'next/font/google';
import './globals.css';

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

const playfairDisplay = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Salamatek Medical Centre',
  description: 'Complete family healthcare in Safwa, Eastern Province.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      suppressHydrationWarning
      className={`${inter.variable} ${notoKufiArabic.variable} ${playfairDisplay.variable}`}
    >
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
