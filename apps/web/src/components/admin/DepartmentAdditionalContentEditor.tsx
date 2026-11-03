'use client';

import React, { useState } from 'react';
import {
  Plus,
  Trash2,
  ChevronUp,
  ChevronDown,
  Type,
  List,
  Images,
  FileImage,
  Layers,
  Sparkles,
  Eye,
  X,
  CheckCircle2,
} from 'lucide-react';
import ImageUpload from '@/components/admin/ImageUpload';

export type ContentBlockType = 'heading_text' | 'bullet_points' | 'image_gallery' | 'text_images';

export interface ContentBlockImage {
  url: string;
  caption?: {
    en?: string;
    ar?: string;
  };
}

export interface ContentBlockItem {
  en: string;
  ar: string;
}

export interface ContentBlock {
  id: string;
  type: ContentBlockType;
  heading: {
    en: string;
    ar: string;
  };
  description?: {
    en: string;
    ar: string;
  };
  items?: ContentBlockItem[];
  images?: ContentBlockImage[];
  order: number;
}

interface Props {
  blocks: ContentBlock[];
  onChange: (blocks: ContentBlock[]) => void;
}

const TYPE_CONFIG: Record<
  ContentBlockType,
  { label: string; icon: React.ElementType; color: string; bg: string; desc: string }
> = {
  heading_text: {
    label: 'Heading + Text',
    icon: Type,
    color: 'text-blue-700',
    bg: 'bg-blue-50 border-blue-200',
    desc: 'Section title with explanatory text or methodology overview.',
  },
  bullet_points: {
    label: 'Bullet Points',
    icon: List,
    color: 'text-emerald-700',
    bg: 'bg-emerald-50 border-emerald-200',
    desc: 'List of procedures, features, capabilities, or testing activities.',
  },
  image_gallery: {
    label: 'Image Gallery',
    icon: Images,
    color: 'text-amber-700',
    bg: 'bg-amber-50 border-amber-200',
    desc: 'Multiple photos of equipment, clinical machines, or facilities with optional captions.',
  },
  text_images: {
    label: 'Text + Images',
    icon: FileImage,
    color: 'text-purple-700',
    bg: 'bg-purple-50 border-purple-200',
    desc: 'Combination of descriptive paragraph alongside visual equipment or procedure showcase.',
  },
};

export default function DepartmentAdditionalContentEditor({ blocks, onChange }: Props) {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewLocale, setPreviewLocale] = useState<'en' | 'ar'>('en');

  const generateId = () => `block_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

  // Add a new block
  const handleAddBlock = (type: ContentBlockType) => {
    const newBlock: ContentBlock = {
      id: generateId(),
      type,
      heading: { en: '', ar: '' },
      description: { en: '', ar: '' },
      items: type === 'bullet_points' ? [{ en: '', ar: '' }] : [],
      images: [],
      order: blocks.length,
    };
    onChange([...blocks, newBlock]);
  };

  // Remove a block
  const handleRemoveBlock = (id: string) => {
    if (!confirm('Are you sure you want to delete this content section?')) return;
    const filtered = blocks.filter((b) => b.id !== id);
    // re-index order
    onChange(filtered.map((b, idx) => ({ ...b, order: idx })));
  };

  // Move block up
  const handleMoveUp = (index: number) => {
    if (index <= 0) return;
    const copy = [...blocks];
    const prev = copy[index - 1];
    const curr = copy[index];
    if (!prev || !curr) return;
    copy[index - 1] = curr;
    copy[index] = prev;
    onChange(copy.map((b, idx) => ({ ...b, order: idx })));
  };

  // Move block down
  const handleMoveDown = (index: number) => {
    if (index >= blocks.length - 1) return;
    const copy = [...blocks];
    const curr = copy[index];
    const next = copy[index + 1];
    if (!curr || !next) return;
    copy[index + 1] = curr;
    copy[index] = next;
    onChange(copy.map((b, idx) => ({ ...b, order: idx })));
  };

  // Update specific block
  const updateBlock = (id: string, updater: (prev: ContentBlock) => ContentBlock) => {
    onChange(blocks.map((b) => (b.id === id ? updater(b) : b)));
  };

  // Change block type
  const handleChangeType = (id: string, newType: ContentBlockType) => {
    updateBlock(id, (prev) => ({
      ...prev,
      type: newType,
      items:
        newType === 'bullet_points' && (!prev.items || prev.items.length === 0)
          ? [{ en: '', ar: '' }]
          : (prev.items || []),
    }));
  };

  // Bullet items management
  const handleAddItem = (blockId: string) => {
    updateBlock(blockId, (prev) => ({
      ...prev,
      items: [...(prev.items || []), { en: '', ar: '' }],
    }));
  };

  const handleUpdateItem = (blockId: string, itemIndex: number, field: 'en' | 'ar', val: string) => {
    updateBlock(blockId, (prev) => {
      const items = [...(prev.items || [])];
      const target = items[itemIndex];
      if (!target) return prev;
      items[itemIndex] = {
        en: field === 'en' ? val : (target.en || ''),
        ar: field === 'ar' ? val : (target.ar || ''),
      };
      return { ...prev, items };
    });
  };

  const handleRemoveItem = (blockId: string, itemIndex: number) => {
    updateBlock(blockId, (prev) => {
      const items = [...(prev.items || [])];
      items.splice(itemIndex, 1);
      return { ...prev, items };
    });
  };

  // Images management
  const handleAddImage = (blockId: string, url: string) => {
    if (!url) return;
    updateBlock(blockId, (prev) => ({
      ...prev,
      images: [...(prev.images || []), { url, caption: { en: '', ar: '' } }],
    }));
  };

  const handleUpdateCaption = (
    blockId: string,
    imageIndex: number,
    field: 'en' | 'ar',
    val: string
  ) => {
    updateBlock(blockId, (prev) => {
      const images = [...(prev.images || [])];
      const target = images[imageIndex];
      if (!target) return prev;
      images[imageIndex] = {
        url: target.url,
        caption: {
          en: field === 'en' ? val : (target.caption?.en || ''),
          ar: field === 'ar' ? val : (target.caption?.ar || ''),
        },
      };
      return { ...prev, images };
    });
  };

  const handleRemoveImage = (blockId: string, imageIndex: number) => {
    updateBlock(blockId, (prev) => {
      const images = [...(prev.images || [])];
      images.splice(imageIndex, 1);
      return { ...prev, images };
    });
  };

  const inputClass =
    'block w-full px-3 py-2 bg-white border border-border rounded-xl text-xs sm:text-sm text-text-base placeholder-text-subtle focus:outline-none focus:ring-2 focus:ring-brand-medium focus:border-brand-medium transition';
  const labelClass = 'block text-xs font-semibold text-text-base mb-1';

  return (
    <div className="bg-white rounded-2xl border border-border p-5 sm:p-6 space-y-6 shadow-card">
      {/* ── Section Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-100">
        <div className="flex items-start sm:items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand/10 text-brand flex items-center justify-center shrink-0">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-brand-dark">Additional Content</h3>
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-surface-mint text-brand-dark border border-brand/10">
                {blocks.length} {blocks.length === 1 ? 'Section' : 'Sections'}
              </span>
            </div>
            <p className="text-xs text-text-muted mt-0.5">
              Add modular rich sections: Procedures, Diagnostic Equipment, Image Galleries, or Clinical Capabilities.
            </p>
          </div>
        </div>

        {blocks.length > 0 && (
          <button
            type="button"
            onClick={() => setPreviewOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-brand hover:text-brand-dark bg-brand/5 hover:bg-brand/10 rounded-xl transition cursor-pointer self-start sm:self-auto"
          >
            <Eye className="w-3.5 h-3.5" />
            Preview Content
          </button>
        )}
      </div>

      {/* ── Add Block Quick Bar ── */}
      <div className="bg-[#F8FAF9] p-4 rounded-xl border border-dashed border-gray-200">
        <p className="text-xs font-bold uppercase tracking-wider text-gray-600 mb-2.5">
          + Add New Content Section
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {(Object.keys(TYPE_CONFIG) as ContentBlockType[]).map((type) => {
            const cfg = TYPE_CONFIG[type];
            const Icon = cfg.icon;
            return (
              <button
                key={type}
                type="button"
                onClick={() => handleAddBlock(type)}
                className="flex items-center gap-2 p-2.5 bg-white border border-gray-200 hover:border-brand rounded-xl hover:shadow-xs transition text-left group cursor-pointer"
              >
                <div className={`w-7 h-7 rounded-lg ${cfg.bg} ${cfg.color} flex items-center justify-center shrink-0`}>
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-gray-800 group-hover:text-brand truncate">
                    {cfg.label}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Block List ── */}
      {blocks.length === 0 ? (
        <div className="text-center py-8 px-4 rounded-xl border border-dashed border-gray-200 bg-gray-50/50">
          <Sparkles className="w-8 h-8 text-gray-300 mx-auto mb-2" />
          <p className="text-sm font-semibold text-gray-700">No additional content sections added</p>
          <p className="text-xs text-gray-500 mt-1 max-w-md mx-auto">
            This section is entirely optional. Click any of the buttons above to add testing procedures, facilities, equipment photos, or clinical highlights.
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          {blocks.map((block, index) => {
            const cfg = TYPE_CONFIG[block.type] || TYPE_CONFIG.heading_text;
            const Icon = cfg.icon;

            return (
              <div
                key={block.id}
                className="bg-white border-2 border-gray-200/90 rounded-2xl p-4 sm:p-5 shadow-xs transition hover:border-brand/40 space-y-4"
              >
                {/* ── Block Top Bar ── */}
                <div className="flex items-center justify-between pb-3 border-b border-gray-100 gap-2 flex-wrap">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-gray-400 bg-gray-100 px-2 py-0.5 rounded-md">
                      #{index + 1}
                    </span>
                    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold border ${cfg.bg} ${cfg.color}`}>
                      <Icon className="w-3.5 h-3.5" />
                      <span>{cfg.label}</span>
                    </div>

                    {/* Switch Type Dropdown */}
                    <select
                      value={block.type}
                      onChange={(e) => handleChangeType(block.id, e.target.value as ContentBlockType)}
                      className="text-xs font-medium bg-gray-50 border border-gray-200 rounded-lg px-2 py-1 text-gray-700 focus:outline-none focus:ring-1 focus:ring-brand"
                    >
                      <option value="heading_text">Type: Heading + Text</option>
                      <option value="bullet_points">Type: Bullet Points</option>
                      <option value="image_gallery">Type: Image Gallery</option>
                      <option value="text_images">Type: Text + Images</option>
                    </select>
                  </div>

                  {/* Ordering & Delete Controls */}
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      disabled={index === 0}
                      onClick={() => handleMoveUp(index)}
                      className="p-1.5 text-gray-500 hover:text-brand hover:bg-gray-100 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed transition cursor-pointer"
                      title="Move Up"
                    >
                      <ChevronUp className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      disabled={index === blocks.length - 1}
                      onClick={() => handleMoveDown(index)}
                      className="p-1.5 text-gray-500 hover:text-brand hover:bg-gray-100 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed transition cursor-pointer"
                      title="Move Down"
                    >
                      <ChevronDown className="w-4 h-4" />
                    </button>
                    <div className="w-px h-4 bg-gray-200 mx-1" />
                    <button
                      type="button"
                      onClick={() => handleRemoveBlock(block.id)}
                      className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition cursor-pointer"
                      title="Delete Section"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* ── Section Heading Fields ── */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>
                      Section Heading (English) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Laboratory Testing & Capabilities"
                      value={block.heading?.en || ''}
                      onChange={(e) =>
                        updateBlock(block.id, (p) => ({
                          ...p,
                          heading: { ...p.heading, en: e.target.value },
                        }))
                      }
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={`${labelClass} text-right`} dir="rtl">
                      عنوان القسم بالعربية
                    </label>
                    <input
                      type="text"
                      dir="rtl"
                      placeholder="مثال: الفحوصات والقدرات المخبرية"
                      value={block.heading?.ar || ''}
                      onChange={(e) =>
                        updateBlock(block.id, (p) => ({
                          ...p,
                          heading: { ...p.heading, ar: e.target.value },
                        }))
                      }
                      className={`${inputClass} text-right`}
                    />
                  </div>
                </div>

                {/* ── Specific Fields by Type ── */}

                {/* 1. Heading + Text & 4. Text + Images Description */}
                {(block.type === 'heading_text' || block.type === 'text_images') && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                    <div>
                      <label className={labelClass}>Description / Paragraph (English)</label>
                      <textarea
                        rows={4}
                        placeholder="Detailed explanation, equipment specs, or clinical instructions..."
                        value={block.description?.en || ''}
                        onChange={(e) =>
                          updateBlock(block.id, (p) => ({
                            ...p,
                            description: { ...(p.description || { en: '', ar: '' }), en: e.target.value },
                          }))
                        }
                        className={`${inputClass} resize-none`}
                      />
                    </div>
                    <div>
                      <label className={`${labelClass} text-right`} dir="rtl">
                        الوصف / الفقرة بالعربية
                      </label>
                      <textarea
                        rows={4}
                        dir="rtl"
                        placeholder="شرح تفصيلي أو مواصفات الأجهزة أو الإرشادات السريرية..."
                        value={block.description?.ar || ''}
                        onChange={(e) =>
                          updateBlock(block.id, (p) => ({
                            ...p,
                            description: { ...(p.description || { en: '', ar: '' }), ar: e.target.value },
                          }))
                        }
                        className={`${inputClass} resize-none text-right`}
                      />
                    </div>
                  </div>
                )}

                {/* 2. Bullet Points List */}
                {block.type === 'bullet_points' && (
                  <div className="space-y-3 pt-1">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold uppercase tracking-wider text-gray-700">
                        Bullet Points ({block.items?.length || 0})
                      </label>
                      <button
                        type="button"
                        onClick={() => handleAddItem(block.id)}
                        className="inline-flex items-center gap-1 text-xs font-bold text-brand hover:text-brand-dark bg-brand/5 hover:bg-brand/10 px-2.5 py-1 rounded-lg transition cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        Add Point
                      </button>
                    </div>

                    <div className="space-y-2.5">
                      {(block.items || []).map((item, itemIdx) => (
                        <div
                          key={itemIdx}
                          className="flex items-start gap-2 bg-gray-50/70 p-2.5 rounded-xl border border-gray-200"
                        >
                          <span className="font-mono text-xs text-gray-400 mt-2">
                            •
                          </span>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 flex-1">
                            <input
                              type="text"
                              placeholder={`Point #${itemIdx + 1} (English)`}
                              value={item.en}
                              onChange={(e) => handleUpdateItem(block.id, itemIdx, 'en', e.target.value)}
                              className="px-3 py-1.5 text-xs sm:text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-brand"
                            />
                            <input
                              type="text"
                              dir="rtl"
                              placeholder={`نقطة #${itemIdx + 1} (بالعربية)`}
                              value={item.ar}
                              onChange={(e) => handleUpdateItem(block.id, itemIdx, 'ar', e.target.value)}
                              className="px-3 py-1.5 text-xs sm:text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-brand text-right"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveItem(block.id, itemIdx)}
                            className="p-1.5 text-gray-400 hover:text-red-500 rounded-lg hover:bg-white transition cursor-pointer shrink-0 mt-0.5"
                            title="Remove Point"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 3. Image Gallery & 4. Text + Images Uploader */}
                {(block.type === 'image_gallery' || block.type === 'text_images') && (
                  <div className="space-y-3 pt-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-700 block">
                      Uploaded Images ({block.images?.length || 0})
                    </label>

                    {/* Image Cards Grid */}
                    {block.images && block.images.length > 0 && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                        {block.images.map((img, imgIdx) => (
                          <div
                            key={imgIdx}
                            className="relative bg-gray-50 border border-gray-200 rounded-xl p-2.5 space-y-2 group"
                          >
                            <div className="relative aspect-video bg-white rounded-lg overflow-hidden border border-gray-200">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={img.url}
                                alt={`Uploaded #${imgIdx + 1}`}
                                className="w-full h-full object-cover"
                              />
                              <button
                                type="button"
                                onClick={() => handleRemoveImage(block.id, imgIdx)}
                                className="absolute top-1.5 right-1.5 p-1 bg-red-600 hover:bg-red-700 text-white rounded-md shadow-xs opacity-90 hover:opacity-100 transition cursor-pointer"
                                title="Remove Image"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>

                            {/* Optional Captions */}
                            <div className="space-y-1.5">
                              <input
                                type="text"
                                placeholder="Caption (English - optional)"
                                value={img.caption?.en || ''}
                                onChange={(e) => handleUpdateCaption(block.id, imgIdx, 'en', e.target.value)}
                                className="w-full px-2 py-1 text-[11px] bg-white border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-brand"
                              />
                              <input
                                type="text"
                                dir="rtl"
                                placeholder="التعليق التوضيحي (اختياري)"
                                value={img.caption?.ar || ''}
                                onChange={(e) => handleUpdateCaption(block.id, imgIdx, 'ar', e.target.value)}
                                className="w-full px-2 py-1 text-[11px] bg-white border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-brand text-right"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Add Image Uploader */}
                    <div className="pt-1">
                      <p className="text-xs text-text-muted mb-1.5">
                        Upload an image using Cloudinary (auto-optimised):
                      </p>
                      <ImageUpload
                        value=""
                        onChange={(url) => handleAddImage(block.id, url)}
                      />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* ── Preview Modal ── */}
      {previewOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 max-w-3xl w-full max-h-[85vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-gray-100 flex items-center justify-between bg-surface-mint/30">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-brand text-white flex items-center justify-center">
                  <Eye className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-brand-dark text-base">Additional Content Preview</h3>
                  <p className="text-xs text-text-muted">
                    Simulated rendering on the public department details page.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {/* Language Switcher */}
                <div className="flex items-center bg-gray-100 p-0.5 rounded-lg text-xs font-semibold">
                  <button
                    type="button"
                    onClick={() => setPreviewLocale('en')}
                    className={`px-2.5 py-1 rounded-md transition ${previewLocale === 'en' ? 'bg-white text-brand shadow-xs' : 'text-gray-500'}`}
                  >
                    EN
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreviewLocale('ar')}
                    className={`px-2.5 py-1 rounded-md transition ${previewLocale === 'ar' ? 'bg-white text-brand shadow-xs' : 'text-gray-500'}`}
                  >
                    العربية
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => setPreviewOpen(false)}
                  className="p-1.5 text-gray-400 hover:text-gray-700 rounded-lg hover:bg-gray-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div
              className={`p-6 sm:p-8 overflow-y-auto space-y-12 ${previewLocale === 'ar' ? 'text-right' : 'text-left'}`}
              dir={previewLocale === 'ar' ? 'rtl' : 'ltr'}
            >
              {blocks.map((b, idx) => {
                const heading = (previewLocale === 'ar' ? b.heading?.ar : b.heading?.en) || b.heading?.en || b.heading?.ar;
                const desc = (previewLocale === 'ar' ? b.description?.ar : b.description?.en) || b.description?.en || b.description?.ar;

                return (
                  <div key={b.id || idx} className="space-y-4 border-b border-gray-100 pb-8 last:border-b-0">
                    {heading && (
                      <div className="flex items-center gap-3">
                        <div className="w-2.5 h-2.5 rounded-full bg-brand" />
                        <h4 className="text-xl sm:text-2xl font-serif font-bold text-brand-dark">
                          {heading}
                        </h4>
                      </div>
                    )}

                    {/* Heading + Text */}
                    {b.type === 'heading_text' && desc && (
                      <p className="text-gray-600 leading-relaxed whitespace-pre-line text-sm sm:text-base">
                        {desc}
                      </p>
                    )}

                    {/* Bullet Points */}
                    {b.type === 'bullet_points' && b.items && b.items.length > 0 && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                        {b.items.map((item, itemIdx) => {
                          const text = (previewLocale === 'ar' ? item.ar : item.en) || item.en || item.ar;
                          if (!text) return null;
                          return (
                            <div
                              key={itemIdx}
                              className="flex items-start gap-2.5 bg-surface-mint/30 p-3 rounded-xl border border-brand/10 text-sm text-brand-dark"
                            >
                              <CheckCircle2 className="w-4 h-4 text-brand shrink-0 mt-0.5" />
                              <span className="font-medium">{text}</span>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {/* Image Gallery */}
                    {b.type === 'image_gallery' && b.images && b.images.length > 0 && (
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-2">
                        {b.images.map((img, imgIdx) => {
                          const caption = (previewLocale === 'ar' ? img.caption?.ar : img.caption?.en) || img.caption?.en || img.caption?.ar;
                          return (
                            <div key={imgIdx} className="space-y-1.5">
                              <div className="relative aspect-video bg-gray-100 rounded-xl overflow-hidden border border-gray-200">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                  src={img.url}
                                  alt={caption || `Gallery ${imgIdx + 1}`}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              {caption && (
                                <p className="text-xs text-gray-500 font-medium text-center">
                                  {caption}
                                </p>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {/* Text + Images */}
                    {b.type === 'text_images' && (
                      <div className="space-y-4 pt-1">
                        {desc && (
                          <p className="text-gray-600 leading-relaxed whitespace-pre-line text-sm sm:text-base">
                            {desc}
                          </p>
                        )}
                        {b.images && b.images.length > 0 && (
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                            {b.images.map((img, imgIdx) => {
                              const caption = (previewLocale === 'ar' ? img.caption?.ar : img.caption?.en) || img.caption?.en || img.caption?.ar;
                              return (
                                <div key={imgIdx} className="space-y-1.5">
                                  <div className="relative aspect-video bg-gray-100 rounded-xl overflow-hidden border border-gray-200">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                      src={img.url}
                                      alt={caption || `Image ${imgIdx + 1}`}
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                  {caption && (
                                    <p className="text-xs text-gray-500 font-medium text-center">
                                      {caption}
                                    </p>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

