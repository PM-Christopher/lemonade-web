import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { MoneyInput, formatMoneyInput, sanitizeMoneyInput } from "./money-input";

describe("money input helpers", () => {
  it.each([
    ["1a2b3", "123"],
    ["007", "7"],
    ["0.5", "0.5"],
    ["12.345", "12.34"],
    ["1.2.3", "1.23"],
    ["-5", "5"],
    ["", ""],
  ])("sanitizes %j to %j", (typed, expected) => {
    expect(sanitizeMoneyInput(typed)).toBe(expected);
  });

  it.each([
    ["1234567", "1,234,567"],
    ["1234.5", "1,234.5"],
    ["1234.", "1,234."],
    ["999", "999"],
    ["", ""],
  ])("formats %j as %j", (raw, expected) => {
    expect(formatMoneyInput(raw)).toBe(expected);
  });
});

describe("MoneyInput", () => {
  it("shows thousands separators for the plain amount it is given", () => {
    render(<MoneyInput aria-label="Fee" value="1234567.5" onValueChange={vi.fn()} />);

    expect(screen.getByLabelText("Fee")).toHaveValue("1,234,567.5");
  });

  it("hands back the plain amount, without letters, separators or extra decimals", () => {
    const onValueChange = vi.fn();
    render(<MoneyInput aria-label="Fee" value="" onValueChange={onValueChange} />);

    fireEvent.change(screen.getByLabelText("Fee"), { target: { value: "₦1,234.567abc" } });

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

  it("pads to two decimals when the field loses focus", () => {
    const onValueChange = vi.fn();
    render(
      <MoneyInput aria-label="Fee" padDecimals value="1000000" onValueChange={onValueChange} />,
    );

    fireEvent.blur(screen.getByLabelText("Fee"));

    expect(onValueChange).toHaveBeenCalledWith("1000000.00");
  });

  it("can show a plain number without separators", () => {
    render(<MoneyInput aria-label="Rate" grouping value="12500.5" onValueChange={vi.fn()} />);
    expect(screen.getByLabelText("Rate")).toHaveValue("12,500.5");

    render(
      <MoneyInput aria-label="Percent" grouping={false} value="12500.5" onValueChange={vi.fn()} />,
    );
    expect(screen.getByLabelText("Percent")).toHaveValue("12500.5");
  });

  it("pads a lone point or a leading point, and leaves an empty field empty", () => {
    const onValueChange = vi.fn();
    const { rerender } = render(
      <MoneyInput aria-label="Fee" padDecimals value="." onValueChange={onValueChange} />,
    );
    fireEvent.blur(screen.getByLabelText("Fee"));
    expect(onValueChange).toHaveBeenLastCalledWith("");

    rerender(<MoneyInput aria-label="Fee" padDecimals value=".5" onValueChange={onValueChange} />);
    fireEvent.blur(screen.getByLabelText("Fee"));
    expect(onValueChange).toHaveBeenLastCalledWith("0.50");

    rerender(<MoneyInput aria-label="Fee" padDecimals value="" onValueChange={onValueChange} />);
    fireEvent.blur(screen.getByLabelText("Fee"));
    expect(onValueChange).toHaveBeenLastCalledWith("");
  });

  it("does not pad whole-number fields and still calls the caller's onBlur", () => {
    const onValueChange = vi.fn();
    const onBlur = vi.fn();
    render(
      <MoneyInput
        aria-label="Count"
        allowDecimals={false}
        padDecimals
        value="5"
        onBlur={onBlur}
        onValueChange={onValueChange}
      />,
    );

    fireEvent.blur(screen.getByLabelText("Count"));

    expect(onValueChange).not.toHaveBeenCalled();
    expect(onBlur).toHaveBeenCalled();
  });
});
