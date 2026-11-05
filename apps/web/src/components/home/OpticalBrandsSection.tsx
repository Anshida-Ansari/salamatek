'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import type { Locale } from '@/i18n/config';
import type { Translations } from '@/i18n';

type Props = {
  locale: Locale;
  t?: Translations; // Made optional if unused in some contexts
};

const OPTICAL_BRANDS = [
  { name: "Puma", image: "PUMA.png" },
  { name: "Ray ban", image: "rayban.png" },
  { name: "Police", image: "police.png" },
  { name: "Nike", image: "nike.png" },
  { name: "Fila", image: "fila.png" },
  { name: "Calvin klein", image: "calvin-klein.png" },
  { name: "Gucci", image: "gucci.png" },
  { name: "Vogue", image: "Vogue.png" },
  { name: "Tiffany & co", image: "tiffany.jpg" },
  { name: "Burberry", image: "Burberry.png" },
  { name: "Prada", image: "prada.png" },
  { name: "Emperio armani", image: "emprorio.png" },
  { name: "Armani exchange", image: "armani.png" },
  { name: "Saint Lauren", image: "saint-laurent.png" },
  { name: "Lacoste", image: "Lacoste.jpg" },
  { name: "Dunhill", image: "Dunhill.png" },
  { name: "Maui Jim", image: "mauijim.png" },
  { name: "Oakley", image: "Oakley.png" },
  { name: "Tommy hilfiger", image: "Tommy-hilfiger.jpg" },
  { name: "Polo", image: "polo.png" },
  { name: "Hugo boss", image: "Hugo-Boss.png" },
  { name: "Dolce & Gabbana", image: "dolce-gabbana.jpg" },
  { name: "Bvlgari", image: "Bvlgari.webp" },
  { name: "Michael kors", image: "michael-kors.png" },
  { name: "Versace", image: "Versace.jpg" },
  { name: "Chopard", image: "Chopard.png" },
  { name: "Swarovski", image: "Swarovski.jpg" },
  { name: "Dkny", image: "dkny.png" }
];

function BrandLogo({ brand }: { brand: { name: string; image: string } }) {
  const isExternalOrAbsolute =
    brand.image.startsWith('http://') ||
    brand.image.startsWith('https://') ||
    brand.image.startsWith('/');
  const logoUrl = isExternalOrAbsolute ? brand.image : `/images/opticals/${brand.image}`;

  return (
    <div className="group bg-white rounded-2xl p-2.5 sm:p-3.5 border border-border/70 hover:border-brand-medium/50 shadow-xs hover:shadow-card hover:-translate-y-1 transition-all duration-300 flex flex-col items-center justify-between h-full min-h-[110px] sm:min-h-[136px]">
      <div className="relative w-full h-14 sm:h-20 flex items-center justify-center overflow-hidden">
        <Image
          src={logoUrl}
          alt={`${brand.name || 'Brand'} Logo`}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
          className="object-contain p-1 sm:p-2 transition-transform duration-500 ease-out group-hover:scale-105 mix-blend-multiply"
        />
      </div>
      {brand.name && (
        <div className="w-full pt-1.5 sm:pt-2 mt-auto border-t border-gray-100">
          <p
            className="text-[11px] sm:text-[13px] font-semibold text-brand-dark text-center truncate group-hover:text-brand transition-colors tracking-tight"
            title={brand.name}
          >
            {brand.name}
          </p>
        </div>
      )}
    </div>
  );
}

export function OpticalBrandsSection({ locale }: Props) {
  const [brands, setBrands] = useState<{ name: string; image: string; _id?: string }[]>(OPTICAL_BRANDS);

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const apiUrl = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000') + '/api';
        const res = await fetch(`${apiUrl}/optical-brands?active=true`);
        if (!res.ok) return;
        const json = await res.json();
        if (Array.isArray(json.data) && json.data.length > 0) {
          setBrands(json.data);
        }
      } catch {
        // Fallback to static constant
      }
    };
    fetchBrands();
  }, []);
  return (
    <section className="bg-[#F8FAF9] py-12 sm:py-16 md:py-24 border-t border-brand-dark/5">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12 md:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-brand-dark mb-2.5 sm:mb-4">
            {locale === 'ar' ? 'العلامات التجارية للبصريات' : 'Our Optical Brands'}
          </h2>
          <p className="text-xs sm:text-base md:text-lg text-text-muted leading-relaxed max-w-2xl mx-auto">
            {locale === 'ar' 
              ? 'اكتشف مجموعتنا المتميزة من النظارات الطبية والشمسية من أشهر العلامات التجارية العالمية.' 
              : 'Discover our premium selection of optical frames and sunglasses from world-renowned brands.'}
          </p>
        </div>

        {/* 
          Grid Layout: 
          - Mobile: 2 columns 
          - Tablet: 3-4 columns 
          - Desktop: 5-6 columns
          Uses flex-wrap with center justification so the last row is always perfectly balanced.
        */}
        <div className="flex flex-wrap justify-center gap-3 sm:gap-5 md:gap-6">
          {brands.map((brand, idx) => (
            <div 
              key={brand._id || brand.name || idx} 
              className="w-[calc(50%-0.375rem)] sm:w-[calc(33.333%-0.85rem)] md:w-[calc(25%-1.125rem)] lg:w-[calc(20%-1.2rem)] xl:w-[calc(16.666%-1.25rem)]"
            >
              <BrandLogo brand={brand} />
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
