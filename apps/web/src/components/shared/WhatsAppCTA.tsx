'use client';

import { MessageCircle } from 'lucide-react';
import { contactConfig } from '@/config/contact';
import { usePathname } from 'next/navigation';

interface WhatsAppCTAProps {
  className?: string;
  variant?: 'floating' | 'inline' | 'icon';
  text?: string;
}

export function WhatsAppCTA({ className = '', variant = 'floating', text }: WhatsAppCTAProps) {
  const pathname = usePathname();
  const isRtl = pathname.startsWith('/ar');

  const defaultText = text || (isRtl ? 'تواصل عبر واتساب' : 'Chat on WhatsApp');
  
  // Clean number for the wa.me link
  const waUrl = `https://wa.me/${contactConfig.whatsappNumber}`;

  if (variant === 'inline') {
    return (
      <a
        href={waUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={`inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#25D366] hover:bg-[#128C7E] text-white font-bold rounded-lg transition-colors shadow-sm ${className}`}
      >
        <MessageCircle className="w-5 h-5" />
        {defaultText}
      </a>
    );
  }

  if (variant === 'icon') {
    return (
      <a
        href={waUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={`inline-flex items-center justify-center w-10 h-10 rounded-full bg-[#25D366] hover:bg-[#128C7E] text-white transition-colors ${className}`}
        aria-label={defaultText}
      >
        <MessageCircle className="w-5 h-5" />
      </a>
    );
  }

  // Floating variant
  return (
    <a
      href={waUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={`fixed bottom-6 ${isRtl ? 'left-6' : 'right-6'} z-50 flex items-center justify-center w-14 h-14 bg-[#25D366] text-white rounded-full shadow-lg hover:scale-110 hover:shadow-xl hover:bg-[#128C7E] transition-all duration-300 group ${className}`}
      aria-label={defaultText}
    >
      <MessageCircle className="w-7 h-7" />
      
      {/* Tooltip */}
      <span className={`absolute ${isRtl ? 'left-full ml-4' : 'right-full mr-4'} px-3 py-1.5 bg-gray-900 text-white text-sm font-medium rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap`}>
        {defaultText}
      </span>
    </a>
  );
}
