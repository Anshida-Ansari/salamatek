"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { X, Users, Heart, ShieldCheck, ArrowRight } from "lucide-react";

export function PromoPopup() {
  const [isOpen, setIsOpen] = useState(false);

  // Use useEffect to prevent hydration mismatch since we are rendering a modal
  useEffect(() => {
    // The user requested the modal to appear every time someone checks the website.
    // So we don't check sessionStorage/localStorage. We just open it on mount.
    setIsOpen(true);
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
      <div className="relative w-full max-w-4xl bg-surface-mint rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row animate-slide-down">
        
        {/* Close Button */}
        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-4 right-4 z-20 p-2 bg-white/80 hover:bg-white text-gray-800 rounded-full transition-colors shadow-sm"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left Side: Content */}
        <div className="w-full md:w-[55%] p-8 md:p-12 flex flex-col justify-center relative z-10">
          
          {/* Logo */}
          <div className="mb-6 relative w-24 h-24 md:w-32 md:h-32 bg-white rounded-2xl shadow-sm flex items-center justify-center p-3">
            <Image
              src="/promo-logo.png"
              alt="Salamatek Logo"
              width={100}
              height={100}
              className="object-contain"
              priority
            />
          </div>

          <p className="text-brand-DEFAULT font-bold tracking-widest text-xs uppercase mb-3">
            Trusted Care Since 1985
          </p>
          
          <h2 className="text-3xl md:text-5xl font-serif font-bold text-brand-dark mb-4 leading-tight">
            Your Health,<br />Our Priority
          </h2>
          
          <p className="text-text-muted text-lg mb-8 max-w-sm">
            Experience quality healthcare at Salamatek Medical Center.
          </p>

          {/* Features Row */}
          <div className="flex flex-wrap gap-6 mb-8">
            <div className="flex flex-col items-center text-center max-w-[80px]">
              <div className="w-10 h-10 rounded-full bg-brand-pale/30 flex items-center justify-center mb-2 text-brand-DEFAULT">
                <Users className="w-5 h-5" />
              </div>
              <span className="text-xs font-semibold text-brand-dark">Experienced Specialists</span>
            </div>
            <div className="flex flex-col items-center text-center max-w-[80px]">
              <div className="w-10 h-10 rounded-full bg-brand-pale/30 flex items-center justify-center mb-2 text-brand-DEFAULT">
                <Heart className="w-5 h-5" />
              </div>
              <span className="text-xs font-semibold text-brand-dark">Comprehensive Care</span>
            </div>
            <div className="flex flex-col items-center text-center max-w-[80px]">
              <div className="w-10 h-10 rounded-full bg-brand-pale/30 flex items-center justify-center mb-2 text-brand-DEFAULT">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <span className="text-xs font-semibold text-brand-dark">Trusted by Generations</span>
            </div>
          </div>
          
          <Link 
            href="https://salamatekonline.com/en/" 
            target="_blank" 
            rel="noopener noreferrer"
            onClick={() => setIsOpen(false)}
            className="inline-flex items-center justify-center w-full sm:w-auto px-8 py-3.5 bg-brand-red hover:bg-brand-red-dark text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5 group"
          >
            Visit Salamatek Online
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          
          <p className="mt-4 text-xs text-text-subtle text-center sm:text-left">
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
              className="object-cover rounded-l-3xl shadow-[-10px_0_30px_rgba(0,0,0,0.1)]"
              priority
            />
            {/* Optional overlay gradient for the image */}
            <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/40 to-transparent rounded-l-3xl"></div>
            
            <div className="absolute bottom-6 right-6 text-white text-right">
              <p className="font-serif italic text-2xl drop-shadow-md">Care that feels personal</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
