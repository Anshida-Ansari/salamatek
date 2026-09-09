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
  excerptEn: string;
  excerptAr: string;
  contentEn: string;
  contentAr: string;
  authorEn: string;
  authorAr: string;
  categoryEn: string;
  categoryAr: string;
  image: string;
  status: 'draft' | 'published';
  featured: boolean;
}

const emptyForm: FormState = {
  titleEn: '',
  titleAr: '',
  slug: '',
  excerptEn: '',
  excerptAr: '',
  contentEn: '',
  contentAr: '',
  authorEn: '',
  authorAr: '',
  categoryEn: 'Health',
  categoryAr: 'الصحة',
  image: '',
  status: 'published',
  featured: false,
};

export default function NewsForm({ articleId }: { articleId?: string }) {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(!!articleId);
  const [isTranslating, setIsTranslating] = useState(false);
  const [formData, setFormData] = useState<FormState>(emptyForm);

  useEffect(() => {
    if (!articleId) return;
    async function load() {
      try {
        const res = await fetchApi(`/api/news/${articleId}`);
        const a = res.data;
        setFormData({
          titleEn: a.title?.en ?? '',
          titleAr: a.title?.ar ?? '',
          slug: a.slug ?? '',
          excerptEn: a.excerpt?.en ?? '',
          excerptAr: a.excerpt?.ar ?? '',
          contentEn: a.content?.en ?? '',
          contentAr: a.content?.ar ?? '',
          authorEn: a.author?.en ?? '',
          authorAr: a.author?.ar ?? '',
          categoryEn: a.category?.en ?? '',
          categoryAr: a.category?.ar ?? '',
          image: a.image ?? '',
          status: a.status ?? 'published',
          featured: a.featured ?? false,
        });
      } catch {
        toast('Failed to load article data.', 'error');
      } finally {
        setIsFetching(false);
      }
    }
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [articleId]);

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
      const [titleAr, excerptAr, contentAr, authorAr, categoryAr] = await Promise.all([
        translateText(formData.titleEn),
        translateText(formData.excerptEn),
        translateText(formData.contentEn),
        translateText(formData.authorEn),
        translateText(formData.categoryEn),
      ]);

      setFormData((prev) => ({
        ...prev,
        titleAr,
        excerptAr,
        contentAr,
        authorAr,
        categoryAr,
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
      excerpt: { en: formData.excerptEn, ar: formData.excerptAr },
      content: { en: formData.contentEn, ar: formData.contentAr },
      author: { en: formData.authorEn, ar: formData.authorAr },
      category: { en: formData.categoryEn, ar: formData.categoryAr },
      image: formData.image || undefined,
      status: formData.status,
      featured: formData.featured,
    };

    try {
      if (articleId) {
        await fetchApi(`/api/news/${articleId}`, {
          method: 'PATCH',
          body: JSON.stringify(payload),
        });
        toast('Article updated successfully.', 'success');
      } else {
        await fetchApi('/api/news', {
          method: 'POST',
          body: JSON.stringify(payload),
        });
        toast('Article created successfully.', 'success');
      }
      router.push('/admin/dashboard/news');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to save article.';
      toast(message, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
        <span className="ml-3 text-gray-500">Loading article data...</span>
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
            <h3 className="text-base font-semibold text-gray-900">Article Header</h3>
            <span className="text-xs text-red-500 font-medium">* Required</span>
          </div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <label className={labelClass}>Article Title (English) <span className="text-red-500">*</span></label>
              <input required type="text" name="titleEn" value={formData.titleEn} onChange={handleChange} className={inputClass} />
            </div>
            <div>
              <label className={`${labelClass} text-right`} dir="rtl">عنوان المقال (عربي) <span className="text-red-500">*</span></label>
              <input required type="text" name="titleAr" value={formData.titleAr} onChange={handleChange} dir="rtl" className={`${inputClass} text-right`} />
            </div>

            <div className="sm:col-span-2">
              <label className={labelClass}>Slug <span className="text-xs font-normal text-gray-400">(auto-generated if empty)</span></label>
              <input type="text" name="slug" value={formData.slug} onChange={handleChange} className={inputClass} />
            </div>

            <div>
              <label className={labelClass}>Category (English)</label>
              <input type="text" name="categoryEn" value={formData.categoryEn} onChange={handleChange} className={inputClass} />
            </div>
            <div>
              <label className={`${labelClass} text-right`} dir="rtl">الفئة (عربي)</label>
              <input type="text" name="categoryAr" value={formData.categoryAr} onChange={handleChange} dir="rtl" className={`${inputClass} text-right`} />
            </div>

            <div>
              <label className={labelClass}>Author (English)</label>
              <input type="text" name="authorEn" value={formData.authorEn} onChange={handleChange} className={inputClass} />
            </div>
            <div>
              <label className={`${labelClass} text-right`} dir="rtl">الكاتب (عربي)</label>
              <input type="text" name="authorAr" value={formData.authorAr} onChange={handleChange} dir="rtl" className={`${inputClass} text-right`} />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className={sectionClass}>
          <h3 className="text-base font-semibold text-gray-900 pb-1 border-b border-gray-100">Content</h3>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <label className={labelClass}>Excerpt / Summary (English) <span className="text-red-500">*</span></label>
              <textarea required name="excerptEn" rows={3} value={formData.excerptEn} onChange={handleChange} className={`${inputClass} resize-none`} />
            </div>
            <div>
              <label className={`${labelClass} text-right`} dir="rtl">مقتطف / ملخص (عربي) <span className="text-red-500">*</span></label>
              <textarea required name="excerptAr" rows={3} value={formData.excerptAr} onChange={handleChange} dir="rtl" className={`${inputClass} resize-none text-right`} />
            </div>

            <div className="sm:col-span-2 border-t border-gray-100 pt-5">
              <label className={labelClass}>Full Content (English) <span className="text-red-500">*</span></label>
              <textarea required name="contentEn" rows={12} value={formData.contentEn} onChange={handleChange} className={`${inputClass} resize-none`} />
            </div>
            <div className="sm:col-span-2">
              <label className={`${labelClass} text-right`} dir="rtl">المحتوى الكامل (عربي) <span className="text-red-500">*</span></label>
              <textarea required name="contentAr" rows={12} value={formData.contentAr} onChange={handleChange} dir="rtl" className={`${inputClass} resize-none text-right`} />
            </div>
          </div>
        </div>

        {/* Media & Settings */}
        <div className={sectionClass}>
          <h3 className="text-base font-semibold text-gray-900 pb-1 border-b border-gray-100">Media & Status</h3>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <label className={labelClass}>Cover Image</label>
              <ImageUpload value={formData.image} onChange={(url) => setFormData((prev) => ({ ...prev, image: url }))} />
            </div>
            <div className="space-y-4">
              <div>
                <label className={labelClass}>Publication Status</label>
                <select name="status" value={formData.status} onChange={handleChange} className={inputClass}>
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                </select>
              </div>
              <label className="flex items-center gap-3 cursor-pointer pt-2">
                <input type="checkbox" name="featured" checked={formData.featured} onChange={handleChange} className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                <div>
                  <p className="text-sm font-semibold text-gray-700">Featured Article</p>
                  <p className="text-xs text-gray-400">Pin this article to the top of the blog page.</p>
                </div>
              </label>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
          <button type="button" onClick={() => router.push('/admin/dashboard/news')} className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition">
            <ChevronLeft className="w-4 h-4" /> Cancel
          </button>
          <button type="submit" disabled={isLoading} className="inline-flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-sm font-semibold rounded-xl transition shadow-sm">
            {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
            {isLoading ? 'Saving...' : articleId ? 'Update Article' : 'Publish Article'}
          </button>
        </div>
      </form>
    </div>
  );
}
