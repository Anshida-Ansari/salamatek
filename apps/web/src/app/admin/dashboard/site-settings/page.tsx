'use client';

import { useState, useEffect } from 'react';
import { fetchApi } from '@/lib/admin/api';
import { useToast } from '@/components/admin/ToastProvider';
import { ImageUpload } from '@/components/admin/ImageUpload';
import { Loader2, Settings2, Save } from 'lucide-react';

const PAGE_KEYS = [
  { id: 'departments', label: 'Departments Index' },
  { id: 'services', label: 'Services Index' },
  { id: 'doctors', label: 'Doctors Index' },
  { id: 'health-packages', label: 'Health Packages Index' },
  { id: 'sarc', label: 'SARC Index' },
  { id: 'news', label: 'News & Blog Index' },
  { id: 'careers', label: 'Careers Index' },
  { id: 'contact', label: 'Contact Us Page' },
  { id: 'about', label: 'About Us Page' },
];

export default function SiteSettingsPage() {
  const { toast } = useToast();
  const [selectedPage, setSelectedPage] = useState(PAGE_KEYS[0].id);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState({
    image: '',
    headingEn: '',
    headingAr: '',
    subtextEn: '',
    subtextAr: '',
  });

  const loadSettings = async (pageKey: string) => {
    setIsLoading(true);
    try {
      const res = await fetchApi(`/api/page-heroes/${pageKey}`);
      if (res.data) {
        setFormData({
          image: res.data.image || '',
          headingEn: res.data.heading?.en || '',
          headingAr: res.data.heading?.ar || '',
          subtextEn: res.data.subtext?.en || '',
          subtextAr: res.data.subtext?.ar || '',
        });
      } else {
        setFormData({ image: '', headingEn: '', headingAr: '', subtextEn: '', subtextAr: '' });
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
          heading: { en: formData.headingEn, ar: formData.headingAr },
          subtext: { en: formData.subtextEn, ar: formData.subtextAr },
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
              className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                selectedPage === page.id
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              {page.label}
            </button>
          ))}
        </div>

        {/* Content Form */}
        <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900">
              {PAGE_KEYS.find((p) => p.id === selectedPage)?.label} Hero
            </h2>
            <button
              onClick={handleSave}
              disabled={isSaving || isLoading}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 text-sm font-medium transition"
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Heading (English)</label>
                  <input
                    type="text"
                    value={formData.headingEn}
                    onChange={(e) => setFormData({ ...formData, headingEn: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Leave blank to use default"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" dir="rtl">Heading (Arabic)</label>
                  <input
                    type="text"
                    value={formData.headingAr}
                    onChange={(e) => setFormData({ ...formData, headingAr: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="اتركه فارغًا لاستخدام الافتراضي"
                    dir="rtl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Subtext (English)</label>
                  <textarea
                    rows={3}
                    value={formData.subtextEn}
                    onChange={(e) => setFormData({ ...formData, subtextEn: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Leave blank to use default"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" dir="rtl">Subtext (Arabic)</label>
                  <textarea
                    rows={3}
                    value={formData.subtextAr}
                    onChange={(e) => setFormData({ ...formData, subtextAr: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="اتركه فارغًا لاستخدام الافتراضي"
                    dir="rtl"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
