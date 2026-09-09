'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { fetchApi } from '@/lib/admin/api';
import { useToast } from '@/components/admin/ToastProvider';
import { Loader2, ChevronLeft, Languages } from 'lucide-react';
import ImageUpload from '@/components/admin/ImageUpload';
import { translateText } from '@/lib/admin/translate';

interface Department {
  _id: string;
  name: { en: string };
}

interface FormState {
  nameEn: string;
  nameAr: string;
  slug: string;
  descriptionEn: string;
  descriptionAr: string;
  departmentId: string;
  image: string;
  active: boolean;
}

const emptyForm: FormState = {
  nameEn: '',
  nameAr: '',
  slug: '',
  descriptionEn: '',
  descriptionAr: '',
  departmentId: '',
  image: '',
  active: true,
};

export default function ServiceForm({ serviceId }: { serviceId?: string }) {
  const router = useRouter();
  const { toast } = useToast();
  const [departments, setDepartments] = useState<Department[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(!!serviceId);
  const [isTranslating, setIsTranslating] = useState(false);
  const [formData, setFormData] = useState<FormState>(emptyForm);

  useEffect(() => {
    async function loadData() {
      try {
        const depsRes = await fetchApi('/api/departments?limit=100&active=true');
        setDepartments(depsRes.data ?? []);

        if (serviceId) {
          const res = await fetchApi(`/api/services/${serviceId}`);
          const d = res.data;
          setFormData({
            nameEn: d.name?.en ?? '',
            nameAr: d.name?.ar ?? '',
            slug: d.slug ?? '',
            descriptionEn: d.description?.en ?? '',
            descriptionAr: d.description?.ar ?? '',
            departmentId: d.departmentId?._id ?? d.departmentId ?? '',
            image: d.image ?? '',
            active: d.active !== false,
          });
        }
      } catch {
        toast('Failed to load form data.', 'error');
      } finally {
        setIsFetching(false);
      }
    }
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serviceId]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
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
      departmentId: formData.departmentId || undefined,
      image: formData.image || undefined,
      active: formData.active,
    };

    try {
      if (serviceId) {
        await fetchApi(`/api/services/${serviceId}`, {
          method: 'PATCH',
          body: JSON.stringify(payload),
        });
        toast('Service updated successfully.', 'success');
      } else {
        await fetchApi('/api/services', {
          method: 'POST',
          body: JSON.stringify(payload),
        });
        toast('Service added successfully.', 'success');
      }
      router.push('/admin/dashboard/services');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to save service.';
      toast(message, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
        <span className="ml-3 text-gray-500">Loading service data...</span>
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
              placeholder="e.g. General Checkup"
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
              placeholder="الفحص الشامل"
              className={`${inputClass} text-right`}
            />
          </div>

          <div>
            <label className={labelClass}>
              Slug{' '}
              <span className="text-xs font-normal text-gray-400">(auto-generated if empty)</span>
            </label>
            <input
              type="text"
              name="slug"
              value={formData.slug}
              onChange={handleChange}
              placeholder="e.g. general-checkup"
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Department</label>
            <select
              name="departmentId"
              value={formData.departmentId}
              onChange={handleChange}
              className={inputClass}
            >
              <option value="">— No specific department —</option>
              {departments.map((dep) => (
                <option key={dep._id} value={dep._id}>
                  {dep.name?.en}
                </option>
              ))}
            </select>
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
              placeholder="Describe this service..."
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
            <label className={labelClass}>Service Image</label>
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
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <div>
              <label htmlFor="active" className="text-sm font-semibold text-gray-700 cursor-pointer">Active</label>
              <p className="text-xs text-gray-400">Visible on the public website when active.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between pt-2">
        <button
          type="button"
          onClick={() => router.push('/admin/dashboard/services')}
          className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition"
        >
          <ChevronLeft className="w-4 h-4" />
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-sm font-semibold rounded-xl transition shadow-sm"
        >
          {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
          {isLoading ? 'Saving...' : serviceId ? 'Update Service' : 'Add Service'}
        </button>
      </div>
    </form>
    </div>
  );
}
