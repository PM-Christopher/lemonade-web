import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { FeedSection } from "./FeedSection";

vi.mock("next/image", () => ({
  // eslint-disable-next-line @next/next/no-img-element
  default: ({ alt }: { alt: string }) => <img alt={alt} />,
}));
vi.mock("react-redux", () => ({ useSelector: () => true }));
vi.mock("@/components/feed/FeedCard", () => ({
  FeedCard: ({ thread }: { thread: { topic: string } }) => <p>{thread.topic}</p>,
}));

const fetchNextPage = vi.fn();
let feed: Record<string, unknown>;
vi.mock("@/features/tribes/queries", () => ({ useFeedQuery: () => feed }));

const page = (over: Record<string, unknown> = {}) => ({
  threads: [{ id: "1", topic: "Open tribe post" }],
  joined_tribes: [],
  page: 1,
  has_more: false,
  ...over,
});

describe("FeedSection", () => {
  beforeEach(() => {
    fetchNextPage.mockReset();
    feed = {
      data: { pages: [page()] },
      isLoading: false,
      isError: false,
      hasNextPage: false,
      fetchNextPage,
    };
  });

  it("shows posts and a way to find tribes for a user who joined none", () => {
    render(<FeedSection />);

    expect(screen.getByText("Open tribe post")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Find tribes" })).toHaveAttribute("href", "/tribe");
  });

  it("shows the tribe strip, opening each tribe, once tribes are joined", () => {
    feed.data = {
      pages: [
        page({
          joined_tribes: [{ id: "t", slug: "creator-101", name: "Creator 101", image: null }],
        }),
      ],
    };
    render(<FeedSection />);

    expect(screen.getByRole("link", { name: /Creator 101/ })).toHaveAttribute(
      "href",
      "/tribe/creator-101",
    );
    expect(screen.queryByRole("link", { name: "Find tribes" })).not.toBeInTheDocument();
  });

  it("loads the next page only when asked", () => {
    feed.hasNextPage = true;
    render(<FeedSection />);

    fireEvent.click(screen.getByRole("button", { name: "Load more posts" }));

    expect(fetchNextPage).toHaveBeenCalledTimes(1);
  });
});
