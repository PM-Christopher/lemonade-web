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
// Singletons, not a new WebSocket per call — see the frontend app's
// identical fix in its own pusherConfig.ts for the leak this avoids
// (usePusher.ts's cleanup only unsubscribes the channel, not the
// connection, so a fresh `new Pusher()` per call leaks a socket on every
// effect re-run). Unused today per the file comment above, but the same
// structural bug exists here — fixed now so it doesn't resurface the
// moment this gets wired to a real component.
let authenticatedClient: Pusher | null = null;
let publicClient: Pusher | null = null;

export const pusherConfig = () => {
  if (!authenticatedClient) {
    authenticatedClient = new Pusher(app_key, {
      ...connectionOptions,
      channelAuthorization: {
        transport: "ajax",
        endpoint: "/api/broadcasting/auth",
      },
    });
  }
  return authenticatedClient;
};

export const pusherCon = () => {
  if (!publicClient) {
    publicClient = new Pusher(app_key, connectionOptions);
  }
  return publicClient;
};
