import type { ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

const variants = {
  primary:   'bg-brand-red text-white hover:bg-brand-red-dark focus-visible:ring-brand-red shadow-sm',
  secondary: 'bg-brand-dark text-white hover:bg-brand focus-visible:ring-brand-dark shadow-sm',
  outline:   'border-2 border-brand-dark text-brand-dark hover:bg-brand-dark hover:text-white focus-visible:ring-brand-dark',
  ghost:     'text-brand-dark hover:bg-brand-mint focus-visible:ring-brand-dark',
  link:      'text-brand-red underline-offset-4 hover:underline focus-visible:ring-brand-red',
  sarc:      'bg-brand-orange text-white hover:bg-brand-orange-dark focus-visible:ring-brand-orange shadow-sm',
} as const;

const sizes = {
  sm:  'px-4 py-2 text-sm',
  md:  'px-5 py-2.5 text-sm',
  lg:  'px-6 py-3 text-base',
  xl:  'px-8 py-4 text-base',
} as const;

type ButtonVariant = keyof typeof variants;
type ButtonSize = keyof typeof sizes;

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  fullWidth?: boolean;
};

export function Button({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  fullWidth = false,
  className,
  children,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      disabled={disabled ?? isLoading}
      aria-busy={isLoading}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-all duration-200',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
        'disabled:pointer-events-none disabled:opacity-50',
        variants[variant],
        sizes[size],
        fullWidth && 'w-full',
        className,
      )}
      {...props}
    >
      {isLoading && (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" aria-hidden="true" />
      )}
      {children}
    </button>
  );
}
