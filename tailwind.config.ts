import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // The Knodle palette — three tokens, used deliberately.
        white: "#ffffff",
        black: "#000000",
        lime: {
          DEFAULT: "#c1ff72",
          400: "#c1ff72",
          500: "#aef04f",
          600: "#93d637",
        },
      },
      fontFamily: {
        sans: ["var(--font-space-grotesk)", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      borderRadius: {
        xl: "0.9rem",
        "2xl": "1.25rem",
      },
      boxShadow: {
        soft: "0 1px 2px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.06)",
        node: "0 2px 6px rgba(0,0,0,0.06), 0 12px 30px rgba(0,0,0,0.08)",
      },
      keyframes: {
        buzz: {
          "0%, 100%": { transform: "translateX(0) rotate(0deg)" },
          "20%": { transform: "translateX(-2px) rotate(-1.5deg)" },
          "40%": { transform: "translateX(2px) rotate(1.5deg)" },
          "60%": { transform: "translateX(-2px) rotate(-1deg)" },
          "80%": { transform: "translateX(2px) rotate(1deg)" },
        },
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "pulse-ring": {
          "0%": { boxShadow: "0 0 0 0 rgba(193,255,114,0.7)" },
          "100%": { boxShadow: "0 0 0 14px rgba(193,255,114,0)" },
        },
      },
      animation: {
        buzz: "buzz 0.6s ease-in-out",
        "fade-up": "fade-up 0.35s ease-out both",
        "pulse-ring": "pulse-ring 1.4s ease-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
