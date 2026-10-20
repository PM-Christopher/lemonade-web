import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import BusinessFilter from "./BusinessFilter";

vi.mock("@/images/icons/close.svg", () => ({ default: () => null }));
vi.mock("@/images/icons/location.svg", () => ({ default: () => null }));
vi.mock("@/images/icons/nairaIcon.svg", () => ({ default: () => null }));
vi.mock("@/features/shared/queries", () => ({
  useBusinessCategoriesQuery: () => ({
    data: { categories: [{ name: "Career" }, { name: "Investment" }] },
  }),
}));

const empty = { category: "", location: "", service_type: "", start_range: "", end_range: "" };

const setup = (values = empty) => {
  const props = { toggle: vi.fn(), onApply: vi.fn(), onReset: vi.fn() };
  render(<BusinessFilter isOpen values={values} {...props} />);
  return props;
};

describe("BusinessFilter", () => {
  it("applies the chosen filters, keeping zeros in the budget", async () => {
    const { onApply, toggle } = setup();

    fireEvent.change(screen.getByPlaceholderText("All locations"), { target: { value: "Lagos" } });
    fireEvent.click(screen.getByRole("button", { name: "Business category" }));
    fireEvent.click(screen.getByRole("option", { name: "Career" }));
    fireEvent.change(screen.getByLabelText("Minimum budget"), { target: { value: "15000" } });
    fireEvent.change(screen.getByLabelText("Maximum budget"), { target: { value: "35000" } });
    fireEvent.click(screen.getByRole("button", { name: "Apply filter" }));
    await waitFor(() => expect(onApply).toHaveBeenCalled());

    expect(onApply).toHaveBeenCalledWith({
      category: "Career",
      location: "Lagos",
      service_type: "",
      start_range: "15000",
      end_range: "35000",
    });
    expect(toggle).toHaveBeenCalled();
  });

  it("only accepts digits in the budget fields", () => {
    setup();

    const min = screen.getByLabelText("Minimum budget");
    fireEvent.change(min, { target: { value: "1a,0.5" } });

    expect(min).toHaveValue("105");
  });

  it("resets the filters through the parent", () => {
    const { onReset, toggle } = setup({ ...empty, location: "Abuja" });

    fireEvent.click(screen.getByRole("button", { name: "Reset filter" }));

    expect(onReset).toHaveBeenCalled();
    expect(toggle).toHaveBeenCalled();
  });
});
