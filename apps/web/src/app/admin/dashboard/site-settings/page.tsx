'use client';

import { useState, useEffect } from 'react';
import { fetchApi } from '@/lib/admin/api';
import { useToast } from '@/components/admin/ToastProvider';
import ImageUpload from '@/components/admin/ImageUpload';
import { Loader2, Settings2, Save } from 'lucide-react';

const PAGE_KEYS = [
  { id: 'home',          label: 'Home Hero (Landing Page)' },
  { id: 'sarc',          label: 'SARC Section (Landing Page)' },
  { id: 'departments',   label: 'Departments Index' },
  { id: 'services',      label: 'Services Index' },
  { id: 'doctors',       label: 'Doctors Index' },
  { id: 'health-packages', label: 'Health Packages Index' },
  { id: 'news',          label: 'News & Blog Index' },
  { id: 'careers',       label: 'Careers Index' },
  { id: 'contact',       label: 'Contact Us Page' },
  { id: 'about',         label: 'About Us Page' },
];

export default function SiteSettingsPage() {
  const { toast } = useToast();
  const [selectedPage, setSelectedPage] = useState(PAGE_KEYS[0]!.id);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState({
    image: '',
  });

  const loadSettings = async (pageKey: string) => {
    setIsLoading(true);
    try {
      const res = await fetchApi(`/api/page-heroes/${pageKey}`);
      if (res.data) {
        setFormData({
          image: res.data.image || '',
        });
      } else {
        setFormData({ image: '' });
      }
    } catch {
      toast('Failed to load settings', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadSettings(selectedPage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPage]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await fetchApi(`/api/page-heroes/${selectedPage}`, {
        method: 'PATCH',
        body: JSON.stringify({
          image: formData.image,
        }),
      });
      toast('Page settings updated successfully', 'success');
    } catch {
      toast('Failed to save settings', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Settings2 className="w-6 h-6 text-gray-400" /> Site Settings
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Manage dynamic hero sections for public pages
          </p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Tabs */}
        <div className="w-full md:w-64 space-y-1">
          {PAGE_KEYS.map((page) => (
            <button
              key={page.id}
              onClick={() => setSelectedPage(page.id)}
              className={`w-full text-left px-4 py-3 rounded-xl text-sm transition-colors cursor-pointer ${
                selectedPage === page.id
                  ? 'bg-surface-mint text-brand-dark font-bold shadow-sm'
                  : 'text-text-muted hover:bg-surface-mint/50 hover:text-text-base font-medium'
              }`}
            >
              {page.label}
            </button>
          ))}
        </div>

        {/* Content Form */}
        <div className="flex-1 bg-white rounded-2xl shadow-card border border-border p-6 sm:p-8">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-border">
            <h2 className="text-lg font-bold font-serif text-brand-dark">
              {PAGE_KEYS.find((p) => p.id === selectedPage)?.label} Hero
            </h2>
            <button
              onClick={handleSave}
              disabled={isSaving || isLoading}
              className="flex items-center gap-2 px-5 py-2.5 bg-brand text-white rounded-xl hover:bg-brand-medium disabled:opacity-50 text-sm font-semibold transition shadow-sm cursor-pointer"
            >
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Save Changes
            </button>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="w-8 h-8 animate-spin text-gray-300" />
            </div>
          ) : (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Hero Image</label>
                <ImageUpload
                  value={formData.image}
                  onChange={(url) => setFormData({ ...formData, image: url })}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
