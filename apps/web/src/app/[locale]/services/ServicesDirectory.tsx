'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import type { Locale } from '@/i18n/config';
import { getLocalizedPath } from '@/lib/utils';

type Category = {
  _id: string;
  name: { en: string; ar: string };
  slug: string;
  description?: { en: string; ar: string };
  order?: number;
};

type Service = {
  _id: string;
  name: { en: string; ar: string };
  slug: string;
  description?: { en: string; ar: string };
  image?: string;
  categoryId?: Category | string;
  associatedOrganizations?: string[];
  order?: number;
};

type Props = {
  services: Service[];
  categories: Category[];
  locale: Locale;
};

export function ServicesDirectory({ services, categories, locale }: Props) {
  const isAr = locale === 'ar';
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Count services per category
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    services.forEach((s) => {
      const catId = typeof s.categoryId === 'object' && s.categoryId ? s.categoryId._id : s.categoryId;
      if (catId) {
        counts[catId] = (counts[catId] || 0) + 1;
      }
    });
    return counts;
  }, [services]);

  // Filter categories to only those that have services or all
  const activeCategories = useMemo(() => {
    return categories.filter((c) => (categoryCounts[c._id] || 0) > 0);
  }, [categories, categoryCounts]);

  // Filtered services
  const filteredServices = useMemo(() => {
    return services.filter((service) => {
      // Category filter
      if (selectedCategory !== 'all') {
        const catId =
          typeof service.categoryId === 'object' && service.categoryId
            ? service.categoryId._id
            : service.categoryId;
        if (catId !== selectedCategory) return false;
      }

      // Search filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const nameEn = (service.name?.en || '').toLowerCase();
        const nameAr = (service.name?.ar || '').toLowerCase();
        const descEn = (service.description?.en || '').toLowerCase();
        const descAr = (service.description?.ar || '').toLowerCase();
        const orgs = (service.associatedOrganizations || []).join(' ').toLowerCase();

        const matchesName = nameEn.includes(query) || nameAr.includes(query);
        const matchesDesc = descEn.includes(query) || descAr.includes(query);
        const matchesOrgs = orgs.includes(query);

        if (!matchesName && !matchesDesc && !matchesOrgs) {
          return false;
        }
      }

      return true;
    });
  }, [services, selectedCategory, searchQuery]);

  return (
    <div className="space-y-10">
      {/* Controls: Search & Category Pills */}
      <div className="space-y-6">
        {/* Search Bar & Stats */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          {/* Quick Search */}
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                isAr
                  ? 'ابحث بالاسم، الفئة، أو الجهة المعتمدة...'
                  : 'Search by service name, category, or accreditation...'
              }
              className="w-full ps-11 pe-10 py-3 bg-white border border-border/80 rounded-2xl text-sm text-text-base placeholder:text-text-subtle focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition-all shadow-xs"
            />
            <div className="absolute inset-y-0 start-0 flex items-center ps-4 pointer-events-none text-text-muted">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 end-0 flex items-center pe-3.5 text-text-muted hover:text-text-base transition-colors"
                aria-label={isAr ? 'مسح البحث' : 'Clear search'}
              >
                <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            )}
          </div>

          {/* Results count */}
          <div className="text-xs sm:text-sm text-text-muted font-medium flex items-center gap-1.5 shrink-0">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>
              {isAr
                ? `${filteredServices.length} من أصل ${services.length} خدمة متوفرة`
                : `Showing ${filteredServices.length} of ${services.length} services`}
            </span>
          </div>
        </div>

        {/* Category Classification Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none pt-1">
          {/* All tab */}
          <button
            type="button"
            onClick={() => setSelectedCategory('all')}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 shrink-0 cursor-pointer ${
              selectedCategory === 'all'
                ? 'bg-brand-dark text-white shadow-md shadow-brand-dark/15 ring-2 ring-brand-dark/20'
                : 'bg-white text-text-muted hover:text-brand-dark hover:bg-surface-mint/60 border border-border/80'
            }`}
          >
            <span>{isAr ? 'جميع الخدمات' : 'All Services'}</span>
            <span
              className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                selectedCategory === 'all'
                  ? 'bg-white/20 text-white'
                  : 'bg-gray-100 text-text-muted'
              }`}
            >
              {services.length}
            </span>
          </button>

          {/* Dynamic category tabs */}
          {activeCategories.map((cat) => {
            const catName = cat.name?.[locale] || cat.name?.en;
            const count = categoryCounts[cat._id] || 0;
            const isSelected = selectedCategory === cat._id;

            return (
              <button
                key={cat._id}
                type="button"
                onClick={() => setSelectedCategory(cat._id)}
                className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 shrink-0 cursor-pointer ${
                  isSelected
                    ? 'bg-brand-dark text-white shadow-md shadow-brand-dark/15 ring-2 ring-brand-dark/20'
                    : 'bg-white text-text-muted hover:text-brand-dark hover:bg-surface-mint/60 border border-border/80'
                }`}
              >
                <span>{catName}</span>
                <span
                  className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                    isSelected
                      ? 'bg-white/20 text-white'
                      : 'bg-gray-100 text-text-muted'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Services Grid */}
      {filteredServices.length === 0 ? (
        <div className="py-20 text-center bg-white rounded-3xl border border-dashed border-border p-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-surface-mint flex items-center justify-center text-brand">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-serif font-bold text-brand-dark mb-1">
            {isAr ? 'لم يتم العثور على خدمات مطابقة' : 'No matching services found'}
          </h3>
          <p className="text-sm text-text-muted max-w-md mx-auto mb-6">
            {isAr
              ? 'جرّب البحث بكلمات أخرى أو اختر فئة مختلفة من التصنيفات أعلاه.'
              : 'Try adjusting your search query or selecting a different category from above.'}
          </p>
          <button
            type="button"
            onClick={() => {
              setSelectedCategory('all');
              setSearchQuery('');
            }}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-dark text-white rounded-xl text-xs sm:text-sm font-semibold hover:bg-brand transition-colors cursor-pointer"
          >
            <span>{isAr ? 'إعادة ضبط التصفية' : 'Reset Filters'}</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredServices.map((service) => {
            const name = service.name?.[locale] || service.name?.en;
            const desc = service.description?.[locale] || service.description?.en || '';
            const orgs = service.associatedOrganizations || [];
            const categoryObj =
              typeof service.categoryId === 'object' && service.categoryId
                ? service.categoryId
                : categories.find((c) => c._id === service.categoryId);
            const categoryName = categoryObj?.name?.[locale] || categoryObj?.name?.en;

            return (
              <Link
                key={service._id}
                href={getLocalizedPath(`/services/${service.slug}`, locale)}
                className="group flex flex-col bg-white rounded-3xl overflow-hidden border border-border/70 hover:border-brand-pale/80 shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-[0_16px_36px_rgb(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300"
              >
                {/* Image & Category Floating Tag */}
                <div className="relative h-52 sm:h-56 bg-surface-mint overflow-hidden shrink-0">
                  {service.image ? (
                    <img
                      src={service.image}
                      alt={name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-linear-to-br from-surface-mint via-emerald-50/50 to-surface-mint text-brand-medium">
                      <div className="w-16 h-16 rounded-2xl bg-white/80 backdrop-blur-xs shadow-sm flex items-center justify-center text-brand-medium group-hover:scale-110 transition-transform duration-300">
                        <svg
                          className="w-8 h-8"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.5"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="1.5"
                            d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </div>
                    </div>
                  )}

                  {/* Gradient shadow for contrast */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/10 opacity-60 group-hover:opacity-40 transition-opacity" />

                  {/* Floating Category Badge */}
                  {categoryName && (
                    <div className="absolute top-4 start-4 z-10">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white/95 text-brand-dark backdrop-blur-md shadow-sm border border-white/40">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                        {categoryName}
                      </span>
                    </div>
                  )}
                </div>

                {/* Content Body */}
                <div className="p-6 sm:p-7 flex flex-col flex-1">
                  <h3 className="text-xl font-serif font-bold text-brand-dark mb-2.5 group-hover:text-brand transition-colors line-clamp-2">
                    {name}
                  </h3>

                  {desc && (
                    <p className="text-text-muted text-sm leading-relaxed mb-5 line-clamp-3 flex-1">
                      {desc}
                    </p>
                  )}

                  {/* Associated Organizations (if present) */}
                  {orgs.length > 0 && (
                    <div className="mb-5 pt-3 border-t border-border/60">
                      <p className="text-[11px] font-bold uppercase tracking-wider text-text-subtle mb-2">
                        {isAr ? 'الجهات المعتمدة:' : 'Recognized By:'}
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {orgs.map((org, i) => (
                          <span
                            key={i}
                            className="inline-flex items-center px-2.5 py-0.5 bg-emerald-50/80 rounded-md text-emerald-800 font-bold text-[11px] border border-emerald-200/60"
                          >
                            {org}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Footer link */}
                  <div className="mt-auto pt-2 flex items-center justify-between text-sm font-semibold text-brand group-hover:text-brand-dark transition-colors">
                    <span>{isAr ? 'تفاصيل الخدمة' : 'View Service'}</span>
                    <div className="w-8 h-8 rounded-full bg-surface-mint flex items-center justify-center text-brand group-hover:bg-brand group-hover:text-white transition-all duration-300">
                      <svg
                        className="w-4 h-4 rtl:rotate-180 transition-transform group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M14 5l7 7m0 0l-7 7m7-7H3"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
