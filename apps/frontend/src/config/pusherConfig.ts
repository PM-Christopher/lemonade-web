import Pusher from "pusher-js";
import { clientEnv } from "@/lib/env.client";

// Was: token built into a manual Authorization header, sent cross-origin
// straight to Laravel — dead since the httpOnly cutover (no token is ever
// readable here to build that header from) and a violation of "browser JS
// never holds a token" even before that. authEndpoint is now this app's own
// same-origin Route Handler, which attaches the real token server-side from
// the httpOnly session cookie. See app/api/broadcasting/auth/route.ts.
//
// Falls back to "" rather than requiring the var — NEXT_PUBLIC_REVERB_KEY is
// empty in .env.local today, and Pusher's constructor requires a string key,
// not string | undefined.
//
// ADR-005: self-hosted Reverb, not Pusher Cloud — wsHost/wsPort point at
// the Reverb server, and forceTLS follows the configured scheme since local
// dev talks to Reverb over plain ws. `cluster` is a Pusher Cloud routing
// concept Reverb has no equivalent for and ignores at runtime, but pusher-js's
// own Options type still marks it required — the empty string satisfies the
// type without pusher-js sending it anywhere Reverb would see it.
const app_key = clientEnv.NEXT_PUBLIC_REVERB_KEY ?? "";
const reverbPort = Number(clientEnv.NEXT_PUBLIC_REVERB_PORT ?? 8080);
const forceTLS = clientEnv.NEXT_PUBLIC_REVERB_SCHEME === "https";
Pusher.logToConsole = false;
export const pusherConfig = () => {
  return new Pusher(app_key, {
    cluster: "",
    wsHost: clientEnv.NEXT_PUBLIC_REVERB_HOST ?? "localhost",
    wsPort: reverbPort,
    wssPort: reverbPort,
    forceTLS,
    enabledTransports: ["ws", "wss"],
    authEndpoint: "/api/broadcasting/auth",
  });
};

export const pusherCon = () => {
  return new Pusher(app_key, {
    cluster: "",
    wsHost: clientEnv.NEXT_PUBLIC_REVERB_HOST ?? "localhost",
    wsPort: reverbPort,
    wssPort: reverbPort,
    forceTLS,
    enabledTransports: ["ws", "wss"],
  });
};
