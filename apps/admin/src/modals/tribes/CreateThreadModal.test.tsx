import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import CreateThreadModal from "./CreateThreadModal";

const mutate = vi.fn();

vi.mock("react-redux", () => ({ useDispatch: () => vi.fn() }));
vi.mock("@/features/tribes/mutations", () => ({
  useAddTribeThreadMutation: () => ({ mutate, isPending: false }),
}));

const fill = () => {
  fireEvent.change(screen.getByPlaceholderText("Topic"), { target: { value: "Vote" } });
  fireEvent.change(screen.getByPlaceholderText("Share your thoughts..."), {
    target: { value: "Pick one" },
  });
};

describe("CreateThreadModal", () => {
  beforeEach(() => mutate.mockReset());

  it("posts a plain thread", async () => {
    render(<CreateThreadModal isOpen toggle={vi.fn()} tribeId="t1" />);
    fill();
    fireEvent.click(screen.getByRole("button", { name: "Post" }));

    await waitFor(() => expect(mutate).toHaveBeenCalled());
    expect(mutate.mock.calls[0][0]).toMatchObject({ topic: "Vote", thoughts: "Pick one" });
    expect(mutate.mock.calls[0][0].polls).toBeUndefined();
  });

  it("will not post a poll with fewer than two options", async () => {
    render(<CreateThreadModal isOpen toggle={vi.fn()} tribeId="t1" />);
    fill();
    fireEvent.click(screen.getByRole("button", { name: "Add poll" }));
    fireEvent.change(screen.getByLabelText("Poll question"), { target: { value: "Best day?" } });
    fireEvent.change(screen.getByLabelText("Option 1"), { target: { value: "Friday" } });
    fireEvent.click(screen.getByRole("button", { name: "Post" }));

    expect(await screen.findByText("Add at least two options.")).toBeInTheDocument();
    expect(mutate).not.toHaveBeenCalled();
  });

  it("sends a poll with its options", async () => {
    render(<CreateThreadModal isOpen toggle={vi.fn()} tribeId="t1" />);
    fill();
    fireEvent.click(screen.getByRole("button", { name: "Add poll" }));
    fireEvent.change(screen.getByLabelText("Poll question"), { target: { value: "Best day?" } });
    fireEvent.change(screen.getByLabelText("Option 1"), { target: { value: "Friday" } });
    fireEvent.change(screen.getByLabelText("Option 2"), { target: { value: "Saturday" } });
    fireEvent.click(screen.getByRole("button", { name: "Post" }));

    await waitFor(() => expect(mutate).toHaveBeenCalled());
    expect(mutate.mock.calls[0][0]).toMatchObject({
      polls: true,
      thread_polls: { title: "Best day?", options: ["Friday", "Saturday"] },
    });
  });
});
