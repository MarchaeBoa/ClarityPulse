import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        jade: {
          DEFAULT: "#1AE5A0",
          hover: "#0FBF82",
          dark: "#0A9465",
          tint: "#E6FDF5",
        },
        sapphire: {
          DEFAULT: "#3B7BF8",
          tint: "#E8EFFF",
        },
        ember: {
          DEFAULT: "#F5653A",
          tint: "#FEF0EC",
        },
        gold: {
          DEFAULT: "#F0A500",
          tint: "#FEF6E4",
        },
        ink: {
          DEFAULT: "#0A0B0D",
          2: "#1C1E23",
          3: "#2E3038",
        },
        mist: {
          DEFAULT: "#F7F8FA",
          2: "#EDEEF2",
          3: "#E2E4EA",
        },
        ghost: {
          DEFAULT: "#9BA0AE",
          2: "#C4C7D0",
        },
        surface: {
          DEFAULT: "#111214",
          2: "#131416",
          3: "#1C1E23",
        },
      },
      fontFamily: {
        display: ["'Syne'", "system-ui", "sans-serif"],
        body: ["'DM Sans'", "system-ui", "sans-serif"],
        mono: ["'DM Mono'", "'Fira Code'", "monospace"],
      },
      borderRadius: {
        micro: "4px",
        sm: "6px",
        base: "8px",
        card: "12px",
        panel: "16px",
        modal: "20px",
        pill: "999px",
      },
      spacing: {
        "18": "4.5rem",
        "22": "5.5rem",
        "26": "6.5rem",
        "30": "7.5rem",
      },
      letterSpacing: {
        display: "-0.03em",
        tight: "-0.025em",
      },
      animation: {
        "fade-in": "fadeIn 0.6s ease-out forwards",
        "slide-up": "slideUp 0.6s ease-out forwards",
        "float": "float 6s ease-in-out infinite",
        "pulse-slow": "pulse 4s ease-in-out infinite",
        shimmer: "shimmer 1.4s ease infinite",
      },
      keyframes: {
        fadeIn: {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        slideUp: {
          from: { opacity: "0", transform: "translateY(24px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-12px)" },
        },
        shimmer: {
          "0%, 100%": { opacity: "0.5" },
          "50%": { opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
