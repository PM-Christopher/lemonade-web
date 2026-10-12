import { describe, expect, it } from "vitest";
import { formatDistanceAway, getSafeImageSrc } from "./helper";

// next/image throws "Invalid src prop" and crashes the whole page for any
// hostname not in next.config.mjs's images.remotePatterns — caught by a
// real Playwright run against a live backend when an event's event_image
// was "https://example.com/..." (placeholder seed data, not a real image
// host). See tooling/e2e/README.md.
describe("getSafeImageSrc", () => {
  it("returns the fallback for an empty, null or undefined url", () => {
    expect(getSafeImageSrc("", "/fallback.jpg")).toBe("/fallback.jpg");
    expect(getSafeImageSrc(null, "/fallback.jpg")).toBe("/fallback.jpg");
    expect(getSafeImageSrc(undefined, "/fallback.jpg")).toBe("/fallback.jpg");
  });

  it("returns the fallback for a hostname not in next.config.mjs's remotePatterns", () => {
    expect(getSafeImageSrc("https://example.com/events/foo.jpg", "/fallback.jpg")).toBe(
      "/fallback.jpg",
    );
  });

  it("returns the fallback for an unparseable url", () => {
    expect(getSafeImageSrc("not-a-url", "/fallback.jpg")).toBe("/fallback.jpg");
  });

  it("returns the real url for an allowed host", () => {
    const url = "https://res.cloudinary.com/demo/image/upload/event.jpg";
    expect(getSafeImageSrc(url, "/fallback.jpg")).toBe(url);

    const bucketUrl = "https://dev-lemonade-bucket.lon1.digitaloceanspaces.com/events/foo.jpg";
    expect(getSafeImageSrc(bucketUrl, "/fallback.jpg")).toBe(bucketUrl);
  });
});

describe("formatDistanceAway", () => {
  it("returns null when the server sent no distance", () => {
    expect(formatDistanceAway(null)).toBeNull();
    expect(formatDistanceAway(undefined)).toBeNull();
  });

  it("labels sub-kilometre distances", () => {
    expect(formatDistanceAway(0)).toBe("Under 1 km away");
  });

  it("renders the server's whole-km value with separators", () => {
    expect(formatDistanceAway(526)).toBe("526 km away");
    expect(formatDistanceAway(1204)).toBe("1,204 km away");
  });
});
