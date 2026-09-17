// Parses the shadcn-style `--token: H S% L%;` custom properties out of a
// globals.css file's `:root` and `.dark` blocks. Both apps' globals.css
// define the identical token set (confirmed via diff — see
// docs/ARCHITECTURE.md Phase 7), so either app's file is the source of
// truth; this takes a path rather than hardcoding one app so that stops
// being true without silently going stale.
const HSL_DECL = /--([\w-]+):\s*([\d.]+)\s+([\d.]+)%\s+([\d.]+)%\s*;/g;

export function parseTokens(css) {
  // globals.css has an earlier, unrelated `:root { --foreground-rgb: ...}`
  // block (legacy, RGB-triplet-valued, not HSL) before @layer base's real
  // shadcn token block — search from `@layer base` onward so that first
  // block isn't picked up by mistake. Not trying to match @layer base's own
  // closing brace (CSS nesting isn't regex-friendly); :root {...} and
  // .dark {...} are single-level blocks that terminate at their own first
  // `}` regardless of what comes after.
  const fromLayerBase = css.slice(css.indexOf("@layer base"));
  const rootBlock = fromLayerBase.match(/:root\s*{([^}]*)}/)?.[1] ?? "";
  const darkBlock = fromLayerBase.match(/\.dark\s*{([^}]*)}/)?.[1] ?? "";

  return {
    light: parseBlock(rootBlock),
    dark: parseBlock(darkBlock),
  };
}

function parseBlock(block) {
  const tokens = {};
  for (const match of block.matchAll(HSL_DECL)) {
    const [, name, h, s, l] = match;
    tokens[name] = { h: Number(h), s: Number(s), l: Number(l) };
  }
  return tokens;
}
