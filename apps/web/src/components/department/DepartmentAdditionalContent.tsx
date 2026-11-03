import Image from 'next/image';
import type { Locale } from '@/i18n/config';

export interface ContentBlockImage {
  url: string;
  caption?: {
    en?: string;
    ar?: string;
  };
}

export interface ContentBlockItem {
  en?: string;
  ar?: string;
}

export interface ContentBlock {
  id?: string;
  type: 'heading_text' | 'bullet_points' | 'image_gallery' | 'text_images';
  heading?: {
    en?: string;
    ar?: string;
  };
  description?: {
    en?: string;
    ar?: string;
  };
  items?: ContentBlockItem[];
  images?: ContentBlockImage[];
  order?: number;
}

interface Props {
  blocks: ContentBlock[];
  locale: Locale;
}

export function DepartmentAdditionalContent({ blocks, locale }: Props) {
  if (!blocks || blocks.length === 0) return null;

  const isAr = locale === 'ar';

  // Sort blocks by order
  const sortedBlocks = [...blocks].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  // Count side-by-side sections to alternate left/right placement
  let sideBySideCount = 0;

  return (
    <div className="space-y-16 lg:space-y-20 border-t border-border/50 pt-14 lg:pt-16">
      {sortedBlocks.map((block, idx) => {
        const heading = (isAr ? block.heading?.ar : block.heading?.en) || block.heading?.en || block.heading?.ar || '';
        const desc = (isAr ? block.description?.ar : block.description?.en) || block.description?.en || block.description?.ar || '';
        const items = (block.items || [])
          .map((it) => (isAr ? it.ar : it.en) || it.en || it.ar || '')
          .filter(Boolean);
        const images = (block.images || []).filter((img) => Boolean(img?.url));

        // Skip completely empty block
        if (!heading && !desc && items.length === 0 && images.length === 0) {
          return null;
        }

        /* ─────────────────────────────────────────────────────────────────
         * 1. Content Type A: Heading + Text
         * Clean, editorial healthcare presentation without heavy box wrappers.
         * ───────────────────────────────────────────────────────────────── */
        if (block.type === 'heading_text') {
          return (
            <section
              key={block.id || idx}
              className="space-y-4 max-w-4xl"
              aria-label={heading || `Section ${idx + 1}`}
            >
              {heading && (
                <h3 className="text-xl sm:text-2xl md:text-[26px] font-serif font-bold text-brand-dark tracking-tight leading-snug">
                  {heading}
                </h3>
              )}
              {desc && (
                <div className="text-base sm:text-lg text-text-muted leading-relaxed whitespace-pre-line font-normal">
                  {desc}
                </div>
              )}
            </section>
          );
        }

        /* ─────────────────────────────────────────────────────────────────
         * 2. Content Type B: Bullet Points
         * Clean subsection heading with vertical line-by-line list.
         * Consistent bullet styling, generous vertical spacing, clean wrap.
         * If an image is also attached, displays alongside in balanced grid.
         * ───────────────────────────────────────────────────────────────── */
        if (block.type === 'bullet_points') {
          // If an image is attached to the bullet points section
          if (images.length > 0) {
            const isReversed = sideBySideCount % 2 === 1;
            sideBySideCount++;
            const singleImg = images[0];
            const caption = (isAr ? singleImg.caption?.ar : singleImg.caption?.en) || singleImg.caption?.en || singleImg.caption?.ar || '';

            return (
              <section
                key={block.id || idx}
                className="space-y-6"
                aria-label={heading || `Section ${idx + 1}`}
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
                  {/* Points Column */}
                  <div
                    className={`space-y-4 lg:col-span-7 ${
                      isReversed ? 'lg:order-2' : 'lg:order-1'
                    }`}
                  >
                    {heading && (
                      <h3 className="text-xl sm:text-2xl md:text-[26px] font-serif font-bold text-brand-dark tracking-tight leading-snug">
                        {heading}
                      </h3>
                    )}
                    {items.length > 0 && (
                      <ul className="space-y-3.5 sm:space-y-4 pt-1">
                        {items.map((item, itemIdx) => (
                          <li
                            key={itemIdx}
                            className="flex items-start gap-3.5 sm:gap-4 text-base sm:text-lg text-gray-700 leading-relaxed font-normal"
                          >
                            <span
                              className="inline-block w-2 h-2 rounded-full bg-brand shrink-0 mt-2.5"
                              aria-hidden="true"
                            />
                            <span className="flex-1 leading-relaxed">{item}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  {/* Image Column */}
                  <div
                    className={`lg:col-span-5 ${
                      isReversed ? 'lg:order-1' : 'lg:order-2'
                    }`}
                  >
                    <figure className="relative rounded-2xl overflow-hidden bg-white border border-border/70 shadow-sm max-w-md w-full mx-auto lg:mx-0 group">
                      <div className="relative aspect-[4/3] bg-surface-light overflow-hidden">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={singleImg.url}
                          alt={caption || heading || 'Department Feature'}
                          className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500 ease-out"
                          loading="lazy"
                        />
                      </div>
                      {caption && (
                        <figcaption className="p-3.5 sm:p-4 bg-white border-t border-border/40 text-xs sm:text-sm text-text-muted font-medium leading-snug">
                          {caption}
                        </figcaption>
                      )}
                    </figure>
                  </div>
                </div>
              </section>
            );
          }

          // Pure vertical bullet points without image
          return (
            <section
              key={block.id || idx}
              className="space-y-5 max-w-4xl"
              aria-label={heading || `Section ${idx + 1}`}
            >
              {heading && (
                <h3 className="text-xl sm:text-2xl md:text-[26px] font-serif font-bold text-brand-dark tracking-tight leading-snug">
                  {heading}
                </h3>
              )}
              {items.length > 0 && (
                <ul className="space-y-3.5 sm:space-y-4 pt-1">
                  {items.map((item, itemIdx) => (
                    <li
                      key={itemIdx}
                      className="flex items-start gap-3.5 sm:gap-4 text-base sm:text-lg text-gray-700 leading-relaxed font-normal"
                    >
                      <span
                        className="inline-block w-2 h-2 rounded-full bg-brand shrink-0 mt-2.5"
                        aria-hidden="true"
                      />
                      <span className="flex-1 leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          );
        }

        /* ─────────────────────────────────────────────────────────────────
         * 3. Content Type C: Image Gallery
         * Clean subsection heading with balanced, responsive image grid.
         * Proportional aspect ratio with subtle captions.
         * ───────────────────────────────────────────────────────────────── */
        if (block.type === 'image_gallery') {
          return (
            <section
              key={block.id || idx}
              className="space-y-6"
              aria-label={heading || `Section ${idx + 1}`}
            >
              {heading && (
                <h3 className="text-xl sm:text-2xl md:text-[26px] font-serif font-bold text-brand-dark tracking-tight leading-snug">
                  {heading}
                </h3>
              )}
              {images.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 pt-1">
                  {images.map((img, imgIdx) => {
                    const caption = (isAr ? img.caption?.ar : img.caption?.en) || img.caption?.en || img.caption?.ar || '';
                    return (
                      <figure
                        key={imgIdx}
                        className="group overflow-hidden rounded-2xl bg-white border border-border/70 shadow-xs hover:border-brand-pale hover:shadow-card transition-all duration-300 flex flex-col"
                      >
                        <div className="relative aspect-[4/3] bg-surface-light overflow-hidden">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={img.url}
                            alt={caption || `${heading} - ${imgIdx + 1}`}
                            className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500 ease-out"
                            loading="lazy"
                          />
                        </div>
                        {caption && (
                          <figcaption className="p-4 bg-white border-t border-border/40 text-xs sm:text-sm text-text-muted font-medium leading-snug">
                            {caption}
                          </figcaption>
                        )}
                      </figure>
                    );
                  })}
                </div>
              )}
            </section>
          );
        }

        /* ─────────────────────────────────────────────────────────────────
         * 4. Content Type D: Text + Images
         * Side-by-side balanced layout (text alongside image on desktop).
         * Alternates left/right placement for visual variety.
         * Neatly stacks on mobile devices without overflow.
         * ───────────────────────────────────────────────────────────────── */
        if (block.type === 'text_images') {
          const isReversed = sideBySideCount % 2 === 1;
          sideBySideCount++;

          // If no images, render as clean text
          if (images.length === 0) {
            return (
              <section
                key={block.id || idx}
                className="space-y-4 max-w-4xl"
                aria-label={heading || `Section ${idx + 1}`}
              >
                {heading && (
                  <h3 className="text-xl sm:text-2xl md:text-[26px] font-serif font-bold text-brand-dark tracking-tight leading-snug">
                    {heading}
                  </h3>
                )}
                {desc && (
                  <div className="text-base sm:text-lg text-text-muted leading-relaxed whitespace-pre-line font-normal">
                    {desc}
                  </div>
                )}
              </section>
            );
          }

          // Single image side-by-side layout
          if (images.length === 1) {
            const singleImg = images[0];
            const caption = (isAr ? singleImg.caption?.ar : singleImg.caption?.en) || singleImg.caption?.en || singleImg.caption?.ar || '';

            return (
              <section
                key={block.id || idx}
                className="space-y-6"
                aria-label={heading || `Section ${idx + 1}`}
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                  {/* Text Column */}
                  <div
                    className={`space-y-4 lg:col-span-7 ${
                      isReversed ? 'lg:order-2' : 'lg:order-1'
                    }`}
                  >
                    {heading && (
                      <h3 className="text-xl sm:text-2xl md:text-[26px] font-serif font-bold text-brand-dark tracking-tight leading-snug">
                        {heading}
                      </h3>
                    )}
                    {desc && (
                      <div className="text-base sm:text-lg text-text-muted leading-relaxed whitespace-pre-line font-normal">
                        {desc}
                      </div>
                    )}
                  </div>

                  {/* Image Column */}
                  <div
                    className={`lg:col-span-5 ${
                      isReversed ? 'lg:order-1' : 'lg:order-2'
                    }`}
                  >
                    <figure className="relative rounded-2xl overflow-hidden bg-white border border-border/70 shadow-sm max-w-md w-full mx-auto lg:mx-0 group">
                      <div className="relative aspect-[4/3] bg-surface-light overflow-hidden">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={singleImg.url}
                          alt={caption || heading || 'Department Feature'}
                          className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500 ease-out"
                          loading="lazy"
                        />
                      </div>
                      {caption && (
                        <figcaption className="p-3.5 sm:p-4 bg-white border-t border-border/40 text-xs sm:text-sm text-text-muted font-medium leading-snug">
                          {caption}
                        </figcaption>
                      )}
                    </figure>
                  </div>
                </div>
              </section>
            );
          }

          // Multiple images alongside text layout
          return (
            <section
              key={block.id || idx}
              className="space-y-6"
              aria-label={heading || `Section ${idx + 1}`}
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
                {/* Text Column */}
                <div
                  className={`space-y-4 lg:col-span-6 ${
                    isReversed ? 'lg:order-2' : 'lg:order-1'
                  }`}
                >
                  {heading && (
                    <h3 className="text-xl sm:text-2xl md:text-[26px] font-serif font-bold text-brand-dark tracking-tight leading-snug">
                      {heading}
                    </h3>
                  )}
                  {desc && (
                    <div className="text-base sm:text-lg text-text-muted leading-relaxed whitespace-pre-line font-normal">
                      {desc}
                    </div>
                  )}
                </div>

                {/* Multiple Images Column */}
                <div
                  className={`lg:col-span-6 ${
                    isReversed ? 'lg:order-1' : 'lg:order-2'
                  }`}
                >
                  <div className={`grid gap-4 ${images.length === 2 ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1 sm:grid-cols-2'}`}>
                    {images.map((img, imgIdx) => {
                      const caption = (isAr ? img.caption?.ar : img.caption?.en) || img.caption?.en || img.caption?.ar || '';
                      return (
                        <figure
                          key={imgIdx}
                          className="group overflow-hidden rounded-2xl bg-white border border-border/70 shadow-xs hover:border-brand-pale transition-all flex flex-col"
                        >
                          <div className="relative aspect-[4/3] bg-surface-light overflow-hidden">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={img.url}
                              alt={caption || `${heading} - ${imgIdx + 1}`}
                              className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500 ease-out"
                              loading="lazy"
                            />
                          </div>
                          {caption && (
                            <figcaption className="p-3 bg-white border-t border-border/40 text-xs text-text-muted font-medium leading-snug">
                              {caption}
                            </figcaption>
                          )}
                        </figure>
                      );
                    })}
                  </div>
                </div>
              </div>
            </section>
          );
        }

        return null;
      })}
    </div>
  );
}
