/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ethio: {
          green: '#009639',
          yellow: '#FFDE00',
          red: '#E01923',
          blue: '#0F47AF',
          gold: '#D97706',
          dark: '#0F172A',
          card: '#1E293B',
        },
      },
    },
  },
  plugins: [],
}
