// Stands between the backend and Paystack (and Cloudinary) for e2e runs. Point the backend at it
// with PAYSTACK_PAYMENT_URL=http://127.0.0.1:9801.
//
// Everything goes through to the real Paystack test API, so initializing a payment
// still returns a live checkout URL. The one difference: a test can mark a reference
// as paid, and the verify call for it then answers "success". The backend runs its
// real finalizing logic on that answer. Paystack's hosted checkout can't be driven
// from a test (Cloudflare bot challenge), and a payment can't be charged by reference.
import { createServer } from "node:http";

const PORT = Number(process.env.PAYSTACK_PROXY_PORT ?? 9801);
const UPSTREAM = process.env.PAYSTACK_UPSTREAM ?? "https://api.paystack.co";

// reference -> what the backend sent when it initialized the payment
const initialized = new Map();
const paid = new Set();
// checkout URL -> reference, for flows whose API answer has the URL but not the reference
const referenceByUrl = new Map();

function readBody(req) {
  return new Promise((resolve) => {
    const chunks = [];
    req.on("data", (chunk) => chunks.push(chunk));
    req.on("end", () => resolve(Buffer.concat(chunks)));
  });
}

function send(res, status, body) {
  res.writeHead(status, { "content-type": "application/json" });
  res.end(JSON.stringify(body));
}

createServer(async (req, res) => {
  const url = new URL(req.url ?? "/", "http://localhost");
  const body = await readBody(req);

  // Stand-in for Cloudinary's upload API (the backend uploads ticket QR codes). Set
  // CLOUDINARY_UPLOAD_PREFIX to this server and use any cloud name and keys.
  if (
    req.method === "POST" &&
    /^\/v1_1\/[^/]+\/(image|video|raw|auto)\/upload$/.test(url.pathname)
  ) {
    const secureUrl = "https://res.cloudinary.com/demo/image/upload/e2e-fixture.png";
    return send(res, 200, {
      public_id: "e2e-fixture",
      secure_url: secureUrl,
      url: secureUrl,
      format: "png",
      resource_type: "image",
    });
  }

  if (url.pathname === "/__e2e/health") return send(res, 200, { ok: true });

  // Test control: the reference of the payment that was given this checkout URL.
  if (req.method === "GET" && url.pathname === "/__e2e/reference") {
    const reference = referenceByUrl.get(url.searchParams.get("authorization_url") ?? "");
    return reference
      ? send(res, 200, { reference })
      : send(res, 404, { status: false, message: "Unknown checkout URL" });
  }

  // Test control: mark a reference as paid.
  if (req.method === "POST" && url.pathname === "/__e2e/pay") {
    const { reference } = JSON.parse(body.toString() || "{}");
    if (!initialized.has(reference)) {
      return send(res, 404, { status: false, message: `Unknown reference ${reference}` });
    }
    paid.add(reference);
    return send(res, 200, { status: true });
  }

  const verifyMatch = url.pathname.match(/^\/transaction\/verify\/(.+)$/);
  if (req.method === "GET" && verifyMatch && paid.has(decodeURIComponent(verifyMatch[1]))) {
    const reference = decodeURIComponent(verifyMatch[1]);
    const init = initialized.get(reference);
    return send(res, 200, {
      status: true,
      message: "Verification successful",
      data: {
        status: "success",
        reference,
        amount: init.amount,
        currency: "NGN",
        channel: "card",
        paid_at: new Date().toISOString(),
        customer: { email: init.email },
        metadata: init.metadata ?? {},
      },
    });
  }

  const headers = { ...req.headers };
  delete headers.host;
  delete headers["content-length"];
  const upstream = await fetch(`${UPSTREAM}${url.pathname}${url.search}`, {
    method: req.method,
    headers,
    body: ["GET", "HEAD"].includes(req.method ?? "GET") ? undefined : body,
  }).catch((error) => ({ failed: error }));

  if ("failed" in upstream) {
    return send(res, 502, { status: false, message: String(upstream.failed) });
  }

  const text = await upstream.text();
  if (req.method === "POST" && url.pathname === "/transaction/initialize" && upstream.ok) {
    const request = JSON.parse(body.toString() || "{}");
    const initData = JSON.parse(text)?.data;
    const reference = initData?.reference;
    if (reference) {
      referenceByUrl.set(initData.authorization_url, reference);
      initialized.set(reference, {
        amount: request.amount,
        email: request.email,
        metadata: request.metadata,
      });
    }
  }
  res.writeHead(upstream.status, {
    "content-type": upstream.headers.get("content-type") ?? "application/json",
  });
  res.end(text);
}).listen(PORT, "127.0.0.1", () => {
  console.warn(`paystack proxy on :${PORT} -> ${UPSTREAM}`);
});
