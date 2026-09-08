import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Enable strict mode for better development experience
  reactStrictMode: true,

  // Transpile internal workspace packages so Next.js can handle their TypeScript
  transpilePackages: ['@salamatek/ui', '@salamatek/config', '@salamatek/types'],

  // NOTE: In Next.js 15 (App Router), i18n routing is handled via middleware.
  // Locale detection and routing will be implemented in Phase 1 using
  // next/server middleware + the `[locale]` dynamic segment pattern.

  // Image domains — will be populated when media hosting is confirmed
  images: {
    remotePatterns: [],
  },

  // Disable x-powered-by header
  poweredByHeader: false,
};

export default nextConfig;
