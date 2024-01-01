/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'lexend-deca': ['LexendDeca', 'ui-sans-serif', 'system-ui']
      },
    },
  },
  plugins: [],
}

