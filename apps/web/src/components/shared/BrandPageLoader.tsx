'use client';

import Image from 'next/image';

interface Props {
  text?: string;
  isRtl?: boolean;
}

export function BrandPageLoader({ text, isRtl = false }: Props) {
  return (
    <div
      className="min-h-[70vh] flex flex-col items-center justify-center p-6 bg-[#F8FAF9]"
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      <div className="relative flex items-center justify-center mb-6">
        {/* Animated outer spinning ring */}
        <div className="w-24 h-24 rounded-full border-3 border-brand-light/30 border-t-brand animate-spin" />
        
        {/* Inner pulsing logo container */}
        <div className="absolute w-16 h-16 bg-white rounded-2xl shadow-card border border-border flex items-center justify-center p-2.5 animate-pulse">
          <Image
            src="/icon.png"
            alt="Salamatek"
            width={40}
            height={40}
            className="w-10 h-10 object-contain"
            priority
          />
        </div>
      </div>

      <div className="text-center space-y-1.5">
        <h3 className="text-base font-serif font-bold text-brand-dark tracking-wide">
          {isRtl ? 'مركز سلامتك الطبي' : 'Salamatek Medical Centre'}
        </h3>
        <p className="text-xs font-medium text-text-muted animate-pulse">
          {text || (isRtl ? 'جاري التحميل...' : 'Loading…')}
        </p>
      </div>
    </div>
  );
}
