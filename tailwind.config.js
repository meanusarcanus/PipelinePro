/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        monday: {
          green: '#00c875',
          greenHover: '#00b368',
          amber: '#fdab3d',
          amberHover: '#e59b37',
          red: '#e2445c',
          redHover: '#cc3d52',
          blue: '#579bfc',
          blueHover: '#4e8ce3',
          purple: '#a25ddc',
          purpleHover: '#9253c6',
          slate: '#333333',
          grayBg: '#f6f7fb',
          darkBg: '#181b34',
          darkCard: '#202444',
          darkBorder: '#2d325a'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
