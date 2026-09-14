// Extends the shared @lemonade/config flat config — see
// apps/frontend/eslint.config.mjs for the full rationale, identical here
// except this app's eslint-config-next is pinned to Next 15 (this app's own
// major) instead of frontend's 14.
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { FlatCompat } from "@eslint/eslintrc";
import tseslint from "@typescript-eslint/eslint-plugin";
import boundaries from "eslint-plugin-boundaries";
import baseConfig from "@lemonade/config/eslint";

const compat = new FlatCompat({ baseDirectory: dirname(fileURLToPath(import.meta.url)) });

// Scoped to src/** — root-level config files (next.config.mjs,
// eslint.config.mjs itself, tailwind/postcss config) were never meant to be
// subject to Next's page/document rules, and some of those rules crash on
// ESLint 9's flat-config runtime when they fire outside app source
// (context.getAncestors() is legacy-eslintrc-only).
const nextConfigs = compat.extends("next/core-web-vitals", "next/typescript").map((config) => ({
    ...config,
    files: ["src/**/*.{js,jsx,ts,tsx}"],
}));

/** @type {import("eslint").Linter.Config[]} */
export default [
    ...baseConfig,
    ...nextConfigs,
    {
        // eslint-config-next's `extends` chain resolves @next/eslint-plugin-next
        // via FlatCompat's single baseDirectory rather than per-package
        // relative resolution, and in this workspace that lands on whichever
        // copy of the plugin the pnpm virtual store happens to expose first —
        // not reliably this app's own pinned Next major. no-duplicate-head is
        // a Pages-Router-only rule (checks for a custom _document's <Head>)
        // that crashes under ESLint 9's flat-config rule runtime
        // (context.getAncestors() removed) on whichever plugin build gets
        // loaded; both apps are App Router only, so it has nothing to check
        // anyway. Off, not "error we can't reach" — see docs/ARCHITECTURE.md
        // Phase 3 for the actual Next-version-unification work.
        files: ["src/**/*.{js,jsx,ts,tsx}"],
        rules: { "@next/next/no-duplicate-head": "off" },
    },
    {
        // Only the cross-feature-family check is enabled — see
        // apps/frontend/eslint.config.mjs's file header for why the
        // app-must-not-import-api-client and entry-point rules were tried
        // and dropped (both were silently inert against known real
        // violations, which is worse than not having them).
        // If a features/shared (or similarly cross-cutting) feature shows
        // up later, give it its own element type matched before "feature"
        // — see apps/frontend/eslint.config.mjs for why (it's meant to be
        // consumed by other domain features and shouldn't trip the
        // family-isolation check below).
        files: ["**/*.{ts,tsx}"],
        plugins: { boundaries },
        settings: {
            "boundaries/elements": [{ type: "feature", pattern: "src/features/*/**", capture: ["family"] }],
        },
        rules: {
            "boundaries/element-types": [
                "error",
                {
                    default: "allow",
                    rules: [
                        {
                            from: "feature",
                            disallow: [["feature", { family: "!${from.family}" }]],
                            message: "features/x/** may not import features/y/** internals — go through y's index.",
                        },
                    ],
                },
            ],
        },
    },
    {
        // Pre-existing debt, not new-code license — see
        // apps/frontend/eslint.config.mjs's file header for the rationale
        // and the measured violation counts.
        files: ["**/*.{ts,tsx}"],
        plugins: { "@typescript-eslint": tseslint },
        rules: {
            "@typescript-eslint/no-explicit-any": "warn",
            // 158 pre-existing unused-import/-variable violations, measured
            // when this app's eslint.config.mjs was first wired up — real
            // dead code, worth burning down, but not this PR's problem.
            "@typescript-eslint/no-unused-vars": "warn",
            // eslint-config-next's own react-hooks/recommended (bundled via
            // next/core-web-vitals, spread earlier in this file) sets this
            // to "warn" — CLAUDE.md lists it under lint rules that must not
            // regress, so re-assert "error" here since this config object
            // is last and wins.
            "react-hooks/exhaustive-deps": "error",
            "no-restricted-imports": [
                "warn",
                {
                    paths: [
                        {
                            name: "axios",
                            message: "Import the shared transport from @lemonade/api-client instead of calling axios directly.",
                        },
                    ],
                    patterns: [
                        {
                            group: ["@mui/*", "antd", "evergreen-ui"],
                            message: "MUI, antd and Evergreen are retired in favour of @lemonade/ui. See docs/ARCHITECTURE.md §7.",
                        },
                    ],
                },
            ],
        },
    },
];
