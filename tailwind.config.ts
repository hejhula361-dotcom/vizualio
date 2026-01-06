import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        carbon: "#0C0C0C",
        charcoal: "#1A1A1A",
        obsidian: "#2B2B2B",
        offwhite: "#F8F8F5",
        stone: "#9F9F9F",
        silver: "#C9C9C9",
        champagne: "#C6A67C",
        copper: "#B88A55",
        amber: "#DDB980",
        fog: "#D9D9D6",
        blueshadow: "#2F3A4A",
        graphite: "#3E4A5B"
      },
      boxShadow: {
        glow: "0 0 30px rgba(198, 166, 124, 0.25)"
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.5rem"
      },
      backdropBlur: {
        lg: "16px"
      }
    }
  },
  plugins: []
};

export default config;




