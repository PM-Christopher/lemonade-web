import { renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import useSearchParams from "@/hooks/useSearchParams";

const push = vi.fn();

vi.mock("@/hooks/useNavigation", () => ({ useNavigation: () => ({ push }) }));
vi.mock("next/navigation", () => ({
  useSearchParams: () => new URLSearchParams(window.location.search),
}));

describe("useSearchParams", () => {
  beforeEach(() => {
    push.mockClear();
    window.history.replaceState(null, "", "/users?page=2&status=active");
  });

  it("merges new params into the live URL and drops empty ones", () => {
    const { result } = renderHook(() => useSearchParams());
    result.current.setSearchParams({ q: "ada", page: undefined });
    expect(push).toHaveBeenCalledWith("/users?status=active&q=ada");
  });

  it("pushes the bare path when no params remain", () => {
    const { result } = renderHook(() => useSearchParams());
    result.current.setSearchParams({ page: undefined, status: "" });
    expect(push).toHaveBeenCalledWith("/users");
  });

  it("skips a push when nothing changes", () => {
    const { result } = renderHook(() => useSearchParams());
    result.current.setSearchParams({ page: "2", search: undefined });
    expect(push).not.toHaveBeenCalled();
  });

  it("keeps the setter stable across URL changes", () => {
    const { result, rerender } = renderHook(() => useSearchParams());
    const first = result.current.setSearchParams;
    window.history.replaceState(null, "", "/users?page=3");
    rerender();
    expect(result.current.setSearchParams).toBe(first);
    expect(result.current.searchParams.get("page")).toBe("3");
  });
});
