import type { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

type BadgeVariant = 'default' | 'brand' | 'red' | 'orange' | 'mint' | 'cream';

type Props = HTMLAttributes<HTMLSpanElement> & {
  variant?: BadgeVariant;
};

const variants: Record<BadgeVariant, string> = {
  default: 'bg-surface-light text-text-muted border border-border',
  brand:   'bg-brand-mint text-brand-dark border border-brand-pale',
  red:     'bg-red-50 text-brand-red border border-red-200',
  orange:  'bg-orange-50 text-brand-orange border border-orange-200',
  mint:    'bg-brand-mint text-brand-medium',
  cream:   'bg-brand-cream text-text-base',
};

export function Badge({ variant = 'default', className, children, ...props }: Props) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold',
        variants[variant],
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}
