import colors from "tailwindcss/colors";

/** @type {import('tailwindcss').Config} */
export const content = ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"];
export const theme = {
  extend: {
    colors: {
      primary: colors.pink[500],
      secondary: colors.indigo[500],
    },
  },
};
export const plugins = [];
