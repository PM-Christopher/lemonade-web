import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { images } from "./images";

describe("images", () => {
  it.each(Object.entries(images))("%s points at a file in public/", (_key, path) => {
    expect(existsSync(join(process.cwd(), "public", path))).toBe(true);
  });
});
