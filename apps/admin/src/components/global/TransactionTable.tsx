import React from "react";
import { centerNumericColumns } from "@/utils/tableAlign";
import PaginationComp from "@/components/global/Pagination";

export interface TransactionColumn<T> {
  header: string;
  cell: (row: T) => React.ReactNode;
}

interface TransactionTableProps<T> {
  columns: ReadonlyArray<TransactionColumn<T>>;
  rows: ReadonlyArray<T> | undefined;
  getKey: (row: T, index: number) => string | number;
  onRowClick?: (row: T) => void;
  page: number;
  totalPages: number;
  perPage: number;
  onPageChange: (page: number) => void;
}

// The table every transaction tab shares: headers, clickable rows and server pagination.
export function TransactionTable<T>({
  columns,
  rows,
  getKey,
  onRowClick,
  page,
  totalPages,
  perPage,
  onPageChange,
}: TransactionTableProps<T>) {
  return (
    <div className="rounded-lg bg-white shadow-md">
      <table
        className={`min-w-full table-auto border-collapse ${centerNumericColumns(columns.map((column) => column.header))}`}
      >
        <thead>
          <tr className="bg-mid-grey">
            {columns.map((column) => (
              <th
                className="font-semiBold text-text-grey text-meta p-4 text-left leading-normal"
                key={column.header}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows && rows.length > 0 ? (
            rows.map((row, index) => (
              <tr
                key={getKey(row, index)}
                className={`border-grey-20 h-18 border-b ${onRowClick ? "cursor-pointer" : ""}`}
                onClick={() => onRowClick?.(row)}
              >
                {columns.map((column) => (
                  <td className="p-4 font-sans text-sm font-medium" key={column.header}>
                    {column.cell(row)}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length} className="p-4 text-center text-sm text-gray-500">
                No data available
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <PaginationComp
        currentPage={page}
        totalPages={totalPages}
        onPageChange={onPageChange}
        perPage={perPage}
      />
    </div>
  );
}
