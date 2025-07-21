/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",   // обязательно сюда
    "./components/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",  // если есть
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};

export default config;