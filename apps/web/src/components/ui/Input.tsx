import { forwardRef, type InputHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
  hint?: string;
};

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, error, hint, className, id, ...props },
  ref
) {
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-text-base mb-1.5"
        >
          {label}
          {props.required && <span className="text-brand-red ms-1" aria-label="required">*</span>}
        </label>
      )}
      <input
        ref={ref}
        id={inputId}
        className={cn(
          'w-full rounded-lg border bg-white px-4 py-2.5 text-sm text-text-base',
          'placeholder:text-text-subtle',
          'transition-colors duration-150',
          'focus:outline-none focus:ring-2 focus:ring-brand-medium focus:border-brand-medium',
          error
            ? 'border-brand-red focus:ring-brand-red'
            : 'border-border hover:border-border-strong',
          className,
        )}
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
        {...props}
      />
      {hint && !error && (
        <p id={`${inputId}-hint`} className="mt-1.5 text-xs text-text-muted">{hint}</p>
      )}
      {error && (
        <p id={`${inputId}-error`} role="alert" className="mt-1.5 text-xs text-brand-red">{error}</p>
      )}
    </div>
  );
});
