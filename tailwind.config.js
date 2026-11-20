/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#fff1ee',
          100: '#ffe4de',
          200: '#ffdad3',
          300: '#ffb4a6',
          400: '#f87258',
          500: '#e04225',
          600: '#b22204',
          700: '#941901',
          800: '#7a1502',
          900: '#641505',
          dark: '#111c2d',
          card: '#ffffff',
          bg: '#f9f9ff',
          muted: '#5b403b',
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', '-apple-system', 'sans-serif'],
      }
    },
  },
  plugins: [],
};
