import daisyui from "daisyui";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', "system-ui", "sans-serif"],
        display: ['"Space Grotesk"', '"Plus Jakarta Sans"', "sans-serif"],
      },
      backgroundImage: {
        brand: "linear-gradient(135deg, #a855f7 0%, #ec4899 100%)",
      },
      boxShadow: {
        glow: "0 0 28px -6px rgba(168, 85, 247, 0.6)",
        "glow-lg": "0 0 40px -4px rgba(168, 85, 247, 0.75)",
        "glow-pink": "0 0 16px 0 rgba(236, 72, 153, 0.8)",
      },
    },
  },
  plugins: [daisyui],
  daisyui: {
    themes: [
      {
        hifiguyz: {
          primary: "#a855f7",
          "primary-content": "#ffffff",
          secondary: "#ec4899",
          "secondary-content": "#ffffff",
          accent: "#22d3ee",
          "accent-content": "#04141a",
          neutral: "#1c1930",
          "neutral-content": "#e7e5f4",
          "base-100": "#0b0a14",
          "base-200": "#12101d",
          "base-300": "#1c1930",
          "base-content": "#e7e5f4",
          info: "#38bdf8",
          success: "#34d399",
          warning: "#fbbf24",
          error: "#f87171",
          "--rounded-btn": "0.75rem",
          "--rounded-box": "1.25rem",
          "--rounded-badge": "9999px",
        },
      },
    ],
    darkTheme: "hifiguyz",
  },
};
