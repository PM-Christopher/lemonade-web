import { describe, expect, it } from "vitest";
import { buildReverbConnectionOptions } from "./index";

describe("buildReverbConnectionOptions", () => {
  it("builds plain-ws options for the http scheme", () => {
    expect(buildReverbConnectionOptions({ host: "localhost", port: 8080, scheme: "http" })).toEqual({
      cluster: "",
      wsHost: "localhost",
      wsPort: 8080,
      wssPort: 8080,
      forceTLS: false,
      enabledTransports: ["ws"],
    });
  });

  it("forces TLS for the https scheme", () => {
    const options = buildReverbConnectionOptions({
      host: "reverb.example.com",
      port: 443,
      scheme: "https",
    });

    expect(options.forceTLS).toBe(true);
    expect(options.wsHost).toBe("reverb.example.com");
    expect(options.wsPort).toBe(443);
    expect(options.wssPort).toBe(443);
    expect(options.enabledTransports).toEqual(["wss"]);
  });

  it("always sends an empty cluster, never Pusher Cloud's", () => {
    expect(
      buildReverbConnectionOptions({ host: "localhost", port: 8080, scheme: "http" }).cluster,
    ).toBe("");
  });
});
