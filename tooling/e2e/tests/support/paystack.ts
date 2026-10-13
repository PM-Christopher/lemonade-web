import { createHmac } from "node:crypto";
import { expect, type APIRequestContext } from "@playwright/test";

const PROXY_URL = process.env.E2E_PAYSTACK_PROXY_URL ?? "http://127.0.0.1:9801";

// Marks a payment the backend initialized as paid, so its verify call succeeds.
// The backend must be pointed at the proxy, see support/paystack-proxy.mjs.
export async function markPaid(request: APIRequestContext, reference: string): Promise<void> {
  const response = await request.post(`${PROXY_URL}/__e2e/pay`, { data: { reference } });
  expect(response.ok(), `${response.status()} ${await response.text()}`).toBeTruthy();
}

// The reference of the payment behind a checkout URL, for flows whose API answer only has the URL.
export async function referenceForCheckout(
  request: APIRequestContext,
  authorizationUrl: string,
): Promise<string> {
  const response = await request.get(`${PROXY_URL}/__e2e/reference`, {
    params: { authorization_url: authorizationUrl },
  });
  expect(response.ok(), `${response.status()} ${await response.text()}`).toBeTruthy();
  return ((await response.json()) as { reference: string }).reference;
}

// Sends the signed charge.success webhook Paystack sends once a payment clears. Flows that
// finish on the webhook (ticket purchases) need this on top of markPaid.
export async function sendChargeSuccessWebhook(
  request: APIRequestContext,
  reference: string,
): Promise<void> {
  const secret = process.env.E2E_PAYSTACK_SECRET_KEY;
  if (!secret) throw new Error("E2E_PAYSTACK_SECRET_KEY must be set, see .env.e2e.example");

  const body = JSON.stringify({ event: "charge.success", data: { reference } });
  const signature = createHmac("sha512", secret).update(body).digest("hex");
  const backend = process.env.E2E_BACKEND_URL ?? "http://127.0.0.1:9800";

  const response = await request.post(`${backend}/v1/shared/payment/paystack/webhook`, {
    data: body,
    headers: { "content-type": "application/json", "x-paystack-signature": signature },
  });
  expect(response.ok(), `${response.status()} ${await response.text()}`).toBeTruthy();
}
