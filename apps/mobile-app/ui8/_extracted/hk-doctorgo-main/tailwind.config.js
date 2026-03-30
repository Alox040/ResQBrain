/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./app/**/*.{js,jsx,ts,tsx}', './components/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      fontFamily: {
        sans: ['rubik-regular', 'sans-serif'],
        light: ['rubik-light', 'sans-serif'],
        medium: ['rubik-medium', 'sans-serif'],
        bold: ['rubik-bold', 'sans-serif'],
        extrabold: ['rubik-extrabold', 'sans-serif'],
        semibold: ['rubik-semibold', 'sans-serif'],
        // sans: ['roboto-regular', 'sans-serif'],
        // light: ['roboto-light', 'sans-serif'],
        // medium: ['roboto-medium', 'sans-serif'],
        // bold: ['roboto-bold', 'sans-serif'],
        // extrabold: ['roboto-extrabold', 'sans-serif'],
        // semibold: ['roboto-semibold', 'sans-serif'],
        // sans: ['poppins-regular', 'sans-serif'],
        // light: ['poppins-light', 'sans-serif'],
        // medium: ['poppins-medium', 'sans-serif'],
        // bold: ['poppins-bold', 'sans-serif'],
        // extrabold: ['poppins-extrabold', 'sans-serif'],
        // semibold: ['poppins-semibold', 'sans-serif'],
      },
      colors: {
        primary: '#514DDF',
        secondary: '#2AEEC8',
      },
    },
  },
  plugins: [],
};
