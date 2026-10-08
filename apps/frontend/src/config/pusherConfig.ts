import Pusher from "pusher-js";
import { buildReverbConnectionOptions } from "@lemonade/realtime";
import { clientEnv } from "@/lib/env.client";

// Reverb client; auth goes through the same-origin BFF route (no browser token).
const app_key = clientEnv.NEXT_PUBLIC_REVERB_KEY ?? "";
const connectionOptions = buildReverbConnectionOptions({
  host: clientEnv.NEXT_PUBLIC_REVERB_HOST ?? "localhost",
  port: Number(clientEnv.NEXT_PUBLIC_REVERB_PORT ?? 8080),
  scheme: clientEnv.NEXT_PUBLIC_REVERB_SCHEME === "https" ? "https" : "http",
});
Pusher.logToConsole = false;

// Reuse one socket per client type so effect re-runs do not leak connections.
let authenticatedClient: Pusher | null = null;
let publicClient: Pusher | null = null;

export const pusherConfig = () => {
  if (!authenticatedClient) {
    authenticatedClient = new Pusher(app_key, {
      ...connectionOptions,
      authEndpoint: "/api/broadcasting/auth",
    });
  }
  return authenticatedClient;
};

/** Drop the signed-in realtime socket so auth pages do not re-authorize. */
export const disconnectAuthenticatedPusher = () => {
  if (!authenticatedClient) return;
  authenticatedClient.disconnect();
  authenticatedClient = null;
};

export const pusherCon = () => {
  if (!publicClient) {
    publicClient = new Pusher(app_key, connectionOptions);
  }
  return publicClient;
};
