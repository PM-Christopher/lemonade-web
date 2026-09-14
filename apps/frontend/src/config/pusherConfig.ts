import Pusher from "pusher-js";
import { clientEnv } from "@/lib/env.client";

// Was: token built into a manual Authorization header, sent cross-origin
// straight to Laravel — dead since the httpOnly cutover (no token is ever
// readable here to build that header from) and a violation of "browser JS
// never holds a token" even before that. authEndpoint is now this app's own
// same-origin Route Handler, which attaches the real token server-side from
// the httpOnly session cookie. See app/api/broadcasting/auth/route.ts.
//
// Falls back to "" rather than requiring the var — NEXT_PUBLIC_PUSHER_KEY is
// empty in .env.local today, and Pusher's constructor requires a string key,
// not string | undefined.
const app_key = clientEnv.NEXT_PUBLIC_PUSHER_KEY ?? "";
Pusher.logToConsole = false;
export const pusherConfig = () => {
  return new Pusher(app_key, {
    cluster: "eu",
    authEndpoint: "/api/broadcasting/auth",
  });
};

export const pusherCon = () => {
  return new Pusher(app_key, {
    cluster: "eu",
  });
};
