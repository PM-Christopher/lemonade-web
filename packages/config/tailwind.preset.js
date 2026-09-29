// Shared Tailwind preset. Only tokens that are genuinely identical, today,
// between apps/frontend and apps/admin live here — see
// docs/ARCHITECTURE.md §7 for what was deliberately left out (each app's own
// brand palette, admin and frontend disagree on the `fontWeight` scale
// itself — not just values, the same key means a different weight in each —
// and on the `tablet` breakpoint by 1px) and why: merging those would rename
// or reinterpret classes already in use across hundreds of call sites with
// no way to visually verify the result in this environment. Extending this
// preset never changes what an app already renders; each app's own
// tailwind.config.ts still wins on any key it also defines.
//
// shadcn's own token set (background/foreground/card/popover/primary/
// secondary/muted/accent/destructive/border/input/ring/chart, all CSS
// variables so the actual palette stays in each app's globals.css) plus
// borderRadius, fontFamily, the five boxShadow utilities both apps already
// had byte-identical, and the two generic gradient backgroundImages.

/** @type {import("tailwindcss").Config} */
module.exports = {
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        sans: ["Work Sans", "sans-serif"],
        ruso: ["Russo One", "sans-serif"],
      },
      boxShadow: {
        "custom-top": "0px 2px 0px 0px #C1FF3C inset",
        "custom-bottom": "0px -2px 2px 0px #658E0D inset",
        "div-shadow-1": "-8px 8px 12px 0px rgba(187, 187, 187, 0.15)",
        "div-shadow-2": "2px 0px 8px 0px rgba(230, 230, 230, 0.25)",
        "event-custom": "0px -1px 2px 0px #9FC207 inset",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
      },
      height: {
        "desk-content": "calc(100vh-100px)",
        "mobile-content": "calc(100vh-50px)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
