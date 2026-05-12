/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        'red-accent': '#e51111',
        'red-dim': '#7f0000',
        'red-glow': 'rgba(229,17,17,0.15)',
        'indigo-accent': '#6366f1',
        'indigo-dim': '#3730a3',
        'indigo-glow': 'rgba(99,102,241,0.15)',
        surface: '#111111',
        'surface-2': '#181818',
        'surface-3': '#1e1e1e',
        border: '#242424',
        'border-bright': '#333333',
      },
      fontFamily: {
        display: ['"Bebas Neue"', 'sans-serif'],
        body: ['"Syne"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      animation: {
        'fade-up': 'fadeUp 0.6s ease forwards',
        'fade-in': 'fadeIn 0.5s ease forwards',
        'flicker': 'flicker 5s infinite',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        flicker: {
          '0%, 94%, 100%': { opacity: '1' },
          '95%': { opacity: '0.3' },
          '96%': { opacity: '1' },
          '97%': { opacity: '0.5' },
          '98%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}