'use client';

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
  { name: "Nike", image: "nike.jpg" },
  { name: "Fila", image: "fila.png" },
  { name: "Calvin klein", image: "calvin-klein.png" },
  { name: "Gucci", image: "gucci.png" },
  { name: "Vogue", image: "Vogue.png" },
  { name: "Tiffany & co", image: "tiffany.jpg" },
  { name: "Burberry", image: "burberry.jpg" },
  { name: "Prada", image: "prada.png" },
  { name: "Emperio armani", image: "emprorio.png" },
  { name: "Armani exchange", image: "armani.png" },
  { name: "Saint Lauren", image: "saint-laurent.png" },
  { name: "Lacoste", image: "Lacoste.jpg" },
  { name: "Dunhill", image: "Dunhill.png" },
  { name: "Miu Jim", image: "mauijim.webp" },
  { name: "Oakley", image: "Oakley.png" },
  { name: "Tommy hilfiger", image: "Tommy-hilfiger.jpg" },
  { name: "Polo", image: "Polo.jpg" },
  { name: "Hugo boss", image: "Hugo-Boss.png" },
  { name: "Dolce & Gabbana", image: "dolce-gabbana.jpg" },
  { name: "Bvlgari", image: "Bvlgari.webp" },
  { name: "Michael kors", image: "michael-kors.png" },
  { name: "Versace", image: "Versace.jpg" },
  { name: "Chopard", image: "Chopard.jpg" },
  { name: "Swarovski", image: "Swarovski.jpg" },
  { name: "Dkny", image: "Dkny.jpg" }
];

function BrandLogo({ brand }: { brand: { name: string; image: string } }) {
  const logoUrl = `/images/opticals/${brand.image}`;

  return (
    <div className="relative w-full h-20 md:h-24 flex items-center justify-center transition-all duration-300 group overflow-hidden">
      <Image
        src={logoUrl}
        alt={`${brand.name} Logo`}
        fill
        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
        className="object-contain p-2 md:p-4 transition-transform duration-500 ease-out group-hover:scale-[1.05] mix-blend-multiply"
      />
    </div>
  );
}

export function OpticalBrandsSection({ locale }: Props) {
  return (
    <section className="bg-[#F8FAF9] py-16 md:py-24 border-t border-brand-dark/5">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-brand-dark mb-4">
            {locale === 'ar' ? 'العلامات التجارية للبصريات' : 'Our Optical Brands'}
          </h2>
          <p className="text-base md:text-lg text-text-muted leading-relaxed max-w-2xl mx-auto">
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
        <div className="flex flex-wrap justify-center gap-4 sm:gap-5 md:gap-6">
          {OPTICAL_BRANDS.map((brand, idx) => (
            <div 
              key={idx} 
              className="w-[calc(50%-0.5rem)] sm:w-[calc(33.333%-0.85rem)] md:w-[calc(25%-1.125rem)] lg:w-[calc(20%-1.2rem)] xl:w-[calc(16.666%-1.25rem)]"
            >
              <BrandLogo brand={brand} />
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
