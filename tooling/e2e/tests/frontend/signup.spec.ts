import { test, expect } from "@playwright/test";

// Journey 1 (partial) from docs/ARCHITECTURE.md §17 — "sign up → verify
// email → complete profile setup". Covers the first two steps end to end
// against a real backend and a real email: a local Mailpit inbox
// (tooling/e2e/README.md — this needed a real mail catcher, since there's
// no other way for a test to read the actual OTP a real signup sends).
// Deliberately stops once the wizard lands on /profile-setup — completing
// all four of its steps (bio, address, skills, socials) is its own large
// surface with its own selectors per step; out of scope for this pass, see
// README.md's "What's not covered and why".
//
// Runs with a fresh, unauthenticated context — signup must not reuse the
// logged-in demo user's session from auth.setup.ts.
test.use({ storageState: { cookies: [], origins: [] } });

const MAILPIT_URL = process.env.E2E_MAILPIT_URL ?? "http://localhost:8025";

interface MailpitMessageSummary {
  ID: string;
  To: Array<{ Address: string }>;
}

interface MailpitMessage {
  Text?: string;
  HTML?: string;
}

// The signup response comes back before SendOtpNotification's queued mail
// actually lands in Mailpit — poll for it rather than assuming it's
// instant. app/Listeners/Shared/SendOtpNotification.php sends
// "Your Lemonade code: 1234" (resources/views/emails/otp.blade.php).
async function readSignupOtp(toEmail: string): Promise<string> {
  const deadline = Date.now() + 15_000;

  while (Date.now() < deadline) {
    const list = await fetch(`${MAILPIT_URL}/api/v1/messages`);
    const body = (await list.json()) as { messages: MailpitMessageSummary[] };
    const match = body.messages.find((m) => m.To?.some((t) => t.Address === toEmail));

    if (match) {
      const full = await fetch(`${MAILPIT_URL}/api/v1/message/${match.ID}`);
      const message = (await full.json()) as MailpitMessage;
      const code = /Your Lemonade code:\s*(\d{4})/.exec(message.Text ?? message.HTML ?? "");
      if (code) return code[1];
    }

    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  throw new Error(
    `No signup OTP email arrived for ${toEmail} in Mailpit within 15s — is Mailpit running on ${MAILPIT_URL} and is the backend's MAIL_MAILER pointed at it?`,
  );
}

test("sign up, verify email with a real OTP, and land on profile setup", async ({ page }) => {
  const email = `e2e-signup-${Date.now()}@example.com`;
  const password = "TestPass123!";

  await page.goto("/signup");
  await page.locator("#fullname").fill("E2E Signup Test");
  await page.locator("#email").fill(email);
  await page.locator("#password").fill(password);
  await page.getByRole("button", { name: "Create account" }).click();

  await expect(page).toHaveURL(/\/verify-email/, { timeout: 15_000 });

  const code = await readSignupOtp(email);

  const otpInputs = page.locator("form input");
  await expect(otpInputs).toHaveCount(4);
  for (let i = 0; i < 4; i++) {
    await otpInputs.nth(i).fill(code[i]);
  }

  await page.getByRole("button", { name: "Verify" }).click();

  await expect(page).toHaveURL(/\/profile-setup/, { timeout: 15_000 });
});
