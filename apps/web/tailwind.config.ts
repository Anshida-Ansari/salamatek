import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    '../../packages/ui/src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      // Brand colours — will be populated from design reference in Phase 1
      colors: {
        brand: {
          50: '#eef7ff',
          100: '#d9eeff',
          200: '#bce0ff',
          300: '#8ecdff',
          400: '#59b1fe',
          500: '#3391fa',
          600: '#1d72ef',
          700: '#155ddc',
          800: '#174cb2',
          900: '#19438c',
          950: '#142a55',
        },
        neutral: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
          950: '#020617',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        arabic: ['var(--font-noto-kufi)', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
