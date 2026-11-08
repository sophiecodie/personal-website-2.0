import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        cream: "#f3ece0",
        "cream-2": "#ebe2d2",
        paper: "#fffcf6",
        ink: "#2e2433",
        "ink-soft": "#6e6270",
        rule: "#d8ccb9",
        plum: "#5b3a52",
        rose: "#b0607a",
        gold: "#a8834a",
      },
      fontFamily: {
        display: ["var(--font-display)", "Didot", "Georgia", "serif"],
        body: ["var(--font-body)", "Futura", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
    },
  },
  plugins: [],
};
export default config;
