import type { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

type HeadingLevel = 1 | 2 | 3 | 4;
type HeadingVariant = 'display' | 'h1' | 'h2' | 'h3' | 'h4';

type Props = HTMLAttributes<HTMLHeadingElement> & {
  level?: HeadingLevel;
  variant?: HeadingVariant;
  eyebrow?: string;
  serif?: boolean;
};

const variantClasses: Record<HeadingVariant, string> = {
  display: 'font-serif text-display-xl md:text-display-2xl font-bold tracking-tight',
  h1:      'font-serif text-display-md md:text-display-lg font-bold tracking-tight',
  h2:      'font-serif text-display-sm md:text-display-md font-bold tracking-tight',
  h3:      'font-sans text-xl md:text-2xl font-semibold',
  h4:      'font-sans text-lg font-semibold',
};

export function Heading({
  level = 2,
  variant,
  eyebrow,
  serif = false,
  className,
  children,
  ...props
}: Props) {
  const Tag = `h${level}` as 'h1' | 'h2' | 'h3' | 'h4';
  const resolvedVariant: HeadingVariant = variant ?? (`h${level}` as HeadingVariant);

  return (
    <div>
      {eyebrow && (
        <p className="label-sm text-brand-medium mb-3">
          {eyebrow}
        </p>
      )}
      <Tag
        className={cn(
          variantClasses[resolvedVariant],
          serif && 'font-serif',
          className,
        )}
        {...props}
      >
        {children}
      </Tag>
    </div>
  );
}
