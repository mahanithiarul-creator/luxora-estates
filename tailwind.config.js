/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        luxury: {
          900: '#06060a',
          800: '#0b0b10',
          700: '#0f1724',
          gold: '#d4af37',
          silver: '#c7c7c7',
          neon: '#00e6ff'
        }
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui']
      }
    }
  },
  plugins: []
};
