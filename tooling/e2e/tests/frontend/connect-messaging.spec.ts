import { test, expect, type APIRequestContext, type Browser } from "@playwright/test";

// Journey 10 (docs/ARCHITECTURE.md §17): a user sends a message and the
// recipient receives it live over the websocket (Reverb, Pusher protocol).
// Needs a second real account, see E2E_USER_TWO_* in .env.e2e.example, and a
// running `php artisan reverb:start`.
const FRONTEND_URL = "http://localhost:3000";

async function currentUserId(request: APIRequestContext): Promise<string> {
  const response = await request.get("/api/v1/user/profile/user");
  expect(response.ok()).toBeTruthy();
  const body = (await response.json()) as { data: { user?: { id: string }; id?: string } };
  return (body.data.user?.id ?? body.data.id) as string;
}

async function loginAsSecondUser(browser: Browser) {
  const email = process.env.E2E_USER_TWO_EMAIL;
  const password = process.env.E2E_USER_TWO_PASSWORD;
  if (!email || !password) {
    throw new Error("E2E_USER_TWO_EMAIL and E2E_USER_TWO_PASSWORD must be set, see README.md");
  }
  const context = await browser.newContext({ baseURL: FRONTEND_URL });
  const page = await context.newPage();
  await page.goto("/login");
  await page.locator("#email").fill(email);
  await page.locator("#password").fill(password);
  await page.getByRole("button", { name: "Login" }).click();
  await expect(page).toHaveURL((url) => !url.pathname.startsWith("/login"), { timeout: 60_000 });
  return { context, page };
}

test("a message sent by one user reaches the other without a reload", async ({ page, browser }) => {
  test.setTimeout(180_000);

  const { context: contextTwo, page: pageTwo } = await loginAsSecondUser(browser);

  try {
    const idOne = await currentUserId(page.request);
    const idTwo = await currentUserId(contextTwo.request);

    // Connect the two accounts once. Later runs find the existing chat.
    const history = await page.request.get("/api/v1/user/messages");
    expect(history.ok()).toBeTruthy();
    if (!(await history.text()).includes(idTwo)) {
      const invite = await page.request.post("/api/v1/user/connect/send-invite", {
        data: { invitee_id: idTwo, message: "E2E hello" },
      });
      expect(invite.ok(), await invite.text()).toBeTruthy();

      const invites = await contextTwo.request.get("/api/v1/user/connect/get-invites");
      const { data } = (await invites.json()) as {
        data: { invites: { id: string; inviter?: { id: string } }[] };
      };
      const pending = data.invites[0];
      const accept = await contextTwo.request.post(
        `/api/v1/user/connect/invite-response/${pending?.id}`,
        { data: { option: "accepted" } },
      );
      expect(accept.ok(), await accept.text()).toBeTruthy();
    }
    expect(idOne).not.toBe(idTwo);

    // Recipient opens the chat first, so the websocket is already subscribed.
    await pageTwo.goto("/connect");
    await pageTwo
      .locator("div.hide-scrollbar:visible")
      .getByText(/Demo|user/i)
      .first()
      .click();
    await expect(pageTwo.getByPlaceholder("Reply...").first()).toBeVisible({ timeout: 45_000 });

    // Sender opens the same chat and sends a message.
    const text = `E2E hello ${Date.now()}`;
    await page.goto("/connect");
    // Wait for the chat to load, or the send goes out with no receiver id.
    const chatLoaded = page.waitForResponse((r) => r.url().includes("/api/v1/user/messages/chat"));
    await page.locator("div.hide-scrollbar:visible").getByText(/./).first().click();
    await chatLoaded;
    const reply = page.getByPlaceholder("Reply...").first();
    await expect(reply).toBeVisible({ timeout: 45_000 });
    await reply.fill(text);
    const sent = page.waitForResponse(
      (response) =>
        response.url().includes("/api/v1/user/messages") && response.request().method() === "POST",
    );
    await reply.press("Enter");
    const sentResponse = await sent;
    expect(sentResponse.ok(), `${sentResponse.status()} ${await sentResponse.text()}`).toBeTruthy();

    // The recipient sees it live, no navigation or reload.
    // The chat bubble, not the notification toast that shows the same text.
    await expect(pageTwo.locator("p.whitespace-pre-wrap", { hasText: text })).toBeVisible({
      timeout: 30_000,
    });
  } finally {
    await contextTwo.close();
  }
});
