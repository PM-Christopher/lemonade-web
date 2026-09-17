#!/usr/bin/env node
// Checks the shared shadcn token pairs (packages/ui's primitives are built
// against these, via hsl(var(--x)) in packages/config/tailwind.preset.js)
// against WCAG AA. Report-only for now, like the Lighthouse CI job — see
// docs/ARCHITECTURE.md Phase 7. Both apps' globals.css define the identical
// token set (confirmed via diff), so either is a valid source; frontend's is
// used since nothing here is frontend-specific.
//
// Scope: this checks the design system's own token pairs, not every
// `text-X`/`bg-Y` combination actually used together across ~4,000+
// className strings in both apps — that would need parsing which classes
// land on the same element, a much bigger effort. The token pairs are what
// every primitive in packages/ui actually renders with, so a failure here
// is a real, systemic contrast bug, not one call site's typo.
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { parseTokens } from "./parse-tokens.mjs";
import { contrastRatio, AA_NORMAL_TEXT, AA_LARGE_TEXT_OR_UI } from "./contrast.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const globalsCssPath = join(__dirname, "..", "..", "apps", "frontend", "src", "app", "globals.css");
const css = readFileSync(globalsCssPath, "utf8");
const { light, dark } = parseTokens(css);

// [foreground token, background token, threshold, label]
const TEXT_PAIRS = [
  ["foreground", "background", AA_NORMAL_TEXT, "body text on page background"],
  ["card-foreground", "card", AA_NORMAL_TEXT, "card text on card background"],
  ["popover-foreground", "popover", AA_NORMAL_TEXT, "popover text on popover background"],
  ["primary-foreground", "primary", AA_NORMAL_TEXT, "primary button text"],
  ["secondary-foreground", "secondary", AA_NORMAL_TEXT, "secondary button text"],
  ["muted-foreground", "muted", AA_NORMAL_TEXT, "muted text on muted background"],
  ["accent-foreground", "accent", AA_NORMAL_TEXT, "accent text on accent background"],
  ["destructive-foreground", "destructive", AA_NORMAL_TEXT, "destructive button text"],
];

// Non-text UI components (borders, focus rings) against the page background
// they sit on — WCAG's lower 3:1 bar, not the text bar.
const UI_PAIRS = [
  ["border", "background", AA_LARGE_TEXT_OR_UI, "default border on page background"],
  ["input", "background", AA_LARGE_TEXT_OR_UI, "input border on page background"],
  ["ring", "background", AA_LARGE_TEXT_OR_UI, "focus ring on page background"],
];

function auditMode(modeName, tokens) {
  console.log(`\n${modeName}:`);
  let failures = 0;
  for (const [fgName, bgName, threshold, label] of [...TEXT_PAIRS, ...UI_PAIRS]) {
    const fg = tokens[fgName];
    const bg = tokens[bgName];
    if (!fg || !bg) {
      console.log(`  ? ${label} — missing token(s): ${!fg ? fgName : ""} ${!bg ? bgName : ""}`);
      continue;
    }
    const ratio = contrastRatio(fg, bg);
    const pass = ratio >= threshold;
    if (!pass) failures++;
    console.log(
      `  ${pass ? "✓" : "✗"} ${label}: ${ratio.toFixed(2)}:1 (needs ${threshold}:1) — ` +
        `--${fgName} on --${bgName}`,
    );
  }
  return failures;
}

const lightFailures = auditMode("Light mode", light);
const darkFailures = auditMode("Dark mode", dark);
const totalFailures = lightFailures + darkFailures;

console.log(
  `\n${totalFailures === 0 ? "All pairs pass WCAG AA." : `${totalFailures} pair(s) fail WCAG AA.`} ` +
    "Report-only — see docs/ARCHITECTURE.md Phase 7.",
);
