# contrast-audit

Checks WCAG AA contrast on the shared shadcn token pairs both apps' `globals.css` define — the same
tokens `packages/ui/src/*` primitives render with via `hsl(var(--x))` in
`packages/config/tailwind.preset.js`. Report-only, like `tooling/lighthouse-ci`, not a CI gate — see
`docs/ARCHITECTURE.md` §7.

## Scope

This checks the design system's own token pairs (`primary`/`primary-foreground`,
`card`/`card-foreground`, `border`/`background`, and so on — 11 pairs total, light and dark mode each),
not every `text-X`/`bg-Y` combination actually used together across the ~4,000 className strings in both
apps. That would mean parsing which classes land on the same rendered element — a much bigger effort with
a much higher false-positive rate (most `text-*`/`bg-*` pairs in a className string aren't even applied to
the same element). The token pairs are what every primitive in `packages/ui` actually renders with by
default, so a failure here is a systemic contrast bug in the design system itself, not one call site's
typo.

## How it works

1. `parse-tokens.mjs` reads `apps/frontend/src/app/globals.css`'s `@layer base` block and extracts every
   `--token: H S% L%;` declaration from `:root` (light mode) and `.dark` (dark mode) into
   `{ h, s, l }`. Both apps define the identical token set (confirmed via diff), so either app's file is
   a valid source.
2. `contrast.mjs` implements WCAG 2.1's relative-luminance contrast ratio formula directly from HSL —
   the same math a browser uses, no headless browser needed.
3. `audit.mjs` checks each pair against the right threshold — 4.5:1 for text pairs, 3:1 for non-text UI
   component pairs (borders, focus rings) — and prints a pass/fail report for both light and dark mode.

## Usage

```bash
pnpm --filter @lemonade/contrast-audit check
```

The script is named `check`, not `audit`, even though the package is `@lemonade/contrast-audit` and the
file is `audit.mjs` — `pnpm --filter <pkg> audit` silently runs pnpm's own built-in `pnpm audit` (a
security-vulnerability scan) instead of a package.json script named `audit`, since `audit` is a reserved
top-level pnpm command name, not a script-name lookup. Found this the hard way; keep the script name
`check`.

## Known findings (light mode, as of this tool's introduction)

- `destructive-foreground` on `destructive`: 3.60:1 — fails the 4.5:1 text bar.
- `muted-foreground` on `muted`: 4.35:1 — fails by a hair.
- `border`/`input` on `background`: 1.26:1 — fails the 3:1 UI-component bar, though WCAG 1.4.11 exempts
  purely decorative borders, and these are the stock shadcn defaults never customized for this project;
  worth a real design decision, not a silent fix.

Dark mode passes every text pair; `border`/`input` fail there too (1.31:1), same as light.
