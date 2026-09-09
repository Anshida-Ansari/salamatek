'use client';

import { useState } from 'react';
import { Send, Loader2, CheckCircle2 } from 'lucide-react';
import { usePathname } from 'next/navigation';

export function ContactForm() {
  const pathname = usePathname();
  const isRtl = pathname.startsWith('/ar');

  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      const res = await fetch(`${apiUrl}/contact-enquiries`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to submit enquiry');
      }
      
      setIsSuccess(true);
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch (err: any) {
      setError(err.message || 'An error occurred while sending your request. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center py-12 bg-white rounded-2xl shadow-sm border border-gray-100">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
          <CheckCircle2 className="w-10 h-10 text-green-600" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          {isRtl ? 'تم إرسال الرسالة بنجاح!' : 'Message Sent Successfully!'}
        </h3>
        <p className="text-gray-600 max-w-md mx-auto">
          {isRtl 
            ? 'شكراً لتواصلك معنا. سيقوم فريقنا بمراجعة رسالتك والرد عليك في أقرب وقت ممكن.'
            : 'Thank you for reaching out. Our team will review your message and get back to you as soon as possible.'}
        </p>
        <button 
          onClick={() => setIsSuccess(false)}
          className="mt-8 text-[#8E2829] font-semibold hover:underline"
        >
          {isRtl ? 'إرسال رسالة أخرى' : 'Send another message'}
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
      <h3 className="text-2xl font-bold mb-6 text-gray-900">
        {isRtl ? 'أرسل لنا رسالة' : 'Send Us A Message'}
      </h3>
      
      {error && (
        <div className="p-4 bg-red-50 text-red-700 text-sm rounded-lg mb-4">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">{isRtl ? 'الاسم الكامل' : 'Full Name'} *</label>
          <input required type="text" name="name" value={formData.name} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#8E2829] focus:outline-none" />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">{isRtl ? 'رقم الهاتف' : 'Phone Number'} *</label>
          <input required type="tel" name="phone" value={formData.phone} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#8E2829] focus:outline-none" dir="ltr" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">{isRtl ? 'البريد الإلكتروني' : 'Email Address'} *</label>
          <input required type="email" name="email" value={formData.email} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#8E2829] focus:outline-none" dir="ltr" />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">{isRtl ? 'الموضوع' : 'Subject'} *</label>
          <input required type="text" name="subject" value={formData.subject} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#8E2829] focus:outline-none" />
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1.5">{isRtl ? 'الرسالة' : 'Message'} *</label>
        <textarea required name="message" value={formData.message} onChange={handleChange} rows={5} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#8E2829] focus:outline-none resize-none"></textarea>
      </div>

      <button 
        type="submit" 
        disabled={isLoading}
        className="w-full flex items-center justify-center gap-2 py-4 bg-[#8E2829] hover:bg-[#732021] text-white font-bold rounded-lg transition disabled:opacity-70 text-lg shadow-md"
      >
        {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
        {isLoading ? (isRtl ? 'جاري الإرسال...' : 'Sending...') : (isRtl ? 'إرسال الرسالة' : 'Send Message')}
      </button>
    </form>
  );
}
