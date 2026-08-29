import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#f0fdf6",
          100: "#dcfce9",
          200: "#bbf7d4",
          300: "#86efb3",
          400: "#4ade8c",
          500: "#22c56e",
          600: "#16a35a",
          700: "#15803f",
          800: "#166535",
          900: "#14532d",
        },
      },
    },
  },
  plugins: [],
};
export default config;
