import { beforeAll, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "./select";

// jsdom lacks the pointer and scroll APIs Radix Select calls when it opens.
beforeAll(() => {
  Element.prototype.hasPointerCapture = () => false;
  Element.prototype.releasePointerCapture = () => {};
  Element.prototype.scrollIntoView = () => {};
});

describe("Select", () => {
  it("lists grouped options and reports the one picked", () => {
    const onValueChange = vi.fn();
    render(
      <Select defaultOpen onValueChange={onValueChange}>
        <SelectTrigger aria-label="Status">
          <SelectValue placeholder="Choose a status" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Visible</SelectLabel>
            <SelectItem value="active">Active</SelectItem>
          </SelectGroup>
          <SelectSeparator />
          <SelectItem value="archived">Archived</SelectItem>
        </SelectContent>
      </Select>,
    );

    expect(screen.getByText("Visible")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("option", { name: "Archived" }));

    expect(onValueChange).toHaveBeenCalledWith("archived");
  });
});
