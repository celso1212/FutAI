/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Default theme
        primary: { DEFAULT: '#16a34a', hover: '#15803d', light: '#dcfce7' },
        surface: { DEFAULT: '#0f172a', card: '#1e293b', border: '#334155' },
        // World Cup theme (injected via CSS vars)
        wc: {
          bg: 'var(--wc-bg)',
          card: 'var(--wc-card)',
          accent: 'var(--wc-accent)',
          text: 'var(--wc-text)',
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        shimmer: 'shimmer 2s linear infinite',
      },
      keyframes: {
        fadeIn: { from: { opacity: '0' }, to: { opacity: '1' } },
        slideUp: { from: { opacity: '0', transform: 'translateY(20px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        shimmer: { from: { backgroundPosition: '-200% 0' }, to: { backgroundPosition: '200% 0' } },
      },
    },
  },
  plugins: [],
};
