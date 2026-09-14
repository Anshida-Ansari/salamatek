"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { X } from "lucide-react";

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
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-300">
      <div className="relative w-full max-w-md md:max-w-lg lg:max-w-xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-300">
        
        {/* Close Button */}
        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-4 right-4 z-10 p-2 bg-white/80 hover:bg-white text-gray-800 rounded-full transition-colors shadow-sm"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Top Image / Logo Area */}
        <div className="relative w-full h-48 sm:h-56">
          <Image
            src="/promo-bg.jpg"
            alt="Salamatek Medical Center Background"
            fill
            className="object-cover"
            priority
          />
          {/* Gradient overlay to ensure text/logo readability if needed */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/90 to-transparent"></div>
          
          <div className="absolute inset-0 flex items-center justify-center pt-4">
            <div className="relative w-32 h-32 bg-white/90 p-4 rounded-full shadow-lg flex items-center justify-center">
              <Image
                src="/promo-logo.png"
                alt="Salamatek Logo"
                width={100}
                height={100}
                className="object-contain"
                priority
              />
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-6 sm:p-8 text-center bg-white">
          <h2 className="text-2xl sm:text-3xl font-bold text-teal-800 mb-3 font-sans">
            Your Health, Our Priority
          </h2>
          <p className="text-gray-600 text-lg mb-8">
            Experience quality healthcare at Salamatek Medical Center.
          </p>
          
          <Link 
            href="https://salamatekonline.com/en/" 
            target="_blank" 
            rel="noopener noreferrer"
            onClick={() => setIsOpen(false)}
            className="inline-block w-full sm:w-auto px-8 py-3.5 bg-teal-700 hover:bg-teal-800 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5"
          >
            Visit Website
          </Link>
        </div>
      </div>
    </div>
  );
}
