'use client';

import { useEffect } from 'react';

type Props = {
  locale: string;
  dir: 'ltr' | 'rtl';
};

export function HtmlAttributes({ locale, dir }: Props): null {
  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = dir;
  }, [locale, dir]);

  return null;
}
