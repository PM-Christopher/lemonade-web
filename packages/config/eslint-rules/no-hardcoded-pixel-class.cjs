// Custom rule, not eslint-plugin-tailwindcss's `no-arbitrary-value` — that
// rule flags every arbitrary value (colors, percentages, calc()), which is
// broader than what docs/ARCHITECTURE.md Phase 7 tracks: specifically
// `[Npx]` classes like `w-[285px]`, `text-[12px]`, `rounded-[12px]` — no
// scale, no tokens. It also needs a resolved Tailwind config at lint time;
// this needs nothing but the source text, so it can't drift from the repo's
// actual tailwind.config.ts.
//
// An error in both apps: every `[Npx]` class was mapped to a token on
// 2026-10-14, so a new one fails lint.

const PIXEL_CLASS = /-\[\d+(?:\.\d+)?px\]/;

function reportIfPixelClass(context, node, text) {
  const match = PIXEL_CLASS.exec(text);
  if (match) {
    context.report({
      node,
      messageId: "hardcodedPixelClass",
      data: { match: match[0] },
    });
  }
}

module.exports = {
  rules: {
    "no-hardcoded-pixel-class": {
      meta: {
        type: "suggestion",
        docs: {
          description:
            "Disallow arbitrary `[Npx]` Tailwind classes in favor of the shared token scale.",
        },
        schema: [],
        messages: {
          hardcodedPixelClass:
            "'{{match}}' hardcodes a pixel value — use a token from the shared Tailwind preset instead. See docs/ARCHITECTURE.md §7.",
        },
      },
      create(context) {
        return {
          Literal(node) {
            if (typeof node.value === "string") {
              reportIfPixelClass(context, node, node.value);
            }
          },
          TemplateElement(node) {
            reportIfPixelClass(context, node, node.value.raw);
          },
        };
      },
    },
  },
};
