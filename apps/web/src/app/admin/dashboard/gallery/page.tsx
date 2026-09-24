'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { fetchApi } from '@/lib/admin/api';
import { useToast } from '@/components/admin/ToastProvider';
import ImageUpload from '@/components/admin/ImageUpload';
import {
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  Image as ImageIcon,
  Loader2,
  Save,
  Sliders,
} from 'lucide-react';

interface GalleryImage {
  _id: string;
  imageUrl: string;
  title: { en: string; ar: string };
  order: number;
  active: boolean;
}

function TableSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="bg-gray-100 h-48 rounded-xl animate-pulse" />
      ))}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 bg-white rounded-xl border border-gray-200">
      <div className="w-16 h-16 bg-surface-mint rounded-2xl flex items-center justify-center mb-4 text-brand-medium">
        <ImageIcon className="w-8 h-8" />
      </div>
      <h3 className="text-base font-semibold text-text-base mb-1">No images yet</h3>
      <p className="text-sm text-text-muted text-center max-w-xs mb-6">
        Upload your first image to the gallery.
      </p>
      <Link
        href="/admin/dashboard/gallery/new"
        className="inline-flex items-center gap-2 px-4 py-2 bg-brand hover:bg-brand-medium text-white text-sm font-semibold rounded-xl transition shadow-sm cursor-pointer"
      >
        <Plus className="w-4 h-4" />
        Upload Image
      </Link>
    </div>
  );
}

export default function GalleryPage() {
  const { toast } = useToast();
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  // Banner hero management
  const [bannerImage, setBannerImage] = useState('');
  const [isBannerLoading, setIsBannerLoading] = useState(true);
  const [isBannerSaving, setIsBannerSaving] = useState(false);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const res = await fetchApi('/api/gallery-images?limit=1000');
      setImages(res.data ?? []);
    } catch {
      toast('Failed to load gallery images.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const loadBanner = async () => {
    setIsBannerLoading(true);
    try {
      const res = await fetchApi('/api/page-heroes/gallery');
      if (res.data?.image) {
        setBannerImage(res.data.image);
      }
    } catch {
      // silently handle
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
      await fetchApi('/api/page-heroes/gallery', {
        method: 'PATCH',
        body: JSON.stringify({ image: bannerImage }),
      });
      toast('Gallery hero banner updated successfully!', 'success');
    } catch {
      toast('Failed to save gallery banner.', 'error');
    } finally {
      setIsBannerSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this image?')) return;
    setDeletingId(id);
    try {
      await fetchApi(`/api/gallery-images/${id}`, { method: 'DELETE' });
      toast('Image was deleted successfully.', 'success');
      setImages((prev) => prev.filter((t) => t._id !== id));
    } catch {
      toast('Failed to delete image.', 'error');
    } finally {
      setDeletingId(null);
    }
  };

  const handleToggleActive = async (id: string, currentActive: boolean) => {
    setTogglingId(id);
    try {
      await fetchApi(`/api/gallery-images/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ active: !currentActive }),
      });
      toast(`Image is now ${!currentActive ? 'active' : 'inactive'}.`, 'success');
      setImages((prev) =>
        prev.map((t) => (t._id === id ? { ...t, active: !currentActive } : t))
      );
    } catch {
      toast('Failed to update status.', 'error');
    } finally {
      setTogglingId(null);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-brand-dark">Gallery Management</h1>
          <p className="text-sm text-text-muted mt-1">
            Manage your public gallery photos and page hero banner
          </p>
        </div>
        <Link
          href="/admin/dashboard/gallery/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-brand hover:bg-brand-medium text-white text-sm font-semibold rounded-xl transition shadow-sm cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Add Image
        </Link>
      </div>

      {/* Gallery Page Hero Banner Section */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
        <div className="p-5 sm:p-6 bg-gradient-to-r from-surface-mint/30 to-white border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand text-white flex items-center justify-center shrink-0 shadow-sm">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-brand-dark">Public Page Hero Banner</h2>
                <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-surface-mint text-brand-dark border border-brand/10">
                  Hero Header
                </span>
              </div>
              <p className="text-xs text-text-muted mt-0.5">
                Set the background banner photo displayed at the top of the public /gallery page.
              </p>
            </div>
          </div>
          <button
            onClick={handleSaveBanner}
            disabled={isBannerSaving || isBannerLoading}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-brand text-white rounded-xl hover:bg-brand-medium disabled:opacity-50 text-sm font-semibold transition shadow-sm cursor-pointer shrink-0"
          >
            {isBannerSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save Banner
          </button>
        </div>

        <div className="p-5 sm:p-6">
          {isBannerLoading ? (
            <div className="flex items-center justify-center py-8">
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
              <p className="text-xs text-text-muted">
                Tip: High-resolution landscape images (1920x600 or 16:9) work best with the hospital theme gradient.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Gallery Photos Grid Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-brand-dark font-serif">Uploaded Gallery Photos</h2>
            <span className="text-xs text-text-muted bg-gray-100 px-2.5 py-0.5 rounded-full font-medium">
              {isLoading ? 'Loading...' : `${images.length} item${images.length !== 1 ? 's' : ''}`}
            </span>
          </div>
        </div>

        {isLoading ? (
          <TableSkeleton />
        ) : images.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {images.map((img) => (
              <div key={img._id} className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm group">
                <div className="relative aspect-[4/3]">
                  <Image
                    src={img.imageUrl}
                    alt={img.title?.en || 'Gallery Image'}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                    <Link
                      href={`/admin/dashboard/gallery/${img._id}/edit`}
                      className="p-2 bg-white text-brand rounded-lg hover:bg-brand-pale transition"
                    >
                      <Edit2 className="w-5 h-5" />
                    </Link>
                    <button
                      onClick={() => handleDelete(img._id)}
                      disabled={deletingId === img._id}
                      className="p-2 bg-white text-red-500 rounded-lg hover:bg-red-50 transition"
                    >
                      {deletingId === img._id ? <Loader2 className="w-5 h-5 animate-spin" /> : <Trash2 className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
                <div className="p-4 flex flex-col gap-2">
                  <div className="flex justify-between items-start">
                    <span className="text-sm font-semibold text-gray-800 line-clamp-1">
                      {img.title?.en || 'No title'}
                    </span>
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-md">Order: {img.order}</span>
                  </div>
                  <button
                    onClick={() => handleToggleActive(img._id, img.active)}
                    disabled={togglingId === img._id}
                    className={`inline-flex w-fit items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold transition ${
                      img.active
                        ? 'bg-green-100 text-green-700 hover:bg-green-200'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    } disabled:opacity-50`}
                  >
                    {togglingId === img._id ? (
                      <Loader2 className="w-3 h-3 animate-spin" />
                    ) : img.active ? (
                      <CheckCircle2 className="w-3 h-3" />
                    ) : (
                      <XCircle className="w-3 h-3" />
                    )}
                    {img.active ? 'Active' : 'Hidden'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
