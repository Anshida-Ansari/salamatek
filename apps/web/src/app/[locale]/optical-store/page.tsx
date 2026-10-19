import { redirect, notFound } from 'next/navigation';
import { isValidLocale } from '@/i18n/config';
import type { Locale } from '@/i18n/config';
import { getLocalizedPath } from '@/lib/utils';

type Props = { params: Promise<{ locale: string }> };

export default async function OpticalStorePage({ params }: Props) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();
  redirect(getLocalizedPath('/optical-brands', locale as Locale));
}

