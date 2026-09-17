// WCAG 2.1 contrast ratio, computed from the same HSL tokens Tailwind's
// `hsl(var(--x))` resolves at render time — see
// https://www.w3.org/TR/WCAG21/#contrast-minimum for the formula.

function hslToRgb({ h, s, l }) {
  const sat = s / 100;
  const light = l / 100;
  const k = (n) => (n + h / 30) % 12;
  const a = sat * Math.min(light, 1 - light);
  const f = (n) => light - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  return { r: f(0) * 255, g: f(8) * 255, b: f(4) * 255 };
}

function relativeLuminance({ r, g, b }) {
  const channel = (v) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

export function contrastRatio(tokenA, tokenB) {
  const lumA = relativeLuminance(hslToRgb(tokenA));
  const lumB = relativeLuminance(hslToRgb(tokenB));
  const lighter = Math.max(lumA, lumB);
  const darker = Math.min(lumA, lumB);
  return (lighter + 0.05) / (darker + 0.05);
}

// WCAG AA thresholds — AAA (7:1 / 4.5:1) isn't the bar CLAUDE.md sets
// anywhere, so not checked here.
export const AA_NORMAL_TEXT = 4.5;
export const AA_LARGE_TEXT_OR_UI = 3.0;
