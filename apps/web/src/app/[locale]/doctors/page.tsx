import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { isValidLocale } from '@/i18n/config';
import type { Locale } from '@/i18n/config';
import { getTranslations } from '@/i18n';
import { Section, Container, Heading, Badge } from '@/components/ui';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!isValidLocale(locale)) return {};
  return { title: getTranslations(locale as Locale).pages.doctors.title };
}

export default async function DoctorsPage({ params }: Props) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();
  const t = getTranslations(locale as Locale);
  return (
    <Section spacing="lg">
      <Container size="md" className="text-center">
        <Badge variant="brand" className="mb-4">Coming in Phase 2</Badge>
        <Heading level={1} variant="h1">{t.pages.doctors.title}</Heading>
        <p className="body-lg mt-4">{t.common.placeholder}</p>
      </Container>
    </Section>
  );
}
