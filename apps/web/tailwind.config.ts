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
      colors: {
        brand: {
          dark:    '#0C3528',
          DEFAULT: '#1A6B4A',
          medium:  '#1E7A56',
          light:   '#2D9E72',
          pale:    '#8FCBB5',
          mint:    '#EBF5EF',
          cream:   '#F5F0E8',
          red:     '#CC2828',
          'red-dark': '#9E1E1E',
          orange:  '#E05522',
          'orange-dark': '#B8441A',
        },
        text: {
          base:    '#0F1F1A',
          muted:   '#64746C',
          subtle:  '#8FA39A',
          inverse: '#FFFFFF',
        },
        border: {
          DEFAULT: '#D4E5DB',
          strong:  '#A8C9BB',
        },
        surface: {
          white:   '#FFFFFF',
          mint:    '#EBF5EF',
          cream:   '#F5F0E8',
          light:   '#F8FAF9',
        },
      },
      fontFamily: {
        sans:    ['var(--font-inter)', 'system-ui', 'sans-serif'],
        serif:   ['var(--font-playfair)', 'Georgia', 'serif'],
        arabic:  ['var(--font-noto-kufi)', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'display-2xl': ['4.5rem',  { lineHeight: '1.08', letterSpacing: '-0.025em' }],
        'display-xl':  ['3.75rem', { lineHeight: '1.1',  letterSpacing: '-0.02em'  }],
        'display-lg':  ['3rem',    { lineHeight: '1.15', letterSpacing: '-0.015em' }],
        'display-md':  ['2.25rem', { lineHeight: '1.2',  letterSpacing: '-0.01em'  }],
        'display-sm':  ['1.875rem',{ lineHeight: '1.25', letterSpacing: '-0.005em' }],
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      boxShadow: {
        'card':    '0 1px 3px 0 rgba(15,31,26,0.06), 0 1px 2px -1px rgba(15,31,26,0.06)',
        'card-md': '0 4px 6px -1px rgba(15,31,26,0.08), 0 2px 4px -2px rgba(15,31,26,0.06)',
        'card-lg': '0 10px 15px -3px rgba(15,31,26,0.08), 0 4px 6px -4px rgba(15,31,26,0.05)',
      },
      animation: {
        'fade-in':    'fadeIn 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
      },
      keyframes: {
        fadeIn:    { from: { opacity: '0' },                      to: { opacity: '1' } },
        slideDown: { from: { transform: 'translateY(-8px)', opacity: '0' }, to: { transform: 'translateY(0)', opacity: '1' } },
      },
    },
  },
  plugins: [],
};

export default config;
