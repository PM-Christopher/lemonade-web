// Shared Tailwind preset. Design tokens live here so apps stop inventing
// pixel values ad hoc — see docs/ARCHITECTURE.md §18 (7,041 hardcoded
// pixel classes). Admin and the user app differ in density, not tokens:
// express that with variants, not forks of this file.
//
// This is a starting point — fill in the real scale when @lemonade/ui's
// primitives are built.

/** @type {import("tailwindcss").Config} */
module.exports = {
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Placeholder — replace with the real brand palette.
        brand: {
          DEFAULT: "#f5c518",
          foreground: "#1a1a1a",
        },
      },
      borderRadius: {
        sm: "4px",
        md: "8px",
        lg: "12px",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
