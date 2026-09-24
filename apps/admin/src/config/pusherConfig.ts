import Pusher from "pusher-js";
import { buildReverbConnectionOptions } from "@lemonade/realtime";
import { clientEnv } from "@/lib/env.client";

// Was: custom /pusher/auth/{user,channel} endpoints — never registered on
// the backend (only the framework's default /broadcasting/auth exists) —
// with a manual Authorization header built from a token nothing ever set.
// authEndpoint is now this app's own same-origin Route Handler, which
// attaches the real token server-side from the httpOnly session cookie. See
// app/api/broadcasting/auth/route.ts. Unused today (see that file's
// comment) but fixed for consistency with the frontend app's equivalent.
// Falls back to "" rather than requiring the var — this whole file is
// unused today (see comment above), and Pusher's constructor requires a
// string key, not string | undefined.
//
// ADR-005: self-hosted Reverb, not Pusher Cloud — connection options (host/
// port/TLS/cluster) are shared with the frontend app via @lemonade/realtime,
// since both apps built the exact same options object; only the auth
// strategy differs per app (this one uses `channelAuthorization`, frontend
// uses `authEndpoint`), which is why client construction itself stays
// app-local.
const app_key = clientEnv.NEXT_PUBLIC_REVERB_KEY ?? "";
const connectionOptions = buildReverbConnectionOptions({
  host: clientEnv.NEXT_PUBLIC_REVERB_HOST ?? "localhost",
  port: Number(clientEnv.NEXT_PUBLIC_REVERB_PORT ?? 8080),
  scheme: clientEnv.NEXT_PUBLIC_REVERB_SCHEME === "https" ? "https" : "http",
});
export const pusherConfig = () => {
  return new Pusher(app_key, {
    ...connectionOptions,
    channelAuthorization: {
      transport: "ajax",
      endpoint: "/api/broadcasting/auth",
    },
  });
};

export const pusherCon = () => {
  return new Pusher(app_key, connectionOptions);
};
