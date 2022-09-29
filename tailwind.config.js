/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'yankees-blue': '#14174A',
        'cetacean-blue': '#0F1132',
        'space-cadet': '#1C1E4E',
      },
      fontFamily: {
        mitr: ['Mitr', 'Cantarell', 'Roboto', 'Ubuntu', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
