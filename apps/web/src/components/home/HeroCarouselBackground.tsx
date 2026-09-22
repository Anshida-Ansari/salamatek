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
      <div className={`absolute inset-y-0 ${locale === 'ar' ? 'left-0' : 'right-0'} w-full md:w-[75%] lg:w-[65%]`}>
        {images.map((src, idx) => (
          <Image
            key={src}
            src={src}
            alt={`Hero image ${idx + 1}`}
            fill
            priority={idx === 0}
            sizes="(max-width: 768px) 100vw, 70vw"
            className={`object-cover object-center transition-opacity duration-1000 ease-in-out ${
              idx === currentIndex ? 'opacity-100' : 'opacity-0'
            }`}
          />
        ))}
      </div>

      {/* Gradient overlay: dark at bottom for stats legibility */}
      <div
        className="absolute inset-0 z-10 pointer-events-none"
        style={{
          background:
            'linear-gradient(to top, #151f23 0%, rgba(21,31,35,0.7) 15%, transparent 40%)',
        }}
        aria-hidden="true"
      />
      
      {/* Additional horizontal gradient for RTL/LTR text readability */}
      <div
        className="absolute inset-0 z-10 pointer-events-none"
        style={{
          background:
            locale === 'ar'
              ? 'linear-gradient(to left, #151f23 0%, #151f23 35%, rgba(21,31,35,0.8) 55%, transparent 100%)'
              : 'linear-gradient(to right, #151f23 0%, #151f23 35%, rgba(21,31,35,0.8) 55%, transparent 100%)',
        }}
        aria-hidden="true"
      />

      {/* Navigation arrows */}
      <div className="absolute top-1/2 -translate-y-1/2 z-20 flex justify-between w-full px-4 md:px-8 lg:px-12 pointer-events-none">
        <button
          onClick={goToPrev}
          className="pointer-events-auto bg-black/20 hover:bg-black/50 text-white/80 hover:text-white rounded-full p-3 backdrop-blur-sm transition-all focus:outline-none focus:ring-2 focus:ring-brand-light"
          aria-label="Previous slide"
        >
          <svg className="w-6 h-6 rtl:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        </button>
        <button
          onClick={goToNext}
          className="pointer-events-auto bg-black/20 hover:bg-black/50 text-white/80 hover:text-white rounded-full p-3 backdrop-blur-sm transition-all focus:outline-none focus:ring-2 focus:ring-brand-light"
          aria-label="Next slide"
        >
          <svg className="w-6 h-6 rtl:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
        </button>
      </div>

      {/* Indicators */}
      <div className={`absolute bottom-[30%] z-20 flex gap-3 pointer-events-none ${
        locale === 'ar' 
          ? 'left-0 right-0 justify-center lg:left-24 lg:right-auto lg:justify-start' 
          : 'left-0 right-0 justify-center lg:right-24 lg:left-auto lg:justify-end'
      }`}>
        {images.map((_, idx) => (
          <button
            key={idx}
            onClick={() => goToSlide(idx)}
            className={`pointer-events-auto w-2.5 h-2.5 rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-brand-light ${
              idx === currentIndex ? 'bg-brand-light scale-125' : 'bg-white/40 hover:bg-white/80'
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
