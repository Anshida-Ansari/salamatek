import type { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

type CardVariant = 'default' | 'bordered' | 'elevated' | 'flat';

type Props = HTMLAttributes<HTMLDivElement> & {
  variant?: CardVariant;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hover?: boolean;
};

const variants: Record<CardVariant, string> = {
  default:  'bg-white border border-border shadow-card',
  bordered: 'bg-white border-2 border-border',
  elevated: 'bg-white shadow-card-md',
  flat:     'bg-surface-light',
};

const paddings = {
  none: '',
  sm:   'p-4',
  md:   'p-6',
  lg:   'p-8',
};

export function Card({
  variant = 'default',
  padding = 'md',
  hover = false,
  className,
  children,
  ...props
}: Props) {
  return (
    <div
      className={cn(
        'rounded-2xl overflow-hidden',
        variants[variant],
        paddings[padding],
        hover && 'transition-shadow duration-200 hover:shadow-card-lg',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
