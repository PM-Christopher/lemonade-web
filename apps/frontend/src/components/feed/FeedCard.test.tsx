import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { FeedCard } from "./FeedCard";
import type { FeedThread } from "@/features/tribes/api";

vi.mock("next/image", () => ({
  // eslint-disable-next-line @next/next/no-img-element
  default: ({ alt }: { alt: string }) => <img alt={alt} />,
}));
const push = vi.fn();
vi.mock("@/hooks/useNavigation", () => ({ useNavigation: () => ({ push }) }));
vi.mock("@/redux/hook", () => ({ useAppDispatch: () => vi.fn() }));

const mutate = vi.fn();
const postComment = vi.fn();
vi.mock("@/features/tribes/mutations", () => ({
  useLikeThreadMutation: () => ({ mutate }),
  usePostCommentMutation: () => ({ mutate: postComment, isPending: false }),
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
  beforeEach(() => {
    mutate.mockReset();
    postComment.mockReset();
    push.mockReset();
  });

  it("shows the post and links its tribe chip to the tribe", () => {
    render(<FeedCard thread={thread()} />);

    expect(screen.getByText("Launch day")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Founders" })).toHaveAttribute(
      "href",
      "/tribe/founders-ab12",
    );
  });

  it("likes with the tribe id and counts it straight away", () => {
    render(<FeedCard thread={thread()} />);

    fireEvent.click(screen.getByRole("button", { name: "Like" }));

    expect(mutate).toHaveBeenCalledWith(
      { tribeId: "tribe-1", threadId: "thread-1" },
      expect.any(Object),
    );
    expect(screen.getByRole("button", { name: "Like" })).toHaveTextContent("5");
  });

  it("offers to join a tribe the user has not joined, and not one they have", () => {
    const { rerender } = render(<FeedCard thread={thread({ from_joined_tribe: false })} />);
    expect(screen.getByRole("link", { name: "Join tribe" })).toBeInTheDocument();

    rerender(<FeedCard thread={thread({ from_joined_tribe: true })} />);
    expect(screen.queryByRole("link", { name: "Join tribe" })).not.toBeInTheDocument();
  });

  it("cuts a long post and title and links to the tribe to read the rest", () => {
    render(<FeedCard thread={thread({ topic: "T".repeat(90), thoughts: "x".repeat(400) })} />);

    expect(screen.getByText(`${"T".repeat(60)}...`)).toBeInTheDocument();
    expect(screen.getByText(`${"x".repeat(100)}...`)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Read more" })).toHaveAttribute(
      "href",
      "/tribe/founders-ab12",
    );
  });

  it("shows a short post whole, with no Read more link", () => {
    render(<FeedCard thread={thread()} />);

    expect(screen.getByText("We open the doors on Friday.")).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "Read more" })).not.toBeInTheDocument();
  });

  it("lets a member comment on the post without leaving the feed", () => {
    postComment.mockImplementation((_vars, options) => options.onSuccess());
    render(<FeedCard thread={thread()} />);

    fireEvent.click(screen.getByRole("button", { name: "Comment" }));
    fireEvent.change(screen.getByLabelText("Write a comment"), { target: { value: "Congrats!" } });
    fireEvent.click(screen.getByRole("button", { name: "Post" }));

    expect(postComment).toHaveBeenCalledWith(
      { tribeId: "tribe-1", threadId: "thread-1", data: { body: "Congrats!" } },
      expect.any(Object),
    );
    expect(screen.getByRole("button", { name: "Comment" })).toHaveTextContent("3");
  });

  it("sends a non-member to the tribe to read the comments, since only members can comment", () => {
    render(<FeedCard thread={thread({ from_joined_tribe: false })} />);

    expect(screen.getByRole("link", { name: "Comments" })).toHaveAttribute(
      "href",
      "/tribe/founders-ab12",
    );
    expect(screen.queryByRole("button", { name: "Comment" })).not.toBeInTheDocument();
  });

  it("copies the tribe's public link when the browser has no share sheet", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator, { share: undefined, clipboard: { writeText } });
    render(<FeedCard thread={thread()} />);

    fireEvent.click(screen.getByRole("button", { name: "Share" }));

    await vi.waitFor(() =>
      expect(writeText).toHaveBeenCalledWith(expect.stringContaining("/share/tribe/founders-ab12")),
    );
  });

  it("opens the tribe when the card is tapped, but not when a control inside it is", () => {
    render(<FeedCard thread={thread()} />);

    fireEvent.click(screen.getByText("Launch day"));
    expect(push).toHaveBeenCalledWith("/tribe/founders-ab12");

    push.mockReset();
    fireEvent.click(screen.getByRole("button", { name: "Like" }));
    expect(push).not.toHaveBeenCalled();
  });
});
