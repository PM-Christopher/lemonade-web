import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { FeedTribeStrip } from "./FeedTribeStrip";

vi.mock("next/image", () => ({
  // eslint-disable-next-line @next/next/no-img-element
  default: ({ alt }: { alt: string }) => <img alt={alt} />,
}));

const tribes = [
  { id: "1", slug: "creator-101", name: "Creator 101", image: null },
  { id: "2", slug: "vc-crafters", name: "VC Crafters", image: null },
];

describe("FeedTribeStrip", () => {
  it("links each tribe to the feed filtered by it, and All to the full feed", () => {
    render(<FeedTribeStrip tribes={tribes} selected={undefined} />);

    expect(screen.getByRole("link", { name: /Creator 101/ })).toHaveAttribute("href", "/feed?tribe=creator-101");
    expect(screen.getByRole("link", { name: /Feed/ })).toHaveAttribute("href", "/feed");
    expect(screen.getByRole("link", { name: /Feed/ })).toHaveAttribute("aria-current", "page");
  });

  it("marks the picked tribe as current instead of All", () => {
    render(<FeedTribeStrip tribes={tribes} selected="vc-crafters" />);

    expect(screen.getByRole("link", { name: /VC Crafters/ })).toHaveAttribute("aria-current", "page");
    expect(screen.getByRole("link", { name: /Feed/ })).not.toHaveAttribute("aria-current");
  });
});
