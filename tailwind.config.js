/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
     "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage:{
        'crousz': "url('/comp.jpg')",
      }
    },
  },
  plugins: [],
}

