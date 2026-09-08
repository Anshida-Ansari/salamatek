import { en } from './translations/en';
import { ar } from './translations/ar';
import type { Locale } from './config';
import type { Translations } from './translations/en';

const translations: Record<Locale, Translations> = { en, ar };

export function getTranslations(locale: Locale): Translations {
  return translations[locale];
}

export type { Locale, Translations };
export { LOCALES, DEFAULT_LOCALE, LOCALE_LABELS, LOCALE_DIR, isValidLocale } from './config';
