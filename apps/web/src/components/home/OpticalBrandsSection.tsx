import Image from 'next/image';
import type { Locale } from '@/i18n/config';
import type { Translations } from '@/i18n';

type Props = {
  locale: Locale;
  t: Translations;
};

const OPTICAL_BRANDS = [
  "Puma", "Ray ban", "Police", "Nike", "Fila",
  "Calvin klein", "Gucci", "Vogue", "Tiffany & co", "Burberry",
  "Prada", "Emperio armani", "Armani exchange", "Celvin klein jeans", "Saint Lauren",
  "Lacoste", "Dunhill", "Miu Jim", "Oakley", "Tommy hilfiger",
  "Polo", "Hugo boss", "Dolce & Gabbana", "Bvlgari", "Michael kors",
  "Versace", "Chopard", "Swarovski", "Dkny"
];

export function OpticalBrandsSection({ locale, t }: Props) {
  return (
    <section className="bg-white py-12 md:py-16 border-t border-brand-dark/5">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-8">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-brand-dark mb-3">
            {locale === 'ar' ? 'العلامات التجارية للبصريات' : 'Our Optical Brands'}
          </h2>
          <p className="text-base md:text-lg text-brand-dark/60">
            {locale === 'ar' 
              ? 'اكتشف مجموعتنا المتميزة من النظارات الطبية والشمسية من أشهر العلامات التجارية العالمية.' 
              : 'Discover our premium selection of optical frames and sunglasses from world-renowned brands.'}
          </p>
        </div>



        {/* Brands List (Full Width Inline Text Layout with Dash Separators) */}
        <div className="w-full mx-auto text-center mt-8">
          <div className="text-sm md:text-base leading-[3] md:leading-[4] font-serif text-brand-dark/90 tracking-[0.15em] uppercase">
            {OPTICAL_BRANDS.map((brand, i) => {
              const isLast = i === OPTICAL_BRANDS.length - 1;

              return (
                <span key={i} className="inline-block whitespace-nowrap">
                  <span className="hover:text-brand-primary transition-colors duration-200 cursor-default">
                    {brand}
                  </span>
                  
                  {/* Dash separator */}
                  {!isLast && (
                    <span className="mx-3 md:mx-6 text-brand-dark/30 select-none font-light">
                      —
                    </span>
                  )}
                </span>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}
