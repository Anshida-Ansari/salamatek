'use client';

import { useState } from 'react';
import { Send, Loader2, CheckCircle2, MapPin, ExternalLink } from 'lucide-react';
import type { Locale } from '@/i18n/config';
import { contactConfig } from '@/config/contact';

type Props = {
  locale: Locale;
};

export function FooterQuickContact({ locale }: Props) {
  const isAr = locale === 'ar';
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: isAr ? 'استفسار من الموقع' : 'Website Quick Inquiry',
    message: '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const apiUrl =
        (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000') + '/api';
      const res = await fetch(`${apiUrl}/contact-enquiries`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.message || 'Failed to submit enquiry');
      }

      setIsSuccess(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: isAr ? 'استفسار من الموقع' : 'Website Quick Inquiry',
        message: '',
      });
    } catch (err: any) {
      setError(
        err.message || (isAr ? 'حدث خطأ أثناء الإرسال' : 'Error sending message')
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="border-b border-white/10 bg-white/[0.03]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 lg:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          
          {/* Quick Message Form (Catchy & Compact) */}
          <div className="lg:col-span-7 bg-white/[0.05] border border-white/10 rounded-2xl p-5 sm:p-6 backdrop-blur-xs">
            <div className="flex items-center justify-between gap-3 mb-4">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">
                  {isAr ? 'رسالة سريعة' : 'Send a Quick Message'}
                </span>
                <h3 className="text-lg font-serif font-bold text-white">
                  {isAr ? 'يسعدنا تواصلكم معنا' : 'We’d Love to Hear From You'}
                </h3>
              </div>
              <span className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-300 flex items-center justify-center shrink-0">
                <Send className="w-4 h-4 rtl:rotate-180" />
              </span>
            </div>

            {isSuccess ? (
              <div className="py-6 flex flex-col items-center justify-center text-center">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-3">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-bold text-white mb-1">
                  {isAr ? 'تم إرسال رسالتك بنجاح!' : 'Message Sent Successfully!'}
                </h4>
                <p className="text-xs text-white/70 max-w-sm mb-3">
                  {isAr
                    ? 'شكراً لتواصلك. سيقوم فريقنا بالرد عليك في أقرب وقت.'
                    : 'Thank you for reaching out. Our team will contact you soon.'}
                </p>
                <button
                  type="button"
                  onClick={() => setIsSuccess(false)}
                  className="text-xs font-semibold text-emerald-300 hover:text-white underline"
                >
                  {isAr ? 'إرسال رسالة أخرى' : 'Send another message'}
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3">
                {error && (
                  <div className="p-2.5 rounded-lg bg-red-500/20 border border-red-500/30 text-red-200 text-xs">
                    {error}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <input
                    required
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder={isAr ? 'الاسم *' : 'Your Name *'}
                    className="w-full px-3 py-2 text-xs bg-white/10 border border-white/15 rounded-lg text-white placeholder:text-white/40 focus:outline-none focus:ring-1 focus:ring-emerald-400"
                  />
                  <input
                    required
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder={isAr ? 'رقم الهاتف *' : 'Phone *'}
                    dir="ltr"
                    className="w-full px-3 py-2 text-xs bg-white/10 border border-white/15 rounded-lg text-white placeholder:text-white/40 focus:outline-none focus:ring-1 focus:ring-emerald-400"
                  />
                  <input
                    required
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder={isAr ? 'البريد الإلكتروني *' : 'Email *'}
                    dir="ltr"
                    className="w-full px-3 py-2 text-xs bg-white/10 border border-white/15 rounded-lg text-white placeholder:text-white/40 focus:outline-none focus:ring-1 focus:ring-emerald-400"
                  />
                </div>

                <div className="flex gap-2">
                  <textarea
                    required
                    rows={2}
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder={
                      isAr ? 'اكتب رسالتك أو استفسارك هنا...' : 'Write your message or inquiry here...'
                    }
                    className="flex-1 px-3 py-2 text-xs bg-white/10 border border-white/15 rounded-lg text-white placeholder:text-white/40 focus:outline-none focus:ring-1 focus:ring-emerald-400 resize-none"
                  />
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="px-5 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-600 disabled:opacity-60 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shrink-0 shadow-sm cursor-pointer self-end h-[56px]"
                  >
                    {isLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <span>{isAr ? 'إرسال' : 'Send'}</span>
                        <Send className="w-3.5 h-3.5 rtl:rotate-180" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Compact Interactive Map & Location (Small & Catchy) */}
          <div className="lg:col-span-5 bg-white/[0.05] border border-white/10 rounded-2xl p-4 sm:p-5 backdrop-blur-xs flex flex-col justify-between">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-400" />
                <h4 className="text-sm font-bold text-white">
                  {isAr ? 'موقع المجمع في صفوى' : 'Salamatek Medical Group'}
                </h4>
              </div>
              <a
                href={contactConfig.mapsLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-300 hover:text-white transition-colors"
              >
                <span>{isAr ? 'فتح الخريطة' : 'Open in Maps'}</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            {/* Compact Map Preview */}
            <div className="relative w-full h-[120px] rounded-xl overflow-hidden border border-white/10 mb-2.5">
              <iframe
                src="https://maps.google.com/maps?q=Salamatek%20Medical%20Group,%20Safwa,%20Saudi%20Arabia&t=&z=14&ie=UTF8&iwloc=&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Salamatek Medical Group Safwa Location"
                className="absolute inset-0 w-full h-full"
              />
            </div>

            <p className="text-[11px] text-white/70 line-clamp-1">
              📍 {contactConfig.address} • <span dir="ltr">{contactConfig.phone}</span>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
