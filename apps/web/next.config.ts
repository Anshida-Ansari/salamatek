import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Strict mode for better React development
  reactStrictMode: true,

  // Transpile internal workspace packages
  transpilePackages: ['@salamatek/ui', '@salamatek/config', '@salamatek/types'],

  // Enable gzip/brotli compression for production responses
  compress: true,

  // Disable x-powered-by header (security)
  poweredByHeader: false,

  // Generate ETags for caching
  generateEtags: true,

  // Image optimisation
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'res.cloudinary.com' },
    ],
  },

  // ─── Security Headers ──────────────────────────────────────────────────────
  async headers() {
    return [
      {
        // Apply to all routes
        source: '/(.*)',
        headers: [
          // Prevent clickjacking
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          // Prevent MIME-type sniffing
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          // Referrer policy — don't leak full URL to external sites
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          // Limit browser feature access
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(self), interest-cohort=()',
          },
          // Enable XSS protection in older browsers
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          // HSTS — only enable after SSL is confirmed on production
          // { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
        ],
      },
      {
        // Long-lived cache for Next.js static assets (they are content-hashed)
        source: '/_next/static/(.*)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      {
        // Cache public images for 1 week
        source: '/images/(.*)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=604800, stale-while-revalidate=86400' },
        ],
      },
    ];
  },
};

export default nextConfig;
