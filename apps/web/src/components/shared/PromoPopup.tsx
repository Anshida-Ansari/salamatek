"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { X, Users, Heart, ShieldCheck, ArrowRight } from "lucide-react";

export function PromoPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const isAr = pathname?.startsWith('/ar');

  // Open on initial mount
  useEffect(() => {
    setIsOpen(true);
  }, []);

  // Open when navigated to health-packages
  useEffect(() => {
    if (pathname?.includes('/health-packages')) {
      setIsOpen(true);
    }
  }, [pathname]);

  // Listen for custom open event (e.g. clicking Packages in navbar)
  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    window.addEventListener('open-promo-popup', handleOpen);
    return () => window.removeEventListener('open-promo-popup', handleOpen);
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
      <div className="relative w-full max-w-4xl bg-surface-mint rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row animate-slide-down">
        
        {/* Close Button */}
        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-4 end-4 z-20 p-2 bg-white/80 hover:bg-white text-gray-800 rounded-full transition-colors shadow-sm"
          aria-label={isAr ? "إغلاق" : "Close"}
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left Side: Content */}
        <div className="w-full md:w-[55%] p-8 md:p-12 flex flex-col justify-center relative z-10">
          
          {/* Logo */}
          <div className="mb-6 relative flex items-center justify-start">
            <Image
              src="/images/promo-horizontal-logo.png"
              alt="Salamatek Logo"
              width={220}
              height={80}
              className="object-contain mix-blend-multiply"
              priority
            />
          </div>

          <p className="text-brand-DEFAULT font-bold tracking-widest text-xs uppercase mb-3">
            {isAr ? "رعاية موثوقة منذ عام 1985" : "Trusted Care Since 1985"}
          </p>
          
          <h2 className="text-3xl md:text-5xl font-serif font-bold text-brand-dark mb-4 leading-tight">
            {isAr ? <>صحتكم،<br />أولويتنا</> : <>Your Health,<br />Our Priority</>}
          </h2>
          
          <p className="text-text-muted text-lg mb-8 max-w-sm">
            {isAr ? "تجربة رعاية صحية متميزة في مجمع سلامتك الطبي." : "Experience quality healthcare at Salamatek Medical Center."}
          </p>

          {/* Features Row */}
          <div className="flex flex-wrap gap-6 mb-8">
            <div className="flex flex-col items-center text-center max-w-[80px]">
              <div className="w-10 h-10 rounded-full bg-brand-pale/30 flex items-center justify-center mb-2 text-brand-DEFAULT">
                <Users className="w-5 h-5" />
              </div>
              <span className="text-xs font-semibold text-brand-dark">
                {isAr ? "أطباء متخصصون" : "Experienced Specialists"}
              </span>
            </div>
            <div className="flex flex-col items-center text-center max-w-[80px]">
              <div className="w-10 h-10 rounded-full bg-brand-pale/30 flex items-center justify-center mb-2 text-brand-DEFAULT">
                <Heart className="w-5 h-5" />
              </div>
              <span className="text-xs font-semibold text-brand-dark">
                {isAr ? "رعاية شاملة" : "Comprehensive Care"}
              </span>
            </div>
            <div className="flex flex-col items-center text-center max-w-[80px]">
              <div className="w-10 h-10 rounded-full bg-brand-pale/30 flex items-center justify-center mb-2 text-brand-DEFAULT">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <span className="text-xs font-semibold text-brand-dark">
                {isAr ? "ثقة عبر الأجيال" : "Trusted by Generations"}
              </span>
            </div>
          </div>
          
          <Link 
            href={isAr ? "https://salamatekonline.com/ar/" : "https://salamatekonline.com/en/"} 
            target="_blank" 
            rel="noopener noreferrer"
            onClick={() => setIsOpen(false)}
            className="inline-flex items-center justify-center w-full sm:w-auto px-8 py-3.5 bg-brand-red hover:bg-brand-red-dark text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5 group"
          >
            {isAr ? "شراء الباقة" : "Package Purchase"}
            <ArrowRight className="ms-2 w-5 h-5 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 rtl:rotate-180 transition-transform" />
          </Link>
          
          <p className="mt-4 text-xs text-text-subtle text-center sm:text-left rtl:sm:text-right">
            salamatekonline.com
          </p>
        </div>

        {/* Right Side: Image */}
        <div className="hidden md:block w-full md:w-[45%] relative min-h-[300px]">
          {/* Curve Mask Effect using standard CSS or simple absolute positioning */}
          <div className="absolute inset-0 bg-brand-DEFAULT">
            <Image
              src="/promo-bg.jpg"
              alt="Salamatek Medical Center Background"
              fill
              className="object-cover rounded-l-3xl rtl:rounded-r-3xl rtl:rounded-l-none shadow-[-10px_0_30px_rgba(0,0,0,0.1)]"
              priority
            />
            {/* Optional overlay gradient for the image */}
            <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/40 to-transparent rounded-l-3xl rtl:rounded-r-3xl rtl:rounded-l-none"></div>
            
            <div className="absolute bottom-6 end-6 text-white text-end">
              <p className="font-serif italic text-2xl drop-shadow-md">
                {isAr ? "رعاية تلامس قلوبكم" : "Care that feels personal"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
