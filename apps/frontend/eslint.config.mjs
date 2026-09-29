// Extends the shared @lemonade/config flat config with:
//   - eslint-config-next 16's native flat config (core-web-vitals +
//     typescript). The Next app stays on 15.1.11; v16 of this package drops
//     @rushstack/eslint-patch, which refuses to load under ESLint 10, and
//     does not depend on the `next` runtime.
//   - eslint-plugin-boundaries element paths for THIS app's src/ layout,
//     encoding docs/ARCHITECTURE.md's import-rules table (see §9):
//       * a feature may not reach into another feature's internals
//       * app/** may not import @lemonade/api-client directly — it must go
//         through a feature's api.ts
//   - per-app downgrades of three shared rules from "error" to "warn".
//     These three describe a TARGET state the app doesn't meet yet
//     (measured: 24 files still importing axios directly, 10 files still on
//     MUI/antd/evergreen-ui, ~300+ `any` occurrences) — leaving them at
//     "error" here would make lint permanently red for pre-existing debt,
//     not the PR under review. `packages/*` keeps the strict "error" level
//     from the shared config unchanged, since those are new/small and
//     should be held to the real bar.
//       * no-explicit-any -> resolved by Phase 3's declining budget
//       * MUI/antd/evergreen-ui -> resolved by Phase 7's design-system swap
//         (zero real usage of @mui/*, antd or evergreen-ui left in this app —
//         confirmed via grep before removing the packages). The single
//         `no-restricted-imports` rule below still stays at "warn" as a
//         whole, though: it also bans axios, which is NOT resolved (still
//         real debt) — ESLint's severity is per-rule, not per-pattern, so
//         one shared "warn" is the honest level until axios is migrated too.
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import tseslint from "@typescript-eslint/eslint-plugin";
import boundaries from "eslint-plugin-boundaries";
import baseConfig from "@lemonade/config/eslint";

// Scoped to src/** — root-level config files (next.config.mjs,
// eslint.config.mjs itself, tailwind/postcss config) were never meant to be
// subject to Next's page/document rules. Ignore-only blocks stay unscoped so
// `.next/**` still gets dropped.
const nextConfigs = [...nextVitals, ...nextTs]
  .filter((config) => !config.ignores)
  .map((config) => ({
    ...config,
    files: ["src/**/*.{js,jsx,ts,tsx}"],
  }));

/** @type {import("eslint").Linter.Config[]} */
export default [
  ...baseConfig,
  ...nextConfigs,
  {
    files: ["src/**/*.{js,jsx,ts,tsx}"],
    settings: {
      // eslint-plugin-react 7.37 still calls context.getFilename() when
      // version is "detect", and that method is gone in ESLint 10.
      // Pin the version so it never tries to detect.
      react: { version: "19.0" },
    },
  },
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
    // Only the cross-feature-family check is enabled. Two other rules
    // (app/** must not import @lemonade/api-client directly; a feature
    // may only be entered through its index.ts) were tried here and
    // dropped — eslint-plugin-boundaries' external-package matching and
    // its entry-point rule both produced zero hits against known real
    // violations (app/api/**'s BFF route handlers importing
    // @lemonade/api-client directly, deliberately; pages importing their
    // OWN matching feature's queries.ts directly, the established and
    // correct pattern everywhere in this app) — a silently-inert rule is
    // worse than no rule. The family check below was verified against
    // two real violations (features/connect and features/tribes both
    // reaching into features/shared/api.ts instead of its index) and
    // fixed them. Revisit the other two if picked back up later.
    //
    // features/shared is deliberately its own element type, matched
    // before the generic "feature" pattern — it's the one cross-cutting
    // feature meant to be consumed by other domain features (see its own
    // file header), so it's exempt from the family-isolation check
    // below rather than another "domain".
    files: ["**/*.{ts,tsx}"],
    plugins: { boundaries },
    settings: {
      "boundaries/elements": [
        { type: "shared-feature", pattern: "src/features/shared/**" },
        { type: "feature", pattern: "src/features/*/**", capture: ["family"] },
      ],
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
              message:
                "features/x/** may not import features/y/** internals — go through y's index.",
            },
          ],
        },
      ],
    },
  },
  {
    // Pre-existing debt, not new-code license — see file header.
    files: ["**/*.{ts,tsx}"],
    plugins: { "@typescript-eslint": tseslint },
    rules: {
      "@typescript-eslint/no-explicit-any": "warn",
      // Pre-existing unused-import/-variable debt, measured when this
      // app's eslint.config.mjs was first wired up — real dead code,
      // worth burning down, but not this PR's problem.
      "@typescript-eslint/no-unused-vars": "warn",
      // Pre-existing hardcoded `[Npx]` classes — see
      // packages/config/pixel-class-budget.json and
      // scripts/check-pixel-budget.mjs for the declining-budget ratchet
      // that's the actual enforcement (same shape as no-any-budget.json).
      "local/no-hardcoded-pixel-class": "warn",
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
    },
  },
];
