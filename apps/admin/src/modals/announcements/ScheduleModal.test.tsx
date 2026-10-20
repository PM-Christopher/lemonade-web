import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import ScheduleModal from "./ScheduleModal";

const onSave = vi.fn();

describe("ScheduleModal", () => {
  beforeEach(() => {
    vi.useFakeTimers({ toFake: ["Date"] });
    vi.setSystemTime(new Date(2030, 4, 20, 8, 0, 0));
    onSave.mockReset();
  });
  afterEach(() => vi.useRealTimers());

  const open = () => render(<ScheduleModal isOpen toggle={vi.fn()} onSave={onSave} />);

  it("saves the chosen day and time", () => {
    open();

    fireEvent.click(screen.getByRole("button", { name: "25 May 2030" }));
    fireEvent.change(screen.getByLabelText("Time"), { target: { value: "09:30" } });
    fireEvent.click(screen.getByRole("button", { name: "PM" }));
    fireEvent.click(screen.getByRole("button", { name: "Save" }));

    const when = onSave.mock.calls[0][0] as Date;
    expect([when.getFullYear(), when.getMonth(), when.getDate()]).toEqual([2030, 4, 25]);
    expect([when.getHours(), when.getMinutes()]).toEqual([21, 30]);
  });

  it("refuses a time in the past or one that is not a time", () => {
    open();

    fireEvent.change(screen.getByLabelText("Time"), { target: { value: "25:99" } });
    fireEvent.click(screen.getByRole("button", { name: "Save" }));
    expect(screen.getByText("Enter a time like 09:30")).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText("Time"), { target: { value: "07:00" } });
    fireEvent.click(screen.getByRole("button", { name: "AM" }));
    fireEvent.click(screen.getByRole("button", { name: "Save" }));
    expect(screen.getByText("Pick a time in the future")).toBeInTheDocument();
    expect(onSave).not.toHaveBeenCalled();
  });

  it("does not let a past day be picked", () => {
    open();

    expect(screen.getByRole("button", { name: "19 May 2030" })).toBeDisabled();
  });
});
