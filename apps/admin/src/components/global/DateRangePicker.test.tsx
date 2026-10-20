import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import DateRangePicker, { rangeLabel, toApiTime } from "./DateRangePicker";

describe("DateRangePicker", () => {
  it("starts on ALL TIME and clears back to it from the quick list", () => {
    const onChange = vi.fn();
    render(<DateRangePicker value={null} onChange={onChange} />);
    expect(screen.getByText("ALL TIME")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Filter by date" }));
    fireEvent.click(screen.getByRole("button", { name: "All time" }));

    expect(onChange).toHaveBeenCalledWith(null);
  });

  it("applies a quick range that ends today", () => {
    const onChange = vi.fn();
    render(<DateRangePicker value={null} onChange={onChange} />);

    fireEvent.click(screen.getByRole("button", { name: "Filter by date" }));
    fireEvent.click(screen.getByRole("button", { name: "Last 7 days" }));

    const range = onChange.mock.calls[0][0] as { start: Date; end: Date };
    const days = Math.round((range.end.getTime() - range.start.getTime()) / 86_400_000);
    expect(days).toBe(7);
    expect(range.end.toDateString()).toBe(new Date().toDateString());
  });

  it("picks a range from two clicks in either order", () => {
    const onChange = vi.fn();
    render(<DateRangePicker value={null} onChange={onChange} />);
    fireEvent.click(screen.getByRole("button", { name: "Filter by date" }));

    const buttons = screen.getAllByRole("button", { pressed: false });
    const days = buttons.filter((button) =>
      /^\d{1,2} \w+ \d{4}$/.test(button.getAttribute("aria-label") ?? ""),
    );
    fireEvent.click(days[10] as HTMLElement);
    fireEvent.click(days[3] as HTMLElement);

    const range = onChange.mock.calls[0][0] as { start: Date; end: Date };
    expect(range.start.getTime()).toBeLessThan(range.end.getTime());
  });

  it("labels a chosen range and formats API times in UTC", () => {
    const value = {
      start: new Date("2024-03-01T00:00:00Z"),
      end: new Date("2024-03-31T23:00:00Z"),
    };

    expect(rangeLabel(value)).toMatch(/Mar 2024 - /);
    expect(toApiTime(new Date("2024-03-01T10:05:09Z"))).toBe("2024-03-01 10:05:09");
  });
});
