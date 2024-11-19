/** @type {import('tailwindcss').Config} */

const plugin = require("tailwindcss/plugin");
const backfaceVisibility = plugin(function ({ addUtilities }) {
  addUtilities({
    ".backface-visible": {
      "backface-visibility": "visible",
    },
    ".backface-hidden": {
      "backface-visibility": "hidden",
    },
    ".rotate-y-180": {
      "transform": "rotateY(180deg)",
    },
    ".perspective": {
      "perspective": "1000px",
    },
    ".transform-style-3d": {
      "transform-style": "preserve-3d",
    },
  });
});

module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Include all React components
  ],
  theme: {
    extend: {
      fontFamily: {
        nunito: ["Nunito", "sans-serif"],
      },
    },
  },
  plugins: [backfaceVisibility],
};
