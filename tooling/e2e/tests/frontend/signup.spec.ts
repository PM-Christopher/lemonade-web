import { test, expect } from "@playwright/test";

// Journey 1 from docs/ARCHITECTURE.md §17 — "sign up → verify email →
// complete profile setup". Covers the whole thing end to end against a
// real backend and a real email: a local Mailpit inbox
// (tooling/e2e/README.md — this needed a real mail catcher, since there's
// no other way for a test to read the actual OTP a real signup sends),
// then all four profile-setup steps (components/form-steps/*.tsx).
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

test("sign up, verify email with a real OTP, and complete profile setup", async ({ page }) => {
  const uniqueSuffix = Date.now();
  const email = `e2e-signup-${uniqueSuffix}@example.com`;
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

  // Step 1 — components/form-steps/profile-step.tsx. Username must be
  // globally unique, hence the timestamp suffix (same one the email uses).
  await expect(page.getByText("Profile set up")).toBeVisible();
  await page.locator("#username").fill(`e2euser${uniqueSuffix}`);
  await page.locator("#bio").fill("E2E test bio.");
  await page.locator('[aria-label="Industry"]').click();
  // Radix Select also renders a hidden native <select> with the same
  // option text for form-compat — scope to the open listbox to avoid it.
  await page.getByRole("listbox").getByText("Software Development", { exact: true }).click();
  await page.getByRole("button", { name: "Next" }).click();

  // Step 2 — address-step.tsx. Country is a plain native <select>, not the
  // shadcn one industry above used.
  await expect(page.getByText("Contact address")).toBeVisible({ timeout: 10_000 });
  await page.locator("#address").fill("1 Test Street");
  await page.locator("#city").fill("Lagos");
  await page.locator("#country").selectOption("Nigeria");
  await page.locator("#state").fill("Lagos");
  await page.getByRole("button", { name: "Next" }).click();

  // Step 3 — skills-step.tsx. Both lists require at least 3 picks each;
  // each item is a clickable div, not a real form control.
  await expect(page.getByText("Skills & Interests")).toBeVisible({ timeout: 10_000 });
  for (const skill of ["Creativity", "Leadership", "Problem-solving"]) {
    await page.getByText(skill, { exact: true }).click();
  }
  for (const interest of ["Arts", "Sports", "Music"]) {
    await page.getByText(interest, { exact: true }).click();
  }
  await page.getByRole("button", { name: "Next" }).click();

  // Step 4 — social-step.tsx. Every field is optional (yup.array(), no
  // .required()) — submitting empty is a legitimate real path, not a
  // shortcut around validation.
  await expect(page.getByText("Link your social profiles")).toBeVisible({ timeout: 10_000 });
  await page.getByRole("button", { name: "Done" }).click();

  // socialsStep's onSuccess clears the onboarding cookie and routes home —
  // the same real "you're fully signed in now" transition login/refresh
  // use, proving the whole onboarding flow actually hands off to a real
  // session, not just that the last API call returned 200.
  await expect(page).toHaveURL("/", { timeout: 15_000 });
});
