import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { FeedCard } from "./FeedCard";
import type { FeedThread } from "@/features/tribes/api";

vi.mock("next/image", () => ({
  // eslint-disable-next-line @next/next/no-img-element
  default: ({ alt }: { alt: string }) => <img alt={alt} />,
}));
vi.mock("@/redux/hook", () => ({ useAppDispatch: () => vi.fn() }));

const mutate = vi.fn();
vi.mock("@/features/tribes/mutations", () => ({
  useLikeThreadMutation: () => ({ mutate }),
}));

const thread = (over: Partial<FeedThread> = {}) =>
  ({
    id: "thread-1",
    topic: "Launch day",
    thoughts: "We open the doors on Friday.",
    media: [],
    polls: false,
    hasLiked: false,
    likes: 4,
    comments: 2,
    created_at: "3h",
    created_by: { user: { username: "ada", fullname: "Ada Obi", avatar: null } },
    from_joined_tribe: true,
    tribe: { id: "tribe-1", slug: "founders-ab12", name: "Founders", image: null },
    ...over,
  }) as unknown as FeedThread;

describe("FeedCard", () => {
  beforeEach(() => mutate.mockReset());

  it("shows the post and links its tribe chip to the tribe", () => {
    render(<FeedCard thread={thread()} />);

    expect(screen.getByText("Launch day")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Founders" })).toHaveAttribute("href", "/tribe/founders-ab12");
  });

  it("likes with the tribe id and counts it straight away", () => {
    render(<FeedCard thread={thread()} />);

    fireEvent.click(screen.getByRole("button", { name: "Like" }));

    expect(mutate).toHaveBeenCalledWith({ tribeId: "tribe-1", threadId: "thread-1" }, expect.any(Object));
    expect(screen.getByRole("button", { name: "Like" })).toHaveTextContent("5");
  });

  it("offers to join a tribe the user has not joined, and not one they have", () => {
    const { rerender } = render(<FeedCard thread={thread({ from_joined_tribe: false })} />);
    expect(screen.getByRole("link", { name: "Join tribe" })).toBeInTheDocument();

    rerender(<FeedCard thread={thread({ from_joined_tribe: true })} />);
    expect(screen.queryByRole("link", { name: "Join tribe" })).not.toBeInTheDocument();
  });

  it("cuts a long post and expands it on request", () => {
    render(<FeedCard thread={thread({ thoughts: "x".repeat(400) })} />);

    expect(screen.getByText(/\.\.\.$/)).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "See more" }));
    expect(screen.getByRole("button", { name: "Show less" })).toBeInTheDocument();
  });
});
