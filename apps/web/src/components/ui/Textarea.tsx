import { forwardRef, type TextareaHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label?: string;
  error?: string;
  hint?: string;
};

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { label, error, hint, className, id, rows = 4, ...props },
  ref
) {
  const textareaId = id ?? label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={textareaId}
          className="block text-sm font-medium text-text-base mb-1.5"
        >
          {label}
          {props.required && <span className="text-brand-red ms-1" aria-label="required">*</span>}
        </label>
      )}
      <textarea
        ref={ref}
        id={textareaId}
        rows={rows}
        className={cn(
          'w-full rounded-lg border bg-white px-4 py-2.5 text-sm text-text-base',
          'placeholder:text-text-subtle resize-y',
          'focus:outline-none focus:ring-2 focus:ring-brand-medium focus:border-brand-medium',
          error
            ? 'border-brand-red focus:ring-brand-red'
            : 'border-border hover:border-border-strong',
          className,
        )}
        aria-invalid={error ? 'true' : undefined}
        {...props}
      />
      {hint && !error && (
        <p className="mt-1.5 text-xs text-text-muted">{hint}</p>
      )}
      {error && (
        <p role="alert" className="mt-1.5 text-xs text-brand-red">{error}</p>
      )}
    </div>
  );
});
