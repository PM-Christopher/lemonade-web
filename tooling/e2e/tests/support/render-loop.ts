import type { Page } from "@playwright/test";

// A render loop never throws, it just repeats the same console warning.
const REPEAT_LIMIT = 5;
const SETTLE_MS = 3_000;

// Collects console errors and warnings, then returns any message seen too often.
export function watchRenderLoops(page: Page) {
  const counts = new Map<string, number>();
  page.on("console", (message) => {
    if (message.type() !== "error" && message.type() !== "warning") return;
    const text = message.text().slice(0, 200);
    counts.set(text, (counts.get(text) ?? 0) + 1);
  });

  return async function repeatedMessages() {
    await page.waitForTimeout(SETTLE_MS);
    return [...counts].filter(([, n]) => n >= REPEAT_LIMIT).map(([text, n]) => `${n}x ${text}`);
  };
}
