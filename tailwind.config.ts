import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        navy: "#152A42",
        gold: "#A1805E",
        surface: "#F5F4F2",
        ink: "#0B1220",
        muted: "#667085",
        border: "rgba(21, 42, 66, 0.12)",
      },
      fontFamily: {
        sans: ["var(--font-montserrat)", "Montserrat", "sans-serif"],
        display: ["var(--font-montserrat)", "Montserrat", "sans-serif"],
      },
      boxShadow: {
        menu:
          "0px 30px 60px rgba(11, 18, 32, 0.18), 0px 10px 20px rgba(11, 18, 32, 0.08)",
      },
    },
  },
  plugins: [],
};

export default config;
