import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import ReviewModal from "./ReviewModal";

const dispatch = vi.hoisted(() => vi.fn());
vi.mock("@/images/icons/close.svg", () => ({ default: () => null }));
vi.mock("@/redux/hook", () => ({ useAppDispatch: () => dispatch }));
vi.mock("next/image", () => ({
  // eslint-disable-next-line @next/next/no-img-element
  default: ({ alt }: { alt: string }) => <img alt={alt} />,
}));

const setup = (submit = vi.fn().mockResolvedValue({})) => {
  const toggleMenu = vi.fn();
  render(<ReviewModal isOpen toggleMenu={toggleMenu} submit={submit} />);
  return { submit, toggleMenu };
};

const fillIn = () => {
  fireEvent.click(screen.getByRole("radio", { name: "4 out of 5" }));
  fireEvent.change(screen.getByLabelText("Title"), { target: { value: "Excellent execution" } });
  fireEvent.change(screen.getByLabelText("Description"), {
    target: { value: "Would hire again." },
  });
};

const submitButton = () => screen.getAllByRole("button", { name: "Submit review" })[0];

describe("ReviewModal", () => {
  it("keeps submit disabled until the form is filled in", () => {
    setup();

    expect(submitButton()).toBeDisabled();
  });

  it("asks for a rating, title and description before sending", async () => {
    const { submit } = setup();

    fireEvent.submit(submitButton().closest("form")!);

    expect(await screen.findByText("Pick a rating")).toBeInTheDocument();
    expect(submit).not.toHaveBeenCalled();
  });

  it("sends the review and closes with a success toast", async () => {
    const { submit, toggleMenu } = setup();
    fillIn();

    fireEvent.submit(submitButton().closest("form")!);

    await waitFor(() =>
      expect(submit).toHaveBeenCalledWith({
        rating: 4,
        title: "Excellent execution",
        description: "Would hire again.",
      }),
    );
    expect(toggleMenu).toHaveBeenCalled();
    expect(dispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        payload: expect.objectContaining({ message: "Review submitted" }),
      }),
    );
  });

  it("stays open and shows an error toast when sending fails", async () => {
    const { toggleMenu } = setup(vi.fn().mockRejectedValue(new Error("nope")));
    fillIn();

    fireEvent.submit(submitButton().closest("form")!);

    await waitFor(() =>
      expect(dispatch).toHaveBeenCalledWith(
        expect.objectContaining({ payload: expect.objectContaining({ type: "error" }) }),
      ),
    );
    expect(toggleMenu).not.toHaveBeenCalled();
  });
});
