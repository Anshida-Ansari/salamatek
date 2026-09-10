'use client';

import { GlobalLoader } from './GlobalLoader';

/**
 * GlobalLoaderProvider — renders the top-bar page transition loader.
 * No Suspense needed since GlobalLoader no longer uses useSearchParams.
 */
export function GlobalLoaderProvider() {
  return <GlobalLoader />;
}
