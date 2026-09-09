'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { fetchApi } from '@/lib/admin/api';
import { useToast } from '@/components/admin/ToastProvider';
import { Loader2, ChevronLeft, Languages } from 'lucide-react';
import { translateText } from '@/lib/admin/translate';

interface FormState {
  titleEn: string;
  titleAr: string;
  slug: string;
  departmentEn: string;
  departmentAr: string;
  locationEn: string;
  locationAr: string;
  employmentTypeEn: string;
  employmentTypeAr: string;
  experienceEn: string;
  experienceAr: string;
  descriptionEn: string;
  descriptionAr: string;
  requirementsEn: string;
  requirementsAr: string;
  active: boolean;
}

const emptyForm: FormState = {
  titleEn: '',
  titleAr: '',
  slug: '',
  departmentEn: '',
  departmentAr: '',
  locationEn: '',
  locationAr: '',
  employmentTypeEn: 'Full-time',
  employmentTypeAr: 'دوام كامل',
  experienceEn: '',
  experienceAr: '',
  descriptionEn: '',
  descriptionAr: '',
  requirementsEn: '',
  requirementsAr: '',
  active: true,
};

export default function CareerForm({ careerId }: { careerId?: string }) {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(!!careerId);
  const [isTranslating, setIsTranslating] = useState(false);
  const [formData, setFormData] = useState<FormState>(emptyForm);

  useEffect(() => {
    if (!careerId) return;
    async function load() {
      try {
        const res = await fetchApi(`/api/careers/${careerId}`);
        const c = res.data;
        setFormData({
          titleEn: c.title?.en ?? '',
          titleAr: c.title?.ar ?? '',
          slug: c.slug ?? '',
          departmentEn: c.department?.en ?? '',
          departmentAr: c.department?.ar ?? '',
          locationEn: c.location?.en ?? '',
          locationAr: c.location?.ar ?? '',
          employmentTypeEn: c.employmentType?.en ?? '',
          employmentTypeAr: c.employmentType?.ar ?? '',
          experienceEn: c.experience?.en ?? '',
          experienceAr: c.experience?.ar ?? '',
          descriptionEn: c.description?.en ?? '',
          descriptionAr: c.description?.ar ?? '',
          requirementsEn: c.requirements?.en?.join('\n') ?? '',
          requirementsAr: c.requirements?.ar?.join('\n') ?? '',
          active: c.active !== false,
        });
      } catch {
        toast('Failed to load career data.', 'error');
      } finally {
        setIsFetching(false);
      }
    }
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [careerId]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleTranslate = async () => {
    setIsTranslating(true);
    try {
      const [titleAr, departmentAr, locationAr, empTypeAr, expAr, descAr, reqAr] = await Promise.all([
        translateText(formData.titleEn),
        translateText(formData.departmentEn),
        translateText(formData.locationEn),
        translateText(formData.employmentTypeEn),
        translateText(formData.experienceEn),
        translateText(formData.descriptionEn),
        translateText(formData.requirementsEn),
      ]);

      setFormData((prev) => ({
        ...prev,
        titleAr,
        departmentAr,
        locationAr,
        employmentTypeAr: empTypeAr,
        experienceAr: expAr,
        descriptionAr: descAr,
        requirementsAr: reqAr,
      }));
      toast('Translation completed successfully.', 'success');
    } catch (error) {
      toast('Failed to translate text.', 'error');
    } finally {
      setIsTranslating(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const payload = {
      title: { en: formData.titleEn, ar: formData.titleAr },
      slug:
        formData.slug ||
        formData.titleEn
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-|-$/g, ''),
      department: { en: formData.departmentEn, ar: formData.departmentAr },
      location: { en: formData.locationEn, ar: formData.locationAr },
      employmentType: { en: formData.employmentTypeEn, ar: formData.employmentTypeAr },
      experience: { en: formData.experienceEn, ar: formData.experienceAr },
      description: { en: formData.descriptionEn, ar: formData.descriptionAr },
      requirements: {
        en: formData.requirementsEn.split('\n').map((i) => i.trim()).filter(Boolean),
        ar: formData.requirementsAr.split('\n').map((i) => i.trim()).filter(Boolean),
      },
      active: formData.active,
    };

    try {
      if (careerId) {
        await fetchApi(`/api/careers/${careerId}`, {
          method: 'PATCH',
          body: JSON.stringify(payload),
        });
        toast('Job updated successfully.', 'success');
      } else {
        await fetchApi('/api/careers', {
          method: 'POST',
          body: JSON.stringify(payload),
        });
        toast('Job added successfully.', 'success');
      }
      router.push('/admin/dashboard/careers');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to save job.';
      toast(message, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
        <span className="ml-3 text-gray-500">Loading career data...</span>
      </div>
    );
  }

  const inputClass =
    'block w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition';
  const labelClass = 'block text-sm font-semibold text-gray-700 mb-1.5';
  const sectionClass = 'bg-white rounded-xl border border-gray-200 p-6 space-y-5';

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button
          type="button"
          onClick={handleTranslate}
          disabled={isTranslating}
          className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 disabled:opacity-50 text-sm font-semibold rounded-lg transition"
        >
          {isTranslating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Languages className="w-4 h-4" />}
          Auto-Translate to Arabic
        </button>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div className={sectionClass}>
          <div className="flex items-center gap-3 pb-1 border-b border-gray-100">
            <h3 className="text-base font-semibold text-gray-900">Basic Information</h3>
            <span className="text-xs text-red-500 font-medium">* Required</span>
          </div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <label className={labelClass}>Job Title (English) <span className="text-red-500">*</span></label>
              <input required type="text" name="titleEn" value={formData.titleEn} onChange={handleChange} className={inputClass} placeholder="e.g. Senior General Physician" />
            </div>
            <div>
              <label className={`${labelClass} text-right`} dir="rtl">المسمى الوظيفي (عربي) <span className="text-red-500">*</span></label>
              <input required type="text" name="titleAr" value={formData.titleAr} onChange={handleChange} dir="rtl" className={`${inputClass} text-right`} />
            </div>

            <div className="sm:col-span-2">
              <label className={labelClass}>Slug <span className="text-xs font-normal text-gray-400">(auto-generated if empty)</span></label>
              <input type="text" name="slug" value={formData.slug} onChange={handleChange} className={inputClass} placeholder="e.g. senior-general-physician" />
            </div>

            <div>
              <label className={labelClass}>Department (English)</label>
              <input type="text" name="departmentEn" value={formData.departmentEn} onChange={handleChange} className={inputClass} placeholder="e.g. Internal Medicine" />
            </div>
            <div>
              <label className={`${labelClass} text-right`} dir="rtl">القسم (عربي)</label>
              <input type="text" name="departmentAr" value={formData.departmentAr} onChange={handleChange} dir="rtl" className={`${inputClass} text-right`} />
            </div>

            <div>
              <label className={labelClass}>Location (English)</label>
              <input type="text" name="locationEn" value={formData.locationEn} onChange={handleChange} className={inputClass} placeholder="e.g. Safwa, Eastern Province" />
            </div>
            <div>
              <label className={`${labelClass} text-right`} dir="rtl">الموقع (عربي)</label>
              <input type="text" name="locationAr" value={formData.locationAr} onChange={handleChange} dir="rtl" className={`${inputClass} text-right`} />
            </div>

            <div>
              <label className={labelClass}>Employment Type (English)</label>
              <input type="text" name="employmentTypeEn" value={formData.employmentTypeEn} onChange={handleChange} className={inputClass} placeholder="e.g. Full-time" />
            </div>
            <div>
              <label className={`${labelClass} text-right`} dir="rtl">نوع التوظيف (عربي)</label>
              <input type="text" name="employmentTypeAr" value={formData.employmentTypeAr} onChange={handleChange} dir="rtl" className={`${inputClass} text-right`} />
            </div>

            <div>
              <label className={labelClass}>Experience Needed (English)</label>
              <input type="text" name="experienceEn" value={formData.experienceEn} onChange={handleChange} className={inputClass} placeholder="e.g. 5+ Years" />
            </div>
            <div>
              <label className={`${labelClass} text-right`} dir="rtl">الخبرة المطلوبة (عربي)</label>
              <input type="text" name="experienceAr" value={formData.experienceAr} onChange={handleChange} dir="rtl" className={`${inputClass} text-right`} />
            </div>
          </div>
        </div>

        {/* Details */}
        <div className={sectionClass}>
          <h3 className="text-base font-semibold text-gray-900 pb-1 border-b border-gray-100">Details & Requirements</h3>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <label className={labelClass}>Job Description (English) <span className="text-red-500">*</span></label>
              <textarea required name="descriptionEn" rows={6} value={formData.descriptionEn} onChange={handleChange} className={`${inputClass} resize-none`} />
            </div>
            <div>
              <label className={`${labelClass} text-right`} dir="rtl">الوصف الوظيفي (عربي) <span className="text-red-500">*</span></label>
              <textarea required name="descriptionAr" rows={6} value={formData.descriptionAr} onChange={handleChange} dir="rtl" className={`${inputClass} resize-none text-right`} />
            </div>

            <div>
              <label className={labelClass}>Requirements (English) <span className="text-xs font-normal text-gray-400">One per line</span></label>
              <textarea name="requirementsEn" rows={5} value={formData.requirementsEn} onChange={handleChange} placeholder="MD Degree\n5+ Years Experience\nValid License" className={`${inputClass} resize-none`} />
            </div>
            <div>
              <label className={`${labelClass} text-right`} dir="rtl">المتطلبات (عربي) <span className="text-xs font-normal text-gray-400">عنصر واحد في كل سطر</span></label>
              <textarea name="requirementsAr" rows={5} value={formData.requirementsAr} onChange={handleChange} dir="rtl" className={`${inputClass} resize-none text-right`} />
            </div>
          </div>
        </div>

        {/* Settings */}
        <div className={sectionClass}>
          <h3 className="text-base font-semibold text-gray-900 pb-1 border-b border-gray-100">Settings</h3>
          <div className="flex items-center gap-3">
            <input type="checkbox" name="active" checked={formData.active} onChange={handleChange} className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
            <div>
              <label className="text-sm font-semibold text-gray-700 cursor-pointer">Active Vacancy</label>
              <p className="text-xs text-gray-400">When active, candidates can view and apply to this job on the careers page.</p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
          <button type="button" onClick={() => router.push('/admin/dashboard/careers')} className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition">
            <ChevronLeft className="w-4 h-4" /> Cancel
          </button>
          <button type="submit" disabled={isLoading} className="inline-flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-sm font-semibold rounded-xl transition shadow-sm">
            {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
            {isLoading ? 'Saving...' : careerId ? 'Update Job' : 'Add Job'}
          </button>
        </div>
      </form>
    </div>
  );
}
