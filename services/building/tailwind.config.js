/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./presets/**/*.{js,vue,ts}",
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'green': '#5D694E',
        'light-green': '#E4E9E3',
        'middle-green': '#B8C9B9',
        'text-primary': '#333A2A',
        'text-secondary': '#898989',
        'text-link': '#5D694E',
        'text-green': '#B8C9B9',
        'text-gray': '#F5F5F5',
        'grey-border': '#CBCBCB',
        'grey-background': "#F2F2F2",
        'green-background': '#BBC7B9',
        'border': '#E5E7EB'
      },
      container: {
        center: true,
        screens: {
          'sm': '640px',
          'md': '768px',
          'lg': '1024px',
          'xl': '1280px'
        },
        padding: {
          DEFAULT: '1rem',
          sm: '2rem',
          lg: '4rem',
          xl: '5rem'
        }
      }
    },
  },
  plugins: [require('tailwindcss-primeui')],
}

