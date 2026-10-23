import { describe, expect, it } from "vitest";
import { act, renderHook } from "@testing-library/react";
import { usePagination } from "./usePagination";

const rows = Array.from({ length: 25 }, (_, index) => index + 1);

describe("usePagination", () => {
  it("shows 10 rows at a time", () => {
    const { result } = renderHook(() => usePagination(rows));

    expect(result.current.pageItems).toHaveLength(10);
    expect(result.current.totalPages).toBe(3);

    act(() => result.current.setPage(3));
    expect(result.current.pageItems).toEqual([21, 22, 23, 24, 25]);
  });

  it("goes back to page 1 when the filters change", () => {
    const { result, rerender } = renderHook(({ key }) => usePagination(rows, key), {
      initialProps: { key: "a" },
    });

    act(() => result.current.setPage(2));
    expect(result.current.page).toBe(2);

    rerender({ key: "b" });
    expect(result.current.page).toBe(1);
  });

  it("stays on a real page when the list shrinks", () => {
    const { result, rerender } = renderHook(({ items }) => usePagination(items), {
      initialProps: { items: rows },
    });

    act(() => result.current.setPage(3));
    rerender({ items: rows.slice(0, 5) });
    expect(result.current.page).toBe(1);
    expect(result.current.pageItems).toHaveLength(5);
  });
});
