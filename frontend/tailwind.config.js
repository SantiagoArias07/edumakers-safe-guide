/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: '#07070F',
          soft: '#0E0E1C',
          card: '#13131F',
        },
        bg: {
          dark: '#0A0A14',
          navy: '#070B14',
          card: '#111118',
        },
        cream: '#F5F0EB',
        purple: {
          soft: '#7C5CBF',
          light: '#9B7FD4',
          dark: '#5A3F9B',
          glow: 'rgba(124,92,191,0.15)',
        },
        coral: {
          DEFAULT: '#E8705A',
          light: '#F08B78',
          dark: '#C4503A',
        },
        surface: '#FAFAFA',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['"Plus Jakarta Sans"', 'Inter', 'sans-serif'],
      },
      fontSize: {
        '2xs': ['0.65rem', { lineHeight: '1rem', letterSpacing: '0.02em' }],
      },
      letterSpacing: {
        tighter: '-0.04em',
        tight: '-0.02em',
      },
      animation: {
        'fade-up': 'fadeUp 0.6s cubic-bezier(0.16,1,0.3,1) forwards',
        'fade-in': 'fadeIn 0.4s ease-out forwards',
        'slide-in-right': 'slideInRight 0.4s cubic-bezier(0.16,1,0.3,1) forwards',
        'slide-in-bottom': 'slideInBottom 0.45s cubic-bezier(0.16,1,0.3,1) forwards',
        'bounce-dot': 'bounceDot 1.4s ease-in-out infinite',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'appear': 'appear 0.5s cubic-bezier(0.16,1,0.3,1) forwards',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(32px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        slideInBottom: {
          '0%': { opacity: '0', transform: 'translateY(100%)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        bounceDot: {
          '0%, 60%, 100%': { transform: 'translateY(0)', opacity: '0.6' },
          '30%': { transform: 'translateY(-6px)', opacity: '1' },
        },
        appear: {
          '0%': { opacity: '0', transform: 'translateY(8px) scale(0.98)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
      },
    },
  },
  plugins: [],
}
