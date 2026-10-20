import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import PaginationComp from "./Pagination";

describe("PaginationComp", () => {
  it("shows the ends and the pages around the current one, not every page", () => {
    render(
      <PaginationComp currentPage={50} totalPages={399} onPageChange={vi.fn()} perPage={10} />,
    );

    expect(screen.getAllByRole("button").length).toBeLessThan(10);
    expect(screen.getByRole("button", { name: "1" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "50" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "399" })).toBeInTheDocument();
  });

  it("goes to the chosen page", () => {
    const onPageChange = vi.fn();
    render(
      <PaginationComp currentPage={1} totalPages={3} onPageChange={onPageChange} perPage={10} />,
    );

    fireEvent.click(screen.getByRole("button", { name: "3" }));

    expect(onPageChange).toHaveBeenCalledWith(3);
  });
});
