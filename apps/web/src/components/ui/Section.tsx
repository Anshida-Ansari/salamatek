import type { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';
import { Container } from './Container';

type SectionBg = 'white' | 'mint' | 'cream' | 'dark' | 'brand' | 'none';

type Props = HTMLAttributes<HTMLElement> & {
  bg?: SectionBg;
  containerSize?: 'sm' | 'md' | 'lg' | 'xl';
  spacing?: 'sm' | 'md' | 'lg' | 'xl';
  noContainer?: boolean;
};

const bgs: Record<SectionBg, string> = {
  white:  'bg-white',
  mint:   'bg-brand-mint',
  cream:  'bg-brand-cream',
  dark:   'bg-brand-dark text-white',
  brand:  'bg-brand text-white',
  none:   '',
};

const spacings = {
  sm: 'py-10 md:py-14',
  md: 'py-14 md:py-20',
  lg: 'py-20 md:py-28',
  xl: 'py-28 md:py-36',
};

export function Section({
  bg = 'white',
  containerSize = 'xl',
  spacing = 'md',
  noContainer = false,
  className,
  children,
  ...props
}: Props) {
  return (
    <section className={cn(bgs[bg], spacings[spacing], className)} {...props}>
      {noContainer ? children : <Container size={containerSize}>{children}</Container>}
    </section>
  );
}
