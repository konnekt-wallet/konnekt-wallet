/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        accent: '#15803d',
        'accent-soft': 'rgba(21, 128, 61, 0.12)',
        surface: '#1A1A1A',
        border: '#222222',
        'border-light': '#2A2A2A',
        'text-primary': '#F5F0EB',
        'text-secondary': '#8A8680',
        'text-muted': '#555555',
      },
      fontFamily: {
        sans: ['Noto Sans Mono', 'monospace'],
        mono: ['JetBrains Mono', 'SF Mono', 'monospace'],
        brand: ['Barrio', 'cursive'],
      },
      animation: {
        'spin-slow': 'spin 0.8s linear infinite',
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'scale-in': 'scaleIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
      },
      keyframes: {
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          from: { opacity: '0', transform: 'scale(0.95)' },
          to: { opacity: '1', transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [],
};
