import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        moss: { 500: '#5a8a4a', 600: '#467036', 700: '#365a28' },
      },
    },
  },
  plugins: [],
}
export default config
