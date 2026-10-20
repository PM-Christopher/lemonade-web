import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { CategoryPicker } from "./CategoryPicker";

const options = ["Arts", "Books", "Business", "Education"];

describe("CategoryPicker", () => {
  it("filters the list as you type and picks a category", () => {
    const onChange = vi.fn();
    render(<CategoryPicker value="" options={options} onChange={onChange} />);

    fireEvent.click(screen.getByRole("button", { name: "Category" }));
    fireEvent.change(screen.getByLabelText("Search category"), { target: { value: "bus" } });

    expect(screen.queryByText("Arts")).not.toBeInTheDocument();
    fireEvent.click(screen.getByText("Business"));
    expect(onChange).toHaveBeenCalledWith("Business");
  });

  it("says when nothing matches", () => {
    render(<CategoryPicker value="" options={options} onChange={vi.fn()} />);

    fireEvent.click(screen.getByRole("button", { name: "Category" }));
    fireEvent.change(screen.getByLabelText("Search category"), { target: { value: "zzz" } });

    expect(screen.getByText("No matches")).toBeInTheDocument();
  });
});
