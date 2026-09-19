import { describe, it, expect } from "vitest";
import { buildPath } from "./build-path";

describe("buildPath", () => {
  it("fills a single placeholder", () => {
    expect(buildPath("/admin/users/{id}", { id: 42 })).toBe("/admin/users/42");
  });

  it("fills multiple placeholders", () => {
    expect(
      buildPath("/admin/tribes/{id}/remove-user/{user_id}", { id: 1, user_id: 2 }),
    ).toBe("/admin/tribes/1/remove-user/2");
  });

  it("accepts string values as-is", () => {
    expect(buildPath("/user/threads/{id}/pinned", { id: "abc-123" })).toBe(
      "/user/threads/abc-123/pinned",
    );
  });

  it("leaves a template with no placeholders unchanged", () => {
    expect(buildPath("/admin/transaction/boosts", {})).toBe("/admin/transaction/boosts");
  });

  it("replaces every occurrence of a repeated placeholder", () => {
    expect(buildPath("/{id}/nested/{id}", { id: 7 })).toBe("/7/nested/7");
  });
});
