'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';

type Props = {
  images: string[];
  locale: string;
};

export default function HeroCarouselBackground({ images, locale }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (isHovered) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [images.length, isHovered]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  }, [images.length]);

  const goToPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  }, [images.length]);

  if (!images?.length) return null;

  return (
    <div 
      className="absolute inset-0 z-0 bg-[#151f23] overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="absolute inset-0">
        {images.map((src, idx) => (
          <Image
            key={src}
            src={src}
            alt={`Hero image ${idx + 1}`}
            fill
            priority={idx === 0}
            sizes="100vw"
            quality={90}
            style={{ objectPosition: locale === 'ar' ? '25% center' : '75% center' }}
            className={`object-cover transition-opacity duration-1000 ease-in-out ${
              idx === currentIndex ? 'opacity-100' : 'opacity-0'
            }`}
          />
        ))}
      </div>

      {/* 10% flat black tint */}
      <div className="absolute inset-0 z-10 pointer-events-none bg-black/10" aria-hidden="true" />

      {/* Directional gradient overlay */}
      <div
        className="absolute inset-0 z-10 pointer-events-none"
        style={{
          background: locale === 'ar'
            ? 'linear-gradient(to left, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.55) 40%, transparent 70%)'
            : 'linear-gradient(to right, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.55) 40%, transparent 70%)',
        }}
        aria-hidden="true"
      />

      {/* Bottom gradient */}
      <div
        className="absolute bottom-0 left-0 right-0 h-[220px] z-10 pointer-events-none"
        style={{
          background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 100%)',
        }}
        aria-hidden="true"
      />

      {/* Navigation arrows */}
      <div className="absolute top-1/2 -translate-y-1/2 z-20 flex justify-between w-full px-4 md:px-8 lg:px-12 pointer-events-none">
        <button
          onClick={goToPrev}
          className="pointer-events-auto bg-black/40 hover:bg-black/60 text-white border border-white/30 rounded-full p-3 backdrop-blur-sm transition-all focus:outline-none focus:ring-2 focus:ring-brand-light"
          aria-label="Previous slide"
        >
          <svg className="w-6 h-6 rtl:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        </button>
        <button
          onClick={goToNext}
          className="pointer-events-auto bg-black/40 hover:bg-black/60 text-white border border-white/30 rounded-full p-3 backdrop-blur-sm transition-all focus:outline-none focus:ring-2 focus:ring-brand-light"
          aria-label="Next slide"
        >
          <svg className="w-6 h-6 rtl:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
        </button>
      </div>

      {/* Indicators */}
      <div className={`absolute bottom-[30%] right-0 left-0 z-20 flex justify-center gap-3 pointer-events-none ${
        locale === 'ar' 
          ? 'lg:left-24 lg:right-auto lg:justify-start' 
          : 'lg:right-24 lg:left-auto lg:justify-end'
      }`}>
        {images.map((_, idx) => (
          <button
            key={idx}
            onClick={() => goToSlide(idx)}
            className={`pointer-events-auto w-3 h-3 rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-brand-light ${
              idx === currentIndex 
                ? 'bg-[#6EE7A8] scale-125' 
                : 'bg-white/60 border border-black/50 hover:bg-white/80'
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
