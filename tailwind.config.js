/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        base: "#0F0F12",
        surface: "#1A1A20",
        neon: {
          purple: "#B026FF",
          pink: "#FF2E9F",
          red: "#FF2E4D",
        },
      },
      boxShadow: {
        neon: "0 0 20px rgba(176, 38, 255, 0.45)",
        neonPink: "0 0 20px rgba(255, 46, 159, 0.45)",
      },
      keyframes: {
        popIn: {
          "0%": { transform: "scale(0.85)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
      },
      animation: {
        popIn: "popIn 0.35s ease-out",
      },
    },
  },
  plugins: [],
};
