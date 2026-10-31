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
  ShieldCheck,
  Loader2,
  Save,
  Sliders,
  Search,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import Link from 'next/link';

interface InsurancePartnerItem {
  _id?: string;
  name: string;
  image: string;
  order?: number;
  active?: boolean;
  isCustom?: boolean;
  createdAt?: string;
}

function getLogoUrl(image: string): string {
  if (!image) return '';
  if (image.startsWith('http://') || image.startsWith('https://') || image.startsWith('/')) {
    return image;
  }
  return `/images/insurance/${image}`;
}

export default function InsurancePartnersAdminPage() {
  const { toast } = useToast();
  const [partners, setPartners] = useState<InsurancePartnerItem[]>([]);
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

  // Hero banner management
  const [bannerImage, setBannerImage] = useState('');
  const [isBannerLoading, setIsBannerLoading] = useState(true);
  const [isBannerSaving, setIsBannerSaving] = useState(false);

  // Load insurance partners & banner hero
  const loadData = async () => {
    setIsLoading(true);
    try {
      const res = await fetchApi('/api/insurance-partners?limit=500');
      if (res && res.data) {
        setPartners(res.data);
      }
    } catch {
      toast('Failed to load insurance partners from database.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const loadBanner = async () => {
    setIsBannerLoading(true);
    try {
      const res = await fetchApi('/api/page-heroes/insurance-partners');
      if (res && res.data && res.data.image) {
        setBannerImage(res.data.image);
      }
    } catch {
      // ignore
    } finally {
      setIsBannerLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    loadBanner();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSaveBanner = async () => {
    setIsBannerSaving(true);
    try {
      await fetchApi('/api/page-heroes/insurance-partners', {
        method: 'PATCH',
        body: JSON.stringify({ image: bannerImage }),
      });
      toast('Insurance partners hero banner saved successfully.', 'success');
    } catch {
      toast('Failed to save hero banner.', 'error');
    } finally {
      setIsBannerSaving(false);
    }
  };

  // Add partner (Additive - preserves all existing records)
  const handleAddPartner = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) {
      toast('Please enter company/partner name.', 'error');
      return;
    }
    if (!newImage.trim()) {
      toast('Please upload an insurance partner logo via Cloudinary.', 'error');
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

      const res = await fetchApi('/api/insurance-partners', {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      if (res && res.data) {
        toast(`Partner "${res.data.name}" added successfully alongside existing logos!`, 'success');
        // Add to local state
        setPartners((prev) => [...prev, res.data]);
        // Reset form
        setNewName('');
        setNewImage('');
        setNewOrder('');
        setNewActive(true);
        setIsAddingOpen(false);
      }
    } catch (err: any) {
      toast(err.message || 'Failed to add insurance partner.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Toggle active
  const handleToggleActive = async (id?: string, currentActive?: boolean) => {
    if (!id) return;
    setTogglingId(id);
    try {
      const res = await fetchApi(`/api/insurance-partners/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ active: !currentActive }),
      });
      if (res && res.data) {
        setPartners((prev) =>
          prev.map((p) => (p._id === id ? { ...p, active: res.data.active } : p))
        );
        toast(`Status updated to ${res.data.active ? 'Active' : 'Inactive'}.`, 'success');
      }
    } catch {
      toast('Failed to update partner status.', 'error');
    } finally {
      setTogglingId(null);
    }
  };

  // Delete partner
  const handleDeletePartner = async (id?: string, name?: string) => {
    if (!id) return;
    if (!confirm(`Are you sure you want to remove the insurance partner "${name || 'this logo'}"?`)) {
      return;
    }
    setDeletingId(id);
    try {
      await fetchApi(`/api/insurance-partners/${id}`, { method: 'DELETE' });
      setPartners((prev) => prev.filter((p) => p._id !== id));
      toast('Insurance partner removed successfully.', 'success');
    } catch {
      toast('Failed to delete partner.', 'error');
    } finally {
      setDeletingId(null);
    }
  };

  // Filtered partners
  const filteredPartners = useMemo(() => {
    if (!searchQuery.trim()) return partners;
    const q = searchQuery.toLowerCase().trim();
    return partners.filter((p) => p.name.toLowerCase().includes(q));
  }, [partners, searchQuery]);

  return (
    <div className="space-y-6">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 sm:p-6 rounded-2xl border border-gray-100 shadow-xs">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand/10 text-brand flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-brand-dark">Insurance Partner Logos</h1>
              <p className="text-xs sm:text-sm text-text-muted mt-0.5">
                Manage accepted insurance companies and TPA networks. Upload new logos without losing existing ones.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/en/insurance-partners"
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
            {isAddingOpen ? 'Close Form' : 'Upload New Insurance Logo'}
          </button>
        </div>
      </div>

      {/* ── Add New Partner Card (Additive) ── */}
      {isAddingOpen && (
        <div className="bg-white rounded-2xl border-2 border-brand/20 shadow-md p-5 sm:p-7 transition-all animate-in fade-in duration-200">
          <div className="flex items-center gap-2 pb-4 border-b border-gray-100 mb-5">
            <div className="w-8 h-8 rounded-lg bg-surface-mint text-brand flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-brand-dark">Add New Insurance Partner Logo</h2>
              <p className="text-xs text-text-muted">
                Uploaded logo will be added alongside your existing 29+ insurance partners.
              </p>
            </div>
          </div>

          <form onSubmit={handleAddPartner} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Partner Name */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700">
                  Company / Network Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Allianz, MedNet, AXA"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand"
                />
              </div>

              {/* Display Order */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700">
                  Display Order (Optional)
                </label>
                <input
                  type="number"
                  placeholder="e.g. 30 (leave blank for automatic order)"
                  value={newOrder}
                  onChange={(e) => setNewOrder(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand"
                />
              </div>
            </div>

            {/* Logo Image Upload via Cloudinary */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700">
                Partner Logo Image (Cloudinary) <span className="text-red-500">*</span>
              </label>
              <p className="text-xs text-text-muted mb-2">
                Upload a clear company logo (PNG, JPG, or SVG). Supports up to 20MB.
              </p>
              <ImageUpload
                value={newImage}
                onChange={(url) => setNewImage(url)}
              />
            </div>

            {/* Active Toggle */}
            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="partnerActiveCheck"
                checked={newActive}
                onChange={(e) => setNewActive(e.target.checked)}
                className="w-4 h-4 text-brand rounded focus:ring-brand/20"
              />
              <label htmlFor="partnerActiveCheck" className="text-sm font-medium text-gray-700 cursor-pointer">
                Publish logo immediately on the public website
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
                disabled={isSubmitting || !newName.trim() || !newImage.trim()}
                className="inline-flex items-center gap-2 px-5 py-2 bg-brand hover:bg-brand-medium text-white text-sm font-semibold rounded-xl transition shadow-xs disabled:opacity-50 cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Adding Logo...
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    Add Insurance Partner
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ── Public Page Hero Banner Editor ── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden">
        <div className="p-5 sm:p-6 bg-gradient-to-r from-surface-mint/30 to-white border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand text-white flex items-center justify-center shrink-0 shadow-xs">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-brand-dark">Public Page Hero Banner</h2>
                <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-surface-mint text-brand-dark border border-brand/10">
                  /insurance-partners
                </span>
              </div>
              <p className="text-xs text-text-muted mt-0.5">
                Set or change the background banner photo displayed at the top of the Insurance Partners page.
              </p>
            </div>
          </div>
          <button
            onClick={handleSaveBanner}
            disabled={isBannerSaving || isBannerLoading}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-brand text-white rounded-xl hover:bg-brand-medium disabled:opacity-50 text-sm font-semibold transition shadow-xs cursor-pointer shrink-0"
          >
            {isBannerSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save Banner
          </button>
        </div>

        <div className="p-5 sm:p-6">
          {isBannerLoading ? (
            <div className="flex items-center justify-center py-6">
              <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
            </div>
          ) : (
            <div className="max-w-2xl space-y-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted">
                Banner Background Image
              </label>
              <ImageUpload
                value={bannerImage}
                onChange={(url) => setBannerImage(url)}
              />
            </div>
          )}
        </div>
      </div>

      {/* ── Insurance Partners Directory ── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-xs p-5 sm:p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-gray-100">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-brand-dark">
              Active Partners Directory ({partners.length})
            </h2>
            <p className="text-xs text-text-muted mt-0.5">
              All displayed health insurance companies. Existing and newly uploaded logos appear together.
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
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((i) => (
              <div key={i} className="h-32 bg-gray-100 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : filteredPartners.length === 0 ? (
          <div className="text-center py-12">
            <ShieldCheck className="w-10 h-10 text-gray-300 mx-auto mb-2" />
            <p className="text-sm font-semibold text-gray-700">No insurance partners found</p>
            <p className="text-xs text-gray-500 mt-1">
              {searchQuery ? 'Try matching a different company name.' : 'Click "Upload New Insurance Logo" to add your first partner.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {filteredPartners.map((partner, idx) => {
              const logoSrc = getLogoUrl(partner.image);
              const isCustom = partner.isCustom || partner.image.startsWith('http');

              return (
                <div
                  key={partner._id || idx}
                  className="relative group bg-[#FBFDFD] border border-gray-200/80 rounded-2xl p-3 flex flex-col justify-between hover:border-brand/40 hover:shadow-card transition-all"
                >
                  {/* Top Badges */}
                  <div className="flex items-center justify-between text-[10px] mb-2">
                    <span className="font-mono text-gray-400">#{partner.order ?? idx + 1}</span>
                    <span
                      className={`px-1.5 py-0.5 rounded font-semibold ${
                        isCustom
                          ? 'bg-blue-50 text-blue-700 border border-blue-200/60'
                          : 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
                      }`}
                    >
                      {isCustom ? 'Uploaded' : 'Original'}
                    </span>
                  </div>

                  {/* Image Preview Container */}
                  <div className="relative w-full h-20 bg-white rounded-xl border border-gray-100 p-2 flex items-center justify-center overflow-hidden mb-2.5">
                    {logoSrc ? (
                      <Image
                        src={logoSrc}
                        alt={`${partner.name} logo`}
                        fill
                        sizes="160px"
                        className="object-contain p-2 mix-blend-multiply group-hover:scale-105 transition-transform"
                      />
                    ) : (
                      <span className="text-xs text-gray-300">No Image</span>
                    )}
                  </div>

                  {/* Partner Name */}
                  <p className="text-xs font-bold text-brand-dark text-center truncate mb-3" title={partner.name}>
                    {partner.name}
                  </p>

                  {/* Action Bar */}
                  <div className="flex items-center justify-between pt-2 border-t border-gray-100 gap-1.5">
                    {/* Active toggle */}
                    <button
                      type="button"
                      onClick={() => handleToggleActive(partner._id, partner.active)}
                      disabled={togglingId === partner._id || !partner._id}
                      className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-1 rounded-lg transition ${
                        partner.active !== false
                          ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                          : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                      }`}
                      title={partner.active !== false ? 'Active on site' : 'Hidden from site'}
                    >
                      {togglingId === partner._id ? (
                        <Loader2 className="w-3 h-3 animate-spin" />
                      ) : partner.active !== false ? (
                        <CheckCircle2 className="w-3 h-3" />
                      ) : (
                        <XCircle className="w-3 h-3" />
                      )}
                      <span>{partner.active !== false ? 'Live' : 'Hidden'}</span>
                    </button>

                    {/* Delete button (available for all database records) */}
                    {partner._id && (
                      <button
                        type="button"
                        onClick={() => handleDeletePartner(partner._id, partner.name)}
                        disabled={deletingId === partner._id}
                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                        title="Remove partner"
                      >
                        {deletingId === partner._id ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Trash2 className="w-3.5 h-3.5" />
                        )}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
