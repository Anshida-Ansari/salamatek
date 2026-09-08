import Link from 'next/link';
import type { Locale } from '@/i18n/config';

export type BreadcrumbItem = {
  label: string;
  href?: string;
};

type Props = {
  items: BreadcrumbItem[];
  locale: Locale;
  /** Optional extra class for the nav wrapper */
  className?: string;
};

/**
 * Breadcrumbs — accessible, semantic trail of page ancestry.
 * Structured data (schema.org/BreadcrumbList) is NOT included here;
 * add it at the page level with generateMetadata if required.
 */
export function Breadcrumbs({ items, className = '' }: Props) {
  return (
    <nav
      aria-label="Breadcrumb"
      className={`flex items-center flex-wrap gap-1.5 text-sm ${className}`}
    >
      <ol className="flex items-center flex-wrap gap-1.5 list-none p-0 m-0">
        {items.map((item, idx) => {
          const isLast = idx === items.length - 1;
          return (
            <li key={idx} className="flex items-center gap-1.5">
              {idx > 0 && (
                <span
                  className="text-text-subtle select-none"
                  aria-hidden="true"
                >
                  /
                </span>
              )}
              {isLast || !item.href ? (
                <span
                  className="text-text-muted font-medium"
                  aria-current={isLast ? 'page' : undefined}
                >
                  {item.label}
                </span>
              ) : (
                <Link
                  href={item.href}
                  className="text-text-muted hover:text-brand-dark transition-colors duration-150"
                >
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
