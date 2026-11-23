import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { FeedTribeStrip } from "./FeedTribeStrip";

vi.mock("next/image", () => ({
  // eslint-disable-next-line @next/next/no-img-element
  default: ({ alt }: { alt: string }) => <img alt={alt} />,
}));

describe("FeedTribeStrip", () => {
  it("opens the tribe when its circle is tapped", () => {
    render(
      <FeedTribeStrip
        tribes={[
          { id: "1", slug: "creator-101", name: "Creator 101", image: null },
          { id: "2", slug: "vc-crafters", name: "VC Crafters", image: null },
        ]}
      />,
    );

    expect(screen.getByRole("link", { name: /Creator 101/ })).toHaveAttribute(
      "href",
      "/tribe/creator-101",
    );
    expect(screen.getByRole("link", { name: /VC Crafters/ })).toHaveAttribute(
      "href",
      "/tribe/vc-crafters",
    );
  });
});
