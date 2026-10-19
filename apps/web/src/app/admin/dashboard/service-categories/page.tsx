'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { fetchApi } from '@/lib/admin/api';
import { useToast } from '@/components/admin/ToastProvider';
import { translateText } from '@/lib/admin/translate';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Layers,
  Loader2,
  X,
  Languages,
  CheckCircle2,
  XCircle,
  ArrowLeft,
  Stethoscope,
} from 'lucide-react';

interface ServiceCategory {
  _id: string;
  name: { en: string; ar: string };
  slug: string;
  description?: { en?: string; ar?: string };
  order: number;
  active: boolean;
  servicesCount?: number;
}

interface FormState {
  nameEn: string;
  nameAr: string;
  slug: string;
  descriptionEn: string;
  descriptionAr: string;
  order: number;
  active: boolean;
}

const emptyForm: FormState = {
  nameEn: '',
  nameAr: '',
  slug: '',
  descriptionEn: '',
  descriptionAr: '',
  order: 0,
  active: true,
};

export default function ServiceCategoriesPage() {
  const { toast } = useToast();
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormState>(emptyForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const loadCategories = async () => {
    setIsLoading(true);
    try {
      const res = await fetchApi(
        `/api/service-categories?limit=100&search=${encodeURIComponent(search)}`
      );
      setCategories(res.data ?? []);
    } catch {
      toast('Failed to load service categories.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      loadCategories();
    }, 300);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const handleOpenAddModal = () => {
    setEditingId(null);
    setFormData({
      ...emptyForm,
      order: categories.length + 1,
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (cat: ServiceCategory) => {
    setEditingId(cat._id);
    setFormData({
      nameEn: cat.name?.en ?? '',
      nameAr: cat.name?.ar ?? '',
      slug: cat.slug ?? '',
      descriptionEn: cat.description?.en ?? '',
      descriptionAr: cat.description?.ar ?? '',
      order: cat.order ?? 0,
      active: cat.active !== false,
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setFormData(emptyForm);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === 'checkbox'
          ? (e.target as HTMLInputElement).checked
          : type === 'number'
          ? Number(value)
          : value,
    }));
  };

  const handleTranslate = async () => {
    if (!formData.nameEn) {
      toast('Please enter English name first.', 'error');
      return;
    }
    setIsTranslating(true);
    try {
      const [nameAr, descriptionAr] = await Promise.all([
        translateText(formData.nameEn),
        formData.descriptionEn
          ? translateText(formData.descriptionEn)
          : Promise.resolve(''),
      ]);
      setFormData((prev) => ({
        ...prev,
        nameAr,
        descriptionAr: descriptionAr || prev.descriptionAr,
      }));
      toast('Translation completed.', 'success');
    } catch {
      toast('Failed to auto-translate.', 'error');
    } finally {
      setIsTranslating(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const generatedSlug =
      formData.slug.trim() ||
      formData.nameEn
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');

    const payload = {
      name: { en: formData.nameEn.trim(), ar: formData.nameAr.trim() },
      slug: generatedSlug,
      description: {
        en: formData.descriptionEn.trim(),
        ar: formData.descriptionAr.trim(),
      },
      order: Number(formData.order) || 0,
      active: formData.active,
    };

    try {
      if (editingId) {
        await fetchApi(`/api/service-categories/${editingId}`, {
          method: 'PATCH',
          body: JSON.stringify(payload),
        });
        toast('Category updated successfully.', 'success');
      } else {
        await fetchApi('/api/service-categories', {
          method: 'POST',
          body: JSON.stringify(payload),
        });
        toast('Category created successfully.', 'success');
      }
      handleCloseModal();
      loadCategories();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to save category.';
      toast(msg, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (cat: ServiceCategory) => {
    if (
      !confirm(
        `Are you sure you want to delete "${cat.name.en}"?\n\nThis cannot be undone.`
      )
    )
      return;

    setDeletingId(cat._id);
    try {
      await fetchApi(`/api/service-categories/${cat._id}`, {
        method: 'DELETE',
      });
      toast(`Category "${cat.name.en}" deleted.`, 'success');
      loadCategories();
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : 'Failed to delete category.';
      toast(msg, 'error');
    } finally {
      setDeletingId(null);
    }
  };

  const handleToggleActive = async (cat: ServiceCategory) => {
    setTogglingId(cat._id);
    try {
      await fetchApi(`/api/service-categories/${cat._id}`, {
        method: 'PATCH',
        body: JSON.stringify({ active: !cat.active }),
      });
      toast(
        `"${cat.name.en}" is now ${!cat.active ? 'active' : 'inactive'}.`,
        'success'
      );
      setCategories((prev) =>
        prev.map((c) => (c._id === cat._id ? { ...c, active: !c.active } : c))
      );
    } catch {
      toast('Failed to update status.', 'error');
    } finally {
      setTogglingId(null);
    }
  };

  const inputClass =
    'block w-full px-3.5 py-2.5 bg-white border border-border rounded-xl text-sm text-text-base placeholder-text-subtle focus:outline-none focus:ring-2 focus:ring-brand-medium focus:border-brand-medium transition';
  const labelClass = 'block text-sm font-semibold text-text-base mb-1.5';

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Link
              href="/admin/dashboard/services"
              className="inline-flex items-center gap-1 text-xs text-text-muted hover:text-brand-dark transition font-medium"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back to Services
            </Link>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-brand-dark flex items-center gap-2.5">
            <Layers className="w-7 h-7 text-brand" />
            Service Categories
          </h1>
          <p className="text-sm text-text-muted mt-1">
            Group related clinical and occupational health services under structured categories.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/dashboard/services"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-white border border-border hover:bg-surface-mint text-text-base text-sm font-semibold rounded-xl transition shadow-sm cursor-pointer"
          >
            <Stethoscope className="w-4 h-4 text-brand-medium" />
            View Services
          </Link>
          <button
            onClick={handleOpenAddModal}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-brand hover:bg-brand-medium text-white text-sm font-semibold rounded-xl transition shadow-sm cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Add Category
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted pointer-events-none" />
        <input
          type="text"
          className="block w-full pl-10 pr-4 py-2.5 bg-white border border-border rounded-xl text-sm text-text-base placeholder-text-subtle focus:outline-none focus:ring-2 focus:ring-brand-medium focus:border-brand-medium"
          placeholder="Search categories..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
        {isLoading ? (
          <div className="py-20 flex flex-col items-center justify-center text-text-muted gap-3">
            <Loader2 className="w-7 h-7 animate-spin text-brand-medium" />
            <p className="text-sm">Loading categories...</p>
          </div>
        ) : categories.length === 0 ? (
          <div className="py-16 text-center">
            <div className="w-14 h-14 bg-surface-mint rounded-2xl flex items-center justify-center mx-auto mb-3 text-brand-medium">
              <Layers className="w-7 h-7" />
            </div>
            <h3 className="text-base font-semibold text-text-base mb-1">
              {search ? 'No categories found' : 'No service categories yet'}
            </h3>
            <p className="text-sm text-text-muted max-w-sm mx-auto mb-5">
              {search
                ? `No categories match "${search}".`
                : 'Create your first service category to group services.'}
            </p>
            {!search && (
              <button
                onClick={handleOpenAddModal}
                className="inline-flex items-center gap-2 px-4 py-2 bg-brand text-white text-sm font-semibold rounded-xl hover:bg-brand-medium transition cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                Add First Category
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/80">
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3.5">
                    Order
                  </th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3.5">
                    Category Name (EN / AR)
                  </th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3.5 hidden md:table-cell">
                    Slug
                  </th>
                  <th className="text-center text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3.5">
                    Assigned Services
                  </th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3.5">
                    Status
                  </th>
                  <th className="text-right text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3.5">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {categories.map((cat) => (
                  <tr key={cat._id} className="hover:bg-gray-50/70 transition-colors">
                    <td className="px-6 py-4 font-mono text-xs text-text-muted">
                      #{cat.order ?? 0}
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-semibold text-gray-900">{cat.name.en}</p>
                        <p className="text-xs text-brand-dark/70 font-arabic" dir="rtl">
                          {cat.name.ar}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-mono text-xs text-gray-500 hidden md:table-cell">
                      {cat.slug}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-surface-mint text-brand-dark border border-brand-pale/40">
                        {cat.servicesCount ?? 0} service{(cat.servicesCount ?? 0) !== 1 ? 's' : ''}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleToggleActive(cat)}
                        disabled={togglingId === cat._id}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold transition ${
                          cat.active
                            ? 'bg-green-100 text-green-700 hover:bg-green-200'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        } disabled:opacity-50`}
                      >
                        {togglingId === cat._id ? (
                          <Loader2 className="w-3 h-3 animate-spin" />
                        ) : cat.active ? (
                          <CheckCircle2 className="w-3 h-3" />
                        ) : (
                          <XCircle className="w-3 h-3" />
                        )}
                        {cat.active ? 'Active' : 'Inactive'}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEditModal(cat)}
                          className="p-1.5 text-gray-400 hover:text-brand hover:bg-surface-mint rounded-lg transition"
                          title="Edit Category"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(cat)}
                          disabled={deletingId === cat._id}
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition disabled:opacity-50"
                          title="Delete Category"
                        >
                          {deletingId === cat._id ? (
                            <Loader2 className="w-4 h-4 animate-spin text-red-500" />
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add / Edit Category Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-border space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h2 className="text-xl font-serif font-bold text-brand-dark flex items-center gap-2">
                <Layers className="w-5 h-5 text-brand" />
                {editingId ? 'Edit Service Category' : 'Add Service Category'}
              </h2>
              <button
                type="button"
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-gray-600 p-1.5 rounded-lg hover:bg-gray-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleTranslate}
                  disabled={isTranslating}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-surface-mint text-brand-dark text-xs font-semibold rounded-lg hover:bg-brand-pale/30 border border-brand-pale/40 transition cursor-pointer"
                >
                  {isTranslating ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Languages className="w-3.5 h-3.5" />
                  )}
                  Auto-Translate to Arabic
                </button>
              </div>

              <div>
                <label className={labelClass}>
                  English Category Name <span className="text-red-500">*</span>
                </label>
                <input
                  required
                  type="text"
                  name="nameEn"
                  value={formData.nameEn}
                  onChange={handleChange}
                  placeholder="e.g. Industrial Medical Services"
                  className={inputClass}
                />
              </div>

              <div>
                <label className={`${labelClass} text-right`} dir="rtl">
                  اسم الفئة بالعربية <span className="text-red-500">*</span>
                </label>
                <input
                  required
                  type="text"
                  name="nameAr"
                  value={formData.nameAr}
                  onChange={handleChange}
                  dir="rtl"
                  placeholder="مثال: الخدمات الطبية الصناعية"
                  className={`${inputClass} text-right`}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>
                    Slug <span className="text-xs font-normal text-gray-400">(Auto if empty)</span>
                  </label>
                  <input
                    type="text"
                    name="slug"
                    value={formData.slug}
                    onChange={handleChange}
                    placeholder="e.g. industrial-medical-services"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Display Order</label>
                  <input
                    type="number"
                    name="order"
                    min="0"
                    value={formData.order}
                    onChange={handleChange}
                    placeholder="1"
                    className={inputClass}
                  />
                </div>
              </div>

              <div>
                <label className={labelClass}>English Description (Optional)</label>
                <textarea
                  name="descriptionEn"
                  rows={3}
                  value={formData.descriptionEn}
                  onChange={handleChange}
                  placeholder="Brief description of this group of services..."
                  className={`${inputClass} resize-none`}
                />
              </div>

              <div>
                <label className={`${labelClass} text-right`} dir="rtl">
                  الوصف بالعربية (اختياري)
                </label>
                <textarea
                  name="descriptionAr"
                  rows={3}
                  value={formData.descriptionAr}
                  onChange={handleChange}
                  dir="rtl"
                  placeholder="وصف مختصر لمجموعة الخدمات هذه..."
                  className={`${inputClass} resize-none text-right`}
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  id="modal-active"
                  name="active"
                  type="checkbox"
                  checked={formData.active}
                  onChange={handleChange}
                  className="h-4 w-4 rounded border-border text-brand-medium focus:ring-brand-medium"
                />
                <label htmlFor="modal-active" className="text-sm font-semibold text-text-base cursor-pointer">
                  Active (Visible on Website)
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2.5 text-sm font-semibold text-text-muted hover:bg-gray-100 rounded-xl transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand hover:bg-brand-medium text-white text-sm font-semibold rounded-xl transition shadow-sm disabled:opacity-50 cursor-pointer"
                >
                  {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  {editingId ? 'Update Category' : 'Create Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
