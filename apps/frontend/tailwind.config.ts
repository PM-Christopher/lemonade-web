import type { Config } from "tailwindcss";
import sharedPreset from "@lemonade/config/tailwind-preset";

const config: Config = {
  presets: [sharedPreset],
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/features/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/images/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    screens: {
      phone: "640px", // Small phones and larger
      tablet: "767px", // Tablets and larger
      laptop: "1024px", // Laptops and larger
      desktop: "1280px", // Desktops and larger
      wide: "1536px", // Large desktops and ultra-wide screens
    },
    extend: {
      letterSpacing: {
        custom: "-0.005em",
      },
      boxShadow: {
        "green-inset": "inset 0px 2px 0px 0px #C1FF3C, inset 0px -2px 2px 0px #658E0D",
        "green-inset-strong": "inset 0px 3px 0px 0px #C1FF3C, inset 0px -3px 3px 0px #658E0D",
      },
      // Not shared with admin's fontWeight scale — the same key name means a
      // different weight in each app today (e.g. "thin" is 300 here, 100 in
      // admin's), so merging them would silently change rendered weight on
      // one app's existing classes. See docs/ARCHITECTURE.md §7.
      fontWeight: {
        regular: "100",
        thin: "300",
        normal: "400",
        "semi-normal": "500",
        semiBold: "600",
        bold: "700",
      },
      backgroundImage: {
        "gradient-green": "linear-gradient(90deg, #9BE303, #7FBB00)",
        "gradient-green-2": "linear-gradient(90deg, #FFFAAD, #E6FF7C)",
        "gradient-light-green": "linear-gradient(90deg, #FFFCCC, #EEFFA8)",
        "gradient-progress-green": "linear-gradient(90deg, #EBFFC0, #A2EC02)",
      },
      colors: {
        light_grey: "#F9FAFA",
        "text-grey": "#757C91",
        "border-grey": "#E3E6ED",
        "grey-light": "#6F7C86",
        "black-light": "#121419",
        "light-green": "#405E00",
        "mid-green": "#5B8601",
        "step-color": "#80BC00",
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
        "red-accent-1": "#FFEBEB",
      },
    },
  },
};
export default config;
