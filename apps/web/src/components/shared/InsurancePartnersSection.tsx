'use client';

import { useState } from 'react';
import { ShieldCheck } from 'lucide-react';
import { INSURANCE_PARTNERS } from '@/lib/constants';

interface Props {
  variant?: 'marquee' | 'grid'; // We ignore the variant now since user wants only static grid
  isAr?: boolean;
}

function InsuranceLogo({ partner }: { partner: { name: string; domain: string } }) {
  const [hasError, setHasError] = useState(false);
  const logoUrl = partner.domain ? `https://logo.clearbit.com/${partner.domain}` : null;

  if (hasError || !logoUrl) {
    return (
      <div className="w-full h-full flex items-center justify-center p-4 bg-[#F8FAF9] rounded-xl border border-border/60 hover:bg-white hover:shadow-sm transition-all">
        <span className="text-xs sm:text-sm font-bold text-brand-dark text-center leading-tight">
          {partner.name}
        </span>
      </div>
    );
  }

  return (
    <div className="w-full h-24 sm:h-28 flex items-center justify-center p-4 sm:p-6 bg-white rounded-xl border border-border/40 hover:border-brand-pale/60 hover:shadow-md transition-all group">
      <img
        src={logoUrl}
        alt={`${partner.name} Logo`}
        className="max-w-full max-h-full object-contain grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300"
        onError={() => setHasError(true)}
      />
    </div>
  );
}

export function InsurancePartnersSection({ isAr = false }: Props) {
  const heading = isAr ? 'شركاء التأمين' : 'Our Insurance Partners';
  const subtext = isAr
    ? 'نعمل مع أبرز شركات التأمين لتسهيل حصولكم على الرعاية الطبية بأعلى جودة.'
    : 'We work with leading insurance providers to make quality healthcare more accessible.';

  // Remove duplicate entries if any (like ORIENT and ORIENT INSURANCE)
  const uniquePartners = Array.from(new Map(INSURANCE_PARTNERS.map(p => [p.name, p])).values());

  return (
    <section className="bg-white py-16 md:py-24 border-y border-border" aria-labelledby="insurance-heading">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-surface-mint text-brand mb-6 shadow-sm border border-brand-pale/30">
            <ShieldCheck className="w-6 h-6" />
          </span>
          <h2 id="insurance-heading" className="text-3xl md:text-4xl font-serif font-bold text-brand-dark mb-4">
            {heading}
          </h2>
          <p className="text-base md:text-lg text-text-muted leading-relaxed max-w-2xl mx-auto">
            {subtext}
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
          {uniquePartners.map((partner, idx) => (
            <InsuranceLogo key={idx} partner={partner} />
          ))}
        </div>

      </div>
    </section>
  );
}
