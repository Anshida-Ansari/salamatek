'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { fetchApi } from '@/lib/admin/api';
import { useToast } from '@/components/admin/ToastProvider';
import { Loader2, ChevronLeft, Languages } from 'lucide-react';
import ImageUpload from '@/components/admin/ImageUpload';
import { translateText } from '@/lib/admin/translate';

interface FormState {
  nameEn: string;
  nameAr: string;
  slug: string;
  descriptionEn: string;
  descriptionAr: string;
  image: string;
  active: boolean;
}

const emptyForm: FormState = {
  nameEn: '',
  nameAr: '',
  slug: '',
  descriptionEn: '',
  descriptionAr: '',
  image: '',
  active: true,
};

export default function DepartmentForm({ departmentId }: { departmentId?: string }) {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(!!departmentId);
  const [isTranslating, setIsTranslating] = useState(false);
  const [formData, setFormData] = useState<FormState>(emptyForm);

  useEffect(() => {
    if (!departmentId) return;
    async function load() {
      try {
        const res = await fetchApi(`/api/departments/${departmentId}`);
        const d = res.data;
        setFormData({
          nameEn: d.name?.en ?? '',
          nameAr: d.name?.ar ?? '',
          slug: d.slug ?? '',
          descriptionEn: d.description?.en ?? '',
          descriptionAr: d.description?.ar ?? '',
          image: d.image ?? '',
          active: d.active !== false,
        });
      } catch {
        toast('Failed to load department data.', 'error');
      } finally {
        setIsFetching(false);
      }
    }
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [departmentId]);

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
      const [nameAr, descriptionAr] = await Promise.all([
        translateText(formData.nameEn),
        translateText(formData.descriptionEn)
      ]);

      setFormData(prev => ({
        ...prev,
        nameAr,
        descriptionAr
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
      name: { en: formData.nameEn, ar: formData.nameAr },
      slug:
        formData.slug ||
        formData.nameEn
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-|-$/g, ''),
      description: { en: formData.descriptionEn, ar: formData.descriptionAr },
      image: formData.image || undefined,
      active: formData.active,
    };

    try {
      if (departmentId) {
        await fetchApi(`/api/departments/${departmentId}`, {
          method: 'PATCH',
          body: JSON.stringify(payload),
        });
        toast('Department updated successfully.', 'success');
      } else {
        await fetchApi('/api/departments', {
          method: 'POST',
          body: JSON.stringify(payload),
        });
        toast('Department added successfully.', 'success');
      }
      router.push('/admin/dashboard/departments');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to save department.';
      toast(message, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 animate-spin text-brand-medium" />
        <span className="ml-3 text-text-muted">Loading department data...</span>
      </div>
    );
  }

  const inputClass =
    'block w-full px-3 py-2.5 bg-white border border-border rounded-xl text-sm text-text-base placeholder-text-subtle focus:outline-none focus:ring-2 focus:ring-brand-medium focus:border-brand-medium transition';
  const labelClass = 'block text-sm font-semibold text-text-base mb-1.5';
  const sectionClass = 'bg-white rounded-2xl border border-border p-6 space-y-5 shadow-card';

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button
          type="button"
          onClick={handleTranslate}
          disabled={isTranslating}
          className="inline-flex items-center gap-2 px-4 py-2 bg-surface-mint text-brand-dark hover:bg-brand-pale/30 disabled:opacity-50 text-sm font-semibold rounded-xl border border-brand-pale/40 transition cursor-pointer"
        >
          {isTranslating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Languages className="w-4 h-4" />}
          Auto-Translate to Arabic
        </button>
      </div>
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className={sectionClass}>
        <div className="flex items-center gap-3 pb-1 border-b border-gray-100">
          <h3 className="text-base font-semibold text-gray-900">Basic Information</h3>
          <span className="text-xs text-red-500 font-medium">* Required</span>
        </div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <label className={labelClass}>
              English Name <span className="text-red-500">*</span>
            </label>
            <input
              required
              type="text"
              name="nameEn"
              value={formData.nameEn}
              onChange={handleChange}
              placeholder="e.g. Cardiology"
              className={inputClass}
            />
          </div>
          <div>
            <label className={`${labelClass} text-right`} dir="rtl">
              الاسم بالعربية <span className="text-red-500">*</span>
            </label>
            <input
              required
              type="text"
              name="nameAr"
              value={formData.nameAr}
              onChange={handleChange}
              dir="rtl"
              placeholder="أمراض القلب"
              className={`${inputClass} text-right`}
            />
          </div>
          <div className="sm:col-span-2">
            <label className={labelClass}>
              Slug{' '}
              <span className="text-xs font-normal text-gray-400">(auto-generated if empty)</span>
            </label>
            <input
              type="text"
              name="slug"
              value={formData.slug}
              onChange={handleChange}
              placeholder="e.g. cardiology"
              className={inputClass}
            />
          </div>
        </div>
      </div>

      <div className={sectionClass}>
        <h3 className="text-base font-semibold text-gray-900 pb-1 border-b border-gray-100">Description</h3>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <label className={labelClass}>English Description</label>
            <textarea
              name="descriptionEn"
              rows={5}
              value={formData.descriptionEn}
              onChange={handleChange}
              placeholder="Describe this department..."
              className={`${inputClass} resize-none`}
            />
          </div>
          <div>
            <label className={`${labelClass} text-right`} dir="rtl">الوصف بالعربية</label>
            <textarea
              name="descriptionAr"
              rows={5}
              value={formData.descriptionAr}
              onChange={handleChange}
              dir="rtl"
              className={`${inputClass} resize-none text-right`}
            />
          </div>
        </div>
      </div>

      <div className={sectionClass}>
        <h3 className="text-base font-semibold text-gray-900 pb-1 border-b border-gray-100">Media & Settings</h3>
        <div className="space-y-5">
          <div>
            <label className={labelClass}>Department Image</label>
            <ImageUpload 
              value={formData.image} 
              onChange={(url) => setFormData(prev => ({ ...prev, image: url }))} 
            />
          </div>
          <div className="flex items-center gap-3">
            <input
              id="active"
              name="active"
              type="checkbox"
              checked={formData.active}
              onChange={handleChange}
              className="h-4 w-4 rounded border-border text-brand-medium focus:ring-brand-medium"
            />
            <div>
              <label htmlFor="active" className="text-sm font-semibold text-text-base cursor-pointer">Active</label>
              <p className="text-xs text-text-muted">Visible on the public website when active.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between pt-2">
        <button
          type="button"
          onClick={() => router.push('/admin/dashboard/departments')}
          className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-text-muted bg-white border border-border rounded-xl hover:bg-surface-mint hover:text-brand-dark transition cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" />
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-brand hover:bg-brand-medium disabled:opacity-50 text-white text-sm font-semibold rounded-xl transition shadow-sm cursor-pointer"
        >
          {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
          {isLoading ? 'Saving...' : departmentId ? 'Update Department' : 'Add Department'}
        </button>
      </div>
    </form>
    </div>
  );
}
