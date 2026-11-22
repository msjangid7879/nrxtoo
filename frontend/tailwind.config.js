/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          50: '#fbf8eb',
          100: '#f6efcc',
          200: '#eddca0',
          300: '#e3c46e',
          400: '#d9ac42',
          500: '#c59226',
          600: '#a8721c',
          700: '#865319',
          800: '#6f431b',
          900: '#5c371b',
        },
        gem: {
          emerald: '#059669',
          ruby: '#e11d48',
          sapphire: '#2563eb',
          amethyst: '#7c3aed',
        }
      }
    },
  },
  plugins: [],
}
