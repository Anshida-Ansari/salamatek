'use client';

import { useState, useRef } from 'react';
import { Send, Loader2, UploadCloud, CheckCircle2 } from 'lucide-react';

export default function JobApplicationForm({ careerId, isRtl }: { careerId: string, isRtl: boolean }) {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const [formData, setFormData] = useState({
    careerId,
    fullName: '',
    email: '',
    phone: '',
    coverLetter: '',
    resumeUrl: '',
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setError(isRtl ? 'حجم الملف يجب أن يكون أقل من 5 ميجابايت' : 'File size must be less than 5MB');
      return;
    }

    setIsUploading(true);
    setError('');

    try {
      const data = new FormData();
      data.append('file', file);
      data.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || '');
      const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

      const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/upload`, {
        method: 'POST',
        body: data,
      });

      if (!res.ok) throw new Error('Upload failed');
      const json = await res.json();
      setFormData({ ...formData, resumeUrl: json.secure_url });
    } catch (err) {
      setError(isRtl ? 'فشل تحميل الملف' : 'File upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.resumeUrl) {
      setError(isRtl ? 'يرجى إرفاق السيرة الذاتية' : 'Please upload your resume');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      const res = await fetch(`${apiUrl}/job-applications`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error('Failed to submit application');
      setIsSuccess(true);
    } catch (err) {
      setError(isRtl ? 'حدث خطأ. يرجى المحاولة مرة أخرى.' : 'An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="bg-green-50 rounded-2xl p-8 text-center border border-green-100">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-8 h-8 text-green-600" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          {isRtl ? 'تم تقديم الطلب بنجاح!' : 'Application Submitted Successfully!'}
        </h3>
        <p className="text-gray-600">
          {isRtl 
            ? 'شكراً لاهتمامك بالانضمام إلينا. سيقوم فريق الموارد البشرية بمراجعة طلبك.' 
            : 'Thank you for your interest. Our HR team will review your application and get back to you.'}
        </p>
      </div>
    );
  }

  const inputClass = "block w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition";

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 space-y-6">
      <h3 className="text-2xl font-bold text-gray-900 mb-6">
        {isRtl ? 'قدم على هذه الوظيفة' : 'Apply for this Position'}
      </h3>

      {error && (
        <div className="p-4 bg-red-50 text-red-700 text-sm rounded-lg border border-red-100">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">{isRtl ? 'الاسم الكامل' : 'Full Name'} *</label>
          <input required type="text" name="fullName" value={formData.fullName} onChange={handleChange} className={inputClass} />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">{isRtl ? 'البريد الإلكتروني' : 'Email Address'} *</label>
          <input required type="email" name="email" value={formData.email} onChange={handleChange} dir="ltr" className={inputClass} />
        </div>
        <div className="sm:col-span-2">
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">{isRtl ? 'رقم الهاتف' : 'Phone Number'} *</label>
          <input required type="tel" name="phone" value={formData.phone} onChange={handleChange} dir="ltr" className={inputClass} />
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1.5">{isRtl ? 'رسالة تعريفية (اختياري)' : 'Cover Letter (Optional)'}</label>
        <textarea name="coverLetter" value={formData.coverLetter} onChange={handleChange} rows={4} className={`${inputClass} resize-none`}></textarea>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1.5">{isRtl ? 'السيرة الذاتية (PDF/DOC)' : 'Resume / CV (PDF/DOC)'} *</label>
        
        {formData.resumeUrl ? (
          <div className="flex items-center justify-between px-4 py-3 bg-blue-50 border border-blue-100 rounded-xl">
            <div className="flex items-center gap-2 text-blue-700">
              <CheckCircle2 className="w-5 h-5" />
              <span className="text-sm font-medium">{isRtl ? 'تم إرفاق السيرة الذاتية' : 'Resume attached successfully'}</span>
            </div>
            <button type="button" onClick={() => setFormData({...formData, resumeUrl: ''})} className="text-sm font-semibold text-red-600 hover:text-red-700">
              {isRtl ? 'إزالة' : 'Remove'}
            </button>
          </div>
        ) : (
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-gray-300 hover:border-blue-500 hover:bg-blue-50 bg-gray-50 rounded-xl px-6 py-8 text-center cursor-pointer transition"
          >
            {isUploading ? (
              <Loader2 className="w-8 h-8 text-blue-500 animate-spin mx-auto mb-2" />
            ) : (
              <UploadCloud className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            )}
            <p className="text-sm font-semibold text-gray-700">
              {isUploading 
                ? (isRtl ? 'جاري التحميل...' : 'Uploading...') 
                : (isRtl ? 'انقر لرفع سيرتك الذاتية' : 'Click to upload your resume')}
            </p>
            <p className="text-xs text-gray-500 mt-1">Max 5MB</p>
            <input 
              type="file" 
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept=".pdf,.doc,.docx"
              className="hidden"
            />
          </div>
        )}
      </div>

      <button 
        type="submit" 
        disabled={isLoading || isUploading}
        className="w-full flex items-center justify-center gap-2 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
        {isLoading ? (isRtl ? 'جاري التقديم...' : 'Submitting...') : (isRtl ? 'تقديم الطلب' : 'Submit Application')}
      </button>
    </form>
  );
}
