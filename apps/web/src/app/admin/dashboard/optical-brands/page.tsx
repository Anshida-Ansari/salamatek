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
  Glasses,
  Loader2,
  Save,
  Sliders,
  Search,
  Sparkles,
  ExternalLink,
  Phone,
  MapPin,
} from 'lucide-react';
import Link from 'next/link';

interface OpticalBrandItem {
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
  return `/images/opticals/${image}`;
}

export default function OpticalBrandsAdminPage() {
  const { toast } = useToast();
  const [brands, setBrands] = useState<OpticalBrandItem[]>([]);
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

  // Opticals Contact & Location Settings
  const [contactNumber, setContactNumber] = useState('+966 55 929 3222');
  const [shortLocation, setShortLocation] = useState('Safwa');
  const [mapUrl, setMapUrl] = useState('https://maps.app.goo.gl/NCs1qV9fBLEpk9YK9?g_st=aw');
  const [isContactSaving, setIsContactSaving] = useState(false);

  // Load optical brands & banner hero
  const loadData = async () => {
    setIsLoading(true);
    try {
      const res = await fetchApi('/api/optical-brands?limit=500');
      if (res && res.data) {
        setBrands(res.data);
      }
    } catch {
      toast('Failed to load optical brands from database.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const loadHeroAndSettings = async () => {
    setIsBannerLoading(true);
    try {
      const res = await fetchApi('/api/page-heroes/optical-brands');
      if (res && res.data) {
        if (res.data.image) setBannerImage(res.data.image);
        if (res.data.contactNumber) setContactNumber(res.data.contactNumber);
        if (res.data.shortLocation) setShortLocation(res.data.shortLocation);
        if (res.data.mapUrl) setMapUrl(res.data.mapUrl);
      }
    } catch {
      // ignore
    } finally {
      setIsBannerLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    loadHeroAndSettings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSaveBanner = async () => {
    setIsBannerSaving(true);
    try {
      await fetchApi('/api/page-heroes/optical-brands', {
        method: 'PATCH',
        body: JSON.stringify({ image: bannerImage }),
      });
      toast('Optical brands hero banner saved successfully.', 'success');
    } catch {
      toast('Failed to save hero banner.', 'error');
    } finally {
      setIsBannerSaving(false);
    }
  };

  const handleSaveContact = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsContactSaving(true);
    try {
      await fetchApi('/api/page-heroes/optical-brands', {
        method: 'PATCH',
        body: JSON.stringify({
          contactNumber: contactNumber.trim(),
          shortLocation: shortLocation.trim(),
          mapUrl: mapUrl.trim(),
        }),
      });
      toast('Opticals contact number and location saved successfully.', 'success');
    } catch {
      toast('Failed to save contact information.', 'error');
    } finally {
      setIsContactSaving(false);
    }
  };

  // Add brand (Additive - preserves all existing records)
  const handleAddBrand = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newImage.trim()) {
      toast('Please upload a brand logo.', 'error');
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

      const res = await fetchApi('/api/optical-brands', {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      if (res && res.data) {
        toast(res.data.name ? `Brand "${res.data.name}" added successfully!` : 'Brand logo added successfully!', 'success');
        // Add to local state
        setBrands((prev) => [...prev, res.data]);
        // Reset form
        setNewName('');
        setNewImage('');
        setNewOrder('');
        setNewActive(true);
        setIsAddingOpen(false);
      }
    } catch (err: any) {
      toast(err.message || 'Failed to add brand logo.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Toggle active
  const handleToggleActive = async (id?: string, currentActive?: boolean) => {
    if (!id) return;
    setTogglingId(id);
    try {
      const res = await fetchApi(`/api/optical-brands/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ active: !currentActive }),
      });
      if (res && res.data) {
        setBrands((prev) =>
          prev.map((b) => (b._id === id ? { ...b, active: res.data.active } : b))
        );
        toast(`Status updated to ${res.data.active ? 'Active' : 'Inactive'}.`, 'success');
      }
    } catch {
      toast('Failed to update brand status.', 'error');
    } finally {
      setTogglingId(null);
    }
  };

  // Delete brand
  const handleDeleteBrand = async (id?: string, name?: string) => {
    if (!id) return;
    if (!confirm(`Are you sure you want to remove the brand "${name || 'this logo'}"?`)) {
      return;
    }
    setDeletingId(id);
    try {
      await fetchApi(`/api/optical-brands/${id}`, { method: 'DELETE' });
      setBrands((prev) => prev.filter((b) => b._id !== id));
      toast('Brand removed successfully.', 'success');
    } catch {
      toast('Failed to delete brand.', 'error');
    } finally {
      setDeletingId(null);
    }
  };

  // Filtered brands
  const filteredBrands = useMemo(() => {
    if (!searchQuery.trim()) return brands;
    const q = searchQuery.toLowerCase().trim();
    return brands.filter((b) => b.name.toLowerCase().includes(q));
  }, [brands, searchQuery]);

  return (
    <div className="space-y-6">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 sm:p-6 rounded-2xl border border-gray-100 shadow-xs">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand/10 text-brand flex items-center justify-center">
              <Glasses className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-brand-dark">Optical Brand Logos</h1>
              <p className="text-xs sm:text-sm text-text-muted mt-0.5">
                Manage optical frame & sunglasses brand logos. Upload new logos without losing existing brands.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/en/optical-brands"
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
            {isAddingOpen ? 'Close Form' : 'Upload New Brand Logo'}
          </button>
        </div>
      </div>

      {/* ── Add New Brand Card (Additive) ── */}
      {isAddingOpen && (
        <div className="bg-white rounded-2xl border-2 border-brand/20 shadow-md p-5 sm:p-7 transition-all animate-in fade-in duration-200">
          <div className="flex items-center gap-2 pb-4 border-b border-gray-100 mb-5">
            <div className="w-8 h-8 rounded-lg bg-surface-mint text-brand flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-brand-dark">Add New Optical Brand Logo</h2>
              <p className="text-xs text-text-muted">
                Uploaded logo will be added alongside your existing 28+ brands.
              </p>
            </div>
          </div>

          <form onSubmit={handleAddBrand} className="space-y-5">
            {/* Logo Image Upload */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700">
                Upload Logo Image <span className="text-red-500">*</span>
              </label>
              <p className="text-xs text-text-muted mb-2">
                Upload a transparent PNG, JPG, WebP, or SVG logo. Supports up to 20MB.
              </p>
              <ImageUpload
                value={newImage}
                onChange={(url) => setNewImage(url)}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-1">
              {/* Brand Name (Optional) */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700">
                  Brand Name (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Tom Ford, Persol, Lindberg (or leave blank)"
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
                  placeholder="e.g. 29 (leave blank for automatic order)"
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
                id="brandActiveCheck"
                checked={newActive}
                onChange={(e) => setNewActive(e.target.checked)}
                className="w-4 h-4 text-brand rounded focus:ring-brand/20"
              />
              <label htmlFor="brandActiveCheck" className="text-sm font-medium text-gray-700 cursor-pointer">
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
                disabled={isSubmitting || !newImage.trim()}
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
                    Add Brand Logo
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
                  /optical-brands
                </span>
              </div>
              <p className="text-xs text-text-muted mt-0.5">
                Set or change the background banner photo displayed at the top of the Optical Brands page.
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

      {/* ── Optical Center Contact & Location Settings ── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden">
        <div className="p-5 sm:p-6 bg-gradient-to-r from-surface-mint/30 to-white border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand text-white flex items-center justify-center shrink-0 shadow-xs">
              <Phone className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-brand-dark">Optical Center Contact & Location</h2>
                <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-surface-mint text-brand-dark border border-brand/10">
                  Public Contact Info
                </span>
              </div>
              <p className="text-xs text-text-muted mt-0.5">
                Update the official contact number and Google Maps location shown on the Opticals page.
              </p>
            </div>
          </div>
          <button
            onClick={handleSaveContact}
            disabled={isContactSaving || isBannerLoading}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-brand text-white rounded-xl hover:bg-brand-medium disabled:opacity-50 text-sm font-semibold transition shadow-xs cursor-pointer shrink-0"
          >
            {isContactSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save Contact Info
          </button>
        </div>

        <div className="p-5 sm:p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl">
            {/* Contact Number */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted">
                Contact Number (Calling & WhatsApp)
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={contactNumber}
                  onChange={(e) => setContactNumber(e.target.value)}
                  placeholder="+966 55 929 3222"
                  className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand font-mono"
                />
              </div>
              <p className="text-[11px] text-gray-500 flex items-center justify-between">
                <span>Clickable on public website.</span>
                {contactNumber && (
                  <a
                    href={`tel:${contactNumber.replace(/[^0-9+]/g, '')}`}
                    className="text-brand hover:underline font-semibold ml-2 inline-flex items-center gap-1"
                  >
                    Test Call <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </p>
            </div>

            {/* Short Location Name */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted">
                Short Location Name
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={shortLocation}
                  onChange={(e) => setShortLocation(e.target.value)}
                  placeholder="Safwa"
                  className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand"
                />
              </div>
              <p className="text-[11px] text-gray-500">
                Shown as short location badge (e.g. Safwa) in the optical section.
              </p>
            </div>

            {/* Google Maps Link */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted">
                Google Maps Location URL
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="url"
                  value={mapUrl}
                  onChange={(e) => setMapUrl(e.target.value)}
                  placeholder="https://maps.app.goo.gl/..."
                  className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand font-mono"
                />
              </div>
              <p className="text-[11px] text-gray-500 flex items-center justify-between">
                <span>Opens in Google Maps.</span>
                {mapUrl && (
                  <a
                    href={mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-brand hover:underline font-semibold ml-2 inline-flex items-center gap-1"
                  >
                    Open Map <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Brands Directory ── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-xs p-5 sm:p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-gray-100">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-brand-dark">
              Active Brands Directory ({brands.length})
            </h2>
            <p className="text-xs text-text-muted mt-0.5">
              All displayed brands on the public website. Existing and newly uploaded logos appear together.
            </p>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search brand name..."
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
        ) : filteredBrands.length === 0 ? (
          <div className="text-center py-12">
            <Glasses className="w-10 h-10 text-gray-300 mx-auto mb-2" />
            <p className="text-sm font-semibold text-gray-700">No brands found</p>
            <p className="text-xs text-gray-500 mt-1">
              {searchQuery ? 'Try matching a different brand name.' : 'Click "Upload New Brand Logo" to add your first brand.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {filteredBrands.map((brand, idx) => {
              const logoSrc = getLogoUrl(brand.image);
              const isCustom = brand.isCustom || brand.image.startsWith('http');

              return (
                <div
                  key={brand._id || idx}
                  className="relative group bg-[#FBFDFD] border border-gray-200/80 rounded-2xl p-3 flex flex-col justify-between hover:border-brand/40 hover:shadow-card transition-all"
                >
                  {/* Top Badges */}
                  <div className="flex items-center justify-between text-[10px] mb-2">
                    <span className="font-mono text-gray-400">#{brand.order ?? idx + 1}</span>
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
                        alt={`${brand.name} logo`}
                        fill
                        sizes="160px"
                        className="object-contain p-2 mix-blend-multiply group-hover:scale-105 transition-transform"
                      />
                    ) : (
                      <span className="text-xs text-gray-300">No Image</span>
                    )}
                  </div>

                  {/* Brand Name */}
                  <p className="text-xs font-bold text-brand-dark text-center truncate mb-3" title={brand.name || 'Brand Logo'}>
                    {brand.name || 'Brand Logo'}
                  </p>

                  {/* Action Bar */}
                  <div className="flex items-center justify-between pt-2 border-t border-gray-100 gap-1.5">
                    {/* Active toggle */}
                    <button
                      type="button"
                      onClick={() => handleToggleActive(brand._id, brand.active)}
                      disabled={togglingId === brand._id || !brand._id}
                      className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-1 rounded-lg transition ${
                        brand.active !== false
                          ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                          : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                      }`}
                      title={brand.active !== false ? 'Active on site' : 'Hidden from site'}
                    >
                      {togglingId === brand._id ? (
                        <Loader2 className="w-3 h-3 animate-spin" />
                      ) : brand.active !== false ? (
                        <CheckCircle2 className="w-3 h-3" />
                      ) : (
                        <XCircle className="w-3 h-3" />
                      )}
                      <span>{brand.active !== false ? 'Live' : 'Hidden'}</span>
                    </button>

                    {/* Delete button (available for all database records) */}
                    {brand._id && (
                      <button
                        type="button"
                        onClick={() => handleDeleteBrand(brand._id, brand.name)}
                        disabled={deletingId === brand._id}
                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                        title="Remove brand"
                      >
                        {deletingId === brand._id ? (
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

