import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { MoneyInput } from "./MoneyInput";

describe("MoneyInput", () => {
  it("shows thousands separators for the plain amount it is given", () => {
    render(<MoneyInput aria-label="Fee" value="1234567.5" onValueChange={vi.fn()} />);

    expect(screen.getByLabelText("Fee")).toHaveValue("1,234,567.5");
  });

  it("hands back the plain amount, without separators or extra decimals", () => {
    const onValueChange = vi.fn();
    render(<MoneyInput aria-label="Fee" value="" onValueChange={onValueChange} />);

    fireEvent.change(screen.getByLabelText("Fee"), { target: { value: "₦1,234.567" } });

    expect(onValueChange).toHaveBeenCalledWith("1234.56");
  });

  it("drops the decimal part for whole-number amounts", () => {
    const onValueChange = vi.fn();
    render(
      <MoneyInput aria-label="Fee" allowDecimals={false} value="" onValueChange={onValueChange} />,
    );

    fireEvent.change(screen.getByLabelText("Fee"), { target: { value: "2500.75" } });

    expect(onValueChange).toHaveBeenCalledWith("2500");
  });
});
