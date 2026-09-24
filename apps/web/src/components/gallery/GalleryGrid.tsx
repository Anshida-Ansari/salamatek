'use client';

import { useState } from 'react';
import Image from 'next/image';
import { X, ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';

interface GalleryImage {
  _id: string;
  imageUrl: string;
  title?: { en: string; ar: string };
  description?: { en: string; ar: string };
}

interface GalleryGridProps {
  images: GalleryImage[];
  isAr: boolean;
}

export function GalleryGrid({ images, isAr }: GalleryGridProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  if (!images || images.length === 0) {
    return (
      <div className="py-24 text-center">
        <h3 className="text-xl font-semibold text-brand-dark mb-2">
          {isAr ? 'المعرض قريباً' : 'Gallery coming soon'}
        </h3>
        <p className="text-text-muted">
          {isAr
            ? 'نحن نقوم بتحديث معرض الصور الخاص بنا. يرجى التحقق مرة أخرى قريباً.'
            : 'We are currently updating our photo gallery. Please check back soon.'}
        </p>
      </div>
    );
  }

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedIndex !== null) {
      setSelectedIndex((selectedIndex + 1) % images.length);
    }
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedIndex !== null) {
      setSelectedIndex((selectedIndex - 1 + images.length) % images.length);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') setSelectedIndex(null);
    if (e.key === 'ArrowRight') handleNext(e as any);
    if (e.key === 'ArrowLeft') handlePrev(e as any);
  };

  return (
    <>
      {/* Masonry / Grid Layout */}
      <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {images.map((img, idx) => {
          const title = isAr ? img.title?.ar : img.title?.en;
          
          return (
            <div
              key={img._id}
              className="relative group overflow-hidden rounded-2xl cursor-pointer break-inside-avoid bg-gray-100"
              onClick={() => setSelectedIndex(idx)}
            >
              <div className="relative w-full overflow-hidden" style={{ minHeight: '200px' }}>
                <Image
                  src={img.imageUrl}
                  alt={title || 'Gallery Image'}
                  width={800}
                  height={600}
                  className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
              </div>
              
              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/90 via-brand-dark/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                <ZoomIn className="w-8 h-8 text-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 delay-100 scale-50 group-hover:scale-100" />
                {title && (
                  <h3 className="text-white font-semibold text-lg translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    {title}
                  </h3>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Lightbox Viewer */}
      {selectedIndex !== null && (
        <div 
          className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center"
          onClick={() => setSelectedIndex(null)}
          onKeyDown={handleKeyDown}
          tabIndex={0}
          autoFocus
        >
          {/* Close button */}
          <button 
            className="absolute top-6 right-6 p-2 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition-colors z-50"
            onClick={(e) => { e.stopPropagation(); setSelectedIndex(null); }}
          >
            <X className="w-6 h-6" />
          </button>

          {/* Navigation */}
          {images.length > 1 && (
            <>
              <button 
                className="absolute left-4 p-3 text-white/70 hover:text-white bg-black/50 hover:bg-black/80 rounded-full transition-colors z-50"
                onClick={handlePrev}
              >
                <ChevronLeft className="w-8 h-8" />
              </button>
              <button 
                className="absolute right-4 p-3 text-white/70 hover:text-white bg-black/50 hover:bg-black/80 rounded-full transition-colors z-50"
                onClick={handleNext}
              >
                <ChevronRight className="w-8 h-8" />
              </button>
            </>
          )}

          {/* Current Image */}
          <div className="relative w-full h-full max-w-6xl max-h-[90vh] mx-auto p-4 md:p-12 flex flex-col items-center justify-center" onClick={(e) => e.stopPropagation()}>
            <div className="relative w-full h-full flex items-center justify-center">
              <Image
                src={images[selectedIndex].imageUrl}
                alt={(isAr ? images[selectedIndex].title?.ar : images[selectedIndex].title?.en) || 'Gallery Image'}
                fill
                className="object-contain"
                quality={100}
                priority
              />
            </div>
            {(images[selectedIndex].title?.en || images[selectedIndex].title?.ar || images[selectedIndex].description?.en || images[selectedIndex].description?.ar) && (
              <div className="absolute bottom-0 inset-x-0 p-6 bg-gradient-to-t from-black/90 to-transparent text-center">
                <h3 className="text-white text-xl font-medium mb-2">
                  {isAr ? images[selectedIndex].title?.ar : images[selectedIndex].title?.en}
                </h3>
                <p className="text-white/80 max-w-2xl mx-auto">
                  {isAr ? images[selectedIndex].description?.ar : images[selectedIndex].description?.en}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
