'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { fetchApi } from '@/lib/admin/api';
import { useToast } from '@/components/admin/ToastProvider';
import { Loader2, ChevronLeft, Languages } from 'lucide-react';
import { translateText } from '@/lib/admin/translate';
import ImageUpload from '@/components/admin/ImageUpload';

interface FormState {
  imageUrl: string;
  titleEn: string;
  titleAr: string;
  descriptionEn: string;
  descriptionAr: string;
  order: number;
  active: boolean;
}

const emptyForm: FormState = {
  imageUrl: '',
  titleEn: '',
  titleAr: '',
  descriptionEn: '',
  descriptionAr: '',
  order: 0,
  active: true,
};

export default function GalleryImageForm({ imageId }: { imageId?: string }) {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(!!imageId);
  const [isTranslating, setIsTranslating] = useState(false);
  const [formData, setFormData] = useState<FormState>(emptyForm);

  useEffect(() => {
    if (!imageId) return;
    async function load() {
      try {
        const res = await fetchApi(`/api/gallery-images/${imageId}`);
        const t = res.data;
        setFormData({
          imageUrl: t.imageUrl ?? '',
          titleEn: t.title?.en ?? '',
          titleAr: t.title?.ar ?? '',
          descriptionEn: t.description?.en ?? '',
          descriptionAr: t.description?.ar ?? '',
          order: t.order ?? 0,
          active: t.active !== false,
        });
      } catch {
        toast('Failed to load gallery image data.', 'error');
      } finally {
        setIsFetching(false);
      }
    }
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [imageId]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : (name === 'order' ? Number(value) : value),
    }));
  };

  const handleTranslate = async () => {
    setIsTranslating(true);
    try {
      const [titleAr, descriptionAr] = await Promise.all([
        translateText(formData.titleEn),
        translateText(formData.descriptionEn)
      ]);

      setFormData(prev => ({
        ...prev,
        titleAr: titleAr || prev.titleAr,
        descriptionAr: descriptionAr || prev.descriptionAr
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
    if (!formData.imageUrl) {
      toast('Please upload an image.', 'error');
      return;
    }
    setIsLoading(true);
    const payload = {
      imageUrl: formData.imageUrl,
      title: { en: formData.titleEn, ar: formData.titleAr },
      description: { en: formData.descriptionEn, ar: formData.descriptionAr },
      order: formData.order,
      active: formData.active,
    };

    try {
      if (imageId) {
        await fetchApi(`/api/gallery-images/${imageId}`, {
          method: 'PATCH',
          body: JSON.stringify(payload),
        });
        toast('Gallery image updated successfully.', 'success');
      } else {
        await fetchApi('/api/gallery-images', {
          method: 'POST',
          body: JSON.stringify(payload),
        });
        toast('Gallery image added successfully.', 'success');
      }
      router.push('/admin/dashboard/gallery');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to save gallery image.';
      toast(message, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 animate-spin text-brand-medium" />
        <span className="ml-3 text-text-muted">Loading gallery data...</span>
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
            <h3 className="text-base font-semibold text-gray-900">Image Upload</h3>
            <span className="text-xs text-red-500 font-medium">* Required</span>
          </div>
          <div>
            <label className={labelClass}>Upload Image</label>
            <ImageUpload
              value={formData.imageUrl}
              onChange={(url) => setFormData((prev) => ({ ...prev, imageUrl: url }))}
            />
          </div>
        </div>

        <div className={sectionClass}>
          <h3 className="text-base font-semibold text-gray-900 pb-1 border-b border-gray-100">Information (Optional)</h3>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <label className={labelClass}>English Title</label>
              <input
                type="text"
                name="titleEn"
                value={formData.titleEn}
                onChange={handleChange}
                placeholder="e.g. Hospital Reception"
                className={inputClass}
              />
            </div>
            <div>
              <label className={`${labelClass} text-right`} dir="rtl">
                العنوان بالعربية
              </label>
              <input
                type="text"
                name="titleAr"
                value={formData.titleAr}
                onChange={handleChange}
                dir="rtl"
                placeholder="استقبال المستشفى"
                className={`${inputClass} text-right`}
              />
            </div>
          </div>
        </div>

        <div className={sectionClass}>
          <h3 className="text-base font-semibold text-gray-900 pb-1 border-b border-gray-100">Settings</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
             <div>
              <label className={labelClass}>Display Order</label>
              <input
                type="number"
                name="order"
                value={formData.order}
                onChange={handleChange}
                className={inputClass}
              />
              <p className="text-xs text-text-muted mt-1">Lower numbers appear first.</p>
            </div>
            <div className="flex flex-col justify-center">
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
                  <p className="text-xs text-text-muted">Visible on the public gallery when active.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
          <button
            type="button"
            onClick={() => router.push('/admin/dashboard/gallery')}
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
            {isLoading ? 'Saving...' : imageId ? 'Update Image' : 'Add Image'}
          </button>
        </div>
      </form>
    </div>
  );
}
