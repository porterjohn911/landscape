/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        moss: { 500: '#5a8a4a', 600: '#467036', 700: '#365a28' },
        bark: { 500: '#6b5642', 700: '#3e3024' },
      },
    },
  },
  plugins: [],
}
