import { contactConfig } from '@/config/contact';

interface WhatsAppCTAProps {
  className?: string;
  variant?: 'floating' | 'inline' | 'icon';
  text?: string;
  locale?: string;
  isRtl?: boolean;
}

function WhatsAppIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
      <path d="M12 0C5.373 0 0 5.373 0 12c0 2.116.554 4.103 1.524 5.827L0 24l6.341-1.499A11.947 11.947 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.817 9.817 0 01-5.003-1.366l-.359-.213-3.764.89.952-3.664-.234-.376A9.787 9.787 0 012.182 12C2.182 6.573 6.573 2.182 12 2.182c5.428 0 9.818 4.391 9.818 9.818 0 5.428-4.39 9.818-9.818 9.818z"/>
    </svg>
  );
}

function InstagramIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.772 1.153c-.636-.247-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
    </svg>
  );
}

function SnapchatIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 2.25c-3.6 0-5.75 2.5-5.75 5.8 0 .85.18 1.7.42 2.38-.63.2-1.63.6-1.87 1.52-.15.57.13 1.1.68 1.31.1.04.23.07.37.09-.16.37-.44.86-.94 1.15-.56.31-1.01.26-1.25.67-.18.3-.05.68.3 1.03.59.57 1.41.74 2.3.82.24.02.45.15.56.36.3.61.77 1.16 1.79 1.3.49.07 1.12-.05 1.74-.24.42-.13.86-.13 1.28 0 .61.19 1.24.31 1.73.24 1.02-.14 1.49-.69 1.79-1.3.11-.21.32-.34.56-.36.89-.08 1.71-.25 2.3-.82.35-.35.48-.73.3-1.03-.24-.41-.69-.36-1.25-.67-.5-.29-.78-.78-.94-1.15.14-.02.27-.05.37-.09.55-.21.83-.74.68-1.31-.24-.92-1.24-1.32-1.87-1.52.24-.68.42-1.53.42-2.38 0-3.3-2.15-5.8-5.75-5.8z" />
    </svg>
  );
}

export function WhatsAppCTA({ className = '', variant = 'floating', text, locale, isRtl: isRtlProp }: WhatsAppCTAProps) {
  const isRtl = isRtlProp ?? (locale === 'ar');
  const waUrl = `https://wa.me/${contactConfig.whatsappNumber}`;
  const defaultWaText = text || (isRtl ? 'تواصل عبر واتساب' : 'Chat on WhatsApp');

  if (variant === 'inline') {
    return (
      <a
        href={waUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={`inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#25D366] hover:bg-[#1ebe5c] text-white font-bold rounded-lg transition-colors shadow-sm${className ? ` ${className}` : ''}`}
      >
        <WhatsAppIcon className="w-5 h-5" />
        {defaultWaText}
      </a>
    );
  }

  if (variant === 'icon') {
    return (
      <a
        href={waUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={`inline-flex items-center justify-center w-10 h-10 rounded-full bg-[#25D366] hover:bg-[#1ebe5c] text-white transition-colors${className ? ` ${className}` : ''}`}
        aria-label={defaultWaText}
      >
        <WhatsAppIcon className="w-5 h-5" />
      </a>
    );
  }

  // Floating variant: Vertical stack with WhatsApp (1st), Instagram (2nd), and Snapchat (3rd)
  // Floating variant: Vertical stack with WhatsApp (1st), Instagram (2nd), and Snapchat (3rd)
  // Positioned at right-center (vertically centered on the right edge of the screen)
  return (
    <aside
      aria-label={isRtl ? 'قنوات التواصل المباشر السريعة' : 'Quick Social & Messaging Channels'}
      className={`fixed top-1/2 -translate-y-1/2 right-4 sm:right-5 z-50 flex flex-col items-center gap-2.5${className ? ` ${className}` : ''}`}
    >
      {/* 1. WhatsApp Floating Button */}
      <a
        href={waUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="relative group flex items-center justify-center w-[46px] h-[46px] rounded-full bg-[#25D366] text-white shadow-md hover:scale-105 hover:shadow-lg hover:bg-[#1ebe5c] transition-all duration-200 shrink-0"
        aria-label={defaultWaText}
      >
        <WhatsAppIcon className="w-5 h-5" />

        {/* Tooltip */}
        <span
          className="absolute right-full mr-3 px-2 py-1 bg-gray-900/90 text-white text-[11px] font-semibold rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-md"
        >
          {defaultWaText}
        </span>
      </a>

      {/* 2. Instagram Floating Button */}
      <a
        href={contactConfig.social.instagram}
        target="_blank"
        rel="noopener noreferrer"
        className="relative group flex items-center justify-center w-[46px] h-[46px] rounded-full bg-gradient-to-tr from-amber-500 via-pink-500 to-purple-600 text-white shadow-md hover:scale-105 hover:shadow-lg transition-all duration-200 shrink-0"
        aria-label="Instagram"
      >
        <InstagramIcon className="w-5 h-5" />

        {/* Tooltip */}
        <span
          className="absolute right-full mr-3 px-2 py-1 bg-gray-900/90 text-white text-[11px] font-semibold rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-md"
        >
          {isRtl ? 'إنستغرام' : 'Instagram'}
        </span>
      </a>

      {/* 3. Snapchat Floating Button */}
      <a
        href={contactConfig.social.snapchat}
        target="_blank"
        rel="noopener noreferrer"
        className="relative group flex items-center justify-center w-[46px] h-[46px] rounded-full bg-[#FFFC00] text-black shadow-md hover:scale-105 hover:shadow-lg transition-all duration-200 border border-black/10 shrink-0"
        aria-label="Snapchat"
      >
        <SnapchatIcon className="w-5 h-5" />

        {/* Tooltip */}
        <span
          className="absolute right-full mr-3 px-2 py-1 bg-gray-900/90 text-white text-[11px] font-semibold rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-md"
        >
          {isRtl ? 'سناب شات' : 'Snapchat'}
        </span>
      </a>
    </aside>
  );
}
