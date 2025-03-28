/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      height: {
        '90/100': '90%',
        '100': '400px',
      },
      width: {
        '64/100': '64%',
        '66/100': '66%',
        '68/100': '68%',
        '70/100': '70%',
      },
      spacing: {
        '5.5': '1.375rem',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}