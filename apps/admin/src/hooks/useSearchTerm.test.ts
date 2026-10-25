import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useSearchTerm } from "./useSearchTerm";

beforeEach(() => vi.useFakeTimers());
afterEach(() => vi.useRealTimers());

describe("useSearchTerm", () => {
  it("sends the trimmed term only after typing pauses", () => {
    const { result } = renderHook(() => useSearchTerm());

    act(() => result.current.setValue("  ada  "));
    expect(result.current.value).toBe("  ada  ");
    expect(result.current.term).toBe("");

    act(() => {
      vi.advanceTimersByTime(400);
    });
    expect(result.current.term).toBe("ada");
  });

  it("clears the term when the box is emptied", () => {
    const { result } = renderHook(() => useSearchTerm());

    act(() => result.current.setValue("ada"));
    act(() => {
      vi.advanceTimersByTime(400);
    });
    act(() => result.current.setValue(""));
    act(() => {
      vi.advanceTimersByTime(400);
    });

    expect(result.current.term).toBe("");
  });
});
