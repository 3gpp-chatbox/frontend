/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
      },
      fontSize: {
        'xs': '0.725rem',
        'sm': '0.875rem',
        'base': '1rem',
        'lg': '1.125rem',
        'xl': '1.5rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
        '4xl': '2.5rem',
        '5xl': '3rem',
        '6xl': '3.5rem',
      },
      borderWidth:{
        '1': '1.5px',
        '2': '2px',
        '3': '3px',
        '6': '6px',
        '10': '10px',
      }
    },
  },
  plugins: [],
}

