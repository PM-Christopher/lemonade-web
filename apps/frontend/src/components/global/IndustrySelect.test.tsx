import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/features/shared", () => ({
  useIndustriesQuery: () => ({
    isLoading: false,
    data: {
      industries: [
        { id: "1", name: "Banking", slug: "banking" },
        { id: "2", name: "Software development", slug: "software-development" },
        { id: "3", name: "Sports", slug: "sports" },
      ],
    },
  }),
}));

const { IndustrySelect } = await import("./IndustrySelect");

describe("IndustrySelect", () => {
  it("filters the list as you type and picks an industry", () => {
    const onChange = vi.fn();
    render(<IndustrySelect value="" onChange={onChange} />);

    fireEvent.click(screen.getByRole("button", { name: "Industry" }));
    fireEvent.change(screen.getByLabelText("Search industry"), { target: { value: "sp" } });

    expect(screen.queryByRole("option", { name: "Banking" })).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("option", { name: "Sports" }));

    expect(onChange).toHaveBeenCalledWith("Sports");
  });

  it("shows the current value on the trigger", () => {
    render(<IndustrySelect value="Banking" onChange={() => {}} />);

    expect(screen.getByRole("button", { name: "Industry" })).toHaveTextContent("Banking");
  });
});
