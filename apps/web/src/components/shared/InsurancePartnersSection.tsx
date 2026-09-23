'use client';

import Image from 'next/image';
import { ShieldCheck } from 'lucide-react';
import { INSURANCE_PARTNERS } from '@/lib/constants';

interface Props {
  variant?: string; // Kept for backwards compatibility, but ignored in UI
  isAr?: boolean;
}

function InsuranceLogo({ partner }: { partner: { name: string; image: string } }) {
  const logoUrl = `/images/insurance/${partner.image}`;

  return (
    <div className="relative w-full h-20 md:h-24 flex items-center justify-center transition-all duration-300 group overflow-hidden">
      <Image
        src={logoUrl}
        alt={`${partner.name} Logo`}
        fill
        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
        className="object-contain p-2 md:p-4 transition-transform duration-500 ease-out group-hover:scale-[1.05] mix-blend-multiply"
      />
    </div>
  );
}

export function InsurancePartnersSection({ isAr = false }: Props) {
  const heading = isAr ? 'شركاء التأمين' : 'Our Insurance Partners';
  const subtext = isAr
    ? 'نعمل مع أبرز مزودي خدمات التأمين لنجعل الرعاية الصحية عالية الجودة في متناول الجميع.'
    : 'We work with leading insurance providers to make quality healthcare more accessible.';

  return (
    <section className="bg-white py-16 md:py-24 border-y border-border/50" aria-labelledby="insurance-heading">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-white text-brand mb-6 shadow-sm border border-brand-pale/30">
            <ShieldCheck className="w-6 h-6" />
          </span>
          <h2 id="insurance-heading" className="text-3xl md:text-4xl font-serif font-bold text-brand-dark mb-4">
            {heading}
          </h2>
          <p className="text-base md:text-lg text-text-muted leading-relaxed max-w-2xl mx-auto">
            {subtext}
          </p>
        </div>

        {/* 
          Grid Layout: 
          - Mobile: 2 columns 
          - Tablet: 3-4 columns 
          - Desktop: 5-6 columns
          Uses flex-wrap with center justification so the last row is always perfectly balanced.
        */}
        <div className="flex flex-wrap justify-center gap-4 sm:gap-5 md:gap-6">
          {INSURANCE_PARTNERS.map((partner, idx) => (
            <div 
              key={idx} 
              className="w-[calc(50%-0.5rem)] sm:w-[calc(33.333%-0.85rem)] md:w-[calc(25%-1.125rem)] lg:w-[calc(20%-1.2rem)] xl:w-[calc(16.666%-1.25rem)]"
            >
              <InsuranceLogo partner={partner} />
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
