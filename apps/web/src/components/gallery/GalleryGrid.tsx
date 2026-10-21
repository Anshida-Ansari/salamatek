'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import { X, ChevronLeft, ChevronRight, ZoomIn, Building2, LayoutGrid, Stethoscope } from 'lucide-react';

export interface DepartmentItem {
  _id: string;
  name: { en: string; ar: string };
  slug?: string;
  active?: boolean;
}

export interface GalleryImage {
  _id: string;
  imageUrl: string;
  title?: { en: string; ar: string };
  description?: { en: string; ar: string };
  departmentId?: {
    _id: string;
    name: { en: string; ar: string };
    slug?: string;
  } | string;
}

interface GalleryGridProps {
  images: GalleryImage[];
  departments?: DepartmentItem[];
  isAr: boolean;
}

/** Formats uppercase text like "OPHTHALMOLOGY" to Title Case ("Ophthalmology") */
function formatTitle(name: string, isAr: boolean) {
  if (isAr || !name) return name;
  return name
    .toLowerCase()
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export function GalleryGrid({ images, departments = [], isAr }: GalleryGridProps) {
  const [activeTab, setActiveTab] = useState<string>('all');
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  // Department counts
  const { deptCounts, unassignedCount } = useMemo(() => {
    const counts: Record<string, number> = {};
    let unassigned = 0;

    for (const img of images) {
      const id = typeof img.departmentId === 'object' ? img.departmentId?._id : img.departmentId;
      if (id) {
        counts[id] = (counts[id] || 0) + 1;
      } else {
        unassigned += 1;
      }
    }
    return { deptCounts: counts, unassignedCount: unassigned };
  }, [images]);

  // Construct tabs: "All", "General" (if any unassigned), then departments with photos
  const tabs = useMemo(() => {
    const list: Array<{ id: string; label: string; count: number }> = [
      {
        id: 'all',
        label: isAr ? 'جميع الأقسام' : 'All Photos',
        count: images.length,
      },
    ];

    if (unassignedCount > 0) {
      list.push({
        id: 'general',
        label: isAr ? 'المرافق والمركز' : 'General & Facilities',
        count: unassignedCount,
      });
    }

    // Departments from prop list that have images
    departments.forEach((dept) => {
      const count = deptCounts[dept._id] || 0;
      if (count > 0) {
        list.push({
          id: dept._id,
          label: isAr ? dept.name.ar : formatTitle(dept.name.en, false),
          count,
        });
      }
    });

    return list;
  }, [images.length, unassignedCount, departments, deptCounts, isAr]);

  // Filter images by current tab
  const filteredImages = useMemo(() => {
    if (activeTab === 'all') return images;
    if (activeTab === 'general') {
      return images.filter(
        (img) => !img.departmentId || (typeof img.departmentId === 'object' && !img.departmentId?._id)
      );
    }
    return images.filter((img) => {
      const id = typeof img.departmentId === 'object' ? img.departmentId?._id : img.departmentId;
      return id === activeTab;
    });
  }, [images, activeTab]);

  const handleSelectTab = (tabId: string) => {
    setActiveTab(tabId);
    setSelectedIndex(null);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedIndex !== null && filteredImages.length > 0) {
      setSelectedIndex((selectedIndex + 1) % filteredImages.length);
    }
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedIndex !== null && filteredImages.length > 0) {
      setSelectedIndex((selectedIndex - 1 + filteredImages.length) % filteredImages.length);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') setSelectedIndex(null);
    if (e.key === 'ArrowRight') handleNext(e as any);
    if (e.key === 'ArrowLeft') handlePrev(e as any);
  };

  const selectedImage = selectedIndex !== null ? filteredImages[selectedIndex] : null;

  if (!images || images.length === 0) {
    return (
      <div className="py-24 text-center">
        <h3 className="text-xl font-semibold text-brand-dark mb-2">
          {isAr ? 'المعرض قريباً' : 'Gallery coming soon'}
        </h3>
        <p className="text-text-muted">
          {isAr
            ? 'نحن نقوم بتحديث معرض الصور الخاص بنا. يرجى التحقق مرة أخرى قريباً.'
            : 'We are currently updating our photo gallery. Please check back soon.'}
        </p>
      </div>
    );
  }

  return (
    <section className="py-10 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Modern Segmented Filter Section */}
        {tabs.length > 1 && (
          <div className="space-y-4">
            {/* Filter Pills with wrap layout and no horizontal scrollbar */}
            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-2.5 max-w-5xl mx-auto">
              {tabs.map((tab) => {
                const isActive = activeTab === tab.id;
                const Icon =
                  tab.id === 'all'
                    ? LayoutGrid
                    : tab.id === 'general'
                    ? Building2
                    : Stethoscope;

                return (
                  <button
                    key={tab.id}
                    onClick={() => handleSelectTab(tab.id)}
                    className={`group relative inline-flex items-center gap-2 px-4 py-2 sm:px-4.5 sm:py-2.5 rounded-2xl text-xs sm:text-sm transition-all duration-200 cursor-pointer ${
                      isActive
                        ? 'bg-brand text-white shadow-md shadow-brand/20 ring-1 ring-brand-medium font-semibold'
                        : 'bg-white text-gray-700 hover:text-brand-dark hover:bg-emerald-50/70 border border-gray-200/80 hover:border-brand/30 shadow-2xs font-medium'
                    }`}
                  >
                    <Icon
                      className={`w-3.5 h-3.5 shrink-0 transition-colors ${
                        isActive ? 'text-brand-light' : 'text-gray-400 group-hover:text-brand'
                      }`}
                    />
                    <span>{tab.label}</span>
                    <span
                      className={`text-[11px] font-bold px-2 py-0.5 rounded-full transition-colors ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : 'bg-gray-100 text-gray-500 group-hover:bg-emerald-100 group-hover:text-brand-dark'
                      }`}
                    >
                      {tab.count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Filter Count & Department Indicator */}
            <div className="text-center">
              <p className="text-xs text-text-muted">
                {isAr ? (
                  <>
                    عرض <span className="font-bold text-brand-dark">{filteredImages.length}</span> صورة
                    {activeTab !== 'all' && (
                      <>
                        {' '}في قسم{' '}
                        <span className="font-bold text-brand">
                          {tabs.find((t) => t.id === activeTab)?.label}
                        </span>
                      </>
                    )}
                  </>
                ) : (
                  <>
                    Showing <span className="font-bold text-brand-dark">{filteredImages.length}</span> photo
                    {filteredImages.length !== 1 ? 's' : ''}
                    {activeTab !== 'all' && (
                      <>
                        {' '}in{' '}
                        <span className="font-bold text-brand">
                          {tabs.find((t) => t.id === activeTab)?.label}
                        </span>
                      </>
                    )}
                  </>
                )}
              </p>
            </div>
          </div>
        )}

        {/* Empty state for filtered tab */}
        {filteredImages.length === 0 ? (
          <div className="py-20 text-center bg-white rounded-3xl border border-border/70 p-8 max-w-md mx-auto shadow-xs">
            <div className="w-12 h-12 rounded-2xl bg-surface-mint text-brand flex items-center justify-center mx-auto mb-3 shadow-xs">
              <Building2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-brand-dark mb-1">
              {isAr ? 'لا توجد صور في هذا القسم حالياً' : 'No photos in this department yet'}
            </h3>
            <p className="text-xs text-text-muted mb-4">
              {isAr
                ? 'يرجى اختيار قسم آخر أو عرض جميع الصور.'
                : 'Please select another department or view all photos.'}
            </p>
            <button
              onClick={() => handleSelectTab('all')}
              className="inline-flex items-center gap-2 px-4 py-2 bg-brand text-white text-xs font-semibold rounded-xl hover:bg-brand-medium transition cursor-pointer"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>{isAr ? 'عرض جميع الصور' : 'View All Photos'}</span>
            </button>
          </div>
        ) : (
          /* Masonry / Grid Layout */
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
            {filteredImages.map((img, idx) => {
              const title = isAr ? img.title?.ar : img.title?.en;
              const deptName =
                typeof img.departmentId === 'object' && img.departmentId?.name
                  ? (isAr ? img.departmentId.name.ar : formatTitle(img.departmentId.name.en, false))
                  : null;

              return (
                <div
                  key={img._id}
                  className="relative group overflow-hidden rounded-2xl cursor-pointer break-inside-avoid bg-gray-100 shadow-xs hover:shadow-card transition-all duration-300"
                  onClick={() => setSelectedIndex(idx)}
                >
                  <div className="relative w-full overflow-hidden" style={{ minHeight: '220px' }}>
                    <Image
                      src={img.imageUrl}
                      alt={title || 'Gallery Image'}
                      width={800}
                      height={600}
                      className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  </div>

                  {/* Department Badge */}
                  {deptName && (
                    <div className="absolute top-3 start-3 z-10">
                      <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-brand-dark/80 text-white backdrop-blur-md border border-white/20 shadow-xs flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-brand-light"></span>
                        <span>{deptName}</span>
                      </span>
                    </div>
                  )}

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/95 via-brand-dark/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                    <ZoomIn className="w-8 h-8 text-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 delay-100 scale-50 group-hover:scale-100" />
                    {title && (
                      <h3 className="text-white font-semibold text-lg translate-y-3 group-hover:translate-y-0 transition-transform duration-300">
                        {title}
                      </h3>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Lightbox Viewer */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center"
          onClick={() => setSelectedIndex(null)}
          onKeyDown={handleKeyDown}
          tabIndex={0}
          autoFocus
        >
          {/* Close button */}
          <button
            className="absolute top-6 right-6 p-2 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition-colors z-50 cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedIndex(null);
            }}
            aria-label="Close image preview"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Navigation */}
          {filteredImages.length > 1 && (
            <>
              <button
                className="absolute left-4 p-3 text-white/70 hover:text-white bg-black/50 hover:bg-black/80 rounded-full transition-colors z-50 cursor-pointer"
                onClick={handlePrev}
                aria-label="Previous image"
              >
                <ChevronLeft className="w-8 h-8" />
              </button>
              <button
                className="absolute right-4 p-3 text-white/70 hover:text-white bg-black/50 hover:bg-black/80 rounded-full transition-colors z-50 cursor-pointer"
                onClick={handleNext}
                aria-label="Next image"
              >
                <ChevronRight className="w-8 h-8" />
              </button>
            </>
          )}

          {/* Current Image */}
          <div
            className="relative w-full h-full max-w-6xl max-h-[90vh] mx-auto p-4 md:p-12 flex flex-col items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative w-full h-full flex items-center justify-center">
              <Image
                src={selectedImage.imageUrl}
                alt={(isAr ? selectedImage.title?.ar : selectedImage.title?.en) || 'Gallery Image'}
                fill
                className="object-contain"
                quality={100}
                priority
              />
            </div>
            {(selectedImage.title?.en ||
              selectedImage.title?.ar ||
              selectedImage.description?.en ||
              selectedImage.description?.ar) && (
              <div className="absolute bottom-0 inset-x-0 p-6 bg-gradient-to-t from-black/90 to-transparent text-center">
                <h3 className="text-white text-xl font-medium mb-1">
                  {isAr ? selectedImage.title?.ar : selectedImage.title?.en}
                </h3>
                <p className="text-white/80 max-w-2xl mx-auto text-sm">
                  {isAr ? selectedImage.description?.ar : selectedImage.description?.en}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
