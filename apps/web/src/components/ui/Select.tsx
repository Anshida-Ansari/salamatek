import { forwardRef, type SelectHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  label?: string;
  error?: string;
  placeholder?: string;
  options: Array<{ value: string; label: string }>;
};

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { label, error, placeholder, options, className, id, ...props },
  ref
) {
  const selectId = id ?? label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={selectId}
          className="block text-sm font-medium text-text-base mb-1.5"
        >
          {label}
          {props.required && <span className="text-brand-red ms-1" aria-label="required">*</span>}
        </label>
      )}
      <select
        ref={ref}
        id={selectId}
        className={cn(
          'w-full rounded-lg border bg-white px-4 py-2.5 text-sm text-text-base',
          'transition-colors duration-150 appearance-none cursor-pointer',
          'focus:outline-none focus:ring-2 focus:ring-brand-medium focus:border-brand-medium',
          error
            ? 'border-brand-red focus:ring-brand-red'
            : 'border-border hover:border-border-strong',
          className,
        )}
        aria-invalid={error ? 'true' : undefined}
        {...props}
      >
        {placeholder && <option value="" disabled>{placeholder}</option>}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      {error && (
        <p role="alert" className="mt-1.5 text-xs text-brand-red">{error}</p>
      )}
    </div>
  );
});
