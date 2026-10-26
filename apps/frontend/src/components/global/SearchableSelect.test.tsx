import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { SearchableSelect } from "./SearchableSelect";

describe("SearchableSelect", () => {
  it("lists two options that share a value without a duplicate key warning", () => {
    const error = vi.spyOn(console, "error").mockImplementation(() => {});
    render(
      <SearchableSelect
        options={[
          { value: "50572", label: "BANKIT MFB" },
          { value: "50572", label: "BANKIT MICROFINANCE BANK LTD" },
        ]}
        value=""
        onChange={vi.fn()}
        placeholder="Select bank"
        searchPlaceholder="Search bank name"
        ariaLabel="Bank name"
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Bank name" }));

    expect(screen.getAllByRole("option")).toHaveLength(2);
    expect(error).not.toHaveBeenCalled();
    error.mockRestore();
  });
});
