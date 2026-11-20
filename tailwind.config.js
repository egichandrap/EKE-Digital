/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        peach: {
          50: '#fff7f5',
          100: '#ffefe9',
          200: '#ffdcd2',
          300: '#ffbfaa',
          400: '#ff9374',
          500: '#ff6b4a', // Primary Vibrant Warm Peach
          600: '#f04c24',
          700: '#c93612',
          800: '#9f2d12',
          900: '#7e2611',
        },
        sage: {
          50: '#f2fbf6',
          100: '#e1f7ec',
          200: '#c5eed9',
          300: '#98dfbd',
          400: '#64c89b',
          500: '#38af7d',
          600: '#278f64', // Soft Green / Sage Trust Accent
          700: '#217252',
          800: '#1e5b43',
          900: '#1b4b38',
        },
        brand: {
          50: '#fff7f5',
          100: '#ffefe9',
          200: '#ffdcd2',
          300: '#ffbfaa',
          400: '#ff9374',
          500: '#ff6b4a',
          600: '#f04c24',
          700: '#c93612',
          dark: '#0f172a',
          card: '#ffffff',
          bg: '#faf9f6',
          muted: '#64748b',
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', '-apple-system', 'sans-serif'],
      }
    },
  },
  plugins: [],
};
