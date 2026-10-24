'use client';

import { useState } from 'react';
import { Loader2, CheckCircle2 } from 'lucide-react';
import type { Locale } from '@/i18n/config';

interface Props {
  locale: Locale;
  isAr: boolean;
}

export function SARCEnquiryForm({ locale: _locale, isAr }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    companyName: '',
    contactPerson: '',
    email: '',
    phone: '',
    message: '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const payload = {
      companyName: formData.companyName.trim(),
      contactPerson: formData.contactPerson.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim() || 'N/A',
      serviceRequired: 'Full Industrial Healthcare Support',
      message: formData.message.trim(),
    };

    // Determine target API URL with automatic fallback to live Render API if local is down
    const envUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    const cleanEnvUrl = envUrl.replace(/\/+$/, '');
    const primaryApiUrl = cleanEnvUrl.endsWith('/api') ? cleanEnvUrl : `${cleanEnvUrl}/api`;
    const fallbackApiUrl = 'https://salamatek.onrender.com/api';

    try {
      let response: Response;
      try {
        response = await fetch(`${primaryApiUrl}/sarc-enquiries`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } catch (networkErr) {
        // If primary (e.g. localhost:5000) is unreachable, fallback to production backend
        if (primaryApiUrl !== fallbackApiUrl) {
          response = await fetch(`${fallbackApiUrl}/sarc-enquiries`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          });
        } else {
          throw networkErr;
        }
      }

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        if (data.errors && typeof data.errors === 'object') {
          const firstErr = Object.values(data.errors)[0];
          throw new Error(String(firstErr) || data.message || 'Validation failed');
        }
        throw new Error(data.message || 'Failed to submit enquiry. Please check your inputs.');
      }

      setIsSuccess(true);
      setFormData({
        companyName: '',
        contactPerson: '',
        email: '',
        phone: '',
        message: '',
      });
    } catch (err: any) {
      setError(
        err.message ||
          (isAr
            ? 'حدث خطأ أثناء إرسال الطلب. يرجى المحاولة مرة أخرى.'
            : 'An error occurred while sending your request. Please try again.')
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="bg-[#FAF7F2] rounded-3xl p-8 md:p-12 border border-[#EFECE5] shadow-sm text-center py-16 animate-fade-in">
        <div className="w-16 h-16 bg-[#E05522]/10 rounded-full flex items-center justify-center mx-auto mb-6 text-[#E05522]">
          <CheckCircle2 className="w-9 h-9" />
        </div>
        <h3 className="text-2xl md:text-3xl font-serif font-bold text-slate-900 mb-3">
          {isAr ? 'تم استلام طلبك بنجاح!' : 'Enquiry Received Successfully!'}
        </h3>
        <p className="text-slate-600 max-w-lg mx-auto mb-8 text-base leading-relaxed">
          {isAr
            ? 'شكراً لاهتمامكم بخدمات سارك للرعاية الطبية الصناعية. سيقوم فريقنا بمراجعة متطلبات مشروعكم والتواصل معكم في أقرب وقت.'
            : 'Thank you for contacting SARC Industrial Healthcare. Our team will review your project requirements and get in touch with you shortly.'}
        </p>
        <button
          type="button"
          onClick={() => setIsSuccess(false)}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#E05522] text-white font-semibold text-sm hover:bg-[#B8441A] transition-colors shadow-sm cursor-pointer"
        >
          {isAr ? 'إرسال طلب آخر' : 'Send Another Enquiry'}
        </button>
      </div>
    );
  }

  return (
    <div className="bg-[#FAF7F2] rounded-3xl p-8 md:p-12 border border-[#EFECE5] shadow-sm">
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Company Name */}
          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-2">
              {isAr ? 'اسم الشركة' : 'Company Name'} <span className="text-[#E05522]">*</span>
            </label>
            <input
              type="text"
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#E05522]/40 text-slate-900"
              placeholder={isAr ? 'مثال: أرامكو السعودية' : "e.g. Saudi Aramco"}
            />
          </div>

          {/* Contact Person */}
          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-2">
              {isAr ? 'جهة الاتصال' : 'Contact Person'} <span className="text-[#E05522]">*</span>
            </label>
            <input
              type="text"
              name="contactPerson"
              value={formData.contactPerson}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#E05522]/40 text-slate-900"
              placeholder={isAr ? 'الاسم الكامل' : 'Full Name'}
            />
          </div>

          {/* Email Address */}
          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-2">
              {isAr ? 'البريد الإلكتروني' : 'Email Address'} <span className="text-[#E05522]">*</span>
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#E05522]/40 text-slate-900"
              placeholder="contact@company.com"
            />
          </div>

          {/* Phone Number (Optional, no asterisk matching design) */}
          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-2">
              {isAr ? 'رقم الهاتف' : 'Phone Number'}
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#E05522]/40 text-slate-900"
              placeholder="+966 5X XXX XXXX"
              dir="ltr"
            />
          </div>
        </div>

        {/* Project Details */}
        <div>
          <label className="block text-sm font-semibold text-slate-900 mb-2">
            {isAr ? 'تفاصيل المشروع' : 'Project Details'}
          </label>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            rows={4}
            className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#E05522]/40 resize-none text-slate-900"
            placeholder={
              isAr
                ? 'أخبرنا عن موقع مشروعك ومدته والاحتياجات الطبية المحددة...'
                : 'Tell us about your project location, duration, and specific medical requirements...'
            }
          />
        </div>

        {/* Submit Button - exact styling and text matching Image 2 */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-4 rounded-xl bg-[#E05522] hover:bg-[#B8441A] disabled:opacity-60 text-white font-bold text-sm transition-colors shadow-md flex items-center justify-center gap-2 cursor-pointer"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>{isAr ? 'جاري الإرسال...' : 'Sending Enquiry...'}</span>
            </>
          ) : (
            <span>{isAr ? 'إرسال الطلب' : 'Send Enquiry'}</span>
          )}
        </button>
      </form>
    </div>
  );
}
