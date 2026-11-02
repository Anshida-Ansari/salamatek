'use client';

import { useEffect, useState, useMemo } from 'react';
import Image from 'next/image';
import { fetchApi } from '@/lib/admin/api';
import { useToast } from '@/components/admin/ToastProvider';
import ImageUpload from '@/components/admin/ImageUpload';
import {
  Plus,
  Trash2,
  CheckCircle2,
  XCircle,
  BadgePercent,
  Loader2,
  Save,
  Search,
  Sparkles,
  ExternalLink,
  Edit2,
  X,
  ShieldCheck,
} from 'lucide-react';
import Link from 'next/link';

interface CashDiscountCompanyItem {
  _id?: string;
  name: string;
  image: string;
  order?: number;
  active?: boolean;
  createdAt?: string;
}

function getLogoUrl(image: string): string {
  if (!image) return '';
  if (image.startsWith('http://') || image.startsWith('https://') || image.startsWith('/')) {
    return image;
  }
  return `/images/insurance/${image}`;
}

export default function CashDiscountCompaniesAdminPage() {
  const { toast } = useToast();
  const [companies, setCompanies] = useState<CashDiscountCompanyItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Add new logo state
  const [isAddingOpen, setIsAddingOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newImage, setNewImage] = useState('');
  const [newOrder, setNewOrder] = useState<number | ''>('');
  const [newActive, setNewActive] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Edit company modal state
  const [editingCompany, setEditingCompany] = useState<CashDiscountCompanyItem | null>(null);
  const [editName, setEditName] = useState('');
  const [editImage, setEditImage] = useState('');
  const [editOrder, setEditOrder] = useState<number | ''>('');
  const [editActive, setEditActive] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleOpenEdit = (company: CashDiscountCompanyItem) => {
    setEditingCompany(company);
    setEditName(company.name || '');
    setEditImage(company.image || '');
    setEditOrder(company.order !== undefined ? company.order : '');
    setEditActive(company.active !== false);
  };

  const handleUpdateCompany = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCompany?._id) return;
    if (!editImage || !editImage.trim()) {
      toast('Please upload or provide a logo image.', 'error');
      return;
    }

    setIsUpdating(true);
    try {
      const res = await fetchApi(`/api/cash-discount-companies/${editingCompany._id}`, {
        method: 'PUT',
        body: JSON.stringify({
          name: editName.trim(),
          image: editImage.trim(),
          order: editOrder === '' ? undefined : Number(editOrder),
          active: editActive,
        }),
      });

      if (res && res.data) {
        toast(`"${editName || 'Company'}" updated successfully.`, 'success');
        setCompanies((prev) =>
          prev.map((c) => (c._id === editingCompany._id ? res.data : c))
        );
        setEditingCompany(null);
      }
    } catch {
      toast('Failed to update cash discount company.', 'error');
    } finally {
      setIsUpdating(false);
    }
  };

  // Load companies
  const loadData = async () => {
    setIsLoading(true);
    try {
      const res = await fetchApi('/api/cash-discount-companies?limit=500');
      if (res && res.data) {
        setCompanies(res.data);
      }
    } catch {
      toast('Failed to load cash discount companies from database.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Add company
  const handleAddCompany = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newImage.trim()) {
      toast('Please upload a cash discount company logo.', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload: any = {
        name: newName.trim(),
        image: newImage.trim(),
        active: newActive,
      };
      if (newOrder !== '') {
        payload.order = Number(newOrder);
      }

      const res = await fetchApi('/api/cash-discount-companies', {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      if (res && res.data) {
        toast(
          res.data.name
            ? `Company "${res.data.name}" added successfully!`
            : 'Cash discount company logo added successfully!',
          'success'
        );
        setCompanies((prev) => [...prev, res.data]);
        setNewName('');
        setNewImage('');
        setNewOrder('');
        setNewActive(true);
        setIsAddingOpen(false);
      }
    } catch (err: any) {
      toast(err.message || 'Failed to add company logo.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Toggle active
  const handleToggleActive = async (id?: string, currentActive?: boolean) => {
    if (!id) return;
    setTogglingId(id);
    try {
      const res = await fetchApi(`/api/cash-discount-companies/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ active: !currentActive }),
      });
      if (res && res.data) {
        setCompanies((prev) =>
          prev.map((c) => (c._id === id ? { ...c, active: res.data.active } : c))
        );
        toast(`Status updated to ${res.data.active ? 'Active' : 'Hidden'}.`, 'success');
      }
    } catch {
      toast('Failed to update company status.', 'error');
    } finally {
      setTogglingId(null);
    }
  };

  // Delete company
  const handleDeleteCompany = async (id?: string, name?: string) => {
    if (!id) return;
    if (!confirm(`Are you sure you want to remove "${name || 'this company logo'}"?`)) {
      return;
    }
    setDeletingId(id);
    try {
      await fetchApi(`/api/cash-discount-companies/${id}`, { method: 'DELETE' });
      setCompanies((prev) => prev.filter((c) => c._id !== id));
      toast('Company removed successfully.', 'success');
    } catch {
      toast('Failed to delete company.', 'error');
    } finally {
      setDeletingId(null);
    }
  };

  // Filtered list
  const filteredCompanies = useMemo(() => {
    if (!searchQuery.trim()) return companies;
    const q = searchQuery.toLowerCase().trim();
    return companies.filter((c) => c.name.toLowerCase().includes(q));
  }, [companies, searchQuery]);

  return (
    <div className="space-y-6">
      {/* ── Sub Navigation Tabs ── */}
      <div className="flex items-center gap-2 border-b border-gray-200 pb-3">
        <Link
          href="/admin/dashboard/insurance-partners"
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 hover:text-brand hover:bg-gray-50 rounded-xl transition"
        >
          <ShieldCheck className="w-4 h-4 text-gray-400" />
          <span>Insurance Partners</span>
        </Link>
        <Link
          href="/admin/dashboard/cash-discount-companies"
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-bold text-brand bg-brand/10 rounded-xl transition"
        >
          <BadgePercent className="w-4 h-4 text-brand" />
          <span>Cash Discount Companies</span>
          <span className="ml-1 text-xs px-2 py-0.5 rounded-full bg-brand text-white font-semibold">
            {companies.length}
          </span>
        </Link>
      </div>

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 sm:p-6 rounded-2xl border border-gray-100 shadow-xs">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand/10 text-brand flex items-center justify-center">
              <BadgePercent className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-brand-dark">Cash Discount Companies</h1>
              <p className="text-xs sm:text-sm text-text-muted mt-0.5">
                Manage partner companies offering cash discounts on medical services. Logos appear under the Cash Discount Companies heading.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/en/insurance-partners#cash-discount-companies"
            target="_blank"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-brand hover:text-brand-dark bg-brand/5 hover:bg-brand/10 rounded-xl transition"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            View Public Page
          </Link>
          <button
            onClick={() => setIsAddingOpen((prev) => !prev)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-brand hover:bg-brand-medium text-white text-sm font-semibold rounded-xl transition shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            {isAddingOpen ? 'Close Form' : 'Upload Cash Discount Logo'}
          </button>
        </div>
      </div>

      {/* ── Add New Logo Form ── */}
      {isAddingOpen && (
        <div className="bg-white rounded-2xl border-2 border-brand/20 shadow-md p-5 sm:p-7 transition-all animate-in fade-in duration-200">
          <div className="flex items-center gap-2 pb-4 border-b border-gray-100 mb-5">
            <div className="w-8 h-8 rounded-lg bg-surface-mint text-brand flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-brand-dark">Add New Cash Discount Company</h2>
              <p className="text-xs text-text-muted">
                Uploaded logo will be displayed on the Insurance page under &quot;Cash Discount Companies&quot;.
              </p>
            </div>
          </div>

          <form onSubmit={handleAddCompany} className="space-y-5">
            {/* Logo Image Upload */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700">
                Upload Logo Image <span className="text-red-500">*</span>
              </label>
              <p className="text-xs text-text-muted mb-2">
                Upload a high-quality logo (PNG, JPG, WebP, SVG). Automatically hosted via Cloudinary.
              </p>
              <ImageUpload
                value={newImage}
                onChange={(url) => setNewImage(url)}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-1">
              {/* Company Name */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700">
                  Company / Discount Network Name (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Al Rajhi Takaful Discount, Waed, etc."
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand"
                />
              </div>

              {/* Display Order */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700">
                  Display Order (Optional)
                </label>
                <input
                  type="number"
                  placeholder="e.g. 1, 2, 3 (leave blank for automatic)"
                  value={newOrder}
                  onChange={(e) => setNewOrder(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand"
                />
              </div>
            </div>

            {/* Active Toggle */}
            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="companyActiveCheck"
                checked={newActive}
                onChange={(e) => setNewActive(e.target.checked)}
                className="w-4 h-4 text-brand rounded focus:ring-brand/20"
              />
              <label htmlFor="companyActiveCheck" className="text-sm font-medium text-gray-700 cursor-pointer">
                Publish logo immediately on public Insurance page
              </label>
            </div>

            {/* Buttons */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setIsAddingOpen(false)}
                className="px-4 py-2 text-sm font-semibold text-gray-600 hover:text-gray-800 bg-gray-100 hover:bg-gray-200 rounded-xl transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !newImage.trim()}
                className="inline-flex items-center gap-2 px-5 py-2 bg-brand hover:bg-brand-medium text-white text-sm font-semibold rounded-xl transition shadow-xs disabled:opacity-50 cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Adding Company...
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    Add Company Logo
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ── Companies Directory ── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-xs p-5 sm:p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-gray-100">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-brand-dark">
              Cash Discount Companies ({companies.length})
            </h2>
            <p className="text-xs text-text-muted mt-0.5">
              Logos displayed under the Cash Discount Companies heading on the public Insurance page.
            </p>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search company name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 py-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-32 bg-gray-100 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : filteredCompanies.length === 0 ? (
          <div className="text-center py-12">
            <BadgePercent className="w-10 h-10 text-gray-300 mx-auto mb-2" />
            <p className="text-sm font-semibold text-gray-700">No cash discount companies uploaded yet</p>
            <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
              {searchQuery
                ? 'Try matching a different company name.'
                : 'The heading &quot;Cash Discount Companies&quot; remains visible on the website. Click &quot;Upload Cash Discount Logo&quot; above to add logos whenever you are ready.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {filteredCompanies.map((company, idx) => {
              const logoSrc = getLogoUrl(company.image);

              return (
                <div
                  key={company._id || idx}
                  className="relative group bg-[#FBFDFD] border border-gray-200/80 rounded-2xl p-3 flex flex-col justify-between hover:border-brand/40 hover:shadow-card transition-all"
                >
                  {/* Top Badges */}
                  <div className="flex items-center justify-between text-[10px] mb-2">
                    <span className="font-mono text-gray-400">#{company.order ?? idx + 1}</span>
                    <span className="px-1.5 py-0.5 rounded font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                      Cash Discount
                    </span>
                  </div>

                  {/* Image Preview Container */}
                  <div className="relative w-full h-20 bg-white rounded-xl border border-gray-100 p-2 flex items-center justify-center overflow-hidden mb-2.5">
                    {logoSrc ? (
                      <Image
                        src={logoSrc}
                        alt={`${company.name || 'Company'} logo`}
                        fill
                        sizes="160px"
                        className="object-contain p-2 mix-blend-multiply group-hover:scale-105 transition-transform"
                      />
                    ) : (
                      <span className="text-xs text-gray-300">No Image</span>
                    )}
                  </div>

                  {/* Company Name */}
                  <p
                    className="text-xs font-bold text-brand-dark text-center truncate mb-3"
                    title={company.name || 'Cash Discount Company'}
                  >
                    {company.name || 'Cash Discount Company'}
                  </p>

                  {/* Action Bar */}
                  <div className="flex items-center justify-between pt-2 border-t border-gray-100 gap-1.5">
                    {/* Active toggle */}
                    <button
                      type="button"
                      onClick={() => handleToggleActive(company._id, company.active)}
                      disabled={togglingId === company._id || !company._id}
                      className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-1 rounded-lg transition ${
                        company.active !== false
                          ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                          : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                      }`}
                      title={company.active !== false ? 'Active on site' : 'Hidden from site'}
                    >
                      {togglingId === company._id ? (
                        <Loader2 className="w-3 h-3 animate-spin" />
                      ) : company.active !== false ? (
                        <CheckCircle2 className="w-3 h-3" />
                      ) : (
                        <XCircle className="w-3 h-3" />
                      )}
                      <span>{company.active !== false ? 'Live' : 'Hidden'}</span>
                    </button>

                    <div className="flex items-center gap-1">
                      {/* Edit button */}
                      {company._id && (
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(company)}
                          className="p-1.5 text-gray-400 hover:text-brand hover:bg-brand-mint/40 rounded-lg transition"
                          title="Edit company name or logo"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                      )}

                      {/* Delete button */}
                      {company._id && (
                        <button
                          type="button"
                          onClick={() => handleDeleteCompany(company._id, company.name)}
                          disabled={deletingId === company._id}
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                          title="Remove company"
                        >
                          {deletingId === company._id ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <Trash2 className="w-3.5 h-3.5" />
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Edit Modal ── */}
      {editingCompany && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 max-w-lg w-full p-6 space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-brand/10 text-brand flex items-center justify-center">
                  <Edit2 className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-brand-dark text-base">Edit Cash Discount Company</h3>
              </div>
              <button
                type="button"
                onClick={() => setEditingCompany(null)}
                className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateCompany} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-1.5">
                  Company Name <span className="text-gray-400 font-normal">(displayed below logo)</span>
                </label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder="e.g. Al Rajhi Takaful Discount"
                  className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-1.5">
                  Company Logo Image *
                </label>
                <ImageUpload
                  value={editImage}
                  onChange={(url) => setEditImage(url)}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-1.5">
                    Display Order
                  </label>
                  <input
                    type="number"
                    value={editOrder}
                    onChange={(e) => setEditOrder(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-1.5">
                    Status
                  </label>
                  <select
                    value={editActive ? 'active' : 'hidden'}
                    onChange={(e) => setEditActive(e.target.value === 'active')}
                    className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand bg-white"
                  >
                    <option value="active">Active (Visible)</option>
                    <option value="hidden">Hidden</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setEditingCompany(null)}
                  className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-xl transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="inline-flex items-center gap-2 px-5 py-2 text-xs font-bold text-white bg-brand hover:bg-brand-dark rounded-xl transition shadow-xs disabled:opacity-50"
                >
                  {isUpdating ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-3.5 h-3.5" />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
