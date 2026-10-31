'use client';

import { useState, useEffect } from 'react';
import { fetchApi } from '@/lib/admin/api';
import { useToast } from '@/components/admin/ToastProvider';
import {
  Phone,
  Mail,
  MapPin,
  MessageCircle,
  Save,
  Loader2,
  Plus,
  Trash2,
  ExternalLink,
  Share2,
  Glasses,
  Globe,
  Sliders,
} from 'lucide-react';
import type { ContactSettings, CustomContactField } from '@/config/contact';

const DEFAULT_SETTINGS: ContactSettings = {
  phone: '013 664 2193',
  emergencyPhone: '+966 53 296 3521',
  additionalPhones: ['+966 55 740 0450', '+966 55 350 4004'],
  whatsappNumber: '966532963521',
  whatsappDisplay: '+966 53 296 3521',
  opticalsPhone: '+966 55 929 3222',
  opticalsShortLocation: 'Safwa',
  opticalsMapUrl: 'https://maps.app.goo.gl/NCs1qV9fBLEpk9YK9?g_st=aw',
  email: 'info@salamatekgroup.com',
  additionalEmails: [],
  address: 'Belal Ibn Rabah St, Safa Area، Safwa 32833, Saudi Arabia',
  addressAr: 'شارع بلال بن رباح، حي الصفا، صفوى 32833، المملكة العربية السعودية',
  shortLocation: 'Safwa',
  shortLocationAr: 'صفوى',
  mapsLink: 'https://maps.app.goo.gl/ExsLAhHJm1mrgrnj7?g_st=ac',
  mapsEmbedUrl: '',
  workingHoursEn: '24/7 Emergency Service',
  workingHoursAr: 'خدمة الطوارئ 24/7',
  social: {
    instagram: 'https://www.instagram.com/salamatek_medical?obrf=MXM0c2I0NHUxenVpbQ%3D%3D&utm_source=qr',
    snapchat: 'https://www.snapchat.com/add/salamatekmed',
    facebook: '',
    linkedin: '',
    youtube: '',
    tiktok: '',
    twitter: '',
  },
  customFields: [],
};

export default function ContactSettingsAdminPage() {
  const { toast } = useToast();
  const [formData, setFormData] = useState<ContactSettings>(DEFAULT_SETTINGS);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Load existing settings from API
  const loadData = async () => {
    setIsLoading(true);
    try {
      const res = await fetchApi('/api/contact-settings');
      if (res && res.data) {
        setFormData({
          ...DEFAULT_SETTINGS,
          ...res.data,
          social: {
            ...DEFAULT_SETTINGS.social,
            ...(res.data.social || {}),
          },
          additionalPhones: Array.isArray(res.data.additionalPhones)
            ? res.data.additionalPhones
            : DEFAULT_SETTINGS.additionalPhones,
          additionalEmails: Array.isArray(res.data.additionalEmails)
            ? res.data.additionalEmails
            : [],
          customFields: Array.isArray(res.data.customFields)
            ? res.data.customFields
            : [],
        });
      }
    } catch {
      toast('Failed to load global contact settings from server', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSaving(true);
    try {
      const res = await fetchApi('/api/contact-settings', {
        method: 'PUT',
        body: JSON.stringify(formData),
      });

      if (res && res.success) {
        toast('Global contact settings saved successfully!', 'success');
        // Trigger live update across open client tabs
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('salamatek-contact-updated'));
        }
      }
    } catch (err: any) {
      toast(err.message || 'Failed to save contact settings', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  // Additional phone helpers
  const addPhone = () => {
    setFormData((prev) => ({
      ...prev,
      additionalPhones: [...(prev.additionalPhones || []), ''],
    }));
  };

  const updatePhone = (index: number, val: string) => {
    setFormData((prev) => {
      const copy = [...(prev.additionalPhones || [])];
      copy[index] = val;
      return { ...prev, additionalPhones: copy };
    });
  };

  const removePhone = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      additionalPhones: (prev.additionalPhones || []).filter((_, i) => i !== index),
    }));
  };

  // Additional email helpers
  const addEmail = () => {
    setFormData((prev) => ({
      ...prev,
      additionalEmails: [...(prev.additionalEmails || []), ''],
    }));
  };

  const updateEmail = (index: number, val: string) => {
    setFormData((prev) => {
      const copy = [...(prev.additionalEmails || [])];
      copy[index] = val;
      return { ...prev, additionalEmails: copy };
    });
  };

  const removeEmail = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      additionalEmails: (prev.additionalEmails || []).filter((_, i) => i !== index),
    }));
  };

  // Custom contact field helpers
  const addCustomField = () => {
    const newField: CustomContactField = {
      key: `field_${Date.now()}`,
      labelEn: '',
      labelAr: '',
      value: '',
      type: 'text',
    };
    setFormData((prev) => ({
      ...prev,
      customFields: [...(prev.customFields || []), newField],
    }));
  };

  const updateCustomField = (index: number, updates: Partial<CustomContactField>) => {
    setFormData((prev) => {
      const copy = [...(prev.customFields || [])];
      if (copy[index]) {
        copy[index] = { ...copy[index], ...updates };
      }
      return { ...prev, customFields: copy };
    });
  };

  const removeCustomField = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      customFields: (prev.customFields || []).filter((_, i) => i !== index),
    }));
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-3">
        <Loader2 className="w-8 h-8 animate-spin text-brand" />
        <p className="text-sm font-medium text-gray-500">Loading global contact settings...</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSave} className="space-y-8 max-w-5xl pb-16">
      {/* ── Top Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2.5">
            <Phone className="w-6 h-6 text-brand" />
            Global Contact Information Management
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Centrally manage phone numbers, email addresses, physical addresses, Google Maps links, WhatsApp, and social media shown across the entire website.
          </p>
        </div>

        <button
          type="submit"
          disabled={isSaving}
          className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-brand hover:bg-brand-medium text-white font-semibold text-sm transition shadow-sm disabled:opacity-50 cursor-pointer shrink-0"
        >
          {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Save All Changes
        </button>
      </div>

      {/* ── Section 1: Phone Numbers & Direct Call Lines ── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden">
        <div className="p-5 bg-gradient-to-r from-surface-mint/40 to-white border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-brand text-white flex items-center justify-center shadow-xs">
              <Phone className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-brand-dark">Phone Numbers & Calling Lines</h2>
              <p className="text-xs text-text-muted mt-0.5">Clickable on public website with automated tel: dialer links.</p>
            </div>
          </div>
          <button
            type="button"
            onClick={addPhone}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-mint text-brand-dark border border-brand/20 hover:bg-brand hover:text-white text-xs font-semibold transition"
          >
            <Plus className="w-3.5 h-3.5" /> Add Phone Line
          </button>
        </div>

        <div className="p-5 sm:p-6 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Landline */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted">
                Landline / Appointments Phone
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="013 664 2193"
                  className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand/20 focus:border-brand font-mono"
                />
              </div>
              <p className="text-[11px] text-gray-400">Displayed in Header, Footer, and Contact sections.</p>
            </div>

            {/* Emergency / Direct Mobile */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted">
                Primary Emergency / Direct Mobile
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={formData.emergencyPhone || ''}
                  onChange={(e) => setFormData({ ...formData, emergencyPhone: e.target.value })}
                  placeholder="+966 53 296 3521"
                  className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand/20 focus:border-brand font-mono"
                />
              </div>
              <p className="text-[11px] text-gray-400">Direct mobile line for emergency patient calls.</p>
            </div>
          </div>

          {/* Additional Phone Lines */}
          {formData.additionalPhones && formData.additionalPhones.length > 0 && (
            <div className="pt-3 border-t border-gray-100 space-y-3">
              <span className="block text-xs font-semibold uppercase tracking-wider text-text-muted">
                Additional Direct Lines ({formData.additionalPhones.length})
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {formData.additionalPhones.map((ph, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={ph}
                      onChange={(e) => updatePhone(idx, e.target.value)}
                      placeholder="+966 5X XXX XXXX"
                      className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand/20 focus:border-brand font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => removePhone(idx)}
                      className="p-2 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition"
                      title="Remove phone line"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Section 2: WhatsApp Messaging Settings ── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden">
        <div className="p-5 bg-gradient-to-r from-emerald-50 to-white border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#25D366] text-white flex items-center justify-center shadow-xs">
              <MessageCircle className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900">WhatsApp Messaging Settings</h2>
              <p className="text-xs text-text-muted mt-0.5">Powers all floating chat buttons, hero buttons, and booking triggers.</p>
            </div>
          </div>
          {formData.whatsappNumber && (
            <a
              href={`https://wa.me/${formData.whatsappNumber.replace(/[^0-9]/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-100 text-emerald-800 hover:bg-emerald-200 text-xs font-semibold transition"
            >
              Test WhatsApp <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>

        <div className="p-5 sm:p-6 grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted">
              WhatsApp Target Digits (Without + or spaces)
            </label>
            <input
              type="text"
              value={formData.whatsappNumber}
              onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value.replace(/[^0-9]/g, '') })}
              placeholder="966532963521"
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand/20 focus:border-brand font-mono"
            />
            <p className="text-[11px] text-gray-400">Example: 966532963521 (Country code followed by digits)</p>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted">
              WhatsApp Display Label
            </label>
            <input
              type="text"
              value={formData.whatsappDisplay || ''}
              onChange={(e) => setFormData({ ...formData, whatsappDisplay: e.target.value })}
              placeholder="+966 53 296 3521"
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand/20 focus:border-brand font-mono"
            />
            <p className="text-[11px] text-gray-400">Human-friendly format shown in tooltips and buttons.</p>
          </div>
        </div>
      </div>

      {/* ── Section 3: Physical Address & Google Maps ── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden">
        <div className="p-5 bg-gradient-to-r from-surface-mint/40 to-white border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-brand text-white flex items-center justify-center shadow-xs">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-brand-dark">Physical Address & Location Details</h2>
              <p className="text-xs text-text-muted mt-0.5">Physical hospital addresses, Google Maps links, and working hours.</p>
            </div>
          </div>
          {formData.mapsLink && (
            <a
              href={formData.mapsLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-mint text-brand-dark border border-brand/20 hover:bg-brand hover:text-white text-xs font-semibold transition"
            >
              Open Google Maps <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>

        <div className="p-5 sm:p-6 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted">
                Address (English)
              </label>
              <textarea
                rows={2}
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="Belal Ibn Rabah St, Safa Area, Safwa 32833, Saudi Arabia"
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand/20 focus:border-brand"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted">
                Address (Arabic)
              </label>
              <textarea
                rows={2}
                dir="rtl"
                value={formData.addressAr || ''}
                onChange={(e) => setFormData({ ...formData, addressAr: e.target.value })}
                placeholder="شارع بلال بن رباح، حي الصفا، صفوى 32833، المملكة العربية السعودية"
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand/20 focus:border-brand font-arabic"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted">
                Short City / Location (English)
              </label>
              <input
                type="text"
                value={formData.shortLocation || ''}
                onChange={(e) => setFormData({ ...formData, shortLocation: e.target.value })}
                placeholder="Safwa"
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand/20 focus:border-brand"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted">
                Short City / Location (Arabic)
              </label>
              <input
                type="text"
                dir="rtl"
                value={formData.shortLocationAr || ''}
                onChange={(e) => setFormData({ ...formData, shortLocationAr: e.target.value })}
                placeholder="صفوى"
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand/20 focus:border-brand font-arabic"
              />
            </div>

            <div className="space-y-1.5 sm:col-span-2 md:col-span-1">
              <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted">
                Google Maps Share Link
              </label>
              <input
                type="url"
                value={formData.mapsLink}
                onChange={(e) => setFormData({ ...formData, mapsLink: e.target.value })}
                placeholder="https://maps.app.goo.gl/..."
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand/20 focus:border-brand font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-3 border-t border-gray-100">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted">
                Working / Emergency Hours (English)
              </label>
              <input
                type="text"
                value={formData.workingHoursEn || ''}
                onChange={(e) => setFormData({ ...formData, workingHoursEn: e.target.value })}
                placeholder="24/7 Emergency Service"
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand/20 focus:border-brand"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted">
                Working / Emergency Hours (Arabic)
              </label>
              <input
                type="text"
                dir="rtl"
                value={formData.workingHoursAr || ''}
                onChange={(e) => setFormData({ ...formData, workingHoursAr: e.target.value })}
                placeholder="خدمة الطوارئ 24/7"
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand/20 focus:border-brand font-arabic"
              />
            </div>
          </div>
        </div>
      </div>

      {/* ── Section 4: Email Addresses ── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden">
        <div className="p-5 bg-gradient-to-r from-surface-mint/40 to-white border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-brand text-white flex items-center justify-center shadow-xs">
              <Mail className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-brand-dark">Email Addresses</h2>
              <p className="text-xs text-text-muted mt-0.5">Clickable on public website with automated mailto: links.</p>
            </div>
          </div>
          <button
            type="button"
            onClick={addEmail}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-mint text-brand-dark border border-brand/20 hover:bg-brand hover:text-white text-xs font-semibold transition"
          >
            <Plus className="w-3.5 h-3.5" /> Add Email
          </button>
        </div>

        <div className="p-5 sm:p-6 space-y-4">
          <div className="space-y-1.5 max-w-md">
            <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted">
              Primary Official Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="info@salamatekgroup.com"
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand/20 focus:border-brand font-mono"
            />
          </div>

          {formData.additionalEmails && formData.additionalEmails.length > 0 && (
            <div className="pt-3 border-t border-gray-100 space-y-3">
              <span className="block text-xs font-semibold uppercase tracking-wider text-text-muted">
                Additional Email Addresses ({formData.additionalEmails.length})
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {formData.additionalEmails.map((em, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <input
                      type="email"
                      value={em}
                      onChange={(e) => updateEmail(idx, e.target.value)}
                      placeholder="support@salamatekgroup.com"
                      className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand/20 focus:border-brand font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => removeEmail(idx)}
                      className="p-2 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition"
                      title="Remove email"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Section 5: Salamatek Opticals Direct Contact ── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden">
        <div className="p-5 bg-gradient-to-r from-surface-mint/40 to-white border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-brand text-white flex items-center justify-center shadow-xs">
              <Glasses className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-brand-dark">Salamatek Opticals Contact Information</h2>
              <p className="text-xs text-text-muted mt-0.5">Direct contact details displayed on the Optical Brands page.</p>
            </div>
          </div>
        </div>

        <div className="p-5 sm:p-6 grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted">
              Opticals Contact Phone
            </label>
            <input
              type="text"
              value={formData.opticalsPhone || ''}
              onChange={(e) => setFormData({ ...formData, opticalsPhone: e.target.value })}
              placeholder="+966 55 929 3222"
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand/20 focus:border-brand font-mono"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted">
              Opticals Short Location
            </label>
            <input
              type="text"
              value={formData.opticalsShortLocation || ''}
              onChange={(e) => setFormData({ ...formData, opticalsShortLocation: e.target.value })}
              placeholder="Safwa"
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand/20 focus:border-brand"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted">
              Opticals Google Maps Link
            </label>
            <input
              type="url"
              value={formData.opticalsMapUrl || ''}
              onChange={(e) => setFormData({ ...formData, opticalsMapUrl: e.target.value })}
              placeholder="https://maps.app.goo.gl/..."
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand/20 focus:border-brand font-mono"
            />
          </div>
        </div>
      </div>

      {/* ── Section 6: Social Media Channels ── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden">
        <div className="p-5 bg-gradient-to-r from-surface-mint/40 to-white border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-brand text-white flex items-center justify-center shadow-xs">
              <Share2 className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-brand-dark">Official Social Media Profiles</h2>
              <p className="text-xs text-text-muted mt-0.5">Displayed in floating action docks, mobile drawer, footer, and contact page.</p>
            </div>
          </div>
        </div>

        <div className="p-5 sm:p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted">
              Instagram Profile URL
            </label>
            <input
              type="url"
              value={formData.social?.instagram || ''}
              onChange={(e) => setFormData({
                ...formData,
                social: { ...formData.social, instagram: e.target.value },
              })}
              placeholder="https://instagram.com/..."
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand/20 focus:border-brand"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted">
              Snapchat Profile URL
            </label>
            <input
              type="url"
              value={formData.social?.snapchat || ''}
              onChange={(e) => setFormData({
                ...formData,
                social: { ...formData.social, snapchat: e.target.value },
              })}
              placeholder="https://snapchat.com/add/..."
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand/20 focus:border-brand"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted">
              Facebook Page URL
            </label>
            <input
              type="url"
              value={formData.social?.facebook || ''}
              onChange={(e) => setFormData({
                ...formData,
                social: { ...formData.social, facebook: e.target.value },
              })}
              placeholder="https://facebook.com/..."
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand/20 focus:border-brand"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted">
              LinkedIn Profile URL
            </label>
            <input
              type="url"
              value={formData.social?.linkedin || ''}
              onChange={(e) => setFormData({
                ...formData,
                social: { ...formData.social, linkedin: e.target.value },
              })}
              placeholder="https://linkedin.com/company/..."
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand/20 focus:border-brand"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted">
              YouTube Channel URL
            </label>
            <input
              type="url"
              value={formData.social?.youtube || ''}
              onChange={(e) => setFormData({
                ...formData,
                social: { ...formData.social, youtube: e.target.value },
              })}
              placeholder="https://youtube.com/..."
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand/20 focus:border-brand"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted">
              TikTok Profile URL
            </label>
            <input
              type="url"
              value={formData.social?.tiktok || ''}
              onChange={(e) => setFormData({
                ...formData,
                social: { ...formData.social, tiktok: e.target.value },
              })}
              placeholder="https://tiktok.com/@..."
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand/20 focus:border-brand"
            />
          </div>
        </div>
      </div>

      {/* ── Section 7: Scalable Custom Contact Fields ── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden">
        <div className="p-5 bg-gradient-to-r from-surface-mint/40 to-white border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-brand text-white flex items-center justify-center shadow-xs">
              <Sliders className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-brand-dark">Dynamic Custom Contact Fields</h2>
              <p className="text-xs text-text-muted mt-0.5">
                Add and manage any future contact info (e.g. Fax, Toll-free, Telegram, Hotline) without code changes.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={addCustomField}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-brand text-white hover:bg-brand-medium text-xs font-semibold transition"
          >
            <Plus className="w-3.5 h-3.5" /> Add Custom Field
          </button>
        </div>

        <div className="p-5 sm:p-6 space-y-4">
          {(!formData.customFields || formData.customFields.length === 0) ? (
            <div className="text-center py-6 text-gray-400">
              <Globe className="w-8 h-8 mx-auto mb-2 text-gray-300" />
              <p className="text-xs">No custom fields added yet. Click &quot;Add Custom Field&quot; if you need to add custom contact entries.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {formData.customFields.map((field, idx) => (
                <div key={field.key || idx} className="p-4 rounded-xl border border-gray-200 bg-gray-50/50 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-brand">Field #{idx + 1}</span>
                    <button
                      type="button"
                      onClick={() => removeCustomField(idx)}
                      className="p-1.5 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition"
                      title="Remove custom field"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-gray-500 mb-1">Label (English)</label>
                      <input
                        type="text"
                        value={field.labelEn}
                        onChange={(e) => updateCustomField(idx, { labelEn: e.target.value })}
                        placeholder="e.g. Toll-Free Hotline"
                        className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-gray-500 mb-1">Label (Arabic)</label>
                      <input
                        type="text"
                        dir="rtl"
                        value={field.labelAr}
                        onChange={(e) => updateCustomField(idx, { labelAr: e.target.value })}
                        placeholder="الخط الساخن المجاني"
                        className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg bg-white font-arabic"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-gray-500 mb-1">Value</label>
                      <input
                        type="text"
                        value={field.value}
                        onChange={(e) => updateCustomField(idx, { value: e.target.value })}
                        placeholder="800 123 4567"
                        className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-gray-500 mb-1">Type</label>
                      <select
                        value={field.type || 'text'}
                        onChange={(e) => updateCustomField(idx, { type: e.target.value as any })}
                        className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg bg-white"
                      >
                        <option value="text">Plain Text</option>
                        <option value="phone">Phone Number (tel:)</option>
                        <option value="email">Email Address (mailto:)</option>
                        <option value="url">Web Link (http/https)</option>
                      </select>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Bottom Floating Save Bar ── */}
      <div className="sticky bottom-4 z-20 p-4 bg-white/95 backdrop-blur-md rounded-2xl border border-gray-200 shadow-xl flex items-center justify-between gap-4">
        <div>
          <p className="text-xs sm:text-sm font-bold text-gray-900">Ready to publish contact changes?</p>
          <p className="text-[11px] text-gray-500">Updated contact information instantly applies across all website sections.</p>
        </div>
        <button
          type="submit"
          disabled={isSaving}
          className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-brand hover:bg-brand-medium text-white font-semibold text-sm transition shadow-sm disabled:opacity-50 cursor-pointer shrink-0"
        >
          {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Save All Changes
        </button>
      </div>
    </form>
  );
}
