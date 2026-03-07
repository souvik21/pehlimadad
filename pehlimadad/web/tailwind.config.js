/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx}', './components/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['Bebas Neue', 'sans-serif'],
        sans: ['DM Sans', 'sans-serif'],
      },
      colors: {
        green: { DEFAULT: '#25D366', dark: '#128C7E' },
        red: { DEFAULT: '#dc2626', light: '#ef4444' },
        amber: { DEFAULT: '#f59e0b' },
        bg: { DEFAULT: '#0d0a07', 2: '#120e0a', 3: '#1a1410' },
      },
      fontSize: {
        '10xl': ['10rem', { lineHeight: '0.9' }],
        '11xl': ['12rem', { lineHeight: '0.9' }],
      },
    },
  },
  plugins: [],
};
