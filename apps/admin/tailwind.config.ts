import type { Config } from "tailwindcss";
import sharedPreset from "@lemonade/config/tailwind-preset";

export default {
  presets: [sharedPreset],
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/features/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/icons/**/*.{js,ts,jsx,tsx,mdx,svg}",
    "./src/modals/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/views/**/*.{js,ts,jsx,tsx,mdx}",
    // Without this, arbitrary-value classes unique to a shared component
    // (e.g. Dialog's top-[50%]/translate-x-[-50%]) never get JIT-generated
    // unless the exact same string happens to also appear in this app's own
    // scanned source — real bug found 2026-09-24: every Dialog in this app
    // rendered at its unstyled in-flow position (position:fixed with no
    // top/left/transform at all), not centered, invisible on short pages
    // and badly broken on long ones.
    "../../packages/ui/src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    screens: {
      phone: "640px", // Small phones and larger
      tablet: "768px", // Tablets and larger
      laptop: "1024px", // Laptops and larger
      desktop: "1280px", // Desktops and larger
      wide: "1536px", // Large desktops and ultra-wide screens
    },
    extend: {
      boxShadow: {
        // Pre-existing bug, not touched here: this should be a shadow VALUE
        // ("0px 0px 1px 1.5px #EDEDED4D"), not a full "box-shadow: ..."
        // declaration — Tailwind's boxShadow theme values are values, not
        // statements, so this utility silently never applies. Flagging it
        // rather than fixing it silently since it wasn't part of this pass's
        // scope and fixing it changes rendered output somewhere unverified.
        "card-shadow": "box-shadow: 0px 0px 1px 1.5px #EDEDED4D",
      },
      // Not shared with frontend's fontWeight scale — see
      // apps/frontend/tailwind.config.ts's comment on the same key.
      fontWeight: {
        thin: "100", // Extra Light or Thin
        extraLight: "200", // Ultra Light or Extra Light
        light: "300", // Light
        regular: "400", // Same weight as `normal`; `.font-label` applies it
        normal: "400", // Regular or Normal
        medium: "500", // Medium
        semiBold: "600", // Semi-Bold
        bold: "700", // Bold
        extraBold: "800", // Extra-Bold
        black: "900", // Black or Heavy
      },
      backgroundImage: {
        "gradient-green": "linear-gradient(12deg, #9BE303, #7FBB00)",
        "gradient-green-2": "linear-gradient(90deg, #FFFAAD, #E6FF7C)",
        "gradient-light-green": "linear-gradient(90deg, #FFFCCC, #EEFFA8)",
        "gradient-progress-green": "linear-gradient(90deg, #EBFFC0, #A2EC02)",
      },
      colors: {
        "light-grey": "#F9FAFA",
        "text-grey": "#757C91",
        "border-grey": "#E3E6ED",
        "grey-light": "#6F7C86",
        "black-light": "#121419",
        "light-green": "#405E00",
        "mid-green": "#5B8601",
        "step-color": "#80BC00",
        "link-color": "#E8FFB8",
        "light-yellow": "#F9FCED",
        "light-black": "#3C4253",
        "mid-grey": "#F6F7F8",
        "primary-black": "#1A2600",
        "grey-20": "#F4F4F6",
        "grey-40": "#AAAEBB",
        "grey-30": "#EBECEF",
        "light-grey-60": "#D8D9DC",
        "light-grey-50": "#C8CBD3",
        "light-grey-70": "#E9EAEC",
        "light-green-10": "#F5FAEB",
        "light-green-50": "#DEFF99",
        "light-green-90": "#BFDF37",
        "light-green-tint": "#BFDD80",
        "green-tint": "#F2FFD6",
        "light-white": "#FCFCFC",
        warning: "#FDF3E8",
        "warning-bold": "#EA840D",
        "light-tint": "#FEFEF0",
        "light-tint-2": "#6B9D00",
        "light-tint-3": "#FDFBD8",
        "light-tint-4": "#EBF4D7",
        "yellow-tint-1": "#f5fec6",
        "yellow-tint-2": "#FAF276",
        "purple-tint-1": "#F4EBFF",
        "grey-80": "#DEE0E5",
        "grey-90": "#3B4152",
        "red-1": "#DB0000",
        "red-2": "#BC0000",
        "red-3": "#FFEBEB",
        "light-green-60": "#EBF5EF",
        "light-green-70": "#009D44",
        "purple-1": "#F9F5FF",
        "blue-accent-1": "#5D00D4",
        "blue-accent-2": "#0075FF",
        "red-accent-1": "#FFEBEB",
        "yellow-accent-1": "#FDFAC4",
        "yellow-accent-2": "#FEFEF0",
        "yellow-accent-3": "#CEC529",
      },
    },
  },
} satisfies Config;
