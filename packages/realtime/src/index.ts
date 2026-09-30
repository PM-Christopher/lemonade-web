// @lemonade/realtime
//
// Pure connection-options builder for the pusher-js client talking to a
// self-hosted Reverb server (ADR-005 in lemonade-backend, wire-compatible
// with Pusher Cloud). No I/O, no env reading, no `new Pusher(...)` — each
// app still constructs its own client and picks its own auth strategy
// (authEndpoint vs channelAuthorization); this only builds the options both
// apps' pusherConfig.ts were duplicating byte-for-byte.

export interface ReverbConnectionConfig {
  host: string;
  port: number;
  scheme: "http" | "https";
}

/**
 * `cluster` is a Pusher Cloud routing concept Reverb has no equivalent for
 * and ignores at runtime, but pusher-js's own `Options` type still marks it
 * required — the empty string satisfies the type without pusher-js sending
 * it anywhere Reverb would see it.
 */
export interface ReverbConnectionOptions {
  cluster: string;
  wsHost: string;
  wsPort: number;
  wssPort: number;
  forceTLS: boolean;
  enabledTransports: ("ws" | "wss")[];
}

export function buildReverbConnectionOptions(
  config: ReverbConnectionConfig,
): ReverbConnectionOptions {
  return {
    cluster: "",
    wsHost: config.host,
    wsPort: config.port,
    wssPort: config.port,
    forceTLS: config.scheme === "https",
    // One transport. Offering both makes pusher-js open two sockets and
    // close the loser while it is still connecting, which the browser logs
    // as "WebSocket is closed before the connection is established."
    enabledTransports: config.scheme === "https" ? ["wss"] : ["ws"],
  };
}
