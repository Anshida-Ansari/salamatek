import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,

  // Transpile internal workspace packages
  transpilePackages: ['@salamatek/ui', '@salamatek/config', '@salamatek/types'],

  // Admin is English-only — no i18n needed
  poweredByHeader: false,

  images: {
    remotePatterns: [],
  },
};

export default nextConfig;
