/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.js",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./screens/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      fontSize: {
        xs: ["11px", "16px"],
        sm: ["13px", "18px"],
        md: ["15px", "20px"],
        lg: ["17px", "22px"],
        xl: ["22px", "28px"],
        '2xl': ["28px", "34px"],
        '3xl': ["36px", "40px"],
      },
    },
  },
  plugins: [],
};