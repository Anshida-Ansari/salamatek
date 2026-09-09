'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { fetchApi } from '@/lib/admin/api';
import { useToast } from '@/components/admin/ToastProvider';
import { Loader2, ChevronLeft, Languages } from 'lucide-react';
import ImageUpload from '@/components/admin/ImageUpload';
import { translateText } from '@/lib/admin/translate';

interface FormState {
  titleEn: string;
  titleAr: string;
  slug: string;
  descriptionEn: string;
  descriptionAr: string;
  price: string;
  includedItemsEn: string;
  includedItemsAr: string;
  validityEn: string;
  validityAr: string;
  image: string;
  featured: boolean;
  active: boolean;
}

const emptyForm: FormState = {
  titleEn: '',
  titleAr: '',
  slug: '',
  descriptionEn: '',
  descriptionAr: '',
  price: '',
  includedItemsEn: '',
  includedItemsAr: '',
  validityEn: '',
  validityAr: '',
  image: '',
  featured: false,
  active: true,
};

export default function HealthPackageForm({ packageId }: { packageId?: string }) {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(!!packageId);
  const [isTranslating, setIsTranslating] = useState(false);
  const [formData, setFormData] = useState<FormState>(emptyForm);

  useEffect(() => {
    if (!packageId) return;
    async function load() {
      try {
        const res = await fetchApi(`/api/health-packages/${packageId}`);
        const p = res.data;
        setFormData({
          titleEn: p.title?.en ?? '',
          titleAr: p.title?.ar ?? '',
          slug: p.slug ?? '',
          descriptionEn: p.description?.en ?? '',
          descriptionAr: p.description?.ar ?? '',
          price: p.price ?? '',
          includedItemsEn: p.includedItems?.en?.join('\n') ?? '',
          includedItemsAr: p.includedItems?.ar?.join('\n') ?? '',
          validityEn: p.validity?.en ?? '',
          validityAr: p.validity?.ar ?? '',
          image: p.image ?? '',
          featured: p.featured !== false,
          active: p.active !== false,
        });
      } catch {
        toast('Failed to load package data.', 'error');
      } finally {
        setIsFetching(false);
      }
    }
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [packageId]);

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
      const [titleAr, descriptionAr, includedItemsAr, validityAr] = await Promise.all([
        translateText(formData.titleEn),
        translateText(formData.descriptionEn),
        translateText(formData.includedItemsEn),
        translateText(formData.validityEn),
      ]);

      setFormData((prev) => ({
        ...prev,
        titleAr,
        descriptionAr,
        includedItemsAr,
        validityAr,
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
      description: { en: formData.descriptionEn, ar: formData.descriptionAr },
      price: formData.price || undefined,
      includedItems: {
        en: formData.includedItemsEn.split('\n').map((i) => i.trim()).filter(Boolean),
        ar: formData.includedItemsAr.split('\n').map((i) => i.trim()).filter(Boolean),
      },
      validity: { en: formData.validityEn, ar: formData.validityAr },
      image: formData.image || undefined,
      featured: formData.featured,
      active: formData.active,
    };

    try {
      if (packageId) {
        await fetchApi(`/api/health-packages/${packageId}`, {
          method: 'PATCH',
          body: JSON.stringify(payload),
        });
        toast('Health Package updated successfully.', 'success');
      } else {
        await fetchApi('/api/health-packages', {
          method: 'POST',
          body: JSON.stringify(payload),
        });
        toast('Health Package added successfully.', 'success');
      }
      router.push('/admin/dashboard/health-packages');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to save package.';
      toast(message, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
        <span className="ml-3 text-gray-500">Loading package data...</span>
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
              <label className={labelClass}>English Title <span className="text-red-500">*</span></label>
              <input required type="text" name="titleEn" value={formData.titleEn} onChange={handleChange} className={inputClass} placeholder="e.g. Comprehensive Screening" />
            </div>
            <div>
              <label className={`${labelClass} text-right`} dir="rtl">العنوان بالعربية <span className="text-red-500">*</span></label>
              <input required type="text" name="titleAr" value={formData.titleAr} onChange={handleChange} dir="rtl" className={`${inputClass} text-right`} />
            </div>

            <div>
              <label className={labelClass}>Slug <span className="text-xs font-normal text-gray-400">(auto-generated if empty)</span></label>
              <input type="text" name="slug" value={formData.slug} onChange={handleChange} className={inputClass} placeholder="e.g. comprehensive-screening" />
            </div>
            <div>
              <label className={labelClass}>Price / Offer</label>
              <input type="text" name="price" value={formData.price} onChange={handleChange} className={inputClass} placeholder="e.g. $150 or 'Contact Us'" />
            </div>
          </div>
        </div>

        {/* Details */}
        <div className={sectionClass}>
          <h3 className="text-base font-semibold text-gray-900 pb-1 border-b border-gray-100">Details & Items</h3>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <label className={labelClass}>English Description <span className="text-red-500">*</span></label>
              <textarea required name="descriptionEn" rows={4} value={formData.descriptionEn} onChange={handleChange} className={`${inputClass} resize-none`} />
            </div>
            <div>
              <label className={`${labelClass} text-right`} dir="rtl">الوصف بالعربية <span className="text-red-500">*</span></label>
              <textarea required name="descriptionAr" rows={4} value={formData.descriptionAr} onChange={handleChange} dir="rtl" className={`${inputClass} resize-none text-right`} />
            </div>

            <div>
              <label className={labelClass}>Included Items (English) <span className="text-xs font-normal text-gray-400">One per line</span></label>
              <textarea name="includedItemsEn" rows={5} value={formData.includedItemsEn} onChange={handleChange} placeholder="Blood Test\nConsultation\nX-Ray" className={`${inputClass} resize-none`} />
            </div>
            <div>
              <label className={`${labelClass} text-right`} dir="rtl">العناصر المشمولة (عربي) <span className="text-xs font-normal text-gray-400">عنصر واحد في كل سطر</span></label>
              <textarea name="includedItemsAr" rows={5} value={formData.includedItemsAr} onChange={handleChange} dir="rtl" className={`${inputClass} resize-none text-right`} />
            </div>
            
            <div>
              <label className={labelClass}>Validity (English)</label>
              <input type="text" name="validityEn" value={formData.validityEn} onChange={handleChange} className={inputClass} placeholder="e.g. Valid until Dec 31st" />
            </div>
            <div>
              <label className={`${labelClass} text-right`} dir="rtl">الصلاحية (عربي)</label>
              <input type="text" name="validityAr" value={formData.validityAr} onChange={handleChange} dir="rtl" className={`${inputClass} text-right`} />
            </div>
          </div>
        </div>

        {/* Media & Settings */}
        <div className={sectionClass}>
          <h3 className="text-base font-semibold text-gray-900 pb-1 border-b border-gray-100">Media & Settings</h3>
          <div className="space-y-5">
            <div>
              <label className={labelClass}>Package Image</label>
              <ImageUpload value={formData.image} onChange={(url) => setFormData((prev) => ({ ...prev, image: url }))} />
            </div>
            <div className="flex flex-col gap-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" name="featured" checked={formData.featured} onChange={handleChange} className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                <div>
                  <p className="text-sm font-semibold text-gray-700">Featured Package</p>
                  <p className="text-xs text-gray-400">Highlight this package on the homepage or top of lists.</p>
                </div>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" name="active" checked={formData.active} onChange={handleChange} className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                <div>
                  <p className="text-sm font-semibold text-gray-700">Active</p>
                  <p className="text-xs text-gray-400">Visible on the public website when active.</p>
                </div>
              </label>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
          <button type="button" onClick={() => router.push('/admin/dashboard/health-packages')} className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition">
            <ChevronLeft className="w-4 h-4" /> Cancel
          </button>
          <button type="submit" disabled={isLoading} className="inline-flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-sm font-semibold rounded-xl transition shadow-sm">
            {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
            {isLoading ? 'Saving...' : packageId ? 'Update Package' : 'Add Package'}
          </button>
        </div>
      </form>
    </div>
  );
}
