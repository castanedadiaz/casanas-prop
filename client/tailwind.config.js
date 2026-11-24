import defaultTheme from 'tailwindcss/defaultTheme'

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1A3C2A',
          light: '#2D5A3F',
          dark: '#0F2318',
        },
        secondary: {
          DEFAULT: '#C6A96C',
          light: '#D4BC8B',
          dark: '#A88B4A',
        },
        cream: '#FAF8F2',
        surface: '#FFFFFF',
      },
      fontFamily: {
        sans: ['Inter', ...defaultTheme.fontFamily.sans],
        display: ['Playfair Display', 'serif'],
      },
    },
  },
  plugins: [],
}
