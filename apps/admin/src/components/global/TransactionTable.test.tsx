import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { TransactionTable } from "./TransactionTable";

const columns = [
  { header: "TXN ID", cell: (row: { id: string }) => row.id },
  { header: "AMOUNT", cell: () => "₦500" },
];

describe("TransactionTable", () => {
  it("shows the rows and opens one", () => {
    const onRowClick = vi.fn();
    render(
      <TransactionTable
        columns={columns}
        rows={[{ id: "TX1" }]}
        getKey={(row) => row.id}
        onRowClick={onRowClick}
        page={1}
        totalPages={1}
        perPage={10}
        onPageChange={vi.fn()}
      />,
    );

    fireEvent.click(screen.getByText("TX1"));

    expect(onRowClick).toHaveBeenCalledWith({ id: "TX1" });
  });

  it("says when there is nothing to show", () => {
    render(
      <TransactionTable
        columns={columns}
        rows={[]}
        getKey={() => "x"}
        page={1}
        totalPages={1}
        perPage={10}
        onPageChange={vi.fn()}
      />,
    );

    expect(screen.getByText("No data available")).toBeInTheDocument();
  });
});
