import Pusher from "pusher-js";
import { buildReverbConnectionOptions } from "@lemonade/realtime";
import { clientEnv } from "@/lib/env.client";

// Was: token built into a manual Authorization header, sent cross-origin
// straight to Laravel — dead since the httpOnly cutover (no token is ever
// readable here to build that header from) and a violation of "browser JS
// never holds a token" even before that. authEndpoint is now this app's own
// same-origin Route Handler, which attaches the real token server-side from
// the httpOnly session cookie. See app/api/broadcasting/auth/route.ts.
//
// Falls back to "" rather than requiring the var — Pusher's constructor
// requires a string key, not string | undefined, and NEXT_PUBLIC_REVERB_KEY
// is unset in a fresh .env.local until reverb:install/reverb:start are run.
//
// ADR-005: self-hosted Reverb, not Pusher Cloud — connection options (host/
// port/TLS/cluster) are shared with the admin app via @lemonade/realtime,
// since both apps built the exact same options object; only the auth
// strategy differs per app (this one uses `authEndpoint`, admin uses
// `channelAuthorization`), which is why client construction itself stays
// app-local.
const app_key = clientEnv.NEXT_PUBLIC_REVERB_KEY ?? "";
const connectionOptions = buildReverbConnectionOptions({
  host: clientEnv.NEXT_PUBLIC_REVERB_HOST ?? "localhost",
  port: Number(clientEnv.NEXT_PUBLIC_REVERB_PORT ?? 8080),
  scheme: clientEnv.NEXT_PUBLIC_REVERB_SCHEME === "https" ? "https" : "http",
});
Pusher.logToConsole = false;
export const pusherConfig = () => {
  return new Pusher(app_key, {
    ...connectionOptions,
    authEndpoint: "/api/broadcasting/auth",
  });
};

export const pusherCon = () => {
  return new Pusher(app_key, connectionOptions);
};
