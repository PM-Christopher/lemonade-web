import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import SchedulePromotionModal from "./SchedulePromotionModal";

const mutate = vi.fn();

vi.mock("react-redux", () => ({ useDispatch: () => vi.fn() }));
vi.mock("@/features/events/mutations", () => ({
  useScheduleEventPromotionMutation: () => ({ mutate, isPending: false }),
}));

describe("SchedulePromotionModal", () => {
  beforeEach(() => {
    vi.useFakeTimers({ toFake: ["Date"] });
    vi.setSystemTime(new Date("2030-05-20T08:00:00Z"));
    mutate.mockReset();
  });
  afterEach(() => vi.useRealTimers());

  const open = () => render(<SchedulePromotionModal isOpen toggle={vi.fn()} id="p1" />);

  it("sends the chosen day", async () => {
    open();

    fireEvent.change(screen.getByLabelText("Promotion date"), { target: { value: "2030-05-25" } });
    await waitFor(() => expect(screen.getByRole("button", { name: "Schedule" })).toBeEnabled());
    fireEvent.click(screen.getByRole("button", { name: "Schedule" }));

    await waitFor(() => expect(mutate).toHaveBeenCalledWith("2030-05-25", expect.any(Object)));
  });

  it("refuses a day in the past", async () => {
    open();

    fireEvent.change(screen.getByLabelText("Promotion date"), { target: { value: "2030-05-10" } });

    expect(await screen.findByText("The promotion date can't be in the past")).toBeInTheDocument();
    expect(mutate).not.toHaveBeenCalled();
  });
});
