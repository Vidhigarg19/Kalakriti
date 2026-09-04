/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ivory: {
          DEFAULT: '#F0EAE0',
          50: '#FBF8F3',
          100: '#F0EAE0',
          200: '#E5DCCD',
          300: '#D9CCB8',
        },
        taupe: {
          DEFAULT: '#C4B7A6',
          light: '#D4C9B9',
          dark: '#A89B89',
        },
        terracotta: {
          DEFAULT: '#C1502E',
          light: '#D67050',
          dark: '#9E3F22',
          50: '#FBEEE8',
          100: '#F5D9CC',
          200: '#E8B099',
          300: '#D67050',
          400: '#C1502E',
          500: '#A8421F',
          600: '#8A3518',
        },
        olive: {
          DEFAULT: '#5C6E4A',
          light: '#7A8E66',
          dark: '#44512F',
          50: '#EEF1E8',
          100: '#DCE3D0',
          200: '#A8B894',
          300: '#7A8E66',
          400: '#5C6E4A',
          500: '#44512F',
        },
        walnut: {
          DEFAULT: '#3D2B1F',
          light: '#5A4332',
          dark: '#2A1D14',
          50: '#F2EBE5',
          100: '#E0D2C5',
          200: '#A88E7A',
          300: '#7A5E48',
          400: '#5A4332',
          500: '#3D2B1F',
          600: '#2A1D14',
        },
        hero: {
          DEFAULT: '#1F1712',
          light: '#2E2218',
        },
      },
      fontFamily: {
        sans: ['"Noto Sans"', 'system-ui', 'sans-serif'],
        serif: ['"Playfair Display"', '"Noto Serif"', 'Georgia', 'serif'],
        devanagari: ['"Noto Sans Devanagari"', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out',
        'slide-up': 'slideUp 0.6s ease-out',
        'float': 'float 6s ease-in-out infinite',
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'spin-slow': 'spin 3s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.6' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [],
};
