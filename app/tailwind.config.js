/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          500: '#14b8a6',
          700: '#0f766e',
          800: '#0a4d4c',
          900: '#042f2e'
        }
      }
    },
  },
  plugins: [],
}
