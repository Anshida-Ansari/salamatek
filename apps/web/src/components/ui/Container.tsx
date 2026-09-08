import type { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

type ContainerSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';

type Props = HTMLAttributes<HTMLDivElement> & {
  size?: ContainerSize;
  as?: 'div' | 'section' | 'article' | 'main';
};

const sizes: Record<ContainerSize, string> = {
  sm:   'max-w-3xl',
  md:   'max-w-5xl',
  lg:   'max-w-6xl',
  xl:   'max-w-7xl',
  full: 'max-w-full',
};

export function Container({ size = 'xl', as: Tag = 'div', className, children, ...props }: Props) {
  return (
    <Tag
      className={cn('mx-auto w-full px-4 sm:px-6 lg:px-8', sizes[size], className)}
      {...props}
    >
      {children}
    </Tag>
  );
}
