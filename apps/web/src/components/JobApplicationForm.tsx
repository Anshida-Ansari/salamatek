'use client';

import { useState, useRef } from 'react';
import { Send, Loader2, UploadCloud, CheckCircle2, FileText, X, AlertCircle } from 'lucide-react';

export default function JobApplicationForm({ careerId, isRtl }: { careerId: string; isRtl: boolean }) {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState('');

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

    // Validate size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError(isRtl ? 'حجم الملف يجب أن يكون أقل من 10 ميجابايت' : 'File size must be less than 10MB');
      return;
    }

    setIsUploading(true);
    setError('');

    try {
      const data = new FormData();
      data.append('file', file);

      const res = await fetch('/api/upload-resume', {
        method: 'POST',
        body: data,
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        throw new Error(json.error || 'Upload failed');
      }

      setFormData({ ...formData, resumeUrl: json.url });
      setUploadedFileName(file.name);
    } catch (err: any) {
      setError(err?.message || (isRtl ? 'فشل تحميل الملف' : 'File upload failed. Please try again.'));
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveFile = () => {
    setFormData({ ...formData, resumeUrl: '' });
    setUploadedFileName('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.resumeUrl) {
      setError(isRtl ? 'يرجى إرفاق السيرة الذاتية بصيغة PDF أو DOC' : 'Please upload your resume (PDF or DOC)');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const apiUrl = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000') + '/api';
      const res = await fetch(`${apiUrl}/job-applications`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error('Failed to submit application');
      setIsSuccess(true);
    } catch (err) {
      setError(isRtl ? 'حدث خطأ أثناء التقديم. يرجى المحاولة مرة أخرى.' : 'An error occurred while submitting. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="bg-white rounded-3xl p-8 text-center border border-brand/20 shadow-card">
        <div className="w-16 h-16 bg-surface-mint rounded-2xl flex items-center justify-center mx-auto mb-5 border border-brand/10">
          <CheckCircle2 className="w-9 h-9 text-brand" />
        </div>
        <h3 className="text-xl font-serif font-bold text-brand-dark mb-2.5">
          {isRtl ? 'تم تقديم الطلب بنجاح!' : 'Application Submitted Successfully!'}
        </h3>
        <p className="text-text-muted text-sm leading-relaxed max-w-sm mx-auto">
          {isRtl 
            ? 'شكراً لاهتمامك بالانضمام إلى فريق سلامتك. سيقوم قسم الموارد البشرية بمراجعة طلبك والتواصل معك قريباً.' 
            : 'Thank you for your interest in joining Salamatek Medical Centre. Our HR team will review your credentials and contact you shortly.'}
        </p>
      </div>
    );
  }

  const inputClass = "block w-full px-4 py-3 bg-[#F8FAF9] border border-border rounded-xl text-sm placeholder:text-text-subtle text-text-base focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand focus:bg-white transition";

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-card border border-border p-6 sm:p-8 space-y-5">
      <div>
        <h3 className="text-xl sm:text-2xl font-serif font-bold text-brand-dark mb-1">
          {isRtl ? 'التقديم على هذه الوظيفة' : 'Apply for this Position'}
        </h3>
        <p className="text-xs text-text-muted">
          {isRtl ? 'املأ البيانات التالية وأرفق سيرتك الذاتية' : 'Fill out the form below and attach your CV'}
        </p>
      </div>

      {error && (
        <div className="p-3.5 bg-red-50 text-brand-red text-sm rounded-xl border border-red-200 flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-brand-red" />
          <span>{error}</span>
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-1.5">
            {isRtl ? 'الاسم الكامل' : 'Full Name'} <span className="text-brand-red">*</span>
          </label>
          <input
            required
            type="text"
            name="fullName"
            placeholder={isRtl ? 'مثال: د. أحمد محمد' : 'e.g. Dr. Jane Smith'}
            value={formData.fullName}
            onChange={handleChange}
            className={inputClass}
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-1.5">
            {isRtl ? 'البريد الإلكتروني' : 'Email Address'} <span className="text-brand-red">*</span>
          </label>
          <input
            required
            type="email"
            name="email"
            placeholder="name@example.com"
            value={formData.email}
            onChange={handleChange}
            dir="ltr"
            className={inputClass}
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-1.5">
            {isRtl ? 'رقم الهاتف' : 'Phone Number'} <span className="text-brand-red">*</span>
          </label>
          <input
            required
            type="tel"
            name="phone"
            placeholder="+966 50 000 0000"
            value={formData.phone}
            onChange={handleChange}
            dir="ltr"
            className={inputClass}
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-1.5">
            {isRtl ? 'رسالة تعريفية (اختياري)' : 'Cover Letter (Optional)'}
          </label>
          <textarea
            name="coverLetter"
            value={formData.coverLetter}
            onChange={handleChange}
            rows={3}
            placeholder={isRtl ? 'أخبرنا بإيجاز عن خبراتك ومؤهلاتك...' : 'Briefly describe your relevant experience...'}
            className={`${inputClass} resize-none`}
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-1.5">
            {isRtl ? 'السيرة الذاتية (PDF / DOC)' : 'Resume / CV (PDF / DOC)'} <span className="text-brand-red">*</span>
          </label>
          
          {formData.resumeUrl ? (
            <div className="flex items-center justify-between p-3.5 bg-surface-mint border border-brand/20 rounded-xl">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-brand border border-brand/10 flex-shrink-0">
                  <FileText className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-brand-dark truncate">
                    {uploadedFileName || 'Resume.pdf'}
                  </p>
                  <p className="text-[11px] text-brand-medium">
                    {isRtl ? 'تم التحميل بنجاح' : 'Attached successfully'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleRemoveFile}
                className="p-1 rounded-lg text-text-muted hover:text-brand-red hover:bg-red-50 transition cursor-pointer flex-shrink-0"
                title={isRtl ? 'إزالة الملف' : 'Remove file'}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div 
              onClick={() => !isUploading && fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition ${
                isUploading 
                  ? 'border-brand-medium bg-surface-mint cursor-wait' 
                  : 'border-border hover:border-brand hover:bg-surface-mint/40 bg-[#F8FAF9]'
              }`}
            >
              {isUploading ? (
                <div className="flex flex-col items-center">
                  <Loader2 className="w-7 h-7 text-brand animate-spin mb-2" />
                  <p className="text-xs font-semibold text-brand-dark">
                    {isRtl ? 'جاري رفع الملف وحفظه بأمان...' : 'Uploading & securing your document...'}
                  </p>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 rounded-xl bg-white border border-border shadow-sm flex items-center justify-center text-brand mb-2">
                    <UploadCloud className="w-5 h-5" />
                  </div>
                  <p className="text-xs font-semibold text-brand-dark">
                    {isRtl ? 'انقر لاختيار ملف السيرة الذاتية' : 'Click to select resume file'}
                  </p>
                  <p className="text-[11px] text-text-muted mt-0.5">
                    PDF, DOC, DOCX (Max 10MB)
                  </p>
                </div>
              )}
              <input 
                type="file" 
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept=".pdf,.doc,.docx"
                className="hidden"
                disabled={isUploading}
              />
            </div>
          )}
        </div>
      </div>

      <button 
        type="submit" 
        disabled={isLoading || isUploading}
        className="w-full flex items-center justify-center gap-2 py-3.5 bg-brand hover:bg-brand-medium active:scale-[0.99] text-white font-semibold text-sm rounded-xl shadow-sm transition-all disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
      >
        {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
        {isLoading 
          ? (isRtl ? 'جاري الإرسال...' : 'Submitting Application...') 
          : (isRtl ? 'إرسال طلب التوظيف' : 'Submit Application')}
      </button>
    </form>
  );
}
