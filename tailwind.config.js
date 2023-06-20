/** @type {import('tailwindcss').Config} */
const defaultTheme = require("tailwindcss/defaultTheme");
const colors = require("tailwindcss/colors");

module.exports = {
  darkMode: "className",
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./index.js",
    "./public/index.html",
    "./node_modules/react-tailwindcss-datepicker/dist/index.esm.js",
  ],
  theme: {
    extend: {
      colors: {
        orange: colors.orange,
        customOrange: "#fb923c", // Add the custom color definition here
      },
      fontFamily: {
        sans: ["Inter var", ...defaultTheme.fontFamily.sans],
      },
      keyframes: {
        limitedtime: {
          '0%': { backgroundPosition: '44% 0%' },
          '50%': { backgroundPosition: '57% 100%' },
          '100%': { backgroundPosition: '44% 0%' },
        },
      },
      animation: {
        limitedtime: 'limitedtime 38s ease infinite',
      },
    },
  },
  plugins: [
    require("@tailwindcss/forms"),
    function ({ addVariant }) {
      addVariant("child", "& > *");
      addVariant("child-hover", "& > *:hover");
    },
  ],
};
