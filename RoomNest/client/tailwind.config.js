/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f2f7ff',
          100: '#e0ecff',
          200: '#c2d9ff',
          300: '#94bcff',
          400: '#5f95ff',
          500: '#356cff',
          600: '#1e4bf0',
          700: '#1638c4',
          800: '#16309b',
          900: '#182e79',
        },
        sand: {
          50: '#fbf9f6',
          100: '#f4efe8',
          200: '#e8ddce',
        },
      },
      fontFamily: {
        display: ['"Poppins"', 'sans-serif'],
        body: ['"Inter"', 'sans-serif'],
      },
      boxShadow: {
        card: '0 10px 30px -12px rgba(22, 48, 121, 0.18)',
      },
    },
  },
  plugins: [],
};
