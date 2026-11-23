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

  it("asks for the next page when the end of the row comes into view", () => {
    let onIntersect: (entries: { isIntersecting: boolean }[]) => void = () => {};
    vi.stubGlobal(
      "IntersectionObserver",
      class {
        constructor(callback: typeof onIntersect) {
          onIntersect = callback;
        }
        observe() {}
        disconnect() {}
      },
    );
    feed.hasNextPage = true;
    render(<FeedSection />);

    onIntersect([{ isIntersecting: true }]);

    expect(fetchNextPage).toHaveBeenCalledTimes(1);
    vi.unstubAllGlobals();
  });

  it("stacks posts in list layout and loads more only when asked", () => {
    feed.hasNextPage = true;
    render(<FeedSection layout="list" showHeading={false} />);

    expect(screen.queryByText("Tribe feed")).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Load more posts" }));

    expect(fetchNextPage).toHaveBeenCalledTimes(1);
  });
});
