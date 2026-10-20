import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import CommentsSection from "./CommentSection";
import type { Thread } from "@/interfaces/TribeInterface";

const editMutate = vi.fn();
const deleteMutate = vi.fn();

vi.mock("@/images/icons/dot.svg", () => ({ default: () => <svg aria-hidden="true" /> }));
vi.mock("next/image", () => ({
  // eslint-disable-next-line @next/next/no-img-element
  default: ({ src, alt }: { src: string; alt: string }) => <img src={src} alt={alt} />,
}));
vi.mock("@/components/global/FallbackImage", () => ({
  // eslint-disable-next-line @next/next/no-img-element
  FallbackImage: ({ src, alt }: { src: string; alt: string }) => <img src={src} alt={alt} />,
}));
vi.mock("react-redux", () => ({
  useSelector: (select: (state: unknown) => unknown) => select({ auth: { user: { id: "me" } } }),
}));
vi.mock("@/redux/hook", () => ({ useAppDispatch: () => vi.fn() }));
vi.mock("@/features/tribes/mutations", () => ({
  useEditCommentMutation: () => ({ mutate: editMutate, isPending: false }),
  useDeleteCommentMutation: () => ({ mutate: deleteMutate, isPending: false }),
}));

const comment = (id: string, userId: string, body: string) => ({
  id,
  thread_id: "th1",
  owner: userId === "me",
  body,
  user_id: userId,
  user: { fullname: "Ada Okafor", username: `user-${userId}`, avatar: "", verified: false },
  created_at: new Date().toISOString(),
  likes: 0,
  hasLikedComment: false,
  children: [],
});

const renderSection = () =>
  render(
    <CommentsSection
      comments={[comment("c1", "me", "My comment"), comment("c2", "other", "Their comment")]}
      isVisible
      onToggleVisibility={vi.fn()}
      thread={{ id: "th1" } as Thread}
      tribeSlug="design-circle"
    />,
  );

describe("CommentsSection", () => {
  beforeEach(() => {
    editMutate.mockReset();
    deleteMutate.mockReset();
  });

  it("offers edit and delete only on your own comments", () => {
    renderSection();

    expect(screen.getAllByRole("button", { name: "Edit" })).toHaveLength(1);
    expect(screen.getAllByRole("button", { name: "Delete" })).toHaveLength(1);
  });

  it("saves an edited comment", () => {
    renderSection();

    fireEvent.click(screen.getByRole("button", { name: "Edit" }));
    fireEvent.change(screen.getByLabelText("Edit comment"), { target: { value: "Fixed typo" } });
    fireEvent.click(screen.getByRole("button", { name: "Save" }));

    expect(editMutate.mock.calls[0][0]).toEqual({ id: "c1", body: "Fixed typo" });
  });

  it("asks before deleting a comment", () => {
    renderSection();

    fireEvent.click(screen.getByRole("button", { name: "Delete" }));
    expect(deleteMutate).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole("button", { name: "Yes" }));

    expect(deleteMutate.mock.calls[0][0]).toBe("c1");
  });
});
