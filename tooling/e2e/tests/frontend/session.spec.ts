import { test, expect } from "@playwright/test";

// Journey 2 (partial) from docs/ARCHITECTURE.md §17 — "log in → ... → stay
// logged in". Forcing a real token expiry mid-session isn't covered here
// (would need the backend to issue a near-expired token on demand); this
// checks the cheaper, still-real half: an authenticated session survives a
// hard reload, proving the httpOnly cookie (not just in-memory Redux
// state) is what's actually keeping the user logged in.
test("an authenticated session survives a hard reload", async ({ page }) => {
  await page.goto("/");
  await expect(page).not.toHaveURL(/\/login/);

  await page.reload();

  await expect(page).not.toHaveURL(/\/login/);
});
