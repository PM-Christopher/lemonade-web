// Shared ESLint 9 flat config. Each app extends this and layers on
// `eslint-config-next` (via FlatCompat) plus its own `boundaries` element
// paths, since those are relative to the app's own `src/` layout.
//
// See docs/ARCHITECTURE.md §9 (import rules) and §18 (lint rules that
// encode measured problems) for the rationale behind each rule below.

import tseslint from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import boundaries from "eslint-plugin-boundaries";
import reactHooks from "eslint-plugin-react-hooks";
import local from "./eslint-rules/no-hardcoded-pixel-class.js";

/** @type {import("eslint").Linter.Config[]} */
export default [
  {
    ignores: [
      "**/.next/**",
      "**/dist/**",
      "**/build/**",
      "**/coverage/**",
      "**/.turbo/**",
      "**/node_modules/**",
    ],
  },
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    plugins: {
      "@typescript-eslint": tseslint,
      "react-hooks": reactHooks,
      boundaries,
      local,
    },
    rules: {
      // Prevents the 574 `any` annotations measured in the pre-migration apps.
      "@typescript-eslint/no-explicit-any": "error",

      // Prevents the 7,041 hardcoded `[Npx]` classes measured pre-Phase-7 —
      // see packages/config/eslint-rules/no-hardcoded-pixel-class.js and
      // docs/ARCHITECTURE.md §7/§18.
      "local/no-hardcoded-pixel-class": "error",

      // Prevents the 32 stale-closure effects found in admin's app/ tree.
      "react-hooks/exhaustive-deps": "error",
      "react-hooks/rules-of-hooks": "error",

      // A third HTTP client must never appear outside the transport package.
      "no-restricted-imports": [
        "error",
        {
          paths: [
            {
              name: "axios",
              message:
                "Import the shared transport from @lemonade/api-client instead of calling axios directly.",
            },
          ],
          patterns: [
            {
              group: ["@mui/*", "antd", "evergreen-ui"],
              message:
                "MUI, antd and Evergreen are retired in favour of @lemonade/ui. See docs/ARCHITECTURE.md §7.",
            },
          ],
        },
      ],

      // Prevents the 62 stray console.log calls left in shipped code.
      "no-console": ["error", { allow: ["warn", "error"] }],

      // Tokens must never return to JS-readable storage once the BFF auth
      // flow (httpOnly cookies) lands. See docs/ARCHITECTURE.md §13.
      "no-restricted-syntax": [
        "error",
        {
          selector:
            "CallExpression[callee.object.name='localStorage'][callee.property.name='setItem'] Literal[value=/token/i]",
          message:
            "Tokens must live in httpOnly cookies, never localStorage. See docs/ARCHITECTURE.md §13.",
        },
      ],
    },
  },
];
