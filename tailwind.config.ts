import type { Config } from "tailwindcss";

export default {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "ui-monospace", "monospace"],
      },
      boxShadow: {
        glow: "0 0 40px -8px rgba(34, 211, 238, 0.35), 0 0 80px -24px rgba(6, 182, 212, 0.2)",
        "glow-sm": "0 0 24px -6px rgba(34, 211, 238, 0.3)",
        "inner-soft": "inset 0 1px 0 0 rgba(255, 255, 255, 0.06)",
        card: "0 0 0 1px rgba(255,255,255,0.06), 0 24px 48px -20px rgba(0,0,0,0.65), inset 0 1px 0 0 rgba(255,255,255,0.05)",
      },
      keyframes: {
        pulseGlow: {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(34, 211, 238, 0.35)" },
          "50%": { boxShadow: "0 0 40px 0 rgba(34, 211, 238, 0.2)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "200% 0" },
          "100%": { backgroundPosition: "-200% 0" },
        },
        floatY: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-6px)" },
        },
      },
      animation: {
        pulseGlow: "pulseGlow 2.4s ease-in-out infinite",
        shimmer: "shimmer 2.5s ease-in-out infinite",
        floatY: "floatY 6s ease-in-out infinite",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
} satisfies Config;
